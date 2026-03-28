'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const STORAGE_KEY = 'card-expand-mode'

interface AutoExpandContextValue {
  autoExpand: boolean
  setAutoExpand: (value: boolean) => void
  toggle: () => void
}

const AutoExpandContext = createContext<AutoExpandContextValue | null>(null)

export function AutoExpandProvider({ children }: { children: ReactNode }) {
  const [autoExpand, setAutoExpandState] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setAutoExpandState(stored === 'true')
      }
    } catch {}
  }, [])

  const setAutoExpand = (value: boolean) => {
    setAutoExpandState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {}
  }

  const toggle = () => setAutoExpand(!autoExpand)

  return (
    <AutoExpandContext.Provider value={{ autoExpand, setAutoExpand, toggle }}>
      {children}
    </AutoExpandContext.Provider>
  )
}

export function useAutoExpand(): AutoExpandContextValue {
  const ctx = useContext(AutoExpandContext)
  if (!ctx) throw new Error('useAutoExpand must be used within AutoExpandProvider')
  return ctx
}
