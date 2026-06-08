import { Router } from "express";

const router = Router();

const conflicts = [
  {
    id: 1,
    title: "Kohleausstieg",
    climateEffect: "Drastische CO₂-Reduzierung, sauberere Luft, internationales Klimaziel erreicht",
    economyEffect: "Jobverluste in Kohleregionen (ca. 40.000), hohe Umstrukturierungskosten",
    climateScore: 9.2,
    economyScore: 7.8,
    description: "Deutschland plant den vollständigen Ausstieg aus der Kohleverstromung bis 2038. Während dies erhebliche Klimavorteile bringt, sind besonders strukturschwache Regionen wie das Rheinische Revier und die Lausitz betroffen.",
    severity: "high" as const,
  },
  {
    id: 2,
    title: "Elektromobilität",
    climateEffect: "Reduktion von Abgas-Emissionen im Verkehrssektor, weniger Feinstaub",
    economyEffect: "Hohe Umstellungskosten für Automobilindustrie, Risiko für 800.000 Arbeitsplätze",
    climateScore: 7.5,
    economyScore: 8.5,
    description: "Die Transformation zur Elektromobilität verändert die gesamte Automobilindustrie. Traditionelle Verbrenner-Lieferketten werden überflüssig, während neue Kompetenzen in Batterietechnologie und Software gefragt sind.",
    severity: "high" as const,
  },
  {
    id: 3,
    title: "Windkraftausbau",
    climateEffect: "Saubere Energieerzeugung ohne CO₂, Versorgungssicherheit",
    economyEffect: "Konflikte mit Anwohnern, Einschränkungen für Tourismus, höhere Netzkosten",
    climateScore: 8.0,
    economyScore: 5.5,
    description: "Der geplante Ausbau der Windkraft auf 115 GW bis 2030 stößt auf regionalen Widerstand. Besonders umstritten sind Abstands­regeln zu Wohngebieten und der Ausbau in Wäldern.",
    severity: "medium" as const,
  },
  {
    id: 4,
    title: "CO₂-Bepreisung",
    climateEffect: "Wirtschaftlicher Anreiz zur Emissionsreduktion, Einnahmen für Klimaschutz",
    economyEffect: "Steigende Heizkosten für Haushalte, Belastung für energieintensive Industrien",
    climateScore: 7.8,
    economyScore: 6.2,
    description: "Der CO₂-Preis ist ein zentrales Instrument der deutschen Klimapolitik. Seit 2021 gilt ein nationaler CO₂-Preis für Gebäude und Verkehr, der schrittweise steigt. Kritiker sehen soziale Ungleichgewichte.",
    severity: "medium" as const,
  },
  {
    id: 5,
    title: "Gebäudesanierung",
    climateEffect: "Energieeinsparungen, Reduktion von Heizungs-CO₂, Wärmeschutz",
    economyEffect: "Hohe Investitionskosten für Eigentümer, Mieterhöhungen, Fachkräftemangel",
    climateScore: 6.5,
    economyScore: 5.8,
    description: "Die energetische Sanierung des deutschen Gebäudebestands ist für die Klimaziele unerlässlich. Knapp 35% der CO₂-Emissionen stammen aus dem Gebäudesektor. Die Sanierungsquote von 1% pro Jahr ist zu gering.",
    severity: "medium" as const,
  },
  {
    id: 6,
    title: "Plastiksteuer & Kreislaufwirtschaft",
    climateEffect: "Weniger Plastikmüll, Ressourcenschonung, CO₂-Einsparungen in der Produktion",
    economyEffect: "Mehrkosten für Verpackungsindustrie und Handel, Umstellungsaufwand",
    climateScore: 5.5,
    economyScore: 4.2,
    description: "Die EU-weite Plastiksteuer und nationale Verpackungsgesetze fordern Unternehmen zur Umstellung. Recyclingfähige Verpackungen verursachen höhere Produktionskosten.",
    severity: "low" as const,
  },
  {
    id: 7,
    title: "Wärmpumpen-Pflicht",
    climateEffect: "Dekarbonisierung des Heizsektors, Reduktion fossiler Abhängigkeit",
    economyEffect: "Hohe Investitionskosten, Handwerkerengpässe, soziale Härten für Mieter",
    climateScore: 7.2,
    economyScore: 7.0,
    description: "Das Gebäudeenergiegesetz (GEG) sieht vor, dass ab 2024 neu eingebaute Heizungen zu 65% mit erneuerbaren Energien betrieben werden. Die Diskussion um das 'Heizungsgesetz' war politisch besonders kontrovers.",
    severity: "high" as const,
  },
  {
    id: 8,
    title: "Tempolimit Autobahn",
    climateEffect: "Reduktion von Kraftstoffverbrauch und CO₂ im Straßenverkehr",
    economyEffect: "Geringe wirtschaftliche Auswirkungen, Gegenwind von Autolobby und Teilen der Bevölkerung",
    climateScore: 4.0,
    economyScore: 2.5,
    description: "Ein generelles Tempolimit von 130 km/h auf deutschen Autobahnen würde laut Umweltbundesamt ca. 1,9 Mio. Tonnen CO₂ pro Jahr einsparen. Deutschland ist das einzige EU-Land ohne generelles Autobahn-Tempolimit.",
    severity: "low" as const,
  },
];

router.get("/", (_req, res) => {
  res.json(conflicts);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const conflict = conflicts.find((c) => c.id === id);
  if (!conflict) return res.status(404).json({ error: "Not found" });
  return res.json(conflict);
});

export default router;
