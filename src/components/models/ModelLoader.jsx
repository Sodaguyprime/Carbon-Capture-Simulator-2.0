import { useProgress, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function ModelLoader() {
  const { progress } = useProgress()
  const { theme } = useTheme()
  const pct = Math.round(progress)

  return (
    <Html center>
      <div style={{
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        transform: 'translateX(-50%)',
        marginLeft: '50%',
      }}>
        {/* Spinning cube */}
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 56, height: 56,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
            borderRadius: 14,
            boxShadow: `0 0 36px ${theme.accentGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}
        >
          ⬡
        </motion.div>

        <div style={{ textAlign: 'center', width: 240 }}>
          {/* Label */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              color: theme.textMuted,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 14,
              margin: '0 0 14px',
            }}
          >
            Loading Model
          </motion.p>

          {/* Track */}
          <div style={{
            width: '100%',
            height: 3,
            background: theme.border,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentHover})`,
                borderRadius: 3,
                boxShadow: `0 0 6px ${theme.accent}`,
              }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            style={{
              color: theme.accent,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              margin: '10px 0 0',
            }}
          >
            {pct}%
          </motion.p>
        </div>
      </div>
    </Html>
  )
}
