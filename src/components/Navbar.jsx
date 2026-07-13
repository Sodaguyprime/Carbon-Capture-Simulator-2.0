import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Models', to: '/models' },
  { label: 'Research', to: '/research' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { theme, mode, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Responsive show/hide can't be expressed with inline styles, so the
  // display rules live here; colours stay inline so they track the theme.
  const css = `
    .nav-desktop{ display:flex; align-items:center; gap:2px; }
    .nav-cta{ display:inline-flex; }
    .nav-burger{ display:none; }
    .nav-shell{ padding:0 32px; }
    @media (max-width: 920px){
      .nav-desktop{ display:none; }
      .nav-cta{ display:none; }
      .nav-burger{ display:flex; }
      .nav-shell{ padding:0 18px; }
    }
  `

  const Brand = (
    <Link to="/" style={{ textDecoration: 'none' }} aria-label="CarbonCap home"
      onClick={() => setMenuOpen(false)}>
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
        <span style={{ fontFamily: theme.fontDisplay, fontWeight: 600, fontSize: 20, letterSpacing: '-0.015em', color: theme.text }}>
          CarbonCap<span style={{ color: theme.accent, fontStyle: 'italic' }}>.</span>
        </span>
      </motion.div>
    </Link>
  )

  const themeButton = (
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
        color: theme.text, fontSize: 16, flexShrink: 0,
      }}
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {mode === 'dark' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </motion.button>
  )

  return (
    <>
      <style>{css}</style>
      <motion.nav
        className="nav-shell"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: theme.navBg,
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${theme.border}`,
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {Brand}

        {/* Desktop links */}
        <div className="nav-desktop">
          {navLinks.map(link => {
            const active = location.pathname === link.to
            return (
              <Link key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
                <motion.span
                  whileHover={{ color: theme.accent }}
                  style={{
                    display: 'inline-block',
                    color: active ? theme.accent : theme.textMuted,
                    fontFamily: theme.fontMono, fontSize: 12, fontWeight: active ? 600 : 500,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    padding: '6px 11px', borderRadius: 6, cursor: 'pointer',
                    transition: 'color 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </motion.span>
              </Link>
            )
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {themeButton}

          {/* Desktop CTA */}
          <motion.button
            className="nav-cta"
            whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${theme.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/simulation')}
            style={{
              alignItems: 'center',
              background: location.pathname === '/simulation' ? theme.accentHover : theme.accent,
              color: theme.accentText, border: 'none', borderRadius: 8,
              padding: '9px 18px', fontFamily: theme.fontMono, fontSize: 11.5, fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}
          >
            Launch Simulator
          </motion.button>

          {/* Mobile burger — only visible below the breakpoint */}
          <motion.button
            className="nav-burger"
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              width: 40, height: 40, borderRadius: 8,
              background: menuOpen ? theme.accentGlow : theme.bgCard,
              border: `1px solid ${menuOpen ? theme.accent : theme.border}`,
              cursor: 'pointer',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              flexShrink: 0,
            }}
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              style={{ display: 'block', width: 18, height: 2, borderRadius: 2, background: menuOpen ? theme.accent : theme.text }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
              style={{ display: 'block', width: 18, height: 2, borderRadius: 2, background: theme.text }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              style={{ display: 'block', width: 18, height: 2, borderRadius: 2, background: menuOpen ? theme.accent : theme.text }} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: theme.navBg,
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              borderBottom: `1px solid ${theme.border}`,
              boxShadow: theme.shadowLg,
              padding: '12px 18px 20px',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}
          >
            {navLinks.map(link => {
              const active = location.pathname === link.to
              return (
                <Link key={link.label} to={link.to} style={{ textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>
                  <div style={{
                    padding: '13px 14px', borderRadius: 10,
                    background: active ? theme.accentGlow : 'transparent',
                    color: active ? theme.accent : theme.text,
                    fontSize: 16, fontWeight: active ? 700 : 500,
                  }}>
                    {link.label}
                  </div>
                </Link>
              )
            })}
            <button
              onClick={() => { setMenuOpen(false); navigate('/simulation') }}
              style={{
                marginTop: 10, width: '100%',
                background: theme.accent, color: theme.accentText,
                border: 'none', borderRadius: 10, padding: '14px 18px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Launch Simulator
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
