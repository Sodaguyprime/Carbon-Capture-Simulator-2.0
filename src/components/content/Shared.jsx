import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// Reusable building blocks for the informational pages
// (How It Works, Research, About). They all consume ThemeContext so they
// respond to the light/dark toggle like the rest of the site.

export function PageHero({ badge, title, accentWord, subtitle }) {
  const { theme } = useTheme()
  // Split title so the accent word can be coloured
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      padding: '140px 24px 60px', background: theme.bg,
    }}>
      <div style={{
        position: 'absolute', top: '6%', left: '50%', transform: 'translateX(-50%)',
        width: 620, height: 380,
        background: `radial-gradient(ellipse, ${theme.accentGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: theme.bgCard, border: `1px solid ${theme.border}`,
              borderRadius: 999, padding: '6px 14px', marginBottom: 24, boxShadow: theme.shadow,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted }}>{badge}</span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ margin: '0 0 20px', fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', color: theme.text }}
        >
          {title}{' '}
          {accentWord && <span style={{ color: theme.accent, textShadow: `0 0 40px ${theme.accentGlow}` }}>{accentWord}</span>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ margin: '0 auto', maxWidth: 620, fontSize: 'clamp(15px, 2vw, 18px)', color: theme.textMuted, lineHeight: 1.65 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export function Section({ children, style }) {
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px', ...style }}>
      {children}
    </section>
  )
}

export function SectionLabel({ children }) {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: theme.border }} />
    </div>
  )
}

export function Heading({ children }) {
  const { theme } = useTheme()
  return (
    <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.03em', color: theme.text, lineHeight: 1.15 }}>
      {children}
    </h2>
  )
}

export function Lead({ children }) {
  const { theme } = useTheme()
  return <p style={{ margin: '0 0 24px', fontSize: 16, color: theme.textMuted, lineHeight: 1.7, maxWidth: 760 }}>{children}</p>
}

export function Card({ children, accent, style, hover = true }) {
  const { theme } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4, boxShadow: theme.shadowLg } : undefined}
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: '26px 26px',
        boxShadow: theme.shadow,
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
    >
      {accent && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
      )}
      {children}
    </motion.div>
  )
}

export function Pill({ children, color }) {
  const { theme } = useTheme()
  const c = color || theme.accent
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: c + '1A', color: c, border: `1px solid ${c}40`,
      borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700,
    }}>
      {children}
    </span>
  )
}

// A formatted equation block with caption.
export function Equation({ formula, caption, where }) {
  const { theme } = useTheme()
  return (
    <div style={{
      background: theme.bgSecondary, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: '20px 22px', margin: '0 0 16px',
    }}>
      {caption && (
        <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: theme.accent, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {caption}
        </p>
      )}
      <p style={{
        margin: 0, fontSize: 'clamp(17px, 2.4vw, 22px)', fontWeight: 700, color: theme.text,
        fontFamily: '"Cambria Math", Georgia, "Times New Roman", serif',
        letterSpacing: '0.01em', lineHeight: 1.5,
      }}>
        {formula}
      </p>
      {where && (
        <p style={{ margin: '12px 0 0', fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{where}</p>
      )}
    </div>
  )
}

export function BulletList({ items }) {
  const { theme } = useTheme()
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>
          <span style={{ marginTop: 7, width: 6, height: 6, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}
