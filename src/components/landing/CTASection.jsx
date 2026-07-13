import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Spark } from './FeaturesSection'

const HERO_IMG = '/ChatGPT Image Jun 13, 2026, 07_25_11 AM.png'

export default function CTASection() {
  const { theme } = useTheme()
  const navigate = useNavigate()

  return (
    <section style={{ padding: '96px 24px 120px', background: theme.bgSecondary }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', overflow: 'hidden', borderRadius: 26,
            padding: 'clamp(44px, 6vw, 80px) clamp(28px, 5vw, 68px)',
            background: theme.bgInk, border: `1px solid ${theme.borderStrong}`,
            boxShadow: theme.shadowLg, textAlign: 'center',
          }}
        >
          {/* low-key background image + scrim */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: `#0a120d url("${HERO_IMG}") center 40%/cover no-repeat`,
            opacity: 0.22, filter: 'saturate(1.1)',
            maskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, #000, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, #000, transparent 80%)',
          }} />
          <div aria-hidden style={{
            position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
            width: 520, height: 360, background: `radial-gradient(ellipse, ${theme.accent}33 0%, transparent 68%)`, pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.accent }}>
              <Spark /> Run your own numbers
            </span>
            <h2 style={{
              fontFamily: theme.fontDisplay, fontSize: 'clamp(30px, 4.6vw, 52px)', fontWeight: 500,
              color: '#F2F7F2', letterSpacing: '-0.02em', margin: '18px 0 18px', lineHeight: 1.08,
            }}>
              Ready to simulate the path<br />from <em style={{ fontStyle: 'italic', color: theme.accent }}>CO₂ to fuel?</em>
            </h2>
            <p style={{ fontSize: 16.5, color: '#AEC0B4', lineHeight: 1.7, margin: '0 auto 38px', maxWidth: 480 }}>
              Set your initial conditions, run the kinetic engine, and watch biomass,
              glucose, ethanol and CO₂ evolve in real time — free, in the browser.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ y: -2, boxShadow: `0 16px 44px -8px ${theme.accentGlow}` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/simulation')}
                style={{
                  background: theme.accent, color: theme.accentText, border: 'none', borderRadius: 12,
                  padding: '15px 30px', fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: `0 10px 34px -8px ${theme.accentGlow}`,
                }}>
                Launch the Simulator
              </motion.button>
              <motion.button
                whileHover={{ y: -2, borderColor: theme.accent, color: theme.accent }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/how-it-works')}
                style={{
                  background: 'transparent', color: '#CFDDD3', border: '1px solid rgba(207,221,211,0.28)',
                  borderRadius: 12, padding: '15px 28px', fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}>
                How It Works
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
