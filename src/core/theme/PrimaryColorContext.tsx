import { createContext, useContext } from 'react'
import type { PrimaryColorPreset } from '@/core/theme/color-presets'

interface PrimaryColorContextValue {
  primaryColor: PrimaryColorPreset
  setPrimaryColor: (color: PrimaryColorPreset) => void
}

export const PrimaryColorContext = createContext<PrimaryColorContextValue | undefined>(
  undefined,
)

export function usePrimaryColorSettings() {
  const context = useContext(PrimaryColorContext)
  if (!context) {
    throw new Error('usePrimaryColorSettings must be used within PrimaryColorContext')
  }

  return context
}
