import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Simulator', to: '/' },
  { label: 'How It Works', to: '/' },
  { label: 'Data', to: '/' },
  { label: 'Research', to: '/' },
  { label: 'About', to: '/' },
]

export default function Navbar() {
  const { theme, mode, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: theme.navBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${theme.border}`,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: theme.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 12px ${theme.accentGlow}`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                fill={theme.accentText} />
            </svg>
          </div>
          <span style={{
            fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em',
            color: theme.text,
          }}>
            CarbonCap<span style={{ color: theme.accent }}>.</span>
          </span>
        </motion.div>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {navLinks.map(link => (
          <motion.a
            key={link.label}
            whileHover={{ color: theme.accent }}
            style={{
              color: theme.textMuted,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            {link.label}
          </motion.a>
        ))}

        {/* Models link — highlighted */}
        <Link to="/models" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: location.pathname === '/models'
                ? theme.accentGlow
                : 'transparent',
              border: `1.5px solid ${location.pathname === '/models' ? theme.accent : theme.border}`,
              color: location.pathname === '/models' ? theme.accent : theme.text,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ fontSize: 13 }}>⬡</span>
            Check out Models
          </motion.div>
        </Link>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          style={{
            width: 40, height: 40, borderRadius: 8,
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.text,
            fontSize: 16,
          }}
          title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mode === 'dark' ? '☀️' : '🌙'}
        </motion.button>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${theme.accentGlow}` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/simulation')}
          style={{
            background: location.pathname === '/simulation' ? theme.accentHover : theme.accent,
            color: theme.accentText,
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          Launch Simulator
        </motion.button>
      </div>
    </motion.nav>
  )
}
