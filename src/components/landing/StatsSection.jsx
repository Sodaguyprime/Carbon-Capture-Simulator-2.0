import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

function AnimatedNumber({ target, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, target])

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>
}

const metrics = [
  { label: 'Mt CO₂ Modeled', value: 142, suffix: '+' },
  { label: 'Active Researchers', value: 3800, suffix: '+' },
  { label: 'Cost Reduction (vs. manual)', value: 73, suffix: '%' },
  { label: 'Countries Represented', value: 54, suffix: '' },
]

export default function StatsSection() {
  const { theme } = useTheme()

  return (
    <section style={{
      padding: '100px 24px',
      background: theme.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 1, height: '100%',
        background: `linear-gradient(to bottom, ${theme.accentGlow}, transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            color: theme.text,
            letterSpacing: '-0.03em',
            margin: '0 0 12px',
          }}>
            The numbers speak for themselves
          </h2>
          <p style={{ fontSize: 16, color: theme.textMuted }}>
            Trusted by climate researchers, NGOs, and universities worldwide.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 1,
          background: theme.border,
          borderRadius: 20,
          overflow: 'hidden',
          border: `1px solid ${theme.border}`,
        }}>
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: theme.bgCard,
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 800,
                color: theme.accent,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                marginBottom: 10,
                textShadow: `0 0 40px ${theme.accentGlow}`,
              }}>
                <AnimatedNumber target={m.value} suffix={m.suffix} />
              </div>
              <div style={{ fontSize: 14, color: theme.textMuted, fontWeight: 500 }}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
