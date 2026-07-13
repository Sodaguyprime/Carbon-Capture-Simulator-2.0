import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// ── Line icons (stroke = currentColor, sized by parent) ──────────────────────
const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
const IconCurve = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M3 3v18h18" /><path d="M4 15c3 0 4-9 8-9s5 6 8 6" /></svg>)
const IconCube = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="m3 7 9 5 9-5" /><path d="M12 12v10" /></svg>)
const IconPulse = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>)
const IconLoop = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>)
const IconSliders = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="18" r="2" /></svg>)
const IconDoc = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...s}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M12 18v-6" /><path d="m9.5 15.5 2.5 2.5 2.5-2.5" /></svg>)

// Small four-point spark used as a mono-eyebrow ornament (icon, not emoji)
export const Spark = ({ size = 11 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 1.8l2.3 7.9 7.9 2.3-7.9 2.3L12 22.2l-2.3-7.9L1.8 12l7.9-2.3z" /></svg>)

const features = [
  { Icon: IconCurve, color: '#3ECF7F', title: 'Bioprocess Kinetics', desc: 'Monod substrate limitation, logistic growth, and the Luedeking-Piret product model — integrated over your chosen duration.' },
  { Icon: IconCube, color: '#22D3EE', title: 'Interactive 3D Reactors', desc: 'Orbit the photobioreactor, airlift column, and stirred-tank fermenter as real glTF hardware you can inspect from any angle.' },
  { Icon: IconPulse, color: '#60A5FA', title: 'Live Visualization', desc: 'Biomass, glucose, ethanol and CO₂ curves render the instant you change a parameter — no waiting, no reloads.' },
  { Icon: IconLoop, color: '#C4F24C', title: 'Closed Carbon Loop', desc: 'Fermentation CO₂ is scrubbed and re-injected upstream; water is recycled — the balance is tracked end to end.' },
  { Icon: IconSliders, color: '#FBBF24', title: 'Constrained Tuning', desc: 'Every input is bounded to biologically valid ranges and clamped in real time, so runs stay physically meaningful.' },
  { Icon: IconDoc, color: '#C084FC', title: 'Export & Report', desc: 'Capture a full run as a clean, paginated PDF dashboard — built for lab reports, reviews, and coursework.' },
]

export default function FeaturesSection() {
  const { theme } = useTheme()

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '110px 24px', background: theme.bgSecondary }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
        backgroundSize: '34px 34px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000, transparent 75%)',
      }} />
      <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.accent }}>
            <Spark /> Capabilities
          </span>
          <h2 style={{
            fontFamily: theme.fontDisplay, fontSize: 'clamp(30px, 4.4vw, 52px)', fontWeight: 500,
            color: theme.text, letterSpacing: '-0.02em', margin: '18px 0 16px', lineHeight: 1.06,
          }}>
            Everything you need to model<br />the <em style={{ fontStyle: 'italic', color: theme.accent }}>carbon-to-fuel</em> loop
          </h2>
          <p style={{ fontSize: 17, color: theme.textMuted, maxWidth: 540, margin: '0 auto', lineHeight: 1.65 }}>
            From a single pilot vessel to a full closed-loop system — grounded in real bioprocess kinetics.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, boxShadow: theme.shadowLg, borderColor: f.color + '55' }}
              style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 18,
                padding: '30px 28px', cursor: 'default', transition: 'box-shadow 0.25s, border-color 0.25s',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.color}, transparent 80%)`, opacity: 0.7 }} />
              <div style={{
                width: 50, height: 50, borderRadius: 13, marginBottom: 20,
                background: f.color + '16', border: `1px solid ${f.color}38`, color: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.Icon />
              </div>
              <h3 style={{ fontFamily: theme.fontDisplay, fontSize: 21, fontWeight: 500, color: theme.text, margin: '0 0 9px', letterSpacing: '-0.01em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
