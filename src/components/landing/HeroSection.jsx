import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

// Full-bleed hero image. Quoted in url() so the spaces/commas in the
// filename are handled safely. Lives in /public, served from root by Vite.
const HERO_IMG = '/ChatGPT Image Jun 13, 2026, 07_25_11 AM.png'
const LOGO_IMG = '/Icons/Logo.png'
const ALGAE_IMG = '/Icons/Algae.png'
const FERMENTOR_IMG = '/Icons/Fermentor.png'

function Arrow({ size = 22, color = '#fff', width = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M17 7H9M17 7V15" stroke={color} strokeWidth={width}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HeroSection() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const accent = theme.accent

  // Scoped CSS — the studio-card layout (white card on steel backdrop),
  // absolute topbar, seam badge keyframes + textPath, media queries and
  // reduced-motion, none of which inline styles can express.
  const css = `
    .cc-wrap{
      --ink:#14181a; --card:#ffffff; --muted:#93999a; --line:#eaecec;
      --accent:${accent}; --radius:30px;
      position:relative; min-height:100vh; width:100%;
      display:flex; align-items:center; justify-content:center;
      padding:64px 32px;
      background:radial-gradient(120% 90% at 80% 0%, #3a4a4c 0%, #1e2829 45%, #0d1213 100%);
    }

    .cc-card{
      position:relative; width:100%; max-width:980px;
      background:var(--card); border-radius:var(--radius); padding:18px;
      box-shadow:0 60px 120px -30px rgba(0,0,0,.6);
    }

    /* Top bar — absolute, overlaps the image's top corners */
    .cc-topbar{
      position:absolute; top:34px; left:34px; right:34px; z-index:5;
      display:flex; align-items:center; justify-content:space-between;
    }
    .cc-logo{
      width:54px; height:54px; border-radius:16px; background:var(--ink);
      border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
    }
    .cc-logo:focus-visible{ outline:3px solid var(--accent); outline-offset:3px; }

    /* Hero image stage — full-bleed across the card, anchors the badge */
    .cc-stage{ position:relative; margin:-18px -18px 0; }
    .cc-hero-img{
      width:100%; height:320px; border-radius:var(--radius) var(--radius) 0 0;
      background:
        linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.14)),
        #b9c3c4 url("${HERO_IMG}") center 40%/cover no-repeat;
    }

    /* Rotating badge straddling the image / content seam */
    .cc-badge{
      position:absolute; left:46%; bottom:-46px; transform:translateX(-50%);
      width:96px; height:96px; border-radius:50%; cursor:pointer;
      background:var(--ink); z-index:6; box-shadow:0 0 0 6px var(--card);
      display:flex; align-items:center; justify-content:center;
    }
    .cc-badge:focus-visible{ outline:3px solid var(--accent); outline-offset:4px; }
    .cc-badge .ring{ position:absolute; inset:0; animation:cc-spin 14s linear infinite; }
    .cc-badge .logo{
      position:relative; z-index:2; width:54px; height:54px; border-radius:50%;
      object-fit:cover; display:block; pointer-events:none;
    }
    .cc-badge text{ fill:#fff; font-size:8.2px; font-weight:600; letter-spacing:1.5px; }
    @keyframes cc-spin{ to{ transform:rotate(360deg); } }

    /* Lower grid */
    .cc-lower{
      display:grid; grid-template-columns:1.18fr .92fr; gap:18px; margin-top:18px;
    }
    .cc-h1{
      font-weight:800; font-size:clamp(30px,4.2vw,46px); line-height:1.02;
      letter-spacing:-.02em; color:var(--ink); margin:0;
    }
    .cc-sub{
      font-weight:500; font-size:13px; line-height:1.55; color:var(--muted);
      max-width:320px; margin:14px 0 0;
    }

    .cc-actions{ display:flex; align-items:flex-end; gap:22px; margin-top:30px; }
    .cc-cta-col{ display:flex; flex-direction:column; gap:20px; }
    .cc-cta{
      background:var(--ink); color:#fff; border:none; border-radius:30px;
      padding:14px 26px; font-weight:600; font-size:11px; letter-spacing:1.2px;
      text-transform:uppercase; cursor:pointer; transition:background .2s, color .2s, transform .2s;
      align-self:flex-start;
    }
    .cc-cta:hover{ background:var(--accent); color:#08120c; transform:translateY(-1px); }
    .cc-cta:focus-visible{ outline:3px solid var(--accent); outline-offset:3px; }

    .cc-socials{ display:flex; gap:10px; }
    .cc-soc{
      width:36px; height:36px; border-radius:50%; cursor:pointer;
      border:1px solid var(--line); background:#fff; color:var(--muted);
      display:flex; align-items:center; justify-content:center;
      transition:background .2s, color .2s, border-color .2s;
    }
    .cc-soc:hover{ background:var(--ink); color:#fff; border-color:var(--ink); }
    .cc-soc:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }

    .cc-thumbs{ display:flex; gap:10px; }
    .cc-thumb{
      position:relative; width:90px; height:118px; border-radius:14px; cursor:pointer;
      overflow:hidden; border:none; padding:0; flex:0 0 auto;
      background:#1c2526; background-size:cover; background-position:center;
      transition:transform .2s;
    }
    .cc-thumb:hover{ transform:translateY(-2px); }
    .cc-thumb:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }
    .cc-thumb::after{
      content:""; position:absolute; inset:0;
      background:linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.55));
    }
    .cc-thumb span{
      position:absolute; left:8px; bottom:8px; z-index:2;
      color:#fff; font-size:11px; font-weight:600; letter-spacing:.2px;
    }
    .cc-t1{ background-image:linear-gradient(150deg, #243a36, #11201d); }
    .cc-t2{ background-image:linear-gradient(150deg, #2a3637, #131b1c); }
    .cc-t3{ background-image:linear-gradient(150deg, #1f2e33, #0e1518); }

    /* Right column — site / model cards */
    .cc-projects{ display:flex; flex-direction:column; gap:14px; }
    .cc-pcard{
      position:relative; border-radius:18px; overflow:hidden; min-height:118px;
      flex:1; padding:16px; cursor:pointer; border:none; text-align:left; width:100%;
      display:flex; align-items:flex-end;
      background:#1c2526 center/cover no-repeat;
      transition:transform .2s;
    }
    .cc-algae{ background-image:url("${ALGAE_IMG}"); }
    .cc-fermentor{ background-image:url("${FERMENTOR_IMG}"); }
    .cc-pcard:hover{ transform:translateY(-2px); }
    .cc-pcard:focus-visible{ outline:3px solid var(--accent); outline-offset:3px; }
    .cc-pcard::after{
      content:""; position:absolute; inset:0;
      background:linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55));
    }
    .cc-name{ position:relative; z-index:2; color:#fff; font-size:13px; font-weight:600; }
    .cc-view{
      position:absolute; top:16px; right:18px; z-index:2; color:#fff; font-size:11px;
      font-weight:600; display:flex; align-items:center; gap:4px;
    }
    .cc-metric{
      position:absolute; bottom:14px; right:16px; z-index:2; color:#fff;
      font-size:10px; font-weight:600; opacity:.9;
    }

    @media (max-width:760px){
      .cc-lower{ grid-template-columns:1fr; gap:24px; }
      .cc-actions{ flex-wrap:wrap; }
      .cc-hero-img{ height:230px; }
      .cc-badge{ left:auto; right:24px; transform:none; }
    }
    @media (prefers-reduced-motion:reduce){ .cc-badge .ring{ animation:none; } }
  `

  return (
    <section className="cc-wrap">
      <style>{css}</style>

      <motion.div className="cc-card"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}>

        {/* Top bar overlapping the image corners */}
        <div className="cc-topbar">
          <button className="cc-logo" aria-label="Home" type="button"
            onClick={() => navigate('/')}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 16.5L11.5 3.5V11L17 5.5L10.5 18.5V11L5 16.5Z" fill="#fff" />
            </svg>
          </button>
        </div>

        {/* Hero image + seam badge */}
        <div className="cc-stage">
          <div className="cc-hero-img" role="img"
            aria-label="Carbon capture and bioethanol simulation reactor" />

          <div className="cc-badge" role="button" tabIndex={0}
            aria-label="Explore the simulator"
            onClick={() => navigate('/simulation')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/simulation') }}>
            <svg className="ring" viewBox="0 0 96 96">
              <defs>
                <path id="ccCirclePath"
                  d="M48,48 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
              </defs>
              <text>
                <textPath href="#ccCirclePath">
                  EXPLORE THE SIM
                  <tspan fill={accent}> · </tspan>
                  EXPLORE THE SIM
                  <tspan fill={accent}> · </tspan>
                </textPath>
              </text>
            </svg>
            <img className="logo" src={LOGO_IMG} alt="" aria-hidden="true" />
          </div>
        </div>

        {/* Lower grid */}
        <div className="cc-lower">
          {/* Left column */}
          <div>
            <div className="cc-intro">
              <h1 className="cc-h1">
                Model the future of<br />carbon capture
              </h1>
              <p className="cc-sub">
                An interactive simulator that turns captured CO<sub>2</sub> into
                bioethanol through algae and yeast — explore, tune, and optimize
                the whole process at any scale.
              </p>
            </div>

            <div className="cc-actions">
              <div className="cc-cta-col">
                <button className="cc-cta" onClick={() => navigate('/simulation')}>
                  Launch Simulator
                </button>
                <div className="cc-socials">
                  <button className="cc-soc" aria-label="LinkedIn" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.78v2.2h.07c.67-1.2 2.3-2.47 4.73-2.47C22 7.73 24 10.1 24 14.6V24h-5v-8.3c0-2-.04-4.5-2.75-4.5-2.75 0-3.17 2.13-3.17 4.35V24h-5V8z" />
                    </svg>
                  </button>
                  <button className="cc-soc" aria-label="X" type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65z" />
                    </svg>
                  </button>
                  <button className="cc-soc" aria-label="YouTube" type="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.5v-7l6.3 3.5-6.3 3.5z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="cc-thumbs">
                <button className="cc-thumb cc-t1" type="button" aria-label="Capture"
                  onClick={() => navigate('/simulation')}>
                  <span>Capture</span>
                </button>
                <button className="cc-thumb cc-t2" type="button" aria-label="Convert"
                  onClick={() => navigate('/simulation')}>
                  <span>Convert</span>
                </button>
                <button className="cc-thumb cc-t3" type="button" aria-label="Monitor"
                  onClick={() => navigate('/simulation')}>
                  <span>Monitor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right column — model cards */}
          <div className="cc-projects">
            <button className="cc-pcard cc-algae" type="button" aria-label="Algae Bioreactor model"
              onClick={() => navigate('/models')}>
              <span className="cc-name">Algae Bioreactor</span>
              <span className="cc-view">View Model <Arrow size={14} width={2} /></span>
              <span className="cc-metric">CO₂ → glucose</span>
            </button>
            <button className="cc-pcard cc-fermentor" type="button" aria-label="Yeast Fermenter model"
              onClick={() => navigate('/models')}>
              <span className="cc-name">Yeast Fermenter</span>
              <span className="cc-view">View Model <Arrow size={14} width={2} /></span>
              <span className="cc-metric">glucose → ethanol</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
