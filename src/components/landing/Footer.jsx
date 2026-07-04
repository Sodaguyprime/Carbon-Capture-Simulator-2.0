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
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.text, letterSpacing: '-0.02em' }}>
            CarbonCap<span style={{ color: theme.accent }}>.</span>
          </span>
        </Link>
        <span style={{ fontSize: 13, color: theme.textMuted, textAlign: 'center' }}>
          © 2026 CarbonCap Simulator · Cyprus International University
        </span>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {footerLinks.map(l => (
            <Link key={l.label} to={l.to} style={{
              fontSize: 13, color: theme.textMuted, textDecoration: 'none',
            }}>{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
