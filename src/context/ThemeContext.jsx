import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const themes = {
  light: {
    name: 'light',
    bg: '#F8FAF8',
    bgSecondary: '#EEF2EE',
    bgCard: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#5A6A5A',
    textInverse: '#F8FAF8',
    border: '#D8E4D8',
    accent: '#33D17A',
    accentHover: '#28B868',
    accentGlow: 'rgba(51, 209, 122, 0.25)',
    accentText: '#1A1A1A',
    navBg: 'rgba(248, 250, 248, 0.85)',
    shadow: '0 4px 24px rgba(26, 26, 26, 0.08)',
    shadowLg: '0 16px 48px rgba(26, 26, 26, 0.12)',
  },
  dark: {
    name: 'dark',
    bg: '#121212',
    bgSecondary: '#1A1A1A',
    bgCard: '#1E1E1E',
    text: '#F8FAF8',
    textMuted: '#8A9A8A',
    textInverse: '#121212',
    border: '#2A3A2A',
    accent: '#33D17A',
    accentHover: '#3EE88A',
    accentGlow: 'rgba(51, 209, 122, 0.20)',
    accentText: '#121212',
    navBg: 'rgba(18, 18, 18, 0.85)',
    shadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 16px 48px rgba(0, 0, 0, 0.6)',
  },
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('ccs-theme') || 'dark'
  })

  const theme = themes[mode]

  useEffect(() => {
    localStorage.setItem('ccs-theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const toggle = () => setMode(m => (m === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
