import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const features = [
  {
    icon: '🌿',
    title: 'Direct Air Capture',
    desc: 'Simulate DAC units at varying scales. Adjust sorbent types, airflow rates, and regeneration cycles in real time.',
  },
  {
    icon: '⚡',
    title: 'Energy Efficiency Modeling',
    desc: 'Track energy consumption per tonne of CO₂ captured. Compare renewable vs grid-powered configurations.',
  },
  {
    icon: '📊',
    title: 'Live Data Visualization',
    desc: 'See capture rates, cost curves, and efficiency metrics update dynamically as you tweak parameters.',
  },
  {
    icon: '🧪',
    title: 'Multi-Technology Stacks',
    desc: 'Combine BECCS, enhanced weathering, and ocean alkalinity enhancement in hybrid system scenarios.',
  },
  {
    icon: '🗺️',
    title: 'Geographic Modeling',
    desc: 'Factor in regional energy grids, land availability, and climate conditions for real-world viability.',
  },
  {
    icon: '📤',
    title: 'Export & Report',
    desc: 'Export simulation results as CSV, PDF, or shareable links. Built for researchers and policymakers.',
  },
]

export default function FeaturesSection() {
  const { theme } = useTheme()

  return (
    <section style={{
      padding: '100px 24px',
      background: theme.bgSecondary,
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
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
            marginBottom: 16,
          }}>
            Capabilities
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            color: theme.text,
            letterSpacing: '-0.03em',
            margin: '0 0 16px',
          }}>
            Everything you need to model<br />carbon removal at scale
          </h2>
          <p style={{ fontSize: 17, color: theme.textMuted, maxWidth: 520, margin: '0 auto' }}>
            From small pilot plants to gigaton-scale deployments — the simulator handles it all.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4, boxShadow: theme.shadowLg }}
              style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: '28px 28px',
                cursor: 'default',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{
                fontSize: 28, marginBottom: 14,
                width: 48, height: 48, borderRadius: 12,
                background: theme.bgSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: 17, fontWeight: 700, color: theme.text,
                margin: '0 0 8px', letterSpacing: '-0.02em',
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
