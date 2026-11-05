import { useEffect, useRef } from 'react'

/** Ochiq modallar tartibi: oxirgisi — eng ustdagisi. Escape faqat shuni yopadi. */
const openModals: symbol[] = []

const isTopMost = (token: symbol): boolean => openModals[openModals.length - 1] === token

/**
 * Escape bosilganda faqat eng ustdagi ochiq modalni yopadi (masalan, forma modali ustidagi
 * `ConfirmDialog` yopiladi, forma esa ochiq qoladi).
 */
export function useModalEscape(isOpen: boolean, onClose: () => void): void {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    const token = Symbol('modal')
    openModals.push(token)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTopMost(token)) onCloseRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      openModals.splice(openModals.indexOf(token), 1)
    }
  }, [isOpen])
}
