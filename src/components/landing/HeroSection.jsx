import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

// Assets served from /public
const HERO_IMG = '/ChatGPT Image Jun 13, 2026, 07_25_11 AM.png'
const LOGO_IMG = '/Icons/Logo.png'
const ALGAE_IMG = '/Icons/Algae.png'
const FERMENTOR_IMG = '/Icons/Fermentor.png'

function Arrow({ size = 16, w = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth={w}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ease = [0.22, 1, 0.36, 1]

export default function HeroSection() {
  const { theme, mode } = useTheme()
  const navigate = useNavigate()

  // Theme-aware scoped CSS. Layout, the rotating seam badge, duotone image
  // treatment, media queries and reduced-motion can't be expressed inline.
  const css = `
    .hero{
      --ink:${theme.text}; --muted:${theme.textMuted};
      --card:${theme.bgCard}; --line:${theme.border};
      --accent:${theme.accent}; --accent2:${theme.accent2};
      --glow:${theme.accentGlow}; --mono:${theme.fontMono}; --disp:${theme.fontDisplay};
      position:relative; overflow:hidden; width:100%; min-height:100vh;
      display:flex; align-items:center; padding:120px 32px 72px; background:${theme.bg};
    }
    /* low-key full-bleed background image, duotone + heavy scrim */
    .hero-bg{
      position:absolute; inset:0; pointer-events:none;
      background:#0d1512 url("${HERO_IMG}") center 30%/cover no-repeat;
      opacity:${mode === 'dark' ? 0.16 : 0.1}; filter:grayscale(0.3) saturate(1.2);
      mask-image:linear-gradient(90deg, #000 0%, transparent 78%);
      -webkit-mask-image:linear-gradient(90deg, #000 0%, transparent 78%);
    }
    .hero-grid{
      position:absolute; inset:0; pointer-events:none;
      background-image:linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px);
      background-size:34px 34px;
      mask-image:radial-gradient(ellipse 90% 80% at 30% 40%, #000 20%, transparent 80%);
      -webkit-mask-image:radial-gradient(ellipse 90% 80% at 30% 40%, #000 20%, transparent 80%);
    }
    .hero-bloom{
      position:absolute; top:-10%; right:-6%; width:760px; height:620px; pointer-events:none;
      background:radial-gradient(ellipse at center, var(--glow) 0%, transparent 66%); filter:blur(6px);
    }

    .hero-inner{
      position:relative; z-index:2; width:100%; max-width:1200px; margin:0 auto;
      display:grid; grid-template-columns:1.15fr 0.85fr; gap:56px; align-items:center;
    }

    .hero-eyebrow{
      display:inline-flex; align-items:center; gap:10px; margin-bottom:26px;
      font-family:var(--mono); font-size:12px; font-weight:500; letter-spacing:0.18em;
      text-transform:uppercase; color:var(--muted);
    }
    .hero-eyebrow .dot{ width:7px; height:7px; border-radius:50%; background:var(--accent);
      box-shadow:0 0 12px var(--accent); }
    .hero-eyebrow .rule{ width:38px; height:1px; background:var(--line); }

    .hero-h1{
      font-family:var(--disp); font-optical-sizing:auto;
      font-weight:500; font-size:clamp(44px, 6.2vw, 82px); line-height:0.98;
      letter-spacing:-0.025em; color:var(--ink); margin:0;
    }
    .hero-h1 em{ font-style:italic; font-weight:500; color:var(--accent); }
    .hero-sub{
      font-size:clamp(15px,1.5vw,18px); line-height:1.7; color:var(--muted);
      max-width:440px; margin:26px 0 0;
    }

    .hero-cta{ display:flex; flex-wrap:wrap; gap:14px; margin-top:34px; }
    .btn{
      display:inline-flex; align-items:center; gap:9px; cursor:pointer;
      font-family:var(--mono); font-size:12px; font-weight:600; letter-spacing:0.08em;
      text-transform:uppercase; border-radius:12px; padding:15px 24px;
      transition:transform .2s, box-shadow .2s, background .2s, color .2s, border-color .2s;
    }
    .btn-primary{ background:var(--accent); color:${theme.accentText}; border:1px solid var(--accent);
      box-shadow:0 10px 34px -8px var(--glow); }
    .btn-primary:hover{ transform:translateY(-2px); box-shadow:0 16px 44px -8px var(--glow); }
    .btn-ghost{ background:transparent; color:var(--ink); border:1px solid var(--line); }
    .btn-ghost:hover{ transform:translateY(-2px); border-color:var(--accent); color:var(--accent); }
    .btn:focus-visible{ outline:2px solid var(--accent); outline-offset:3px; }

    /* instrument spec strip */
    .hero-specs{ display:flex; gap:0; margin-top:44px; border-top:1px solid var(--line);
      max-width:480px; }
    .spec{ flex:1; padding:16px 4px 0; }
    .spec .k{ font-family:var(--mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase;
      color:var(--muted); }
    .spec .v{ font-family:var(--disp); font-size:22px; font-weight:500; color:var(--ink); margin-top:4px;
      letter-spacing:-0.01em; }
    .spec .v small{ font-family:var(--mono); font-size:11px; color:var(--accent); font-weight:500; }

    /* right visual */
    .hero-visual{ position:relative; }
    .hero-frame{
      position:relative; border-radius:24px; overflow:hidden; aspect-ratio:4/5;
      border:1px solid var(--line);
      background:#101a15 url("${HERO_IMG}") center/cover no-repeat;
      box-shadow:${theme.shadowLg};
    }
    .hero-frame::after{ content:""; position:absolute; inset:0;
      background:linear-gradient(180deg, rgba(6,12,9,0.15) 0%, rgba(6,12,9,0.72) 100%); }
    .hero-frame .tag{ position:absolute; z-index:2; left:16px; bottom:16px;
      font-family:var(--mono); font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#eafff2; }
    .hero-frame .corner{ position:absolute; z-index:2; top:14px; left:14px;
      font-family:var(--mono); font-size:10px; letter-spacing:0.14em; color:rgba(234,255,242,0.75); }

    /* rotating seam badge */
    .hero-badge{
      position:absolute; z-index:6; right:-22px; top:-22px;
      width:104px; height:104px; border-radius:50%; cursor:pointer;
      background:${theme.bgInk}; box-shadow:0 0 0 6px ${theme.bg}, ${theme.shadowLg};
      display:flex; align-items:center; justify-content:center; border:none;
    }
    .hero-badge .ring{ position:absolute; inset:0; animation:cc-spin 16s linear infinite; }
    .hero-badge .ring text{ fill:#eafff2; font-family:var(--mono); font-size:8px; font-weight:500; letter-spacing:2px; }
    .hero-badge .logo{ position:relative; z-index:2; width:52px; height:52px; border-radius:50%;
      object-fit:cover; }
    .hero-badge:focus-visible{ outline:3px solid var(--accent); outline-offset:4px; }
    @keyframes cc-spin{ to{ transform:rotate(360deg); } }

    .hero-mini{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
    .mini{
      position:relative; overflow:hidden; border-radius:14px; min-height:96px; cursor:pointer;
      border:1px solid var(--line); padding:12px; text-align:left; width:100%;
      display:flex; flex-direction:column; justify-content:flex-end;
      background:#131d18 center/cover no-repeat; transition:transform .2s, border-color .2s;
    }
    .mini.algae{ background-image:linear-gradient(180deg, rgba(8,16,11,.2), rgba(8,16,11,.82)), url("${ALGAE_IMG}"); }
    .mini.ferm{ background-image:linear-gradient(180deg, rgba(8,16,11,.2), rgba(8,16,11,.82)), url("${FERMENTOR_IMG}"); }
    .mini:hover{ transform:translateY(-3px); border-color:var(--accent); }
    .mini .n{ position:relative; z-index:2; color:#eafff2; font-size:13px; font-weight:700; }
    .mini .m{ position:relative; z-index:2; font-family:var(--mono); font-size:10px; color:rgba(234,255,242,0.72);
      letter-spacing:0.04em; margin-top:2px; }
    .mini:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }

    @media (max-width:900px){
      .hero{ padding:110px 22px 56px; }
      .hero-inner{ grid-template-columns:1fr; gap:40px; }
      .hero-bg{ mask-image:linear-gradient(180deg,#000,transparent 90%); -webkit-mask-image:linear-gradient(180deg,#000,transparent 90%); }
      .hero-frame{ aspect-ratio:16/10; }
    }
    @media (max-width:460px){
      .hero-specs{ flex-wrap:wrap; }
      .spec{ flex:1 0 45%; }
    }
    @media (prefers-reduced-motion:reduce){ .hero-badge .ring{ animation:none; } }
  `

  const specs = [
    { k: 'Reaction', v: <>CO₂→<small>C₂H₅OH</small></> },
    { k: 'Organisms', v: <>2 <small>strains</small></> },
    { k: 'Ethanol', v: <>99<small>% pure</small></> },
  ]

  return (
    <section className="hero">
      <style>{css}</style>
      <div className="hero-bg" aria-hidden />
      <div className="hero-grid" aria-hidden />
      <div className="hero-bloom" aria-hidden />

      <div className="hero-inner">
        {/* Left — editorial copy */}
        <div>
          <motion.div className="hero-eyebrow"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span className="dot" /> CO₂ → Bioethanol <span className="rule" /> Interactive Simulator
          </motion.div>

          <motion.h1 className="hero-h1"
            initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.06, ease }}>
            Model the future<br />of <em>carbon capture</em>
          </motion.h1>

          <motion.p className="hero-sub"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease }}>
            An interactive simulator that turns captured CO₂ into bioethanol through
            algae and yeast — explore, tune, and optimize the whole bioprocess at any scale.
          </motion.p>

          <motion.div className="hero-cta"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.24, ease }}>
            <button className="btn btn-primary" onClick={() => navigate('/simulation')}>
              Launch Simulator <Arrow size={15} w={2} />
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/models')}>
              Explore Models
            </button>
          </motion.div>

          <motion.div className="hero-specs"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.4 }}>
            {specs.map(s => (
              <div className="spec" key={s.k}>
                <div className="k">{s.k}</div>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — framed visual + rotating badge + model shortcuts */}
        <motion.div className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}>
          <div className="hero-frame">
            <span className="corner">FIG.01 · REACTOR ARRAY</span>
            <span className="tag">Closed-loop carbon system</span>
          </div>

          <div className="hero-badge" role="button" tabIndex={0}
            aria-label="Explore the simulator"
            onClick={() => navigate('/simulation')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/simulation') }}>
            <svg className="ring" viewBox="0 0 104 104">
              <defs>
                <path id="ccCirclePath" d="M52,52 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text>
                <textPath href="#ccCirclePath">
                  EXPLORE THE SIM
                  <tspan fill={theme.accent}> · </tspan>
                  EXPLORE THE SIM
                  <tspan fill={theme.accent}> · </tspan>
                </textPath>
              </text>
            </svg>
            <img className="logo" src={LOGO_IMG} alt="" aria-hidden="true" />
          </div>

          <div className="hero-mini">
            <button className="mini algae" onClick={() => navigate('/models')} aria-label="Algae Bioreactor model">
              <span className="n">Algae Bioreactor</span>
              <span className="m">CO₂ → glucose</span>
            </button>
            <button className="mini ferm" onClick={() => navigate('/models')} aria-label="Yeast Fermenter model">
              <span className="n">Yeast Fermenter</span>
              <span className="m">glucose → ethanol</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
