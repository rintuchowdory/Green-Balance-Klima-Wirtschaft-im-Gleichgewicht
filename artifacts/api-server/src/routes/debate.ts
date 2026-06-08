import { Router } from "express";
import { GetDebatePerspectiveBody } from "@workspace/api-zod";

const router = Router();

const perspectives: Record<string, Record<string, { perspective: string; keyPoints: string[] }>> = {
  unternehmer: {
    default: {
      perspective: "Als Unternehmer sehe ich den Klimaschutz als doppeltes Risiko: Einerseits drohen regulatorische Kosten und Wettbewerbsnachteile gegenüber Ländern mit weniger strengen Auflagen. Andererseits bieten die grüne Transformation auch erhebliche Chancen – wer früh investiert, sichert sich Marktanteile in wachsenden Sektoren. Die Herausforderung liegt in der Planungssicherheit: Unternehmen brauchen klare, langfristige politische Rahmenbedingungen, um Investitionsentscheidungen treffen zu können. Kurzfristige politische Kursänderungen, wie beim Heizungsgesetz, schaden dem Wirtschaftsstandort Deutschland nachhaltig.",
      keyPoints: [
        "Planungssicherheit und stabile Rahmenbedingungen sind entscheidend für Investitionen",
        "CO₂-Preise müssen international harmonisiert werden, um Wettbewerbsverzerrungen zu vermeiden",
        "Grüne Technologien bieten echte Marktchancen – Frühzeitige Investitionen zahlen sich aus",
        "Bürokratieabbau bei Genehmigungsverfahren für erneuerbare Energien dringend nötig",
        "Energiepreise in Deutschland gefährden energieintensive Industrien",
      ],
    },
    kohleausstieg: {
      perspective: "Der Kohleausstieg bedeutet für viele Unternehmen in den betroffenen Regionen existenzielle Unsicherheit. Als Unternehmer begrüße ich das Ziel, aber der Zeitplan ist zu ambitioniert. Die Infrastruktur für erneuerbare Energien ist noch nicht ausreichend ausgebaut, und die Energieversorgungssicherheit leidet. Gleichzeitig entstehen neue Geschäftsmöglichkeiten in der Energietransformation – wer sich frühzeitig anpasst, kann profitieren.",
      keyPoints: [
        "Strukturhilfen für betroffene Regionen müssen rechtzeitig und ausreichend fließen",
        "Versorgungssicherheit hat Priorität – kein Ausstieg ohne ausreichende Alternativen",
        "Neue Chancen in Infrastruktur, Wartung und Digitalisierung der Energieversorgung",
        "Internationale Wettbewerbsfähigkeit darf nicht gefährdet werden",
      ],
    },
  },
  arbeitnehmer: {
    default: {
      perspective: "Als Arbeitnehmer stehe ich vor einem Dilemma: Der Klimaschutz ist notwendig, aber die Transformation darf nicht auf Kosten der Beschäftigten gehen. Wir brauchen eine sozial gerechte Gestaltung des Wandels – mit echten Qualifizierungsangeboten, fairen Abfindungen und Umschulungsprogrammen für diejenigen, deren Berufsbilder verschwinden. Die Gewerkschaften spielen hier eine wichtige Rolle. Gleichzeitig entstehen in der grünen Wirtschaft neue, qualifizierte Arbeitsplätze – diese Chancen müssen auch für Arbeitnehmer aus traditionellen Industrien zugänglich sein.",
      keyPoints: [
        "Sozialverträglicher Wandel braucht echte Qualifizierungsprogramme und keine Lippenbekenntnisse",
        "Mitbestimmung der Arbeitnehmer bei der Transformation ist unverzichtbar",
        "Neue grüne Jobs müssen gleich gut bezahlt und absgesichert sein wie die alten",
        "Regionale Strukturhilfen müssen direkt bei den Beschäftigten ankommen",
        "Kurzarbeitergeld-Modelle für Transformationszeiten ausweiten",
      ],
    },
  },
  umweltaktivist: {
    default: {
      perspective: "Die Wissenschaft ist eindeutig: Wir befinden uns mitten in einer Klimakrise, und jedes Jahr des Zögerns erhöht die Kosten für zukünftige Generationen. Die wirtschaftlichen Argumente gegen ambitionierten Klimaschutz sind oft kurzsichtig – sie ignorieren die immensen Kosten von Extremwetterereignissen, Ernteausfällen und gesundheitlichen Schäden durch Luftverschmutzung. Deutschland hat als Industrienation eine besondere Verantwortung und kann gleichzeitig zum Exporteur grüner Technologien werden. Die Frage ist nicht ob, sondern wie schnell wir die Transformation vollziehen.",
      keyPoints: [
        "Die Kosten der Klimakrise übersteigen bereits jetzt die Kosten des Klimaschutzes",
        "1,5-Grad-Ziel erfordert sofortiges und entschlossenes Handeln – kein Vertagen mehr",
        "Deutschland kann grüne Vorreiternation werden und technologische Lösungen exportieren",
        "Klimagerechtigkeit: Ärmere Länder leiden am meisten unter einer Krise, die sie kaum verursacht haben",
        "Greenwashing und halbherzige Maßnahmen reichen nicht – systemischer Wandel ist nötig",
      ],
    },
    kohleausstieg: {
      perspective: "Der Kohleausstieg bis 2038 ist schon ein Kompromiss – wissenschaftlich wäre 2030 notwendig. Jede Tonne Kohle, die noch verbrannt wird, erhöht das CO₂ in der Atmosphäre für Jahrhunderte. Die wirtschaftlichen Kosten sind real, aber sie sind beherrschbar und können durch gezielte Strukturhilfen abgefedert werden. Die Kosten des Nicht-Handelns – Überschwemmungen, Dürren, Hitzewellen – sind dagegen unbeherrschbar.",
      keyPoints: [
        "Kohleausstieg bis 2030 wäre wissenschaftlich geboten, 2038 ist bereits ein Kompromiss",
        "Erneuerbarer Energien können alle Kohlekraftwerke ersetzen – die Technologie ist vorhanden",
        "Klimakosten des Kohlestroms werden der Gesellschaft aufgebürdet, nicht den Produzenten",
      ],
    },
  },
  politiker: {
    default: {
      perspective: "Als Politiker stehe ich täglich vor dem Spannungsfeld zwischen kurzfristigen Wählerinteressen und langfristigen gesellschaftlichen Notwendigkeiten. Klimaschutz ist politisch komplex: Die Kosten sind sofort spürbar, die Vorteile abstrakt und in der Zukunft. Wir brauchen einen breiten gesellschaftlichen Konsens, der verschiedene Interessen ausgleicht. Das bedeutet: Ambitionierte Ziele, aber pragmatische Umsetzung mit sozialen Ausgleichsmechanismen. Deutschland hat mit der Energiewende bewiesen, dass Industrienationen die Transformation schaffen können – wenn der politische Wille vorhanden ist.",
      keyPoints: [
        "Klimapolitik braucht gesellschaftlichen Konsens, der soziale Gerechtigkeit einschließt",
        "Klare, langfristige gesetzliche Rahmenbedingungen schaffen Investitionssicherheit",
        "Internationale Zusammenarbeit und EU-weite Harmonisierung sind unverzichtbar",
        "Kommunikation: Ehrlichkeit über Kosten und Nutzen statt Wahlkampfversprechen",
        "Carbon Border Adjustment Mechanism schützt heimische Industrie vor unfairem Wettbewerb",
      ],
    },
  },
};

router.post("/", (req, res) => {
  const parsed = GetDebatePerspectiveBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request" });

  const { role, topic } = parsed.data;
  const topicKey = topic.toLowerCase().replace(/\s+/g, "");

  const rolePerspectives = perspectives[role] ?? perspectives["politiker"];
  const perspectiveData =
    rolePerspectives[topicKey] ??
    rolePerspectives["default"] ??
    perspectives["politiker"]["default"];

  return res.json({
    role,
    perspective: perspectiveData.perspective,
    keyPoints: perspectiveData.keyPoints,
  });
});

export default router;
