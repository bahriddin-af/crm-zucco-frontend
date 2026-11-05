import { useCallback, useState } from 'react'
import { useOperationId } from '@/hooks/useOperationId'
import { getApiErrorCode, OPERATION_CONFLICT_CODE } from '@/utils/apiError'

export interface ConfirmedOperationOptions<TValues, TResult> {
  /** Backendga yozish: `operationId` har doim payloadga qo'shiladi. Xatoda reject qilishi shart (`mutateAsync`). */
  submit: (values: TValues, operationId: string) => Promise<TResult>
  onSuccess?: (result: TResult) => void
  onError?: (error: unknown) => void
  /** Qaysi xatolardan keyin yangi kalit kerak. Standart: faqat `OPERATION_CONFLICT_CODE` (boshqa payload). */
  shouldRenewOnError?: (error: unknown) => boolean
}

export const isOperationConflict = (error: unknown): boolean =>
  getApiErrorCode(error) === OPERATION_CONFLICT_CODE

/**
 * Pul/tanga/SMS sarflaydigan amallar oqimi: validatsiyadan o'tgan forma qiymatlari avval `ConfirmDialog`
 * uchun saqlanadi (`requestConfirm`), tasdiqlangach (`confirm`) bitta `operationId` bilan yuboriladi.
 *
 * - Tarmoq xatosidan keyingi qayta urinish o'sha kalitni ishlatadi (backend amalni ikki marta bajarmaydi).
 * - Muvaffaqiyatdan keyin kalit yangilanadi (keyingi amal — yangi operatsiya).
 * - `shouldRenewOnError` (standart: `OPERATION_CONFLICT_CODE`) bo'lsa, kalit yangilanadi.
 * Xato foydalanuvchiga global toast orqali ko'rsatiladi (queryClient MutationCache).
 */
export function useConfirmedOperation<TValues, TResult>({
  submit,
  onSuccess,
  onError,
  shouldRenewOnError = isOperationConflict,
}: ConfirmedOperationOptions<TValues, TResult>) {
  const { operationId, renew } = useOperationId()
  const [pendingValues, setPendingValues] = useState<TValues | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cancel = useCallback(() => setPendingValues(null), [])

  const confirm = async () => {
    if (pendingValues === null) return
    setIsSubmitting(true)
    try {
      const result = await submit(pendingValues, operationId)
      renew()
      setPendingValues(null)
      onSuccess?.(result)
    } catch (error) {
      if (shouldRenewOnError(error)) renew()
      setPendingValues(null)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    operationId,
    renew,
    pendingValues,
    isConfirmOpen: pendingValues !== null,
    isSubmitting,
    requestConfirm: setPendingValues,
    cancel,
    confirm,
  }
}
