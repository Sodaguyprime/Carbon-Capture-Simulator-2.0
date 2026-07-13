import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import ModelViewer from '../components/models/ModelViewer'
import { useTheme } from '../context/ThemeContext'
import { PageHero, Section, SectionLabel, Heading, Lead, Pill } from '../components/content/Shared'

// The three hardware units of the bioprocess, in flow order. Each maps to a
// .glb preloaded by ModelScene. Sides alternate: right, left, right.
const MODELS = [
  {
    model: '/models/PhotoBioreactor_new.glb',
    label: 'Unit 01 · Capture',
    title: 'Photochemical Bioreactor',
    accent: '#4ADE80',
    description:
      'The acrylic-glass vessel where Chlorella vulgaris fixes captured CO₂ into glucose under full-spectrum LED light — the carbon-capture heart of the loop. Drag to orbit, or let it turn on its own.',
    tags: ['CO₂ → Glucose', 'Chlorella vulgaris', 'Full-spectrum LED'],
    side: 'right',
  },
  {
    model: '/models/Airlift_new.glb',
    label: 'Unit 02 · Circulation',
    title: 'Airlift Circulation Column',
    accent: '#22D3EE',
    description:
      'A gas-lift column that keeps the culture suspended and drives CO₂ dissolution without mechanical shear — sparged air rises and circulates the broth between the reactor and downstream stages.',
    tags: ['Gas-lift mixing', '0.5–1.5 vvm', 'Low-shear'],
    side: 'left',
  },
  {
    model: '/models/Stir%20Tank%20Fermentor_new.glb',
    label: 'Unit 03 · Recovery',
    title: 'Stirred-Tank Fermenter',
    accent: '#F59E0B',
    description:
      'Saccharomyces cerevisiae ferments the glucose into bioethanol under Rushton-turbine agitation; the product is distilled and membrane-dehydrated to ~99%, and the released CO₂ is scrubbed and re-injected upstream.',
    tags: ['Glucose → Ethanol', '~99% purity', 'CO₂ recycle'],
    side: 'right',
  },
]

function ModelShowcase({ data }) {
  const isRight = data.side === 'right'

  const Text = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <SectionLabel>{data.label}</SectionLabel>
      <Heading>{data.title}</Heading>
      <Lead>{data.description}</Lead>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {data.tags.map(t => <Pill key={t} color={data.accent}>{t}</Pill>)}
      </div>
    </motion.div>
  )

  const Visual = (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="cc-model-stage"
    >
      <span className="cc-stage-tag">{data.label}</span>
      {/* Soft accent glow so the transparent model has presence */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: '10% 8%',
          background: `radial-gradient(ellipse at center, ${data.accent}2E 0%, transparent 68%)`,
          filter: 'blur(6px)', pointerEvents: 'none',
        }}
      />
      <ModelViewer modelPath={data.model} />
    </motion.div>
  )

  return (
    <div className={`cc-model-row${isRight ? '' : ' cc-reverse'}`}>
      {isRight ? <>{Text}{Visual}</> : <>{Visual}{Text}</>}
    </div>
  )
}

export default function ModelsPage() {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const css = `
    .cc-models-body{ max-width:1080px; margin:0 auto; padding:20px 24px 40px; }
    .cc-model-row{
      display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center;
      padding:36px 0;
    }
    .cc-model-stage{
      position:relative; width:100%; height:460px;
      border-radius:24px; overflow:hidden;
      border:1px solid ${theme.border};
      background:
        linear-gradient(${theme.gridLine} 1px, transparent 1px) 0 0/28px 28px,
        linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px) 0 0/28px 28px,
        ${theme.bgCard};
      box-shadow:${theme.shadow};
    }
    .cc-stage-tag{
      position:absolute; z-index:3; left:16px; top:14px;
      font-family:${theme.fontMono}; font-size:10px; letter-spacing:0.14em; text-transform:uppercase;
      color:${theme.textMuted}; pointer-events:none;
    }
    /* On narrow screens the visual always sits above its text, regardless of side */
    @media (max-width:840px){
      .cc-model-row, .cc-model-row.cc-reverse{
        grid-template-columns:1fr; gap:20px; padding:24px 0;
      }
      .cc-model-row > *:nth-child(1){ order:2; }
      .cc-model-row.cc-reverse > *:nth-child(1){ order:1; }
      .cc-model-stage{ height:340px; order:1 !important; }
      .cc-model-row.cc-reverse .cc-model-stage{ order:1 !important; }
    }
  `

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />

      <PageHero
        badge="3D Models"
        title="Explore the reactor"
        accentWord="in three dimensions"
        subtitle="Every unit of the carbon-capture system, rendered as an interactive 3D model. Orbit, zoom, and inspect the hardware that turns CO₂ into bioethanol — each one auto-rotates so you can see it from every angle."
      />

      <style>{css}</style>

      <div className="cc-models-body">
        {MODELS.map(m => (
          <ModelShowcase key={m.title} data={m} />
        ))}
      </div>

      {/* CTA */}
      <Section style={{ paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{
            background: theme.accentGlow, border: `1px solid ${theme.accent}`,
            borderRadius: 22, padding: '40px 32px', textAlign: 'center',
          }}
        >
          <Heading>From hardware to numbers</Heading>
          <Lead>You've seen the units — now run them. Feed the kinetic models your own parameters and watch biomass, glucose, ethanol and CO₂ evolve in real time.</Lead>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 0 32px ${theme.accentGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/simulation')}
            style={{ background: theme.accent, color: theme.accentText, border: 'none', borderRadius: 12, padding: '15px 30px', fontFamily: theme.fontMono, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Launch the Simulator
          </motion.button>
        </motion.div>
      </Section>

      <Footer />
    </div>
  )
}
