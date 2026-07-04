import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import { useTheme } from '../context/ThemeContext'
import { PageHero, Section, SectionLabel } from '../components/content/Shared'

// The people behind the project. Add more members here and they'll flow into
// the responsive grid automatically: { name, role, email }.
const TEAM = [
  {
    name: 'Ammar Ahmed',
    role: 'Project Lead & Developer',
    email: 'ammarisahmed@gmail.com',
  },
]

function MailIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

function CopyIcon({ size = 15, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// A tidy typographic CIU badge — no external image, tracks the theme.
function CiuWordmark() {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{
        width: 64, height: 64, flexShrink: 0,
        borderRadius: 16,
        background: `linear-gradient(150deg, ${theme.accent}, ${theme.accentHover})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 28px ${theme.accentGlow}`,
        color: theme.accentText,
        fontWeight: 900, fontSize: 22, letterSpacing: '0.02em',
      }}>
        CIU
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Cyprus International University
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
          Lefkoşa, North Cyprus
        </p>
      </div>
    </div>
  )
}

function PersonCard({ person }) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const initials = person.name.split(' ').map(n => n[0]).slice(0, 2).join('')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard unavailable — the mailto link still works */ }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      style={{
        background: theme.bgCard, border: `1px solid ${theme.border}`,
        borderRadius: 18, padding: 26, boxShadow: theme.shadow,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0, borderRadius: '50%',
          background: theme.accentGlow, border: `1.5px solid ${theme.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.accent, fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em',
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: theme.text, letterSpacing: '-0.02em' }}>
            {person.name}
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: theme.textMuted }}>
            {person.role}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        borderTop: `1px solid ${theme.border}`, paddingTop: 16,
      }}>
        <motion.a
          href={`mailto:${person.email}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: theme.accent, color: theme.accentText,
            textDecoration: 'none', borderRadius: 10, padding: '10px 16px',
            fontSize: 14, fontWeight: 700,
          }}
        >
          <MailIcon size={16} color={theme.accentText} />
          <span style={{ wordBreak: 'break-all' }}>{person.email}</span>
        </motion.a>
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Copy ${person.name}'s email`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'transparent', color: copied ? theme.accent : theme.textMuted,
            border: `1px solid ${copied ? theme.accent : theme.border}`,
            borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          <CopyIcon size={15} color={copied ? theme.accent : theme.textMuted} />
          {copied ? 'Copied' : 'Copy'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function ContactPage() {
  const { theme } = useTheme()

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />

      <PageHero
        badge="Get in touch"
        title="Questions? Reach the"
        accentWord="team behind CarbonCap"
        subtitle="Whether it's feedback on the simulator, a research question, or a collaboration idea — we'd love to hear from you."
      />

      <Section style={{ paddingTop: 10 }}>
        <SectionLabel>The Team</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}>
          {TEAM.map(p => <PersonCard key={p.email} person={p} />)}
        </div>
      </Section>

      <Section style={{ paddingTop: 10, paddingBottom: 90 }}>
        <SectionLabel>Affiliation</SectionLabel>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 20, padding: '28px 28px', boxShadow: theme.shadow,
          }}
        >
          <CiuWordmark />
          <p style={{ margin: '20px 0 0', fontSize: 15, color: theme.textMuted, lineHeight: 1.7, maxWidth: 640 }}>
            CarbonCap was developed as a student project at Cyprus International University,
            exploring how captured CO₂ can be converted into bioethanol through algae and
            yeast — modelled end to end in an interactive simulator.
          </p>
        </motion.div>
      </Section>

      <Footer />
    </div>
  )
}
