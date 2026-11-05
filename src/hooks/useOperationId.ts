import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

/**
 * Yozish amali uchun idempotentlik kaliti (UUID v4).
 *
 * Kalit forma ochilganda bir marta yaratiladi va tarmoq xatosidan keyingi qayta yuborishlarda
 * o'zgarmaydi — backend bir xil `operationId` + bir xil payloadni bir marta bajaradi.
 * Amal muvaffaqiyatli tugaganda yoki backend 409 (boshqa payload) qaytarganda `renew()` chaqiriladi.
 */
export function useOperationId() {
  const [operationId, setOperationId] = useState(() => uuidv4())
  const renew = useCallback(() => setOperationId(uuidv4()), [])

  return { operationId, renew }
}
