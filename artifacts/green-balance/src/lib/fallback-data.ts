// Offline-Fallback für die API-Daten.
// Wird benutzt, wenn der API-Proxy auf Vercel nicht antwortet (z. B. HTTP 508),
// damit Konflikt-Atlas und Bundesländer nie leer bleiben.
// Quelle: artifacts/api-server/src/routes/{conflicts,states}.ts

type ConflictFallback = {
  id: number;
  title: string;
  climateEffect: string;
  economyEffect: string;
  climateScore: number;
  economyScore: number;
  description: string;
  severity: "low" | "medium" | "high";
};

type StateFallback = {
  id: number;
  name: string;
  code: string;
  co2PerCapita: number;
  renewablePercent: number;
  unemploymentRate: number;
  electricityPrice: number;
  industryShare: number;
  population: number;
  windCapacityMw: number;
};

export const FALLBACK_CONFLICTS: ConflictFallback[] = [
  {
    "id": 1,
    "title": "Kohleausstieg",
    "climateEffect": "Drastische CO₂-Reduzierung, sauberere Luft, internationales Klimaziel erreicht",
    "economyEffect": "Jobverluste in Kohleregionen (ca. 40.000), hohe Umstrukturierungskosten",
    "climateScore": 9.2,
    "economyScore": 7.8,
    "description": "Deutschland plant den vollständigen Ausstieg aus der Kohleverstromung bis 2038. Während dies erhebliche Klimavorteile bringt, sind besonders strukturschwache Regionen wie das Rheinische Revier und die Lausitz betroffen.",
    "severity": "high"
  },
  {
    "id": 2,
    "title": "Elektromobilität",
    "climateEffect": "Reduktion von Abgas-Emissionen im Verkehrssektor, weniger Feinstaub",
    "economyEffect": "Hohe Umstellungskosten für Automobilindustrie, Risiko für 800.000 Arbeitsplätze",
    "climateScore": 7.5,
    "economyScore": 8.5,
    "description": "Die Transformation zur Elektromobilität verändert die gesamte Automobilindustrie. Traditionelle Verbrenner-Lieferketten werden überflüssig, während neue Kompetenzen in Batterietechnologie und Software gefragt sind.",
    "severity": "high"
  },
  {
    "id": 3,
    "title": "Windkraftausbau",
    "climateEffect": "Saubere Energieerzeugung ohne CO₂, Versorgungssicherheit",
    "economyEffect": "Konflikte mit Anwohnern, Einschränkungen für Tourismus, höhere Netzkosten",
    "climateScore": 8,
    "economyScore": 5.5,
    "description": "Der geplante Ausbau der Windkraft auf 115 GW bis 2030 stößt auf regionalen Widerstand. Besonders umstritten sind Abstands­regeln zu Wohngebieten und der Ausbau in Wäldern.",
    "severity": "medium"
  },
  {
    "id": 4,
    "title": "CO₂-Bepreisung",
    "climateEffect": "Wirtschaftlicher Anreiz zur Emissionsreduktion, Einnahmen für Klimaschutz",
    "economyEffect": "Steigende Heizkosten für Haushalte, Belastung für energieintensive Industrien",
    "climateScore": 7.8,
    "economyScore": 6.2,
    "description": "Der CO₂-Preis ist ein zentrales Instrument der deutschen Klimapolitik. Seit 2021 gilt ein nationaler CO₂-Preis für Gebäude und Verkehr, der schrittweise steigt. Kritiker sehen soziale Ungleichgewichte.",
    "severity": "medium"
  },
  {
    "id": 5,
    "title": "Gebäudesanierung",
    "climateEffect": "Energieeinsparungen, Reduktion von Heizungs-CO₂, Wärmeschutz",
    "economyEffect": "Hohe Investitionskosten für Eigentümer, Mieterhöhungen, Fachkräftemangel",
    "climateScore": 6.5,
    "economyScore": 5.8,
    "description": "Die energetische Sanierung des deutschen Gebäudebestands ist für die Klimaziele unerlässlich. Knapp 35% der CO₂-Emissionen stammen aus dem Gebäudesektor. Die Sanierungsquote von 1% pro Jahr ist zu gering.",
    "severity": "medium"
  },
  {
    "id": 6,
    "title": "Plastiksteuer & Kreislaufwirtschaft",
    "climateEffect": "Weniger Plastikmüll, Ressourcenschonung, CO₂-Einsparungen in der Produktion",
    "economyEffect": "Mehrkosten für Verpackungsindustrie und Handel, Umstellungsaufwand",
    "climateScore": 5.5,
    "economyScore": 4.2,
    "description": "Die EU-weite Plastiksteuer und nationale Verpackungsgesetze fordern Unternehmen zur Umstellung. Recyclingfähige Verpackungen verursachen höhere Produktionskosten.",
    "severity": "low"
  },
  {
    "id": 7,
    "title": "Wärmpumpen-Pflicht",
    "climateEffect": "Dekarbonisierung des Heizsektors, Reduktion fossiler Abhängigkeit",
    "economyEffect": "Hohe Investitionskosten, Handwerkerengpässe, soziale Härten für Mieter",
    "climateScore": 7.2,
    "economyScore": 7,
    "description": "Das Gebäudeenergiegesetz (GEG) sieht vor, dass ab 2024 neu eingebaute Heizungen zu 65% mit erneuerbaren Energien betrieben werden. Die Diskussion um das 'Heizungsgesetz' war politisch besonders kontrovers.",
    "severity": "high"
  },
  {
    "id": 8,
    "title": "Tempolimit Autobahn",
    "climateEffect": "Reduktion von Kraftstoffverbrauch und CO₂ im Straßenverkehr",
    "economyEffect": "Geringe wirtschaftliche Auswirkungen, Gegenwind von Autolobby und Teilen der Bevölkerung",
    "climateScore": 4,
    "economyScore": 2.5,
    "description": "Ein generelles Tempolimit von 130 km/h auf deutschen Autobahnen würde laut Umweltbundesamt ca. 1,9 Mio. Tonnen CO₂ pro Jahr einsparen. Deutschland ist das einzige EU-Land ohne generelles Autobahn-Tempolimit.",
    "severity": "low"
  },
  {
    "id": 9,
    "title": "Wasserstoff-Kernnetz",
    "climateEffect": "Grüner Wasserstoff ersetzt Koks in der Stahl- und Chemieindustrie und macht Prozesswärme CO₂-frei",
    "economyEffect": "Investitionen von rund 20 Milliarden Euro, hohe Unsicherheit über Abnehmer und Wasserstoffpreise",
    "climateScore": 7.6,
    "economyScore": 6.4,
    "description": "Bis 2032 soll ein rund 9.000 Kilometer langes Wasserstoffnetz aus umgewidmeten Erdgasleitungen entstehen. Befürworter sehen darin die Rettung der Stahlindustrie, Kritiker warnen vor einem Milliardengeschäft ohne gesicherte Nachfrage.",
    "severity": "medium"
  },
  {
    "id": 10,
    "title": "Industriestrompreis",
    "climateEffect": "Ein gedeckelter Strompreis hält Produktion im Land und verhindert Verlagerung CO₂-intensiver Herstellung",
    "economyEffect": "Subventionen in Milliardenhöhe, Wettbewerbsverzerrung zwischen Branchen, Budgetbelastung",
    "climateScore": 5.1,
    "economyScore": 7.4,
    "description": "Energieintensive Branchen fordern einen staatlich gedeckelten Industriestrompreis, um im internationalen Wettbewerb zu bestehen. Ökonomen und Klimainstitute streiten, ob die Entlastung Investitionen in Effizienz und Elektrifizierung eher beschleunigt oder ausbremst.",
    "severity": "high"
  },
  {
    "id": 11,
    "title": "Agrarwende und Methan",
    "climateEffect": "Weniger Viehbestand und wiedervernässte Moore könnten mehrere Millionen Tonnen CO₂-Äquivalente jährlich einsparen",
    "economyEffect": "Betriebe mit kleinen Margen, Preisdruck im Handel, Widerstand gegen Vorgaben zur Tierhaltung",
    "climateScore": 6.6,
    "economyScore": 4.4,
    "description": "Landwirtschaft verursacht etwa acht Prozent der deutschen Treibhausgase, vor allem Methan und Lachgas. Die Debatte um Tierhaltungslabel, Moorflächen und Düngeregeln zeigt den Zielkonflikt zwischen Klimaschutz, Tierwohl und Einkommen der Betriebe.",
    "severity": "medium"
  },
  {
    "id": 12,
    "title": "Flächenverbrauch und Versiegelung",
    "climateEffect": "Weniger Überflutungen, mehr Kohlenstoffbindung und kühlere Städte durch entsiegelte Flächen",
    "economyEffect": "Bauland wird knapper, Kommunen verlieren Gewerbeflächen, Grundstückspreise steigen",
    "climateScore": 6.9,
    "economyScore": 4.8,
    "description": "Deutschland verbraucht weiterhin rund 50 Hektar Fläche pro Tag für Siedlungen und Verkehr. Das Ziel von unter 30 Hektar bis 2030 steht in Konkurrenz zu Wohnungsbau, Gewerbegebieten und dem Ausbau der Infrastruktur.",
    "severity": "medium"
  },
  {
    "id": 13,
    "title": "Bahnausbau und Trassenplanung",
    "climateEffect": "Verlagert Verkehr von der Straße auf die Schiene und ist Voraussetzung für mehr Güterverkehr ohne Straßenlast",
    "economyEffect": "Jahrelange Bauarbeiten treffen Pendler und Anwohner, Kostensteigerungen bei Großprojekten",
    "climateScore": 7.2,
    "economyScore": 6.7,
    "description": "Die Sanierung von Knotenpunkten und neue Korridore sollen die Bahn verlässlicher machen. Gleichzeitig bremsen Bauphasen, Klagen und Fachkräftemangel die Umsetzung, während die Branche auf Planungsbeschleunigung drängt.",
    "severity": "medium"
  },
  {
    "id": 14,
    "title": "Lieferkettengesetz und Rohstoffe",
    "climateEffect": "Ökologische Standards in globalen Lieferketten sollen Abholzung und Schadstoffe in Produzentenländern verringern",
    "economyEffect": "Dokumentationspflichten für Unternehmen, Wettbewerbsnachteile gegenüber Anbietern ohne vergleichbare Pflichten",
    "climateScore": 5.6,
    "economyScore": 5.2,
    "description": "Das Lieferkettengesetz verpflichtet Unternehmen, Menschenrechte und Umweltstandards entlang der Kette zu prüfen. Mittelstand und Handel klagen über Bürokratie, während der Zeitplan für kleinere Betriebe politisch wieder in der Diskussion steht.",
    "severity": "low"
  }
];

export const FALLBACK_STATES: StateFallback[] = [
  {
    "id": 1,
    "name": "Bayern",
    "code": "BY",
    "co2PerCapita": 6.8,
    "renewablePercent": 55.1,
    "unemploymentRate": 3,
    "electricityPrice": 30.8,
    "industryShare": 28.5,
    "population": 13369,
    "windCapacityMw": 2850
  },
  {
    "id": 2,
    "name": "Baden-Württemberg",
    "code": "BW",
    "co2PerCapita": 7.2,
    "renewablePercent": 42.4,
    "unemploymentRate": 3.3,
    "electricityPrice": 31.1,
    "industryShare": 34.1,
    "population": 11235,
    "windCapacityMw": 1880
  },
  {
    "id": 3,
    "name": "Nordrhein-Westfalen",
    "code": "NW",
    "co2PerCapita": 12.4,
    "renewablePercent": 28.6,
    "unemploymentRate": 7.2,
    "electricityPrice": 31.5,
    "industryShare": 29.8,
    "population": 18045,
    "windCapacityMw": 5890
  },
  {
    "id": 4,
    "name": "Niedersachsen",
    "code": "NI",
    "co2PerCapita": 9.1,
    "renewablePercent": 74.3,
    "unemploymentRate": 5.4,
    "electricityPrice": 30.4,
    "industryShare": 25.1,
    "population": 8140,
    "windCapacityMw": 12200
  },
  {
    "id": 5,
    "name": "Brandenburg",
    "code": "BB",
    "co2PerCapita": 18.7,
    "renewablePercent": 68.9,
    "unemploymentRate": 6.1,
    "electricityPrice": 29.8,
    "industryShare": 18.4,
    "population": 2570,
    "windCapacityMw": 8100
  },
  {
    "id": 6,
    "name": "Sachsen-Anhalt",
    "code": "ST",
    "co2PerCapita": 14.2,
    "renewablePercent": 61.2,
    "unemploymentRate": 7.5,
    "electricityPrice": 29.5,
    "industryShare": 22.7,
    "population": 2180,
    "windCapacityMw": 5900
  },
  {
    "id": 7,
    "name": "Mecklenburg-Vorpommern",
    "code": "MV",
    "co2PerCapita": 10.8,
    "renewablePercent": 72.1,
    "unemploymentRate": 7.8,
    "electricityPrice": 29.9,
    "industryShare": 14.2,
    "population": 1610,
    "windCapacityMw": 4450
  },
  {
    "id": 8,
    "name": "Schleswig-Holstein",
    "code": "SH",
    "co2PerCapita": 7.4,
    "renewablePercent": 81.3,
    "unemploymentRate": 4.9,
    "electricityPrice": 30.2,
    "industryShare": 18.3,
    "population": 2960,
    "windCapacityMw": 7950
  },
  {
    "id": 9,
    "name": "Hessen",
    "code": "HE",
    "co2PerCapita": 7.8,
    "renewablePercent": 34.2,
    "unemploymentRate": 4.8,
    "electricityPrice": 31.4,
    "industryShare": 24.6,
    "population": 6390,
    "windCapacityMw": 1680
  },
  {
    "id": 10,
    "name": "Rheinland-Pfalz",
    "code": "RP",
    "co2PerCapita": 8.9,
    "renewablePercent": 50.7,
    "unemploymentRate": 4.3,
    "electricityPrice": 30.7,
    "industryShare": 26.2,
    "population": 4140,
    "windCapacityMw": 3780
  },
  {
    "id": 11,
    "name": "Sachsen",
    "code": "SN",
    "co2PerCapita": 9.4,
    "renewablePercent": 43.8,
    "unemploymentRate": 5.9,
    "electricityPrice": 29.6,
    "industryShare": 24.9,
    "population": 4040,
    "windCapacityMw": 1600
  },
  {
    "id": 12,
    "name": "Thüringen",
    "code": "TH",
    "co2PerCapita": 8.7,
    "renewablePercent": 50.4,
    "unemploymentRate": 5.5,
    "electricityPrice": 29.9,
    "industryShare": 24.1,
    "population": 2100,
    "windCapacityMw": 2200
  },
  {
    "id": 13,
    "name": "Saarland",
    "code": "SL",
    "co2PerCapita": 11.5,
    "renewablePercent": 22.8,
    "unemploymentRate": 6.4,
    "electricityPrice": 31.8,
    "industryShare": 31.7,
    "population": 980,
    "windCapacityMw": 540
  },
  {
    "id": 14,
    "name": "Hamburg",
    "code": "HH",
    "co2PerCapita": 9.8,
    "renewablePercent": 18.4,
    "unemploymentRate": 5.7,
    "electricityPrice": 33.1,
    "industryShare": 20.8,
    "population": 1892,
    "windCapacityMw": 88
  },
  {
    "id": 15,
    "name": "Bremen",
    "code": "HB",
    "co2PerCapita": 14.3,
    "renewablePercent": 21,
    "unemploymentRate": 9.6,
    "electricityPrice": 32.4,
    "industryShare": 28.5,
    "population": 685,
    "windCapacityMw": 42
  },
  {
    "id": 16,
    "name": "Berlin",
    "code": "BE",
    "co2PerCapita": 5.6,
    "renewablePercent": 12.1,
    "unemploymentRate": 8.3,
    "electricityPrice": 33.8,
    "industryShare": 12.4,
    "population": 3669,
    "windCapacityMw": 35
  }
];
