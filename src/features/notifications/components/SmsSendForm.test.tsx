import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLanguageStore } from '@/stores/languageStore'
import { useAuthStore } from '@/stores/authStore'
import { smsMessages } from '@/i18n/messages/sms'
import { ROLES } from '@/constants/permissions'
import { createApiError, renderWithProviders } from '@/test/renderWithProviders'
import { smsApi } from '../api/smsApi'
import { SMS_DELIVERY_STATUS, SMS_ERROR_CODE, SMS_TRIGGER, type SmsLog } from '../types/smsTypes'
import { SmsSendForm } from './SmsSendForm'

vi.mock('../api/smsApi', () => ({ smsApi: { send: vi.fn(), getTemplates: vi.fn() } }))

const t = smsMessages.en
const send = vi.mocked(smsApi.send)
const VALID_PHONE = '+998 (90) 123-45-67'
const NORMALIZED_PHONE = '+998901234567'
/** Backend `SmsDeliveryUnknownException` statusi. */
const BAD_GATEWAY_STATUS = 502

const pendingLog: SmsLog = {
  id: 'log-1',
  recipientPhone: '998901234567',
  message: 'Hello',
  trigger: SMS_TRIGGER.CustomBroadcast,
  status: SMS_DELIVERY_STATUS.Pending,
  sentAt: '2026-11-05T10:00:00Z',
}

const confirmSend = async () => {
  const confirm = (await screen.findAllByRole('button', { name: t.send })).at(-1)
  if (!confirm) throw new Error('confirm button missing')
  await userEvent.click(confirm)
}

describe('SmsSendForm', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('token', 'refresh', {
      id: 'user-1',
      fullName: 'Owner',
      phone: NORMALIZED_PHONE,
      roles: [ROLES.OWNER],
      permissions: [],
      branchIds: [],
    })
    send.mockReset()
    vi.mocked(smsApi.getTemplates).mockResolvedValue([])
  })

  it('validates phone format and message text before anything is sent', async () => {
    renderWithProviders(<SmsSendForm />)

    await userEvent.type(screen.getByLabelText(t.recipientPhone), '90 123')
    await userEvent.type(screen.getByLabelText(t.message), '   ')
    await userEvent.click(screen.getByRole('button', { name: t.send }))

    expect(await screen.findByText(t.validation.phoneInvalid)).toBeInTheDocument()
    expect(screen.getByText(t.validation.messageRequired)).toBeInTheDocument()
    expect(screen.queryByText(/paid service/)).not.toBeInTheDocument()
    expect(send).not.toHaveBeenCalled()
  })

  it('sends a normalized payload after confirmation and reports the pending provider status', async () => {
    send.mockResolvedValueOnce(pendingLog)
    renderWithProviders(<SmsSendForm />)

    await userEvent.type(screen.getByLabelText(t.recipientPhone), VALID_PHONE)
    await userEvent.type(screen.getByLabelText(t.message), ' Hello ')
    await userEvent.click(screen.getByRole('button', { name: t.send }))
    expect(send).not.toHaveBeenCalled()
    await confirmSend()

    await waitFor(() => expect(send).toHaveBeenCalledTimes(1))
    expect(send.mock.calls[0]?.[0]).toEqual({
      recipientPhone: NORMALIZED_PHONE,
      message: 'Hello',
      trigger: SMS_TRIGGER.CustomBroadcast,
      operationId: expect.any(String),
    })
    expect(await screen.findByText(t.result.acceptedTitle)).toBeInTheDocument()
  })

  it('keeps the operationId when the provider outcome is unknown so a resend cannot duplicate the SMS', async () => {
    send.mockRejectedValueOnce(createApiError(BAD_GATEWAY_STATUS, SMS_ERROR_CODE.SubmissionUnknown))
    send.mockResolvedValueOnce({ ...pendingLog, status: SMS_DELIVERY_STATUS.Unknown })
    renderWithProviders(<SmsSendForm />)

    await userEvent.type(screen.getByLabelText(t.recipientPhone), VALID_PHONE)
    await userEvent.type(screen.getByLabelText(t.message), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: t.send }))
    await confirmSend()

    expect(await screen.findByText(t.result.unknownTitle)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: t.send }))
    await confirmSend()
    await waitFor(() => expect(send).toHaveBeenCalledTimes(2))
    expect(send.mock.calls[1]?.[0].operationId).toBe(send.mock.calls[0]?.[0].operationId)
  })
})
