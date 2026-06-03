// ─────────────────────────────────────────────────────────────────────────────
// Bioprocess Simulation Engine
//
// Implements the kinetic models documented in the Carbon Capture Modeling &
// Simulation Platform report (Chapter 4.3 — "Bioprocess model developer"):
//
//   • Monod model            U = Umax · S / (Ks + S)                     (4.3.3.1)
//   • Logistic model         dX/dt = Umax · X · (1 − X/Xmax)             (4.3.3.2)
//                            X(t)  = Xmax / (1 + ((Xmax−X0)/X0)·e^(−Umax·t))
//   • Luedeking-Piret        dP/dt = α · dX/dt + β · X                   (4.3.3.3)
//   • CO₂ capture            dCO₂/dt = (Yco2/X) · dX/dt                  (4.3.4.2)
//   • Yield coefficients     Yb = biomass/glucose ,  Ye = ethanol/glucose
//   • Efficiency             η vs theoretical max 0.348 g EtOH / g CO₂   (4.3.7)
//
// Reactions:
//   CO₂ + H₂O + Light → C₆H₁₂O₆ + O₂      (Chlorella vulgaris, photosynthesis)
//   C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂            (Saccharomyces cerevisiae, fermentation)
// ─────────────────────────────────────────────────────────────────────────────

// Literature-derived kinetic parameters (ranges cited in report §4.3 & appendix).
export const KINETIC_PARAMS = {
  muMaxAlgae: 0.25,      // 1/h   max specific growth — Chlorella (range 0.1–0.3)
  muMaxYeast: 0.30,      // 1/h   max specific growth — S. cerevisiae (0.05–0.5)
  ksCO2: 0.05,           // g/L   CO₂ half-saturation constant (0.01–0.1)
  kG: 0.075,             // g/L   glucose half-saturation, yeast (0.025–0.1)
  xMaxAlgae: 20,         // g/L   algal carrying capacity (5–20)
  xMaxYeast: 50,         // g/L   yeast carrying capacity (10–50)
  yCO2X: 1.83,           // g CO₂ fixed per g algal biomass (fixation 1.5–2.5/day)
  alphaGlucose: 0.40,    // g glucose / g algal biomass   (growth-associated)
  betaGlucose: 0.03,     // g glucose / (g biomass·h)      (non-growth-assoc.)
  alphaEthanol: 0.149,   // g ethanol / g yeast biomass   (growth-associated)
  betaEthanol: 0.02,     // g ethanol / (g biomass·h)      (non-growth-assoc.)
  yBiomassGlucose: 0.5,  // g yeast / g glucose consumed
  co2PerEthanol: 0.957,  // g CO₂ / g ethanol (stoich. 2·44 / 2·46)
  envFactor: 0.92,       // combined f(T)·f(pH)·f(I) at controlled optimum
  theoreticalMax: 0.348, // g ethanol / g CO₂ — thermodynamic ceiling (§4.3.7.3)
}

const round = (n, d = 3) => parseFloat(n.toFixed(d))
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

/**
 * Run the closed-loop CO₂-to-bioethanol simulation.
 * @param {{algalBiomass:number, yeastBiomass:number, co2Concentration:number, simulationDuration:number}} inputs
 * @returns {{series:Array, kpi:Object, params:Object}}
 */
export function runSimulation(inputs) {
  const P = KINETIC_PARAMS
  const Xa0 = inputs.algalBiomass
  const Xy0 = inputs.yeastBiomass
  const CO20 = inputs.co2Concentration
  const duration = inputs.simulationDuration

  const steps = 160
  const dt = duration / steps

  // State variables
  let Xa = Xa0          // algal biomass (g/L)
  let Xy = Xy0          // yeast biomass (g/L)
  let glucose = 0       // free glucose available to yeast (g/L)
  let ethanol = 0       // ethanol concentration (g/L)
  let glucoseProduced = 0 // cumulative carbohydrate produced by algae (g/L)
  let co2Fixed = 0      // cumulative CO₂ fixed by algae (g/L)
  let co2Evolved = 0    // cumulative CO₂ released by fermentation (g/L)
  let o2Evolved = 0     // cumulative O₂ released by photosynthesis (g/L)

  // CO₂ is held at the controlled injection set-point (automated flue-gas feed +
  // recycle loop), so its Monod factor stays constant through the run.
  const fCO2 = CO20 / (P.ksCO2 + CO20)

  
  const series = []
  const snapshot = (h) => ({
    hour: round(h, 2),
    algae: round(Xa),
    yeast: round(Xy),
    glucose: round(glucose),
    ethanol: round(ethanol),
    co2Captured: round(co2Fixed),
    co2Evolved: round(co2Evolved),
    co2Net: round(co2Fixed - co2Evolved),
  })
  series.push(snapshot(0))

  for (let i = 1; i <= steps; i++) {
    // ── Phase 1 — Algae (photosynthesis): Monod(CO₂) × Logistic ──────────────
    const muA = P.muMaxAlgae * fCO2 * P.envFactor
    const dXa = muA * Xa * (1 - Xa / P.xMaxAlgae) * dt
    const dCO2fix = P.yCO2X * dXa
    const dGlu = P.alphaGlucose * dXa + P.betaGlucose * Xa * dt   // Luedeking-Piret
    o2Evolved += dCO2fix * (32 / 44) // photosynthesis O₂:CO₂ molar ratio ≈ 1

    // ── Phase 2 — Yeast (fermentation): Monod(glucose) × Logistic ────────────
    const fG = glucose / (P.kG + glucose)
    const muY = P.muMaxYeast * fG * P.envFactor
    const dXy = muY * Xy * (1 - Xy / P.xMaxYeast) * dt
    const dGluCons = dXy / P.yBiomassGlucose
    const dEth = P.alphaEthanol * dXy + P.betaEthanol * Xy * dt   // Luedeking-Piret
    const dCO2evo = P.co2PerEthanol * dEth                        // fermentation CO₂

    // ── Integrate (forward Euler) ────────────────────────────────────────────
    Xa += dXa
    Xy += dXy
    glucoseProduced += dGlu
    glucose += dGlu - dGluCons
    if (glucose < 0) glucose = 0
    ethanol += dEth
    co2Fixed += dCO2fix
    co2Evolved += dCO2evo

    series.push(snapshot(i * dt))
  }

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const ethanolMass = ethanol
  const co2InputMass = co2Fixed // total CO₂ drawn into biomass over the run

  // Overall process efficiency vs theoretical ceiling 0.348 g EtOH / g CO₂
  // (report §4.3.7.3 — η_total). The ceiling reflects 6 CO₂ → glucose → 2 EtOH.
  const overallEff = co2InputMass > 0
    ? clamp((ethanolMass / co2InputMass) / P.theoreticalMax * 100, 0, 100)
    : 0

  // CO₂ utilization: fraction of captured carbon that stays fixed after the
  // recycle loop returns the fermentation CO₂ (net / gross captured).
  const co2Utilization = co2Fixed > 0
    ? clamp(((co2Fixed - co2Evolved) / co2Fixed) * 100, 0, 100)
    : 0

  const biomassGrowth = ((Xa - Xa0) / Math.max(Xa0, 0.01)) * 100
  const ethanolYield = glucoseProduced > 0 ? ethanol / glucoseProduced : 0

  return {
    series,
    params: P,
    kpi: {
      finalAlgae: round(Xa, 2),
      finalYeast: round(Xy, 2),
      glucoseProduced: round(glucoseProduced, 2),
      ethanolProduced: round(ethanol, 2),
      co2Captured: round(co2Fixed, 2),
      co2Evolved: round(co2Evolved, 2),
      co2Net: round(co2Fixed - co2Evolved, 2),
      o2Released: round(o2Evolved, 2),
      processEfficiency: round(overallEff, 1),
      co2Utilization: round(co2Utilization, 1),
      biomassGrowth: round(biomassGrowth, 1),
      ethanolYield: round(ethanolYield, 3),
      fCO2: round(fCO2, 3),
    },
  }
}
