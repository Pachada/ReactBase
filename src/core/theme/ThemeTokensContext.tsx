import { createContext, useContext } from 'react'

export interface ThemeTokens {
  brandName: string
  radius: 'sm' | 'md' | 'lg' | 'xl'
  fontFamily: string
}

interface ThemeTokensContextValue {
  tokens: ThemeTokens
  updateTokens: (tokens: Partial<ThemeTokens>) => void
  resetTokens: () => void
}

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  brandName: 'ReactBase',
  radius: 'md',
  fontFamily: 'Inter, system-ui, sans-serif',
}

export const ThemeTokensContext = createContext<ThemeTokensContextValue | null>(null)

export function useThemeTokens() {
  const context = useContext(ThemeTokensContext)
  if (!context) {
    throw new Error('useThemeTokens must be used within ThemeTokensContext provider')
  }

  return context
}
