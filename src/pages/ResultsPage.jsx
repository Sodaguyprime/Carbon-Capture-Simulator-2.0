import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ── Standalone dashboard theme (not ThemeContext) ──────────────────────────
const T = {
  bg: '#070A10',
  bgDeep: '#040609',
  card: '#0C1420',
  cardAlt: '#08101A',
  sidebar: '#060910',
  text: '#D0DFF0',
  textBright: '#EEF5FF',
  muted: '#3A566A',
  dim: '#1A2E40',
  border: '#0E1E2C',
  borderGlow: '#183828',
  accent: '#22C55E',
  bright: '#4ADE80',
  accentDim: '#166534',
  glow: 'rgba(34,197,94,0.10)',
  glowMed: 'rgba(34,197,94,0.20)',
  glowBright: 'rgba(34,197,94,0.38)',
  teal: '#0D9488',
  amber: '#F59E0B',
  blue: '#60A5FA',
  purple: '#C084FC',
  grid: '#0B1820',
  // bar chart scale (dark → bright)
  bars: ['#0D4A22', '#166534', '#16A34A', '#22C55E', '#4ADE80'],
}

// ── Default inputs if page loaded directly ─────────────────────────────────
const DEFAULTS = {
  algalBiomass: 1,
  yeastBiomass: 0.5,
  co2Concentration: 0.3,
  simulationDuration: 7,
}

// ── Simulation data generator ──────────────────────────────────────────────
function generateData({ algalBiomass, yeastBiomass, co2Concentration, simulationDuration }) {
  const captureRate = Math.min(0.78, algalBiomass * 0.026 + yeastBiomass * 0.014)
  const yeastBoost  = 1 + (yeastBiomass / 20) * 0.6
  const K           = algalBiomass * 7.5

  const steps = Math.min(simulationDuration, 40)
  const series = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const h = Math.round(i * simulationDuration / steps)

    const co2     = co2Concentration * Math.exp(-captureRate * t * 4.5)
    const algae   = K / (1 + ((K - algalBiomass) / Math.max(algalBiomass, 0.01)) * Math.exp(-yeastBoost * t * 3))
    const eff     = captureRate * 96 * (1 - Math.exp(-t * 6))
    const energy  = parseFloat((h * (0.28 + algalBiomass * 0.018)).toFixed(2))

    series.push({
      hour:       h,
      co2:        Math.max(0, parseFloat(co2.toFixed(4))),
      captured:   Math.max(0, parseFloat((co2Concentration - co2).toFixed(4))),
      algae:      parseFloat(algae.toFixed(2)),
      yeast:      parseFloat((yeastBiomass * (1 + t * 0.48)).toFixed(2)),
      efficiency: parseFloat(eff.toFixed(1)),
      energy,
    })
  }

  const last       = series[series.length - 1]
  const capturePct = ((co2Concentration - last.co2) / co2Concentration) * 100

  return {
    series,
    kpi: {
      capturePct:     parseFloat(capturePct.toFixed(1)),
      totalCaptured:  parseFloat((co2Concentration - last.co2).toFixed(4)),
      peakEfficiency: parseFloat(Math.max(...series.map(d => d.efficiency)).toFixed(1)),
      finalAlgae:     last.algae,
      energyConsumed: last.energy,
      biomassGrowth:  parseFloat(((last.algae - algalBiomass) / Math.max(algalBiomass, 0.01) * 100).toFixed(1)),
      yeastFinal:     last.yeast,
    },
  }
}

// ── Custom chart tooltip ───────────────────────────────────────────────────
function DarkTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 28px rgba(0,0,0,0.9)',
    }}>
      <p style={{ margin: '0 0 6px', fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Hour {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ color: T.text, marginLeft: 8 }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ── KPI card ───────────────────────────────────────────────────────────────
function KpiCard({ label, value, unit, sub, color, Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 14, padding: '18px 20px',
        flex: 1, position: 'relative', overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {/* top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
        background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        opacity: 0.6,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {value}
            <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginLeft: 4 }}>{unit}</span>
          </p>
          {sub && <p style={{ margin: '6px 0 0', fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{sub}</p>}
        </div>
        {Icon && (
          <div style={{
            width: 36, height: 36, flexShrink: 0, marginLeft: 10,
            background: `${color}16`, border: `1px solid ${color}28`,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={16} color={color} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Chart wrapper card ─────────────────────────────────────────────────────
function ChartCard({ title, sub, children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.55 }}
      style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 14, padding: '16px 18px',
        ...style,
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.textBright, letterSpacing: '-0.01em' }}>{title}</p>
        {sub && <p style={{ margin: '3px 0 0', fontSize: 10, color: T.muted }}>{sub}</p>}
      </div>
      {children}
    </motion.div>
  )
}

// ── Inline SVG icons ───────────────────────────────────────────────────────
const ShieldIcon  = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>)
const BoltIcon    = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>)
const LeafIcon    = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M12 22V12"/><path d="M12 12c0-5-4.5-7.5-7.5-5.5"/><path d="M12 12c0-5 4.5-7.5 7.5-5.5"/></svg>)
const ZapIcon     = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>)
const CheckIcon   = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>)
const ArrowLeft   = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>)

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const location = useLocation()
  const navigate  = useNavigate()
  const inputs    = location.state?.values ?? DEFAULTS

  const { series, kpi } = useMemo(() => generateData(inputs), [inputs])

  // Donut data
  const donutData = [
    { name: 'Captured',  value: kpi.capturePct },
    { name: 'Remaining', value: parseFloat((100 - kpi.capturePct).toFixed(1)) },
  ]

  // Downsample efficiency bars (max 14)
  const effBars = series.filter((_, i) => i % Math.max(1, Math.floor(series.length / 14)) === 0)

  // Input param color map (matches SimulationPage)
  const paramColors = { algalBiomass: '#4ADE80', yeastBiomass: '#FBBF24', co2Concentration: '#60A5FA', simulationDuration: '#C084FC' }
  const paramLabels = { algalBiomass: 'Algal Biomass', yeastBiomass: 'Yeast Biomass', co2Concentration: 'CO₂ Input', simulationDuration: 'Duration' }
  const paramUnits  = { algalBiomass: 'g/L', yeastBiomass: 'g/L', co2Concentration: 'g/L', simulationDuration: 'hrs' }

  return (
    <div style={{
      height: '100vh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: T.bg,
      color: T.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
    }}>

      <Navbar />
      {/* spacer so fixed navbar doesn't overlap content */}
      <div style={{ height: 64, flexShrink: 0 }} />

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <div style={{
          width: 252, flexShrink: 0,
          background: T.sidebar,
          borderRight: `1px solid ${T.border}`,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Hero image with overlay */}
          <div style={{ position: 'relative', height: 210, flexShrink: 0, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&q=80"
              alt="Sustainable energy"
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.style.background = 'linear-gradient(160deg, #0D4A22 0%, #0A2E18 60%, #06090F 100%)'
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) brightness(0.45)' }}
            />
            {/* Colour overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, rgba(6,9,16,0.2) 0%, rgba(22,101,52,0.3) 45%, rgba(6,9,16,0.92) 100%)',
            }} />

            {/* Project badge */}
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(6,9,16,0.75)',
                border: `1px solid ${T.borderGlow}`,
                borderRadius: 999, padding: '3px 10px',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.accent, boxShadow: `0 0 5px ${T.accent}` }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: T.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Simulation Project
                </span>
              </div>
            </div>

            {/* Big CO₂ number */}
            <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
              <p style={{
                margin: 0,
                fontSize: 58, fontWeight: 900, lineHeight: 1,
                color: T.bright, letterSpacing: '-0.05em',
                textShadow: `0 0 40px ${T.glowBright}`,
              }}>
                {kpi.capturePct}
                <span style={{ fontSize: 22, fontWeight: 700 }}>%</span>
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                CO₂ Captured
              </p>
            </div>
          </div>

          {/* Sidebar body */}
          <div style={{ flex: 1, padding: '14px 14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Highlight box */}
            <div style={{ background: T.glowMed, border: `1px solid ${T.borderGlow}`, borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 9, color: T.muted, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Total CO₂ Fixed
              </p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: T.bright, letterSpacing: '-0.03em' }}>
                {kpi.totalCaptured}
                <span style={{ fontSize: 12, color: T.muted, marginLeft: 4, fontWeight: 600 }}>g/L</span>
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 10, color: T.muted }}>
                from {inputs.co2Concentration} g/L initial CO₂
              </p>
            </div>

            {/* Input recap */}
            <div>
              <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 700, color: T.muted, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Parameters Used
              </p>
              {Object.keys(DEFAULTS).map(key => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 0', borderBottom: `1px solid ${T.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: paramColors[key], flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>{paramLabels[key]}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>
                    {inputs[key]} <span style={{ fontSize: 9, color: T.muted }}>{paramUnits[key]}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Status block */}
            <div style={{
              marginTop: 'auto',
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: '11px 13px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30,
                background: T.glow, border: `1px solid ${T.borderGlow}`,
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CheckIcon size={14} color={T.accent} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.textBright }}>Run Complete</p>
                <p style={{ margin: 0, fontSize: 10, color: T.muted }}>{inputs.simulationDuration} hrs · all stable</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── Row 1: KPI cards ── */}
          <div style={{ display: 'flex', gap: 12 }}>
            <KpiCard
              label="CO₂ Capture Rate"
              value={kpi.capturePct}
              unit="%"
              sub={`${kpi.totalCaptured} g/L removed`}
              color={T.bright}
              Icon={ShieldIcon}
              delay={0.08}
            />
            <KpiCard
              label="Peak Efficiency"
              value={kpi.peakEfficiency}
              unit="%"
              sub="Maximum process efficiency"
              color={T.blue}
              Icon={BoltIcon}
              delay={0.15}
            />
            <KpiCard
              label="Biomass Growth"
              value={kpi.biomassGrowth}
              unit="%"
              sub={`Final algae: ${kpi.finalAlgae} g/L`}
              color={T.purple}
              Icon={LeafIcon}
              delay={0.22}
            />
            <KpiCard
              label="Energy Used"
              value={kpi.energyConsumed}
              unit="kWh"
              sub={`Over ${inputs.simulationDuration} hr run`}
              color={T.amber}
              Icon={ZapIcon}
              delay={0.29}
            />
          </div>

          {/* ── Row 2: CO₂ area chart + Donut ── */}
          <div style={{ display: 'flex', gap: 12 }}>

            {/* CO₂ area chart — large */}
            <ChartCard
              title="CO₂ Concentration & Capture Over Time"
              sub="g/L — real-time simulation output"
              delay={0.35}
              style={{ flex: '1 1 0', minWidth: 0 }}
            >
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={series} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="gCO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={T.blue}   stopOpacity={0.35} />
                      <stop offset="95%" stopColor={T.blue}   stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gCap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={T.accent} stopOpacity={0.45} />
                      <stop offset="95%" stopColor={T.accent} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={T.grid} />
                  <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                  <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={38} />
                  <Tooltip content={<DarkTip />} />
                  <Area type="monotone" dataKey="co2"      name="CO₂ Remaining" stroke={T.blue}   strokeWidth={2} fill="url(#gCO2)" dot={false} />
                  <Area type="monotone" dataKey="captured" name="CO₂ Captured"  stroke={T.accent} strokeWidth={2} fill="url(#gCap)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 18, marginTop: 10, justifyContent: 'center' }}>
                {[{ label: 'CO₂ Remaining', color: T.blue }, { label: 'CO₂ Captured', color: T.accent }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 3, background: l.color, borderRadius: 2 }} />
                    <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Donut + breakdown */}
            <ChartCard title="Capture Breakdown" sub="% of initial CO₂" delay={0.4} style={{ width: 200, flexShrink: 0 }}>
              {/* Donut */}
              <div style={{ position: 'relative', height: 164, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart width={164} height={164}>
                  <Pie
                    data={donutData}
                    cx={82} cy={82}
                    innerRadius={55} outerRadius={76}
                    startAngle={90} endAngle={-270}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill={T.accent} />
                    <Cell fill={T.border} />
                  </Pie>
                </PieChart>
                {/* Center label (absolute overlay) */}
                <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                  <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: T.bright, letterSpacing: '-0.04em', lineHeight: 1, textShadow: `0 0 20px ${T.glowBright}` }}>
                    {kpi.capturePct}%
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 9, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Captured
                  </p>
                </div>
              </div>

              {/* Legend rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                {[
                  { label: 'CO₂ Captured',  value: `${kpi.capturePct}%`,                      color: T.accent },
                  { label: 'CO₂ Remaining', value: `${(100-kpi.capturePct).toFixed(1)}%`,      color: T.muted  },
                  { label: 'Total Fixed',   value: `${kpi.totalCaptured} g/L`,                 color: T.bright },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: r.color }} />
                      <span style={{ fontSize: 10, color: T.muted }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* ── Row 3: Efficiency bars + Biomass lines ── */}
          <div style={{ display: 'flex', gap: 12 }}>

            {/* Efficiency bar chart */}
            <ChartCard
              title="Process Efficiency"
              sub="% per time segment — green intensity = maturity"
              delay={0.45}
              style={{ flex: 1, minWidth: 0 }}
            >
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={effBars} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                  <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} width={34} />
                  <Tooltip content={<DarkTip />} />
                  <Bar dataKey="efficiency" name="Efficiency %" radius={[4, 4, 0, 0]}>
                    {effBars.map((_, i) => {
                      const t   = effBars.length > 1 ? i / (effBars.length - 1) : 1
                      const idx = Math.min(Math.round(t * (T.bars.length - 1)), T.bars.length - 1)
                      return <Cell key={i} fill={T.bars[idx]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Biomass line chart */}
            <ChartCard
              title="Biomass Growth"
              sub="Algal & yeast concentration (g/L)"
              delay={0.5}
              style={{ flex: 1, minWidth: 0 }}
            >
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={series} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke={T.grid} />
                  <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                  <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={34} />
                  <Tooltip content={<DarkTip />} />
                  <Line type="monotone" dataKey="algae" name="Algae" stroke={T.bright} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="yeast" name="Yeast" stroke={T.amber}  strokeWidth={2}   dot={false} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>

              <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
                {[{ label: 'Algae', color: T.bright }, { label: 'Yeast', color: T.amber }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 2.5, background: l.color, borderRadius: 2 }} />
                    <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* ── Row 4: Energy + Summary grid ── */}
          <div style={{ display: 'flex', gap: 12 }}>

            {/* Energy area chart */}
            <ChartCard
              title="Energy Consumption"
              sub="kWh accumulated — total system draw"
              delay={0.55}
              style={{ flex: '2 1 0', minWidth: 0 }}
            >
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={series} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="gEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={T.amber} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={T.amber} stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={T.grid} />
                  <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                  <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={34} />
                  <Tooltip content={<DarkTip />} />
                  <Area type="monotone" dataKey="energy" name="Energy (kWh)" stroke={T.amber} strokeWidth={2} fill="url(#gEng)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Summary stat grid */}
            <div style={{ flex: '1 1 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 0 }}>
              {[
                { label: 'Total CO₂ Fixed', value: kpi.totalCaptured, unit: 'g/L',  color: T.bright  },
                { label: 'Peak Efficiency', value: kpi.peakEfficiency, unit: '%',    color: T.blue    },
                { label: 'Final Algae',     value: kpi.finalAlgae,     unit: 'g/L',  color: T.accent  },
                { label: 'Energy Used',     value: kpi.energyConsumed, unit: 'kWh',  color: T.amber   },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  style={{
                    background: T.cardAlt,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10, padding: '12px 13px',
                    display: 'flex', flexDirection: 'column', gap: 4,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 2.5,
                    background: s.color, borderRadius: '10px 0 0 10px',
                    opacity: 0.7,
                  }} />
                  <span style={{ fontSize: 9, color: T.muted, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    {s.value}
                    <span style={{ fontSize: 10, color: T.muted, marginLeft: 3, fontWeight: 600 }}>{s.unit}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>{/* end main */}
      </div>{/* end body */}
    </div>
  )
}
