import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// Reusable building blocks for the informational pages
// (How It Works, Research, About, Contact, Models). They all consume
// ThemeContext so they respond to the light/dark toggle like the rest of the
// site. Aesthetic: editorial serif display + mono eyebrows + grain/graph paper.

// A faint engineering graph-paper grid, used as low-key section texture.
export function gridBg(theme, size = 30) {
  return {
    backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  }
}

export function PageHero({ badge, title, accentWord, subtitle }) {
  const { theme } = useTheme()
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      padding: '150px 24px 64px', background: theme.bg,
    }}>
      {/* graph-paper grid */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, ...gridBg(theme), maskImage: 'radial-gradient(ellipse 80% 70% at 50% 20%, #000 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 20%, #000 30%, transparent 75%)' }} />
      {/* atmospheric accent bloom */}
      <div aria-hidden style={{
        position: 'absolute', top: '-6%', left: '50%', transform: 'translateX(-50%)',
        width: 720, height: 460,
        background: `radial-gradient(ellipse at center, ${theme.accentGlow} 0%, transparent 70%)`,
        pointerEvents: 'none', filter: 'blur(4px)',
      }} />
      {/* decorative contour rings */}
      <svg aria-hidden viewBox="0 0 400 400" style={{ position: 'absolute', top: 40, right: -60, width: 340, height: 340, opacity: 0.5, pointerEvents: 'none' }}>
        {[60, 100, 140, 180].map((r, i) => (
          <circle key={r} cx="200" cy="200" r={r} fill="none" stroke={theme.border} strokeWidth={i === 1 ? 1.4 : 1} strokeDasharray={i % 2 ? '3 7' : 'none'} />
        ))}
        <circle cx="200" cy="200" r="6" fill={theme.accent} opacity="0.5" />
      </svg>

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: theme.bgCard, border: `1px solid ${theme.border}`,
              borderRadius: 999, padding: '6px 15px', marginBottom: 26, boxShadow: theme.shadow,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
            <span style={{ fontFamily: theme.fontMono, fontSize: 11, fontWeight: 500, color: theme.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{badge}</span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ margin: '0 0 22px', fontFamily: theme.fontDisplay, fontSize: 'clamp(38px, 5.6vw, 68px)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.02em', color: theme.text, fontOpticalSizing: 'auto' }}
        >
          {title}{accentWord ? ' ' : ''}
          {accentWord && <em style={{ fontStyle: 'italic', fontWeight: 500, color: theme.accent, textShadow: `0 0 44px ${theme.accentGlow}` }}>{accentWord}</em>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ margin: '0 auto', maxWidth: 640, fontSize: 'clamp(15px, 1.5vw, 18px)', color: theme.textMuted, lineHeight: 1.7 }}
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
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '44px 24px', ...style }}>
      {children}
    </section>
  )
}

export function SectionLabel({ children }) {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
      <span style={{ width: 7, height: 7, borderRadius: 2, background: theme.accent, transform: 'rotate(45deg)', flexShrink: 0, boxShadow: `0 0 10px ${theme.accentGlow}` }} />
      <span style={{ fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600, color: theme.accent, letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${theme.border}, transparent)` }} />
    </div>
  )
}

export function Heading({ children }) {
  const { theme } = useTheme()
  return (
    <h2 style={{ margin: '0 0 16px', fontFamily: theme.fontDisplay, fontSize: 'clamp(26px, 3.4vw, 40px)', fontWeight: 500, letterSpacing: '-0.02em', color: theme.text, lineHeight: 1.12 }}>
      {children}
    </h2>
  )
}

export function Lead({ children }) {
  const { theme } = useTheme()
  return <p style={{ margin: '0 0 26px', fontSize: 16.5, color: theme.textMuted, lineHeight: 1.72, maxWidth: 760 }}>{children}</p>
}

export function Card({ children, accent, style, hover = true }) {
  const { theme } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -5, boxShadow: theme.shadowLg, borderColor: accent ? accent + '66' : theme.borderStrong } : undefined}
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: '28px 28px',
        boxShadow: theme.shadow,
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.25s',
        ...style,
      }}
    >
      {accent && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent 85%)` }} />
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
      background: c + '18', color: c, border: `1px solid ${c}3A`,
      borderRadius: 999, padding: '4px 12px',
      fontFamily: theme.fontMono, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em',
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
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, ...gridBg(theme, 22), opacity: 0.6, pointerEvents: 'none' }} />
      {caption && (
        <p style={{ position: 'relative', margin: '0 0 12px', fontFamily: theme.fontMono, fontSize: 11, fontWeight: 600, color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {caption}
        </p>
      )}
      <p style={{
        position: 'relative', margin: 0, fontSize: 'clamp(16px, 2.2vw, 21px)', fontWeight: 500, color: theme.text,
        fontFamily: theme.fontMono, letterSpacing: '0', lineHeight: 1.6,
      }}>
        {formula}
      </p>
      {where && (
        <p style={{ position: 'relative', margin: '12px 0 0', fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{where}</p>
      )}
    </div>
  )
}

export function BulletList({ items }) {
  const { theme } = useTheme()
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>
          <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: 1, background: theme.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}
