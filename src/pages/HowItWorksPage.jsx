import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import { useTheme } from '../context/ThemeContext'
import { PageHero, Section, SectionLabel, Heading, Lead, Card, Pill, BulletList } from '../components/content/Shared'

// ── Process pipeline steps (from report §4.1, §4.2 upstream/downstream) ──────
const STEPS = [
  {
    n: '01', title: 'CO₂ Capture & Feeding', color: '#60A5FA',
    body: 'CO₂ from industrial flue gas is filtered for particulates and injected at 1–2 bar through an automated, sensor-driven control valve to keep dissolution optimal.',
    tags: ['Flue gas', '1–2 bar', 'Auto-dosing'],
  },
  {
    n: '02', title: 'Photochemical Bioreactor', color: '#4ADE80',
    body: 'In an airlift acrylic-glass reactor, Chlorella vulgaris fixes CO₂ under full-spectrum LED light (400–700 nm) — converting it into glucose and releasing O₂.',
    tags: ['Chlorella vulgaris', '25–30 °C', 'pH 6.5–7.5'],
  },
  {
    n: '03', title: 'Centrifugation & Filtration', color: '#22D3EE',
    body: 'A disc-stack centrifuge removes algal biomass; the clarified, glucose-rich stream (5–15 g/L) is heat-sterilized before fermentation.',
    tags: ['Biomass removal', '5–15 g/L glucose', 'Sterilized'],
  },
  {
    n: '04', title: 'Stirred-Tank Fermenter', color: '#F59E0B',
    body: 'Saccharomyces cerevisiae ferments glucose into bioethanol under anaerobic conditions, with Rushton-turbine agitation and a thermal jacket.',
    tags: ['S. cerevisiae', '30–35 °C', 'pH 4.5–5.5'],
  },
  {
    n: '05', title: 'Recovery & Recycle Loops', color: '#C084FC',
    body: 'Ethanol is distilled to 80–95% then membrane-dehydrated to ~99%. Fermentation CO₂ is scrubbed, compressed and re-injected; treated water returns to the reactor.',
    tags: ['~99% ethanol', 'CO₂ recycle', 'Water reuse'],
  },
]

const UNITS = [
  {
    title: 'Photochemical Bioreactor', color: '#4ADE80',
    sub: 'CO₂ → Glucose',
    items: ['Airlift acrylic-glass vessel, 5–5000 L', 'Full-spectrum LED, 100–300 µmol/m²·s', 'Water-jacket temperature control', 'CO₂ inlet / O₂ exhaust sensors'],
  },
  {
    title: 'Stirred-Tank Fermenter', color: '#F59E0B',
    sub: 'Glucose → Bioethanol',
    items: ['Stainless-steel tank, 70–80% working volume', 'Two Rushton turbines + 4 baffles', 'Anaerobic, CO₂-sparged', 'Glucose & ethanol sensors'],
  },
  {
    title: 'Wastewater Recycling', color: '#60A5FA',
    sub: 'Resource efficiency',
    items: ['Filtration of biomass & solids', 'Nitrogen & phosphorus recovery', 'UV sterilization', 'Treated water returned to reactor'],
  },
  {
    title: 'CO₂ Recycle System', color: '#C084FC',
    sub: 'Closed carbon loop',
    items: ['Condenser separates ethanol vapor', 'Gas scrubber removes VOCs', 'Compression & storage tank', 'Re-injection at 1–2 bar'],
  },
]

export default function HowItWorksPage() {
  const { theme } = useTheme()
  const navigate = useNavigate()

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />

      <PageHero
        badge="The Process"
        title="A Closed-Loop Path from"
        accentWord="CO₂ to Bioethanol"
        subtitle="The platform models a four-unit bioprocess that captures carbon dioxide with microalgae, ferments the resulting sugar into fuel with yeast, and recycles both water and CO₂ back into the system."
      />

      {/* Two core reactions */}
      <Section style={{ paddingTop: 10 }}>
        <SectionLabel>The Two Reactions</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          <Card accent="#4ADE80">
            <Pill color="#4ADE80">Phase 1 · Photosynthesis</Pill>
            <p style={{ margin: '16px 0 8px', fontSize: 19, fontWeight: 600, color: theme.text, fontFamily: theme.fontMono, letterSpacing: '-0.01em' }}>
              CO₂ + H₂O + Light → C₆H₁₂O₆ + O₂
            </p>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>
              Chlorella vulgaris uses light energy to fix carbon dioxide into glucose, releasing oxygen.
            </p>
          </Card>
          <Card accent="#F59E0B">
            <Pill color="#F59E0B">Phase 2 · Fermentation</Pill>
            <p style={{ margin: '16px 0 8px', fontSize: 19, fontWeight: 600, color: theme.text, fontFamily: theme.fontMono, letterSpacing: '-0.01em' }}>
              C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂
            </p>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>
              Saccharomyces cerevisiae converts the glucose into bioethanol — the released CO₂ is recaptured.
            </p>
          </Card>
        </div>
      </Section>

      {/* Process pipeline */}
      <Section>
        <SectionLabel>Process Pipeline</SectionLabel>
        <Heading>Five stages, one continuous loop</Heading>
        <Lead>Each stage feeds the next: the output of the algae phase becomes the substrate for fermentation, and the byproduct CO₂ feeds straight back to the start.</Lead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderLeft: `4px solid ${s.color}`,
                borderRadius: 14, padding: '22px 24px', boxShadow: theme.shadow,
              }}
            >
              <span style={{ fontFamily: theme.fontDisplay, fontSize: 34, fontWeight: 600, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, flexShrink: 0 }}>{s.n}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: theme.text }}>{s.title}</p>
                <p style={{ margin: '0 0 12px', fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>{s.body}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {s.tags.map(t => <Pill key={t} color={s.color}>{t}</Pill>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* The four units */}
      <Section>
        <SectionLabel>System Architecture</SectionLabel>
        <Heading>The four main units</Heading>
        <Lead>The system is built around two bioreactors and two recycling subsystems that keep the process sustainable and self-contained.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
          {UNITS.map(u => (
            <Card key={u.title} accent={u.color}>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: u.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{u.sub}</p>
              <p style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: theme.text }}>{u.title}</p>
              <BulletList items={u.items} />
            </Card>
          ))}
        </div>
      </Section>

      {/* Upstream / downstream */}
      <Section>
        <SectionLabel>Upstream & Downstream</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          <Card>
            <Heading>Upstream</Heading>
            <p style={{ margin: '-6px 0 16px', fontSize: 13, color: theme.textMuted }}>Preparation & cultivation</p>
            <BulletList items={[
              'CO₂ capture and filtration from flue gas',
              'UV-sterilized airlift bioreactor preparation',
              'Nitrogen & phosphorus nutrient dosing',
              'Adjustable LED light, 16:8 photoperiod',
              'Airlift mixing & gas exchange (0.5–1.5 vvm)',
            ]} />
          </Card>
          <Card>
            <Heading>Downstream</Heading>
            <p style={{ margin: '-6px 0 16px', fontSize: 13, color: theme.textMuted }}>Extraction & production</p>
            <BulletList items={[
              'Centrifugal glucose extraction (5–15 g/L)',
              'Anaerobic fermentation, 24–72 hours',
              'Distillation to 80–95% ethanol',
              'Membrane dehydration to ~99% purity',
              'Wastewater treatment & recirculation',
            ]} />
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section style={{ paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{
            background: theme.accentGlow, border: `1px solid ${theme.accent}`,
            borderRadius: 22, padding: '40px 32px', textAlign: 'center',
          }}
        >
          <Heading>See it in numbers</Heading>
          <Lead>Run the kinetic models on your own parameters and watch biomass, glucose, ethanol and CO₂ evolve in real time.</Lead>
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
