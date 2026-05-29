import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import ModelScene from '../components/models/ModelScene'
import ModelLoader from '../components/models/ModelLoader'
import { useTheme } from '../context/ThemeContext'

const MODELS = [
  {
    id: 'fermentor',
    label: 'Fermentor',
    description: 'Biological carbon conversion unit. Microorganisms break down organic matter and sequester CO₂ as stable biomass.',
    path: '/models/Fermentor.glb',
    icon: '🧫',
    tag: 'Bioreactor',
  },
  {
    id: 'middle',
    label: 'Middle Part',
    description: 'Central processing chamber. Handles gas separation and pressurisation between capture and storage stages.',
    path: '/models/Middlepart.glb',
    icon: '⚙️',
    tag: 'Gas Separation',
  },
  {
    id: 'third',
    label: '3rd Stage',
    description: 'Final compression and mineralisation unit. Converts gaseous CO₂ into stable solid carbonates for long-term storage.',
    path: '/models/3rd_part.glb',
    icon: '🪨',
    tag: 'Mineralisation',
  },
]

export default function ModelsPage() {
  const { theme } = useTheme()
  const [active, setActive] = useState(MODELS[0])
  const [autoRotate, setAutoRotate] = useState(true)
  const [showHints, setShowHints] = useState(true)

  const handleSelect = (model) => {
    setActive(model)
    setAutoRotate(true)
    setShowHints(true)
  }

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          paddingTop: 82,
          padding: '82px 32px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: theme.accentGlow,
            border: `1px solid ${theme.accent}`,
            borderRadius: 999,
            padding: '3px 12px',
            marginBottom: 10,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: theme.accent,
              display: 'inline-block',
              boxShadow: `0 0 6px ${theme.accent}`,
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: theme.accent,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Interactive 3D
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 800,
            color: theme.text,
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Carbon Capture Components
          </h1>
          <p style={{ fontSize: 14, color: theme.textMuted, marginTop: 6 }}>
            Explore the 3D architecture of each stage in the capture process.
          </p>
        </div>

        {/* Auto-rotate toggle */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setAutoRotate(r => !r)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: autoRotate ? theme.accentGlow : theme.bgCard,
            border: `1.5px solid ${autoRotate ? theme.accent : theme.border}`,
            color: autoRotate ? theme.accent : theme.textMuted,
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <motion.span
            animate={{ rotate: autoRotate ? 360 : 0 }}
            transition={{ duration: 1.8, repeat: autoRotate ? Infinity : 0, ease: 'linear' }}
            style={{ display: 'inline-block', fontSize: 16 }}
          >
            ↻
          </motion.span>
          Auto Rotate
        </motion.button>
      </motion.div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 32px 32px',
        gap: 16,
      }}>
        {/* Viewer container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            flex: 1,
            height: 'calc(100vh - 380px)',
            minHeight: 380,
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            background: theme.bgCard,
            position: 'relative',
            boxShadow: theme.shadowLg,
          }}
        >
          {/* Info card overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id + '-info'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute', top: 18, left: 18, zIndex: 10,
                maxWidth: 256, pointerEvents: 'none',
              }}
            >
              <div style={{
                background: `${theme.bgCard}E8`,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: '14px 16px',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: theme.accentGlow,
                  color: theme.accent,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  {active.tag}
                </span>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 6 }}>
                  {active.icon} {active.label}
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.6 }}>
                  {active.description}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interaction hints */}
          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                style={{
                  position: 'absolute', bottom: 20, left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex', gap: 10,
                  zIndex: 10, pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {[
                  { icon: '🖱️', label: 'Drag to rotate' },
                  { icon: '⚲', label: 'Scroll to zoom' },
                ].map(h => (
                  <div key={h.label} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: `${theme.bgCard}CC`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                    padding: '5px 12px',
                  }}>
                    <span style={{ fontSize: 13 }}>{h.icon}</span>
                    <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>{h.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 2, 7], fov: 45 }}
            shadows
            gl={{ antialias: true }}
            style={{ width: '100%', height: '100%' }}
            onPointerDown={() => { setAutoRotate(false); setShowHints(false) }}
          >
            <Suspense fallback={<ModelLoader />}>
              <ModelScene
                key={active.id}
                modelPath={active.path}
                autoRotate={autoRotate}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Model selector */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {MODELS.map((model, i) => (
            <motion.button
              key={model.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(model)}
              style={{
                flex: 1,
                minWidth: 180,
                background: active.id === model.id ? theme.bgCard : theme.bgSecondary,
                border: `1.5px solid ${active.id === model.id ? theme.accent : theme.border}`,
                borderRadius: 14,
                padding: '14px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: active.id === model.id
                  ? `0 0 24px ${theme.accentGlow}, ${theme.shadow}`
                  : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  fontSize: 20,
                  width: 40, height: 40,
                  background: active.id === model.id ? theme.accentGlow : theme.bgCard,
                  border: `1px solid ${active.id === model.id ? theme.accent : theme.border}`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}>
                  {model.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: active.id === model.id ? theme.accent : theme.text,
                    letterSpacing: '-0.02em',
                    transition: 'color 0.2s',
                    marginBottom: 2,
                  }}>
                    {model.label}
                  </div>
                  <div style={{
                    fontSize: 10, color: theme.textMuted,
                    fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {model.tag}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
