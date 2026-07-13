import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// ── Shared design tokens (identical across light/dark) ───────────────────────
// Editorial scientific-instrument identity: a characterful serif for display,
// a warm grotesque for body/UI, and monospace for lab-style data readouts.
const fonts = {
  fontDisplay: '"Fraunces", Georgia, "Times New Roman", serif',
  fontBody: '"Hanken Grotesk", ui-sans-serif, system-ui, -apple-system, sans-serif',
  fontMono: '"IBM Plex Mono", ui-monospace, "Cascadia Mono", "Segoe UI Mono", monospace',
}

// A fine fractal-noise grain, embedded so it works offline. Composited at low
// opacity for paper/film texture. `noise` is a ready-to-use background value.
const noise =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export const themes = {
  light: {
    name: 'light',
    // Warm bone-paper base — a lab notebook, not a plain white slide
    bg: '#F3F0E7',
    bgSecondary: '#EAE5D8',
    bgCard: '#FCFBF6',
    bgInk: '#12201A',            // dark panel used on light bg (hero/cta)
    text: '#14201A',
    textMuted: '#5C6B60',
    textInverse: '#F3F0E7',
    border: '#DDD6C7',
    borderStrong: '#C9C0AC',
    accent: '#1E9E57',           // deep chlorophyll — reads on paper
    accentHover: '#178B4C',
    accent2: '#6F9B12',          // olive-chartreuse signature
    accent2Text: '#FCFBF6',
    accentGlow: 'rgba(30, 158, 87, 0.16)',
    accentText: '#FCFBF6',
    navBg: 'rgba(243, 240, 231, 0.78)',
    shadow: '0 4px 20px rgba(20, 32, 26, 0.08)',
    shadowLg: '0 22px 60px -18px rgba(20, 32, 26, 0.22)',
    gridLine: 'rgba(20, 32, 26, 0.05)',
    noiseOpacity: 0.35,
    ...fonts,
    noise,
  },
  dark: {
    name: 'dark',
    // Deep forest-ink base with a green undertone
    bg: '#0A0F0C',
    bgSecondary: '#0E140F',
    bgCard: '#121A14',
    bgInk: '#080D0A',
    text: '#E8EFE8',
    textMuted: '#7E9184',
    textInverse: '#0A0F0C',
    border: '#1F2C23',
    borderStrong: '#2C3D30',
    accent: '#3ECF7F',           // luminous chlorophyll
    accentHover: '#57E092',
    accent2: '#C4F24C',          // chartreuse signature highlight
    accent2Text: '#0A0F0C',
    accentGlow: 'rgba(62, 207, 127, 0.20)',
    accentText: '#04140A',
    navBg: 'rgba(10, 15, 12, 0.72)',
    shadow: '0 6px 26px rgba(0, 0, 0, 0.45)',
    shadowLg: '0 26px 70px -20px rgba(0, 0, 0, 0.72)',
    gridLine: 'rgba(232, 239, 232, 0.045)',
    noiseOpacity: 0.26,
    ...fonts,
    noise,
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
    document.documentElement.style.setProperty('--cc-bg', theme.bg)
    document.documentElement.style.setProperty('--cc-text', theme.text)
    document.documentElement.style.setProperty('--cc-accent', theme.accent)
    document.documentElement.style.setProperty('--cc-border', theme.border)
    document.documentElement.style.setProperty('--cc-muted', theme.textMuted)
    document.documentElement.style.setProperty('--cc-noise-opacity', String(theme.noiseOpacity))
  }, [mode, theme])

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
