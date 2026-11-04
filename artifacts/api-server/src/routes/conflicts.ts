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
  {
    id: 9,
    title: "Wasserstoff-Kernnetz",
    climateEffect: "Grüner Wasserstoff ersetzt Koks in der Stahl- und Chemieindustrie und macht Prozesswärme CO₂-frei",
    economyEffect: "Investitionen von rund 20 Milliarden Euro, hohe Unsicherheit über Abnehmer und Wasserstoffpreise",
    climateScore: 7.6,
    economyScore: 6.4,
    description: "Bis 2032 soll ein rund 9.000 Kilometer langes Wasserstoffnetz aus umgewidmeten Erdgasleitungen entstehen. Befürworter sehen darin die Rettung der Stahlindustrie, Kritiker warnen vor einem Milliardengeschäft ohne gesicherte Nachfrage.",
    severity: "medium" as const,
  },
  {
    id: 10,
    title: "Industriestrompreis",
    climateEffect: "Ein gedeckelter Strompreis hält Produktion im Land und verhindert Verlagerung CO₂-intensiver Herstellung",
    economyEffect: "Subventionen in Milliardenhöhe, Wettbewerbsverzerrung zwischen Branchen, Budgetbelastung",
    climateScore: 5.1,
    economyScore: 7.4,
    description: "Energieintensive Branchen fordern einen staatlich gedeckelten Industriestrompreis, um im internationalen Wettbewerb zu bestehen. Ökonomen und Klimainstitute streiten, ob die Entlastung Investitionen in Effizienz und Elektrifizierung eher beschleunigt oder ausbremst.",
    severity: "high" as const,
  },
  {
    id: 11,
    title: "Agrarwende und Methan",
    climateEffect: "Weniger Viehbestand und wiedervernässte Moore könnten mehrere Millionen Tonnen CO₂-Äquivalente jährlich einsparen",
    economyEffect: "Betriebe mit kleinen Margen, Preisdruck im Handel, Widerstand gegen Vorgaben zur Tierhaltung",
    climateScore: 6.6,
    economyScore: 4.4,
    description: "Landwirtschaft verursacht etwa acht Prozent der deutschen Treibhausgase, vor allem Methan und Lachgas. Die Debatte um Tierhaltungslabel, Moorflächen und Düngeregeln zeigt den Zielkonflikt zwischen Klimaschutz, Tierwohl und Einkommen der Betriebe.",
    severity: "medium" as const,
  },
  {
    id: 12,
    title: "Flächenverbrauch und Versiegelung",
    climateEffect: "Weniger Überflutungen, mehr Kohlenstoffbindung und kühlere Städte durch entsiegelte Flächen",
    economyEffect: "Bauland wird knapper, Kommunen verlieren Gewerbeflächen, Grundstückspreise steigen",
    climateScore: 6.9,
    economyScore: 4.8,
    description: "Deutschland verbraucht weiterhin rund 50 Hektar Fläche pro Tag für Siedlungen und Verkehr. Das Ziel von unter 30 Hektar bis 2030 steht in Konkurrenz zu Wohnungsbau, Gewerbegebieten und dem Ausbau der Infrastruktur.",
    severity: "medium" as const,
  },
  {
    id: 13,
    title: "Bahnausbau und Trassenplanung",
    climateEffect: "Verlagert Verkehr von der Straße auf die Schiene und ist Voraussetzung für mehr Güterverkehr ohne Straßenlast",
    economyEffect: "Jahrelange Bauarbeiten treffen Pendler und Anwohner, Kostensteigerungen bei Großprojekten",
    climateScore: 7.2,
    economyScore: 6.7,
    description: "Die Sanierung von Knotenpunkten und neue Korridore sollen die Bahn verlässlicher machen. Gleichzeitig bremsen Bauphasen, Klagen und Fachkräftemangel die Umsetzung, während die Branche auf Planungsbeschleunigung drängt.",
    severity: "medium" as const,
  },
  {
    id: 14,
    title: "Lieferkettengesetz und Rohstoffe",
    climateEffect: "Ökologische Standards in globalen Lieferketten sollen Abholzung und Schadstoffe in Produzentenländern verringern",
    economyEffect: "Dokumentationspflichten für Unternehmen, Wettbewerbsnachteile gegenüber Anbietern ohne vergleichbare Pflichten",
    climateScore: 5.6,
    economyScore: 5.2,
    description: "Das Lieferkettengesetz verpflichtet Unternehmen, Menschenrechte und Umweltstandards entlang der Kette zu prüfen. Mittelstand und Handel klagen über Bürokratie, während der Zeitplan für kleinere Betriebe politisch wieder in der Diskussion steht.",
    severity: "low" as const,
  }

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
