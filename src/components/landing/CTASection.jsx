import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function CTASection() {
  const { theme } = useTheme()

  return (
    <section style={{
      padding: '100px 24px 120px',
      background: theme.bgSecondary,
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: 'clamp(40px, 6vw, 72px) clamp(28px, 5vw, 64px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: theme.shadowLg,
          }}
        >
          {/* Glow inside card */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 400, height: 200,
            background: `radial-gradient(ellipse, ${theme.accentGlow} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <span style={{
            display: 'inline-block',
            background: theme.accentGlow,
            color: theme.accent,
            border: `1px solid ${theme.accent}`,
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Get Started Today
          </span>

          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 800,
            color: theme.text,
            letterSpacing: '-0.03em',
            margin: '0 0 16px',
            lineHeight: 1.1,
          }}>
            Ready to simulate<br />the path to net zero?
          </h2>

          <p style={{
            fontSize: 16,
            color: theme.textMuted,
            lineHeight: 1.7,
            margin: '0 0 36px',
            maxWidth: 460,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Join thousands of researchers using CarbonCap to model,
            test, and validate carbon removal strategies — for free.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 32px ${theme.accentGlow}` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: theme.accent,
                color: theme.accentText,
                border: 'none',
                borderRadius: 10,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}>
              Launch the Simulator
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: theme.accent, color: theme.accent }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'transparent',
                color: theme.textMuted,
                border: `1.5px solid ${theme.border}`,
                borderRadius: 10,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}>
              Read the Docs
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
