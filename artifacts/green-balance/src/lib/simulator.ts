/**
 * Energiemix-Simulator: reine Rechnung im Browser, kein Backend noetig.
 *
 * Kennzahlen sind gerundete Durchschnittswerte fuer Deutschland (Lebenszyklus-
 * Emissionen in g CO2-aeq/kWh bzw. Stromgestehungskosten in ct/kWh). Die Werte
 * dienen der Veranschaulichung von Groessenordnungen, nicht der Bilanzierung.
 */
export const SOURCES = [
  { key: "coal", label: "Kohle", co2: 950, cost: 11.5, color: "#3f3f46" },
  { key: "gas", label: "Gas", co2: 400, cost: 12.0, color: "#a1a1aa" },
  { key: "wind", label: "Wind", co2: 12, cost: 7.0, color: "#0ea5e9" },
  { key: "solar", label: "Solar", co2: 40, cost: 6.5, color: "#f59e0b" },
  { key: "hydro", label: "Wasser & Biomasse", co2: 24, cost: 10.0, color: "#22c55e" },
] as const;

export type MixKey = (typeof SOURCES)[number]["key"];
export type Mix = Record<MixKey, number>;

export const START_MIX: Mix = { coal: 25, gas: 12, wind: 28, solar: 15, hydro: 20 };
export const DEMAND_TWH = 500; // ungefaehrer Bruttostromverbrauch Deutschlands
export const CO2_2023_MT = 673; // gesamte deutsche Emissionen 2023

/** Bringt den Mix auf 100 Prozent und liefert ganzzahlige Werte. */
export function normaliseMix(mix: Mix): Mix {
  const total = Object.values(mix).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return { ...START_MIX };
  const scaled = Object.fromEntries(
    Object.entries(mix).map(([key, value]) => [key, (value / total) * 100])
  ) as Mix;
  return scaled;
}

export interface SimulatorResult {
  intensity: number;      // g CO2-aeq/kWh
  emissionsMt: number;    // Mt CO2 fuer die gewaehlte Strommenge
  costCtPerKwh: number;   // durchschnittliche Gestehungskosten
  annualCostBn: number;   // Mrd. Euro fuer die gewaehlte Strommenge
  renewableShare: number; // Prozent
}

export function simulate(mix: Mix, demandTwh = DEMAND_TWH): SimulatorResult {
  const normalised = normaliseMix(mix);
  let intensity = 0;
  let cost = 0;
  let renewable = 0;
  for (const source of SOURCES) {
    const share = normalised[source.key] / 100;
    intensity += share * source.co2;
    cost += share * source.cost;
    if (source.key !== "coal" && source.key !== "gas") renewable += normalised[source.key];
  }
  const tWh = Math.max(demandTwh, 1);
  return {
    intensity: Math.round(intensity),
    emissionsMt: Math.round((intensity * tWh) / 1000),
    costCtPerKwh: Math.round(cost * 10) / 10,
    annualCostBn: Math.round((cost / 100) * tWh * 10) / 10,
    renewableShare: Math.round(renewable),
  };
}

// Kurzer Selbsttest der Rechnung: node --test via vitest
