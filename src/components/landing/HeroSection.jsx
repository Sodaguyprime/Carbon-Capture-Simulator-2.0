import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function HeroSection() {
  const { theme } = useTheme()

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
      background: theme.bg,
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: `radial-gradient(ellipse, ${theme.accentGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: 300, height: 300,
        background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        {/* Badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 999, padding: '6px 14px',
            boxShadow: theme.shadow,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: theme.accent,
              boxShadow: `0 0 8px ${theme.accent}`,
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted }}>
              Real-time Carbon Capture Simulation
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: theme.text,
            margin: '0 0 24px',
          }}>
          Model the Future of{' '}
          <span style={{
            color: theme.accent,
            textShadow: `0 0 40px ${theme.accentGlow}`,
          }}>
            Carbon Capture
          </span>{' '}
          Technology
        </motion.h1>

        {/* Subheading */}
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: theme.textMuted,
            lineHeight: 1.6,
            maxWidth: 600,
            margin: '0 auto 40px',
            fontWeight: 400,
          }}>
          An interactive 3D simulator that lets researchers, engineers, and students
          explore direct air capture, bioenergy, and enhanced weathering at any scale.
        </motion.p>

        {/* CTA buttons */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 0 32px ${theme.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: theme.accent,
              color: theme.accentText,
              border: 'none',
              borderRadius: 10,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}>
            Start Simulating — It&apos;s Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, borderColor: theme.accent, color: theme.accent }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'transparent',
              color: theme.text,
              border: `1.5px solid ${theme.border}`,
              borderRadius: 10,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
          style={{
            display: 'flex', gap: 0, justifyContent: 'center',
            marginTop: 72,
            borderTop: `1px solid ${theme.border}`,
            paddingTop: 40,
            flexWrap: 'wrap',
          }}>
          {[
            { value: '12+', label: 'Capture Technologies' },
            { value: '50k', label: 'Simulations Run' },
            { value: '98%', label: 'Model Accuracy' },
            { value: '3D', label: 'Visual Engine' },
          ].map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '0 40px',
              borderRight: i < 3 ? `1px solid ${theme.border}` : 'none',
            }}>
              <div style={{
                fontSize: 32, fontWeight: 800, color: theme.accent,
                letterSpacing: '-0.03em',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
