import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Stages mirror the simulation pipeline described in the report (§4.4).
const STAGES = [
  'Initializing bioreactor state…',
  'Solving algal growth (Monod · Logistic)…',
  'Computing CO₂ fixation & glucose yield…',
  'Running yeast fermentation (Luedeking-Piret)…',
  'Evaluating efficiency & CO₂ balance…',
  'Rendering results…',
]

/**
 * Full-screen loading overlay with an animated progress bar.
 * Calls `onDone` once progress reaches 100%.
 */
export default function LoadingScreen({ theme, onDone, duration = 2600 }) {
  const [progress, setProgress] = useState(0)
  const start = useRef(performance.now())

  useEffect(() => {
    let raf
    const tick = (now) => {
      const elapsed = now - start.current
      // Ease-out so it decelerates near completion (feels like real compute).
      const linear = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - linear, 2)
      setProgress(eased * 100)
      if (linear < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => onDone?.(), 260)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, onDone])

  const stageIdx = Math.min(
    STAGES.length - 1,
    Math.floor((progress / 100) * STAGES.length)
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: theme.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* ambient glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600,
        background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Spinning ring + molecule */}
      <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 38 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `3px solid ${theme.border}`,
            borderTopColor: theme.accent,
            borderRightColor: theme.accent,
            boxShadow: `0 0 28px ${theme.accentGlow}`,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 26, borderRadius: '50%',
            background: theme.accentGlow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke={theme.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V12" />
            <path d="M12 12c0-5-4.5-7.5-7.5-5.5" />
            <path d="M12 12c0-5 4.5-7.5 7.5-5.5" />
          </svg>
        </motion.div>
      </div>

      <p style={{
        margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: theme.accent,
      }}>
        Running Simulation
      </p>

      {/* Stage text */}
      <div style={{ height: 24, marginTop: 12, marginBottom: 26, textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={stageIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{ margin: 0, fontSize: 14, color: theme.text, fontWeight: 500 }}
          >
            {STAGES[stageIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div style={{ width: 'min(420px, 80vw)' }}>
        <div style={{
          height: 8, borderRadius: 999, background: theme.bgSecondary,
          border: `1px solid ${theme.border}`, overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg, ${theme.accentHover}, ${theme.accent})`,
              borderRadius: 999,
              boxShadow: `0 0 12px ${theme.accent}`,
            }}
          />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 10,
          fontSize: 12, color: theme.textMuted, fontWeight: 600,
        }}>
          <span>{`Stage ${stageIdx + 1} / ${STAGES.length}`}</span>
          <span style={{ color: theme.accent, fontWeight: 800 }}>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  )
}
