import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import { useTheme } from '../context/ThemeContext'
import { PageHero, Section, SectionLabel, Heading, Lead, Card, Pill, BulletList } from '../components/content/Shared'

const TEAM = [
  { name: 'Alaa Hamid', id: '22115559', dept: 'Bioengineering' },
  { name: 'Nasma Akasha', id: '22119557', dept: 'Bioengineering' },
  { name: 'Plamedie Kapenda Mukumbi', id: '22101673', dept: 'Bioengineering' },
  { name: 'Ammar Mirghani', id: '22109046', dept: 'Software Engineering' },
  { name: 'Tamir Omer', id: '22205399', dept: 'Computer Engineering' },
]

const STACK = [
  { group: 'Frontend', items: ['React 19', 'React Router', 'Vite', 'Framer Motion'] },
  { group: '3D & Charts', items: ['Three.js', 'react-three-fiber', 'drei', 'Recharts'] },
  { group: 'Desktop', items: ['Electron', 'Node.js IPC'] },
  { group: 'Modeling', items: ['MATLAB (validation)', 'Python (compute)', 'PyInstaller'] },
]

const CONSTRAINTS = [
  'Models assume ideal conditions — no mutation, contamination or stress responses.',
  'Inputs are bounded to validated, biologically safe ranges.',
  'Kinetic coefficients are literature-derived and deterministic.',
  'No live sensor / external data integration (offline simulation).',
  'No stochastic or Monte-Carlo uncertainty modeling by default.',
]

function avatarColor(i) {
  return ['#4ADE80', '#60A5FA', '#F59E0B', '#C084FC', '#22D3EE'][i % 5]
}

export default function AboutPage() {
  const { theme } = useTheme()

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />

      <PageHero
        badge="About the Project"
        title="A Capstone in Carbon Capture"
        accentWord="Modeling"
        subtitle="Built by an interdisciplinary team at Cyprus International University, this platform unites bioprocess engineering with modern software to simulate a full CO₂-to-bioethanol system."
      />

      {/* Abstract */}
      <Section style={{ paddingTop: 10 }}>
        <SectionLabel>Abstract</SectionLabel>
        <Card hover={false} accent={theme.accent}>
          <p style={{ margin: 0, fontSize: 16, color: theme.textMuted, lineHeight: 1.8 }}>
            This platform models and simulates carbon-capture systems with a focus on integrated process
            analysis from upstream operations to biofuel production. It supports the evaluation of CO₂ mitigation
            through modeling, process simulation, and system optimization — visually outlining the entire system
            with interactive 3D models and real-time visualizations. By combining technical rigor with
            user-friendly visualization, it serves as a powerful tool for designing, optimizing, and deploying
            sustainable carbon-capture and biofuel-production systems.
          </p>
        </Card>
      </Section>

      {/* Aim / importance */}
      <Section>
        <SectionLabel>Purpose</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <Card>
            <Heading>The aim</Heading>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.7 }}>
              Develop and simulate a model that captures, generates, stores and monitors CO₂ — identifying the
              parameter sets most effective at reducing emissions while producing bioethanol, and evaluating the
              viability and sustainability of the process.
            </p>
          </Card>
          <Card>
            <Heading>Why it matters</Heading>
            <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.7 }}>
              It demonstrates the dual goal of emissions reduction and renewable-energy production — turning
              captured CO₂ from waste into a resource — while giving students and researchers a safe, inexpensive
              way to explore complex bioprocesses.
            </p>
          </Card>
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionLabel>The Team</SectionLabel>
        <Heading>Five disciplines, one platform</Heading>
        <Lead>A collaboration across Bioengineering, Software Engineering and Computer Engineering, supervised by Asst. Prof. Dr. Nihal Bayır.</Lead>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {TEAM.map((m, i) => (
            <Card key={m.id} style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: avatarColor(i) + '22', border: `1.5px solid ${avatarColor(i)}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 800, color: avatarColor(i),
                }}>
                  {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: theme.text, lineHeight: 1.25 }}>{m.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: theme.textMuted }}>{m.id}</p>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <Pill color={avatarColor(i)}>{m.dept}</Pill>
              </div>
            </Card>
          ))}
          <Card style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Supervisor</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: theme.text }}>Asst. Prof. Dr. Nihal Bayır</p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: theme.textMuted }}>Cyprus International University · June 2025</p>
          </Card>
        </div>
      </Section>

      {/* Tech stack */}
      <Section>
        <SectionLabel>Technology</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {STACK.map(s => (
            <Card key={s.group} style={{ padding: '22px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: theme.accent, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.group}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {s.items.map(it => (
                  <span key={it} style={{
                    fontSize: 12, fontWeight: 600, color: theme.textMuted,
                    background: theme.bgSecondary, border: `1px solid ${theme.border}`,
                    borderRadius: 8, padding: '5px 10px',
                  }}>{it}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Constraints */}
      <Section style={{ paddingBottom: 80 }}>
        <SectionLabel>Scope & Limitations</SectionLabel>
        <Card hover={false}>
          <Lead>The platform is a deterministic, educational simulation tool — a firm foundation for industrial-scale modeling, not a substitute for it.</Lead>
          <BulletList items={CONSTRAINTS} />
        </Card>
      </Section>

      <Footer />
    </div>
  )
}
