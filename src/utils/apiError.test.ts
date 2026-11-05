import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { getApiErrorCode, getApiErrorMessage, isNetworkError } from '@/utils/apiError'
import { useLanguageStore } from '@/stores/languageStore'
import { errorsMessages } from '@/i18n/messages/errors'

const httpError = (status: number, data: unknown) => {
  const config = { headers: new AxiosHeaders() }
  const response = { status, data, statusText: '', headers: {}, config } as AxiosResponse
  return new AxiosError('failed', undefined, config, undefined, response)
}

describe('getApiErrorMessage', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
  })

  it('translates a known backend error code', () => {
    const error = httpError(409, { success: false, code: 'operation_key_reused_with_different_payload' })

    expect(getApiErrorCode(error)).toBe('operation_key_reused_with_different_payload')
    expect(getApiErrorMessage(error)).toBe(errorsMessages.en.operation_key_reused_with_different_payload)
  })

  it('falls back to the HTTP status for unknown codes', () => {
    expect(getApiErrorMessage(httpError(403, { code: 'something_new' }))).toBe(errorsMessages.en.forbidden)
    expect(getApiErrorMessage(httpError(500, {}))).toBe(errorsMessages.en.generic)
  })

  it('reports network failures separately', () => {
    const offline = new AxiosError('Network Error')

    expect(isNetworkError(offline)).toBe(true)
    expect(getApiErrorMessage(offline)).toBe(errorsMessages.en.network)
  })

  it.each([502, 503, 504])('treats a %s from the proxy as an unreachable server', (status) => {
    const gatewayError = httpError(status, '')

    expect(isNetworkError(gatewayError)).toBe(true)
    expect(getApiErrorMessage(gatewayError)).toBe(errorsMessages.en.network)
  })

  it('does not treat a backend 500 as a network failure', () => {
    expect(isNetworkError(httpError(500, { code: 'internal_server_error' }))).toBe(false)
  })

  it('follows the selected language', () => {
    useLanguageStore.getState().setLanguage('ru')
    expect(getApiErrorMessage(httpError(404, { code: 'student_not_found' }))).toBe(errorsMessages.ru.student_not_found)
  })
})
