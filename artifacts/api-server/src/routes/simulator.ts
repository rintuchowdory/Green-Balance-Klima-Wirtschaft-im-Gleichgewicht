import { Router } from "express";
import { CalculateSimulatorBody } from "@workspace/api-zod";

const router = Router();

router.post("/calculate", (req, res) => {
  const parsed = CalculateSimulatorBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request" });

  const { windPercent, solarPercent, coalPercent, nuclearPercent, co2TaxEuros } = parsed.data;

  const renewablePercent = windPercent + solarPercent;
  const totalPercent = windPercent + solarPercent + coalPercent + nuclearPercent;

  const warnings: string[] = [];

  if (totalPercent > 100) {
    warnings.push(`Gesamtanteil (${totalPercent.toFixed(0)}%) überschreitet 100%. Bitte Werte anpassen.`);
  }

  if (renewablePercent < 30) {
    warnings.push("Sehr geringer Erneuerbaren-Anteil – CO₂-Ziele kaum erreichbar.");
  }

  if (coalPercent > 50) {
    warnings.push("Hoher Kohleanteil erhöht CO₂-Emissionen erheblich und belastet die Luftqualität.");
  }

  if (co2TaxEuros > 300) {
    warnings.push("Sehr hoher CO₂-Preis kann energieintensive Industrien ins Ausland treiben.");
  }

  if (renewablePercent > 80 && totalPercent < 90) {
    warnings.push("Hohe Fluktuationen bei fast 100% Erneuerbaren erfordern massiven Speicherausbau.");
  }

  const baselineCo2Mt = 746;
  const coalFactor = 1.2;
  const renewableFactor = 0.85;
  const taxFactor = co2TaxEuros / 200;

  const co2ReductionPercent = Math.min(
    85,
    Math.max(
      -10,
      renewablePercent * renewableFactor * 0.6 - coalPercent * coalFactor * 0.3 + co2TaxEuros * 0.04
    )
  );

  const basePrice = 22;
  const electricityPriceCents = Math.max(
    15,
    basePrice +
      renewablePercent * 0.12 +
      nuclearPercent * 0.05 -
      coalPercent * 0.1 +
      co2TaxEuros * 0.02 +
      (totalPercent < 70 ? 8 : 0)
  );

  const greenJobsCreatedPer1Pct = 3200;
  const coalJobsLostPer1Pct = 1400;
  const jobsCreated = Math.round((windPercent + solarPercent) * greenJobsCreatedPer1Pct * 0.8);
  const jobsLost = Math.round(
    (Math.max(0, 30 - coalPercent) * coalJobsLostPer1Pct + co2TaxEuros * 80) * 0.7
  );

  let feasibilityScore = 50;
  if (renewablePercent >= 50) feasibilityScore += 20;
  if (coalPercent <= 20) feasibilityScore += 10;
  if (co2TaxEuros >= 50 && co2TaxEuros <= 200) feasibilityScore += 10;
  if (totalPercent >= 80 && totalPercent <= 100) feasibilityScore += 10;
  if (warnings.length > 0) feasibilityScore -= warnings.length * 8;
  feasibilityScore = Math.max(0, Math.min(100, feasibilityScore));

  return res.json({
    co2ReductionPercent: Math.round(co2ReductionPercent * 10) / 10,
    electricityPriceCents: Math.round(electricityPriceCents * 10) / 10,
    jobsCreated,
    jobsLost,
    renewablePercent,
    feasibilityScore,
    warnings,
  });
});

export default router;
