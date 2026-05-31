import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'

// ── SVG Icons ──────────────────────────────────────────────────────────────
const AlgaeIcon = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12" />
    <path d="M12 12c0-5-4.5-7.5-7.5-5.5" />
    <path d="M12 12c0-5 4.5-7.5 7.5-5.5" />
    <path d="M12 17c-2.5 0-4 1.5-4 3" />
    <path d="M12 17c2.5 0 4 1.5 4 3" />
  </svg>
)

const MicrobeIcon = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="4.5" r="2" />
    <circle cx="19.5" cy="9" r="2" />
    <circle cx="19.5" cy="15" r="2" />
    <circle cx="12" cy="19.5" r="2" />
    <circle cx="4.5" cy="15" r="2" />
    <circle cx="4.5" cy="9" r="2" />
  </svg>
)

const MoleculeIcon = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="12" r="3.5" />
    <circle cx="18.5" cy="12" r="3.5" />
    <circle cx="12" cy="12" r="2" />
    <line x1="9" y1="12" x2="10" y2="12" />
    <line x1="14" y1="12" x2="15" y2="12" />
  </svg>
)

const TimerIcon = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l3 2" />
    <path d="M9.5 3h5" />
    <path d="M12 3v2" />
  </svg>
)

const PlayIcon = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M8 5v14l11-7z" />
  </svg>
)

const ResetIcon = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

const CheckIcon = ({ size = 13, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ── Input Config ────────────────────────────────────────────────────────────
const INPUT_CONFIGS = [
  {
    id: 'algalBiomass',
    label: 'Algal Biomass Concentration',
    shortLabel: 'Algal Biomass',
    description: 'Initial concentration of algal biomass in the system',
    min: 0.3, max: 29.99, defaultVal: 1, step: 0.01,
    unit: 'g/L',
    Icon: AlgaeIcon,
    color: '#4ADE80',
  },
  {
    id: 'yeastBiomass',
    label: 'Yeast Biomass Concentration',
    shortLabel: 'Yeast Biomass',
    description: 'Initial concentration of yeast biomass in the system',
    min: 0.3, max: 19.99, defaultVal: 0.5, step: 0.01,
    unit: 'g/L',
    Icon: MicrobeIcon,
    color: '#FBBF24',
  },
  {
    id: 'co2Concentration',
    label: 'CO₂ Concentration',
    shortLabel: 'CO₂',
    description: 'Initial concentration of carbon dioxide in the system',
    min: 0.3, max: 10, defaultVal: 0.3, step: 0.01,
    unit: 'g/L',
    Icon: MoleculeIcon,
    color: '#60A5FA',
  },
  {
    id: 'simulationDuration',
    label: 'Simulation Duration',
    shortLabel: 'Duration',
    description: 'Total duration of the simulation run',
    min: 7, max: 72, defaultVal: 7, step: 1,
    unit: 'hrs',
    Icon: TimerIcon,
    color: '#C084FC',
  },
]

// ── InputCard ───────────────────────────────────────────────────────────────
function InputCard({ config, value, onChange, theme, index }) {
  const { id, label, description, min, max, unit, Icon, step, color } = config
  const [displayVal, setDisplayVal] = useState(String(value))
  const [focused, setFocused] = useState(false)

  const pct = ((value - min) / (max - min)) * 100

  const handleSlider = (e) => {
    const v = parseFloat(e.target.value)
    onChange(id, v)
    if (!focused) setDisplayVal(String(v))
  }

  const handleNumFocus = () => {
    setFocused(true)
    setDisplayVal(String(value))
  }

  const handleNumBlur = () => {
    setFocused(false)
    const num = parseFloat(displayVal)
    if (isNaN(num)) { setDisplayVal(String(value)); return }
    const clamped = Math.min(max, Math.max(min, num))
    const decimal = step < 1 ? 2 : 0
    const final = parseFloat(clamped.toFixed(decimal))
    onChange(id, final)
    setDisplayVal(String(final))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Per-card injected slider styles */}
      <style>{`
        .sim-slider-${id} {
          -webkit-appearance: none;
          appearance: none;
          display: block;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          cursor: pointer;
          outline: none;
        }
        .sim-slider-${id}::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 12px ${color}80;
          cursor: pointer;
          margin-top: -7px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .sim-slider-${id}::-webkit-slider-thumb:hover {
          transform: scale(1.22);
          box-shadow: 0 0 20px ${color}A0;
        }
        .sim-slider-${id}::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 12px ${color}80;
          border: none;
          cursor: pointer;
        }
        .sim-num-${id}::-webkit-inner-spin-button,
        .sim-num-${id}::-webkit-outer-spin-button { opacity: 0; }
        .sim-num-${id} { -moz-appearance: textfield; }
      `}</style>

      <div style={{
        background: theme.bgCard,
        border: `1.5px solid ${focused ? color + '55' : theme.border}`,
        borderRadius: 18,
        padding: '22px 24px',
        boxShadow: focused
          ? `0 0 0 4px ${color}14, ${theme.shadow}`
          : theme.shadow,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        height: '100%',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            background: color + '18',
            border: `1.5px solid ${color}40`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={20} color={color} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: theme.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {label}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: theme.textMuted, lineHeight: 1.55 }}>
              {description}
            </p>
          </div>
        </div>

        {/* Slider track */}
        <div style={{ marginBottom: 18 }}>
          <input
            type="range"
            min={min} max={max} step={step}
            value={value}
            onChange={handleSlider}
            className={`sim-slider-${id}`}
            style={{
              background: `linear-gradient(to right, ${color} ${pct}%, ${theme.border} ${pct}%)`,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: theme.textMuted }}>{min} {unit}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: color + 'CC' }}>{pct.toFixed(0)}% of range</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: theme.textMuted }}>{max} {unit}</span>
          </div>
        </div>

        {/* Numeric input */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          border: `1.5px solid ${focused ? color + '60' : theme.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          background: theme.bgSecondary,
          transition: 'border-color 0.2s',
        }}>
          <input
            type="number"
            min={min} max={max} step={step}
            value={focused ? displayVal : value}
            onChange={(e) => setDisplayVal(e.target.value)}
            onFocus={handleNumFocus}
            onBlur={handleNumBlur}
            className={`sim-num-${id}`}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '13px 16px',
              fontSize: 26,
              fontWeight: 800,
              color: theme.text,
              outline: 'none',
              textAlign: 'center',
              letterSpacing: '-0.04em',
              fontFamily: 'inherit',
            }}
          />
          <div style={{
            padding: '0 18px',
            background: color + '15',
            borderLeft: `1.5px solid ${color}30`,
            display: 'flex', alignItems: 'center',
            fontSize: 12, fontWeight: 700,
            color: color,
            letterSpacing: '0.04em',
            userSelect: 'none',
            textTransform: 'uppercase',
          }}>
            {unit}
          </div>
        </div>

        {/* Sub-progress bar */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 2, background: theme.border, borderRadius: 1, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.25 }}
              style={{ height: '100%', background: color, borderRadius: 1 }}
            />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: color + '18', borderRadius: 999, padding: '2px 8px',
          }}>
            <CheckIcon size={11} color={color} />
            <span style={{ fontSize: 10, fontWeight: 700, color: color }}>Valid</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Summary Panel ───────────────────────────────────────────────────────────
function SummaryPanel({ values, theme, onRun, onReset }) {
  const avgPct = INPUT_CONFIGS.reduce((acc, cfg) =>
    acc + ((values[cfg.id] - cfg.min) / (cfg.max - cfg.min)), 0
  ) / INPUT_CONFIGS.length * 100

  const estMinutes = Math.max(1, Math.round(values.simulationDuration * 0.8))

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'sticky',
        top: 80,
        background: theme.bgCard,
        border: `1.5px solid ${theme.border}`,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: theme.shadowLg,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 22px 18px',
        background: theme.accentGlow,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: theme.accent,
            boxShadow: `0 0 8px ${theme.accent}`,
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Configuration Summary
          </span>
        </div>

        {/* Overall bar */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>Avg. range position</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>{avgPct.toFixed(0)}%</span>
          </div>
          <div style={{ height: 4, background: theme.border, borderRadius: 2, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${avgPct}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: theme.accent, borderRadius: 2, boxShadow: `0 0 8px ${theme.accentGlow}` }}
            />
          </div>
        </div>
      </div>

      {/* Values list */}
      <div style={{ padding: '6px 0' }}>
        {INPUT_CONFIGS.map((cfg, i) => {
          const pct = ((values[cfg.id] - cfg.min) / (cfg.max - cfg.min)) * 100
          return (
            <div
              key={cfg.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 22px',
                borderBottom: i < INPUT_CONFIGS.length - 1 ? `1px solid ${theme.border}` : 'none',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                background: cfg.color + '18',
                border: `1px solid ${cfg.color}35`,
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <cfg.Icon size={15} color={cfg.color} />
              </div>

              {/* Label + mini bar */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cfg.shortLabel}
                </p>
                <div style={{ height: 3, background: theme.border, borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%', background: cfg.color, borderRadius: 2 }}
                  />
                </div>
              </div>

              {/* Value */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: '-0.03em' }}>
                  {values[cfg.id]}
                </span>
                <span style={{ fontSize: 10, color: theme.textMuted, marginLeft: 3 }}>
                  {cfg.unit}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA area */}
      <div style={{ padding: '14px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: `0 8px 32px ${theme.accentGlow}` }}
          whileTap={{ scale: 0.97 }}
          onClick={onRun}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%',
            background: theme.accent,
            color: theme.accentText,
            border: 'none',
            borderRadius: 12,
            padding: '15px 24px',
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            boxShadow: `0 4px 20px ${theme.accentGlow}`,
            transition: 'box-shadow 0.2s',
          }}
        >
          <PlayIcon size={16} color={theme.accentText} />
          Run Simulation
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            width: '100%',
            background: 'transparent',
            color: theme.textMuted,
            border: `1px solid ${theme.border}`,
            borderRadius: 10,
            padding: '9px 16px',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          <ResetIcon size={13} color={theme.textMuted} />
          Reset to Defaults
        </motion.button>

        <p style={{ margin: 0, textAlign: 'center', fontSize: 11, color: theme.textMuted }}>
          Estimated compute time · ~{estMinutes} min
        </p>
      </div>
    </motion.div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function SimulationPage() {
  const { theme } = useTheme()

  const defaultValues = Object.fromEntries(INPUT_CONFIGS.map(cfg => [cfg.id, cfg.defaultVal]))
  const [values, setValues] = useState(defaultValues)

  const handleChange = (id, val) => setValues(prev => ({ ...prev, [id]: val }))
  const handleReset = () => setValues(defaultValues)
  const handleRun = () => {
    // TODO: navigate to results page
    console.log('Running simulation:', values)
  }

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />

      {/* Page header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Step badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: theme.accentGlow,
            border: `1px solid ${theme.accent}`,
            borderRadius: 999,
            padding: '4px 14px',
            marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: theme.accent, display: 'inline-block',
              boxShadow: `0 0 6px ${theme.accent}`,
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Step 1 of 3 · Initial Conditions
            </span>
          </div>

          <h1 style={{
            margin: 0,
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 800,
            color: theme.text,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
          }}>
            Configure Your Simulation
          </h1>
          <p style={{
            margin: '10px 0 0',
            fontSize: 14,
            color: theme.textMuted,
            maxWidth: 480,
            lineHeight: 1.6,
          }}>
            Set initial concentrations and parameters within specified biological constraints.
            Values are validated in real time.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            height: 1,
            background: theme.border,
            marginTop: 24,
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 32px 80px',
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
      }}>
        {/* Left column — inputs */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              Initial Conditions
            </span>
            <div style={{ flex: 1, height: 1, background: theme.border }} />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: theme.textMuted,
              background: theme.bgSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: '2px 10px',
              whiteSpace: 'nowrap',
            }}>
              4 parameters
            </span>
          </motion.div>

          {/* 2-col grid of input cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {INPUT_CONFIGS.map((config, i) => (
              <InputCard
                key={config.id}
                config={config}
                value={values[config.id]}
                onChange={handleChange}
                theme={theme}
                index={i}
              />
            ))}
          </div>

          {/* Info footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: 20,
              padding: '14px 18px',
              background: theme.bgSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>
              All values are constrained to biologically valid ranges. Inputs outside these bounds are clamped automatically.
            </span>
          </motion.div>
        </div>

        {/* Right column — summary */}
        <div style={{ width: 296, flexShrink: 0 }}>
          <SummaryPanel
            values={values}
            theme={theme}
            onRun={handleRun}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  )
}
