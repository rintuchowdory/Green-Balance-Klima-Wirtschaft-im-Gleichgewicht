import { Router } from "express";

const router = Router();

const states = [
  { id: 1, name: "Bayern", code: "BY", co2PerCapita: 6.8, renewablePercent: 55.1, unemploymentRate: 3.0, electricityPrice: 30.8, industryShare: 28.5, population: 13369, windCapacityMw: 2850 },
  { id: 2, name: "Baden-Württemberg", code: "BW", co2PerCapita: 7.2, renewablePercent: 42.4, unemploymentRate: 3.3, electricityPrice: 31.1, industryShare: 34.1, population: 11235, windCapacityMw: 1880 },
  { id: 3, name: "Nordrhein-Westfalen", code: "NW", co2PerCapita: 12.4, renewablePercent: 28.6, unemploymentRate: 7.2, electricityPrice: 31.5, industryShare: 29.8, population: 18045, windCapacityMw: 5890 },
  { id: 4, name: "Niedersachsen", code: "NI", co2PerCapita: 9.1, renewablePercent: 74.3, unemploymentRate: 5.4, electricityPrice: 30.4, industryShare: 25.1, population: 8140, windCapacityMw: 12200 },
  { id: 5, name: "Brandenburg", code: "BB", co2PerCapita: 18.7, renewablePercent: 68.9, unemploymentRate: 6.1, electricityPrice: 29.8, industryShare: 18.4, population: 2570, windCapacityMw: 8100 },
  { id: 6, name: "Sachsen-Anhalt", code: "ST", co2PerCapita: 14.2, renewablePercent: 61.2, unemploymentRate: 7.5, electricityPrice: 29.5, industryShare: 22.7, population: 2180, windCapacityMw: 5900 },
  { id: 7, name: "Mecklenburg-Vorpommern", code: "MV", co2PerCapita: 10.8, renewablePercent: 72.1, unemploymentRate: 7.8, electricityPrice: 29.9, industryShare: 14.2, population: 1610, windCapacityMw: 4450 },
  { id: 8, name: "Schleswig-Holstein", code: "SH", co2PerCapita: 7.4, renewablePercent: 81.3, unemploymentRate: 4.9, electricityPrice: 30.2, industryShare: 18.3, population: 2960, windCapacityMw: 7950 },
  { id: 9, name: "Hessen", code: "HE", co2PerCapita: 7.8, renewablePercent: 34.2, unemploymentRate: 4.8, electricityPrice: 31.4, industryShare: 24.6, population: 6390, windCapacityMw: 1680 },
  { id: 10, name: "Rheinland-Pfalz", code: "RP", co2PerCapita: 8.9, renewablePercent: 50.7, unemploymentRate: 4.3, electricityPrice: 30.7, industryShare: 26.2, population: 4140, windCapacityMw: 3780 },
  { id: 11, name: "Sachsen", code: "SN", co2PerCapita: 9.4, renewablePercent: 43.8, unemploymentRate: 5.9, electricityPrice: 29.6, industryShare: 24.9, population: 4040, windCapacityMw: 1600 },
  { id: 12, name: "Thüringen", code: "TH", co2PerCapita: 8.7, renewablePercent: 50.4, unemploymentRate: 5.5, electricityPrice: 29.9, industryShare: 24.1, population: 2100, windCapacityMw: 2200 },
  { id: 13, name: "Saarland", code: "SL", co2PerCapita: 11.5, renewablePercent: 22.8, unemploymentRate: 6.4, electricityPrice: 31.8, industryShare: 31.7, population: 980, windCapacityMw: 540 },
  { id: 14, name: "Hamburg", code: "HH", co2PerCapita: 9.8, renewablePercent: 18.4, unemploymentRate: 5.7, electricityPrice: 33.1, industryShare: 20.8, population: 1892, windCapacityMw: 88 },
  { id: 15, name: "Bremen", code: "HB", co2PerCapita: 14.3, renewablePercent: 21.0, unemploymentRate: 9.6, electricityPrice: 32.4, industryShare: 28.5, population: 685, windCapacityMw: 42 },
  { id: 16, name: "Berlin", code: "BE", co2PerCapita: 5.6, renewablePercent: 12.1, unemploymentRate: 8.3, electricityPrice: 33.8, industryShare: 12.4, population: 3669, windCapacityMw: 35 },
];

router.get("/", (_req, res) => {
  res.json(states);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const state = states.find((s) => s.id === id);
  if (!state) return res.status(404).json({ error: "Not found" });
  return res.json(state);
});

export default router;
