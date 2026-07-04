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
    model: '/models/Fermentor.glb',
    label: 'Unit 01 · Bioreactor',
    title: 'Photochemical Bioreactor',
    accent: '#4ADE80',
    description:
      'The airlift acrylic-glass vessel where Chlorella vulgaris fixes captured CO₂ into glucose under full-spectrum LED light. Drag to orbit the reactor, or let it turn on its own.',
    tags: ['CO₂ → Glucose', 'Airlift mixing', 'Full-spectrum LED'],
    side: 'right',
  },
  {
    model: '/models/Middlepart.glb',
    label: 'Unit 02 · Separation',
    title: 'Centrifuge & Transfer Module',
    accent: '#22D3EE',
    description:
      'A disc-stack centrifuge clarifies the algal broth and hands a glucose-rich, biomass-free stream to the fermenter. It ties the upstream and downstream halves of the loop together.',
    tags: ['Biomass removal', '5–15 g/L glucose', 'Heat-sterilized'],
    side: 'left',
  },
  {
    model: '/models/3rd_part.glb',
    label: 'Unit 03 · Recovery',
    title: 'Fermenter & Distillation Column',
    accent: '#F59E0B',
    description:
      'Saccharomyces cerevisiae ferments the sugar into bioethanol, which is distilled and membrane-dehydrated to ~99% purity. The released CO₂ is scrubbed and re-injected upstream.',
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
      {/* Soft accent glow so the transparent model has presence */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: '10% 8%',
          background: `radial-gradient(ellipse at center, ${data.accent}26 0%, transparent 68%)`,
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
            style={{ background: theme.accent, color: theme.accentText, border: 'none', borderRadius: 10, padding: '14px 30px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            Launch the Simulator
          </motion.button>
        </motion.div>
      </Section>

      <Footer />
    </div>
  )
}
