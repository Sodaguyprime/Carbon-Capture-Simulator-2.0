import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const footerLinks = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Models', to: '/models' },
  { label: 'Research', to: '/research' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer style={{ background: theme.bg, borderTop: `1px solid ${theme.border}`, padding: '36px 24px' }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: theme.fontDisplay, fontSize: 18, fontWeight: 600, color: theme.text, letterSpacing: '-0.015em' }}>
            CarbonCap<span style={{ color: theme.accent, fontStyle: 'italic' }}>.</span>
          </span>
        </Link>
        <span style={{ fontFamily: theme.fontMono, fontSize: 11.5, color: theme.textMuted, letterSpacing: '0.03em', textAlign: 'center' }}>
          © 2026 CarbonCap Simulator · Cyprus International University
        </span>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {footerLinks.map(l => (
            <Link key={l.label} to={l.to} style={{
              fontFamily: theme.fontMono, fontSize: 11.5, color: theme.textMuted, textDecoration: 'none',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
