import { motion, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Spark } from './FeaturesSection'

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

// Honest, project-grounded figures — not vanity metrics.
const metrics = [
  { label: 'Kinetic models integrated', value: 3, suffix: '' },
  { label: 'Reactor units, fully 3D', value: 3, suffix: '' },
  { label: 'Ethanol purity modeled', value: 99, suffix: '%' },
  { label: 'Max simulation window', value: 72, suffix: ' h' },
]

export default function StatsSection() {
  const { theme } = useTheme()

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '104px 24px', background: theme.bg }}>
      {/* center seam glow */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 1, height: '100%',
        background: `linear-gradient(to bottom, ${theme.accentGlow}, transparent)`, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.accent }}>
            <Spark /> By the numbers
          </span>
          <h2 style={{
            fontFamily: theme.fontDisplay, fontSize: 'clamp(30px, 4.4vw, 52px)', fontWeight: 500,
            color: theme.text, letterSpacing: '-0.02em', margin: '18px 0 12px', lineHeight: 1.06,
          }}>
            A complete bioprocess,<br />in a single browser tab
          </h2>
          <p style={{ fontSize: 16, color: theme.textMuted }}>
            A student capstone built at Cyprus International University — modelled end to end.
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1,
          background: theme.border, borderRadius: 20, overflow: 'hidden', border: `1px solid ${theme.border}`,
        }}>
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: theme.bgCard, padding: '44px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
              <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`, backgroundSize: '22px 22px', opacity: 0.5 }} />
              <div style={{
                position: 'relative', fontFamily: theme.fontDisplay, fontSize: 'clamp(44px, 5vw, 62px)', fontWeight: 500,
                color: theme.accent, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12,
                textShadow: `0 0 44px ${theme.accentGlow}`,
              }}>
                <AnimatedNumber target={m.value} suffix={m.suffix} />
              </div>
              <div style={{ position: 'relative', fontFamily: theme.fontMono, fontSize: 12, color: theme.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
