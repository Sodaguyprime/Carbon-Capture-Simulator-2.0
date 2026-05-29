import { useTheme } from '../../context/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer style={{
      background: theme.bg,
      borderTop: `1px solid ${theme.border}`,
      padding: '32px 24px',
    }}>
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.text, letterSpacing: '-0.02em' }}>
          CarbonCap<span style={{ color: theme.accent }}>.</span>
        </span>
        <span style={{ fontSize: 13, color: theme.textMuted }}>
          © 2026 CarbonCap Simulator. Built for a cooler planet.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{
              fontSize: 13, color: theme.textMuted, textDecoration: 'none',
            }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
