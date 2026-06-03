import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { loadInputs, saveInputs } from '../lib/inputStore'
import Navbar from '../components/Navbar'
import LoadingScreen from '../components/LoadingScreen'
import { useTheme } from '../context/ThemeContext'
import { runSimulation } from '../lib/simulation'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ── Standalone dark dashboard palette (matches the approved output design) ───
const T = {
  bg: '#070A10',
  card: '#0C1420',
  cardAlt: '#08101A',
  sidebar: '#060910',
  text: '#D0DFF0',
  textBright: '#EEF5FF',
  muted: '#3A566A',
  border: '#0E1E2C',
  borderGlow: '#183828',
  accent: '#22C55E',
  bright: '#4ADE80',
  glow: 'rgba(34,197,94,0.10)',
  glowMed: 'rgba(34,197,94,0.20)',
  glowBright: 'rgba(34,197,94,0.38)',
  amber: '#F59E0B',
  blue: '#60A5FA',
  purple: '#C084FC',
  grid: '#0B1820',
  bars: ['#0D4A22', '#166534', '#16A34A', '#22C55E', '#4ADE80'],
}

const DEFAULTS = {
  algalBiomass: 1,
  yeastBiomass: 0.5,
  co2Concentration: 0.3,
  simulationDuration: 7,
}

// ── Custom tooltip ───────────────────────────────────────────────────────────
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
          <span style={{ color: T.text, marginLeft: 8 }}>{p.value} g/L</span>
        </p>
      ))}
    </div>
  )
}

function KpiCard({ label, value, unit, sub, color, Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 14, padding: '18px 20px',
        flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
        background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        opacity: 0.6,
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.09em', textTransform: 'uppercase' }}>{label}</p>
          <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
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

function ChartCard({ title, sub, children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.55 }}
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 18px', ...style }}
    >
      <div style={{ marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.textBright, letterSpacing: '-0.01em' }}>{title}</p>
        {sub && <p style={{ margin: '3px 0 0', fontSize: 10, color: T.muted }}>{sub}</p>}
      </div>
      {children}
    </motion.div>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────
const ShieldIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>)
const FlaskIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6" /><path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.3h12.4A1.5 1.5 0 0 0 19.5 19L14 9V3" /><path d="M7 15h10" /></svg>)
const DropIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5C12 2.5 5 10 5 14a7 7 0 0 0 14 0c0-4-7-11.5-7-11.5z" /></svg>)
const BoltIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>)
const LeafIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M12 22V12" /><path d="M12 12c0-5-4.5-7.5-7.5-5.5" /><path d="M12 12c0-5 4.5-7.5 7.5-5.5" /></svg>)
const CheckIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>)
const ArrowLeft = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>)
const RefreshIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>)
const DownloadIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>)
const SpinnerIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"><path d="M12 2a10 10 0 0 1 10 10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" /></path></svg>)

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Resolve inputs: a fresh run (router state) wins, otherwise restore the last
  // saved run, otherwise fall back to defaults.
  const inputs = location.state?.values ?? loadInputs() ?? DEFAULTS

  // Persist whenever we arrive with a fresh run so a later return restores it.
  useEffect(() => {
    if (location.state?.values) saveInputs(location.state.values)
  }, [location.state])

  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef(null)

  const { series, kpi } = useMemo(() => runSimulation(inputs), [inputs])

  // ── Export the dashboard to a clean, paginated PDF ──────────────────────────
  async function handleDownloadPdf() {
    const node = reportRef.current
    if (!node || exporting) return
    setExporting(true)
    try {
      // Let the layout reflow into "flow mode" (no inner scroll) before capturing
      await new Promise(r => setTimeout(r, 350))

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: T.bg,
        width: node.scrollWidth,
        height: node.scrollHeight,
        // Exclude the action buttons and any image that can't be inlined (e.g. CORS hero)
        filter: (el) => {
          if (el.dataset && el.dataset.exportHide !== undefined) return false
          if (el.tagName === 'IMG' && !el.complete) return false
          return true
        },
      })

      const img = new Image()
      img.src = dataUrl
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej })

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 8
      const usableW = pageW - margin * 2

      // Scale image to page width, then slice it across pages
      const imgW = usableW
      const imgH = (img.height / img.width) * imgW
      const pageSliceH = pageH - margin * 2

      let heightLeft = imgH
      let position = margin
      pdf.addImage(dataUrl, 'PNG', margin, position, imgW, imgH)
      heightLeft -= pageSliceH

      while (heightLeft > 0) {
        pdf.addPage()
        position = margin - (imgH - heightLeft)
        pdf.addImage(dataUrl, 'PNG', margin, position, imgW, imgH)
        heightLeft -= pageSliceH
      }

      const stamp = new Date().toISOString().slice(0, 10)
      pdf.save(`carbon-capture-results-${stamp}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('Sorry — the PDF could not be generated. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const donutData = [
    { name: 'Converted', value: kpi.processEfficiency },
    { name: 'Loss', value: parseFloat((100 - kpi.processEfficiency).toFixed(1)) },
  ]

  // CO₂ balance bars (downsampled)
  const co2Bars = series.filter((_, i) => i % Math.max(1, Math.floor(series.length / 14)) === 0)

  const paramColors = { algalBiomass: '#4ADE80', yeastBiomass: '#FBBF24', co2Concentration: '#60A5FA', simulationDuration: '#C084FC' }
  const paramLabels = { algalBiomass: 'Algal Biomass', yeastBiomass: 'Yeast Biomass', co2Concentration: 'CO₂ Input', simulationDuration: 'Duration' }
  const paramUnits = { algalBiomass: 'g/L', yeastBiomass: 'g/L', co2Concentration: 'g/L', simulationDuration: 'hrs' }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen theme={theme} onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <div style={{
        height: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: T.bg, color: T.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      }}>
        <Navbar />
        <div style={{ height: 64, flexShrink: 0 }} />

        <div
          ref={reportRef}
          style={{
            flex: 1, display: 'flex',
            overflow: exporting ? 'visible' : 'hidden',
            background: T.bg,
          }}
        >

          {/* ── SIDEBAR ──────────────────────────────────────────────── */}
          <div style={{
            width: 252, flexShrink: 0,
            background: T.sidebar, borderRight: `1px solid ${T.border}`,
            display: 'flex', flexDirection: 'column',
            overflowY: exporting ? 'visible' : 'auto',
          }}>
            {/* Hero */}
            <div style={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&q=80"
                alt="Sustainable energy"
                onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(160deg, #0D4A22 0%, #0A2E18 60%, #06090F 100%)' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) brightness(0.45)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,9,16,0.2) 0%, rgba(22,101,52,0.3) 45%, rgba(6,9,16,0.92) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(6,9,16,0.75)', border: `1px solid ${T.borderGlow}`, borderRadius: 999, padding: '3px 10px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.accent, boxShadow: `0 0 5px ${T.accent}` }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: T.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CO₂ → Bioethanol</span>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                <p style={{ margin: 0, fontSize: 52, fontWeight: 900, lineHeight: 1, color: T.bright, letterSpacing: '-0.05em', textShadow: `0 0 40px ${T.glowBright}` }}>
                  {kpi.ethanolProduced}
                  <span style={{ fontSize: 18, fontWeight: 700 }}> g/L</span>
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bioethanol Produced</p>
              </div>
            </div>

            <div style={{ flex: 1, padding: '14px 14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Highlight */}
              <div style={{ background: T.glowMed, border: `1px solid ${T.borderGlow}`, borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 9, color: T.muted, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Total CO₂ Captured</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: T.bright, letterSpacing: '-0.03em' }}>
                  {kpi.co2Captured}<span style={{ fontSize: 12, color: T.muted, marginLeft: 4, fontWeight: 600 }}>g/L</span>
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 10, color: T.muted }}>net {kpi.co2Net} g/L after recycle</p>
              </div>

              {/* Inputs recap */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 700, color: T.muted, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Parameters Used</p>
                {Object.keys(DEFAULTS).map(key => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${T.border}` }}>
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

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={handleDownloadPdf}
                  disabled={exporting}
                  data-export-hide
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: T.accent, color: '#04140A', border: `1px solid ${T.bright}`, borderRadius: 10, padding: '11px', fontSize: 12, fontWeight: 800, cursor: exporting ? 'wait' : 'pointer', opacity: exporting ? 0.75 : 1, boxShadow: `0 6px 18px ${T.glowBright}` }}
                >
                  {exporting
                    ? <><SpinnerIcon size={14} color="#04140A" /> Generating PDF…</>
                    : <><DownloadIcon size={14} color="#04140A" /> Download PDF</>}
                </button>
                <button
                  onClick={() => { setLoading(true) }}
                  data-export-hide
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: T.glow, color: T.bright, border: `1px solid ${T.borderGlow}`, borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  <RefreshIcon size={13} color={T.bright} /> Re-run Simulation
                </button>
                <button
                  onClick={() => navigate('/simulation')}
                  data-export-hide
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'transparent', color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  <ArrowLeft size={13} color={T.muted} /> Back to Inputs
                </button>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, background: T.glow, border: `1px solid ${T.borderGlow}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckIcon size={14} color={T.accent} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.textBright }}>Run Complete</p>
                    <p style={{ margin: 0, fontSize: 10, color: T.muted }}>{inputs.simulationDuration} hrs · closed loop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: exporting ? 'visible' : 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* KPI row */}
            <div style={{ display: 'flex', gap: 12 }}>
              <KpiCard label="CO₂ Captured" value={kpi.co2Captured} unit="g/L" sub={`O₂ released: ${kpi.o2Released} g/L`} color={T.bright} Icon={ShieldIcon} delay={0.08} />
              <KpiCard label="Glucose Produced" value={kpi.glucoseProduced} unit="g/L" sub="Algal carbohydrate (substrate)" color={T.blue} Icon={DropIcon} delay={0.15} />
              <KpiCard label="Ethanol Produced" value={kpi.ethanolProduced} unit="g/L" sub={`Yield ${kpi.ethanolYield} g/g glucose`} color={T.amber} Icon={FlaskIcon} delay={0.22} />
              <KpiCard label="Process Efficiency" value={kpi.processEfficiency} unit="%" sub="η vs theoretical max (0.348)" color={T.purple} Icon={BoltIcon} delay={0.29} />
            </div>

            {/* Row 2: Biomass growth + efficiency donut */}
            <div style={{ display: 'flex', gap: 12 }}>
              <ChartCard title="Biomass Growth — Logistic Model" sub="Chlorella (algae) & S. cerevisiae (yeast), g/L" delay={0.35} style={{ flex: '1 1 0', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart data={series} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke={T.grid} />
                    <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                    <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={38} />
                    <Tooltip content={<DarkTip />} />
                    <Line type="monotone" dataKey="algae" name="Algae" stroke={T.bright} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="yeast" name="Yeast" stroke={T.amber} strokeWidth={2} dot={false} strokeDasharray="5 3" />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 18, marginTop: 10, justifyContent: 'center' }}>
                  {[{ label: 'Algae', color: T.bright }, { label: 'Yeast', color: T.amber }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 3, background: l.color, borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Conversion Efficiency" sub="ethanol vs CO₂ ceiling" delay={0.4} style={{ width: 200, flexShrink: 0 }}>
                <div style={{ position: 'relative', height: 164, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart width={164} height={164}>
                    <Pie data={donutData} cx={82} cy={82} innerRadius={55} outerRadius={76} startAngle={90} endAngle={-270} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      <Cell fill={T.accent} />
                      <Cell fill={T.border} />
                    </Pie>
                  </PieChart>
                  <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: T.bright, letterSpacing: '-0.04em', lineHeight: 1, textShadow: `0 0 20px ${T.glowBright}` }}>{kpi.processEfficiency}%</p>
                    <p style={{ margin: '4px 0 0', fontSize: 9, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Efficiency</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {[
                    { label: 'Process η', value: `${kpi.processEfficiency}%`, color: T.accent },
                    { label: 'CO₂ utilization', value: `${kpi.co2Utilization}%`, color: T.blue },
                    { label: 'Biomass growth', value: `${kpi.biomassGrowth}%`, color: T.bright },
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

            {/* Row 3: Glucose & Ethanol + CO2 balance */}
            <div style={{ display: 'flex', gap: 12 }}>
              <ChartCard title="Glucose & Ethanol — Luedeking-Piret" sub="product formation over time (g/L)" delay={0.45} style={{ flex: 1, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={series} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="gGlu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={T.blue} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={T.blue} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gEth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={T.amber} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={T.amber} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke={T.grid} />
                    <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                    <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={38} />
                    <Tooltip content={<DarkTip />} />
                    <Area type="monotone" dataKey="glucose" name="Glucose" stroke={T.blue} strokeWidth={2} fill="url(#gGlu)" dot={false} />
                    <Area type="monotone" dataKey="ethanol" name="Ethanol" stroke={T.amber} strokeWidth={2} fill="url(#gEth)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 18, marginTop: 10, justifyContent: 'center' }}>
                  {[{ label: 'Glucose', color: T.blue }, { label: 'Ethanol', color: T.amber }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 3, background: l.color, borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="CO₂ Balance" sub="captured by algae vs evolved by fermentation" delay={0.5} style={{ flex: 1, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={co2Bars} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false} />
                    <XAxis dataKey="hour" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: T.border }} />
                    <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={34} />
                    <Tooltip content={<DarkTip />} />
                    <Bar dataKey="co2Captured" name="Captured" fill={T.accent} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="co2Evolved" name="Evolved" fill={T.purple} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 18, marginTop: 10, justifyContent: 'center' }}>
                  {[{ label: 'Captured', color: T.accent }, { label: 'Evolved', color: T.purple }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 12, height: 12, background: l.color, borderRadius: 3 }} />
                      <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Row 4: summary stat grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
              {[
                { label: 'Final Algae', value: kpi.finalAlgae, unit: 'g/L', color: T.bright },
                { label: 'Final Yeast', value: kpi.finalYeast, unit: 'g/L', color: T.amber },
                { label: 'Glucose', value: kpi.glucoseProduced, unit: 'g/L', color: T.blue },
                { label: 'Ethanol', value: kpi.ethanolProduced, unit: 'g/L', color: T.amber },
                { label: 'CO₂ Net', value: kpi.co2Net, unit: 'g/L', color: T.accent },
                { label: 'O₂ Released', value: kpi.o2Released, unit: 'g/L', color: T.blue },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2.5, background: s.color, borderRadius: '10px 0 0 10px', opacity: 0.7 }} />
                  <span style={{ fontSize: 9, color: T.muted, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{s.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    {s.value}<span style={{ fontSize: 10, color: T.muted, marginLeft: 3, fontWeight: 600 }}>{s.unit}</span>
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
