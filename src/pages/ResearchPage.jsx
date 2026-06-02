import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import { useTheme } from '../context/ThemeContext'
import { PageHero, Section, SectionLabel, Heading, Lead, Card, Pill, Equation, BulletList } from '../components/content/Shared'
import { KINETIC_PARAMS } from '../lib/simulation'

const ENV_PARAMS = [
  { p: 'Temperature', algae: '25–30 °C', yeast: '30–35 °C' },
  { p: 'pH', algae: '6.5–7.5', yeast: '4.5–5.5' },
  { p: 'Light intensity', algae: '100–300 µmol/m²·s', yeast: '— (anaerobic)' },
  { p: 'Carrying capacity (Xmax)', algae: '5–20 g/L', yeast: '10–50 g/L' },
  { p: 'Max growth rate (µmax)', algae: '0.1–0.3 /h', yeast: '0.05–0.5 /h' },
]

export default function ResearchPage() {
  const { theme } = useTheme()

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />

      <PageHero
        badge="Research & Data"
        title="The Science Behind the"
        accentWord="Simulation"
        subtitle="Every output is grounded in established bioprocess kinetics — Monod substrate limitation, logistic growth, and the Luedeking-Piret product-formation model — applied to Chlorella vulgaris and Saccharomyces cerevisiae."
      />

      {/* Organism selection */}
      <Section style={{ paddingTop: 10 }}>
        <SectionLabel>Organism Selection</SectionLabel>
        <Heading>Why Chlorella vulgaris?</Heading>
        <Lead>Microalgae sit at the forefront of carbon-capture research thanks to fast growth and efficient photosynthesis. Chlorella vulgaris is a well-studied strain prized for its high CO₂ fixation rate and biofuel potential.</Lead>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {[
            { t: 'High CO₂ fixation', v: '1.5–2.5', u: 'g CO₂ / g biomass·day', c: '#4ADE80' },
            { t: 'Lipid content', v: '20–60', u: '% of dry weight', c: '#60A5FA' },
            { t: 'Bioethanol yield', v: '0.1–0.15', u: 'L / kg biomass', c: '#F59E0B' },
            { t: 'Biodiesel conversion', v: '90–95', u: '% efficiency', c: '#C084FC' },
          ].map(s => (
            <Card key={s.t} accent={s.c} hover={false} style={{ padding: '22px' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.t}</p>
              <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: s.c, letterSpacing: '-0.03em' }}>{s.v}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: theme.textMuted }}>{s.u}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Metabolic pathways */}
      <Section>
        <SectionLabel>Metabolic Pathways</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <Card>
            <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: theme.text }}>Photosynthesis</p>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>Light energy fixes CO₂ and water into glucose and oxygen — the carbon-capture step.</p>
          </Card>
          <Card>
            <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: theme.text }}>Carbon-concentrating mechanisms</p>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>Specialized mechanisms concentrate CO₂ around RuBisCO in the Calvin cycle, boosting fixation in low-CO₂ conditions.</p>
          </Card>
          <Card>
            <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: theme.text }}>Lipid & carbohydrate biosynthesis</p>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>Stored carbohydrates feed fermentation; triacylglycerols can be transesterified into biodiesel.</p>
          </Card>
        </div>
      </Section>

      {/* Growth kinetic models — equations */}
      <Section>
        <SectionLabel>Growth Kinetic Models</SectionLabel>
        <Heading>The equations driving the simulator</Heading>
        <Lead>These are the exact mathematical models the engine integrates over the simulation duration. They appear in the project report (Chapter 4.3) and the appendix.</Lead>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          <Equation
            caption="Monod Model — substrate-limited growth"
            formula="µ = µmax · S / (Kₛ + S)"
            where="S = limiting substrate (CO₂ or glucose); Kₛ = half-saturation constant; µmax = maximum specific growth rate."
          />
          <Equation
            caption="Logistic Model — carrying capacity"
            formula="dX/dt = µmax · X · (1 − X / Xmax)"
            where="X(t) = Xmax / (1 + ((Xmax − X₀)/X₀)·e^(−µmax·t)). Used for both algal and yeast biomass."
          />
          <Equation
            caption="Luedeking-Piret — product formation"
            formula="dP/dt = α · dX/dt + β · X"
            where="α = growth-associated coefficient (0.1–0.5 g/g); β = non-growth-associated (0.01–0.1 g/g·h). Models glucose and ethanol."
          />
          <Equation
            caption="CO₂ Capture / Consumption"
            formula="dCO₂/dt = (Y꜀ₒ₂/ₓ) · dX/dt"
            where="Y꜀ₒ₂/ₓ = CO₂ consumed per unit biomass produced (≈ 1.83 g/g)."
          />
          <Equation
            caption="Yield Coefficients"
            formula="Y_b = biomass / glucose   ·   Y_e = ethanol / glucose"
            where="Biomass and ethanol produced per gram of glucose consumed."
          />
          <Equation
            caption="Overall Process Efficiency"
            formula="η = (mass EtOH / mass CO₂) ÷ 0.348 × 100%"
            where="Benchmarked against the theoretical maximum of 0.348 g ethanol per g CO₂."
          />
        </div>
      </Section>

      {/* Liebig + integration */}
      <Section>
        <SectionLabel>Multi-factor Limitation</SectionLabel>
        <Card hover={false} accent={theme.accent}>
          <Heading>Liebig's law of the minimum</Heading>
          <p style={{ margin: '-6px 0 16px', fontSize: 15, color: theme.textMuted, lineHeight: 1.7, maxWidth: 760 }}>
            Growth is limited by whichever factor is in shortest supply. The algal growth rate combines correction factors for every environmental condition:
          </p>
          <Equation
            formula="µ = µmax · f(I) · f(T) · f(pH) · f(N) · f(P) · f(CO₂)"
            where="f(I) = light (Lambert-Beer), f(T) = temperature (Arrhenius / Gaussian), f(pH) = sigmoidal response, plus Monod terms for nitrogen, phosphorus and CO₂."
          />
          <p style={{ margin: '8px 0 0', fontSize: 14, color: theme.textMuted, lineHeight: 1.7 }}>
            The two phases are coupled: the carbohydrate (Pa) produced by Chlorella becomes the substrate (S) for Saccharomyces fermentation, closing the loop from carbon to fuel.
          </p>
        </Card>
      </Section>

      {/* Environmental parameter table */}
      <Section>
        <SectionLabel>Operating Parameters</SectionLabel>
        <Card hover={false} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr' }}>
            {['Parameter', 'Chlorella (algae)', 'S. cerevisiae (yeast)'].map((h, i) => (
              <div key={h} style={{
                padding: '14px 20px', background: theme.bgSecondary,
                borderBottom: `1px solid ${theme.border}`,
                fontSize: 12, fontWeight: 800, color: theme.text,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                textAlign: i === 0 ? 'left' : 'center',
              }}>{h}</div>
            ))}
            {ENV_PARAMS.map((row, ri) => (
              [row.p, row.algae, row.yeast].map((cell, ci) => (
                <div key={row.p + ci} style={{
                  padding: '14px 20px',
                  borderBottom: ri < ENV_PARAMS.length - 1 ? `1px solid ${theme.border}` : 'none',
                  fontSize: 14, color: ci === 0 ? theme.text : theme.textMuted,
                  fontWeight: ci === 0 ? 600 : 500,
                  textAlign: ci === 0 ? 'left' : 'center',
                }}>{cell}</div>
              ))
            ))}
          </div>
        </Card>
        <p style={{ margin: '14px 2px 0', fontSize: 12, color: theme.textMuted }}>
          Engine defaults: µmax(algae) = {KINETIC_PARAMS.muMaxAlgae}/h · µmax(yeast) = {KINETIC_PARAMS.muMaxYeast}/h · Kₛ(CO₂) = {KINETIC_PARAMS.ksCO2} g/L · theoretical max = {KINETIC_PARAMS.theoreticalMax} g/g.
        </p>
      </Section>

      {/* References */}
      <Section style={{ paddingBottom: 80 }}>
        <SectionLabel>Key References</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Monod, J. (1949). The growth of bacterial cultures. Annual Review of Microbiology, 3(1), 371–394.',
            'Tsoularis, A. & Wallace, J. (2002). Analysis of logistic growth models. Mathematical Biosciences, 179(1), 21–55.',
            'Luedeking, R. & Piret, E. L. (1959). A kinetic study of the lactic acid fermentation. J. Biochem. Microbiol. Technol. Eng., 1(4), 393–412.',
            'Brennan, L. & Owende, P. (2010). Biofuels from microalgae — a review. Renewable and Sustainable Energy Reviews, 14(2), 557–577.',
            'Razzak, S.A. et al. (2013). Integrated CO₂ capture, wastewater treatment and biofuel production by microalgae. RSER, 27, 622–653.',
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <Pill>{i + 1}</Pill>
              <span style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{r}</span>
            </div>
          ))}
        </div>
      </Section>

      <Footer />
    </div>
  )
}
