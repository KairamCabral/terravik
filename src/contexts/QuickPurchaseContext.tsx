'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface QuickPurchaseContextValue {
  isOpen: boolean
  openQuickPurchase: () => void
  closeQuickPurchase: () => void
}

const QuickPurchaseContext = createContext<QuickPurchaseContextValue | null>(null)

export function QuickPurchaseProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openQuickPurchase = useCallback(() => setIsOpen(true), [])
  const closeQuickPurchase = useCallback(() => setIsOpen(false), [])

  return (
    <QuickPurchaseContext.Provider
      value={{ isOpen, openQuickPurchase, closeQuickPurchase }}
    >
      {children}
    </QuickPurchaseContext.Provider>
  )
}

export function useQuickPurchase() {
  const ctx = useContext(QuickPurchaseContext)
  if (!ctx) {
    return {
      isOpen: false,
      openQuickPurchase: () => {},
      closeQuickPurchase: () => {},
    }
  }
  return ctx
}
