/**
 * Chat-Proxy für Green Balance.
 *
 * Nimmt einen Chatverlauf entgegen und antwortet über die OpenAI-kompatible
 * Groq-API. Der Schlüssel liegt als Worker-Secret (GROQ_API_KEY) und taucht
 * nie im Browser auf.
 */
const ALLOWED_ORIGINS = [
  "https://green-balance-klima-wirtschaft-im-g-tau.vercel.app",
  "https://rintuchowdory.github.io",
  "http://localhost:5173",
  "http://localhost:3000",
];

const SYSTEM_PROMPT = `Du bist der Assistent von Green Balance, einer deutschen Bildungsseite zu den
Zielkonflikten zwischen Klimaschutz und Wirtschaft in Deutschland. Antworte auf Deutsch,
sachlich und knapp (hoechstens 180 Woerter). Nenne bei Bedarf Zahlen, aber erfinde keine
Statistiken: wenn du etwas nicht sicher weisst, sage das. Bleibe beim Thema Klima, Energie,
Industrie, Arbeitsplaetze und Politik in Deutschland. Verweise auf die Seiten der Website
(Uebersicht, Dashboard, Konflikt-Atlas, Bundeslaender, Meinungen, Simulator), wenn das hilft.`;

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(request) },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }
    if (url.pathname === "/health") {
      return json({ ok: true, model: env.GROQ_MODEL || "openai/gpt-oss-120b" }, 200, request);
    }
    if (url.pathname !== "/chat") {
      return json({ error: "Not found" }, 404, request);
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST" }, 405, request);
    }
    if (!env.GROQ_API_KEY) {
      return json({ error: "GROQ_API_KEY fehlt im Worker-Secret" }, 500, request);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Ungueltiges JSON" }, 400, request);
    }

    const incoming = Array.isArray(body?.messages) ? body.messages : [];
    const messages = incoming
      .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    if (messages.length === 0) {
      return json({ error: "Keine Nachricht uebergeben" }, 400, request);
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL || "openai/gpt-oss-120b",
        temperature: 0.4,
        max_tokens: 700,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      return json({ error: "Groq-Fehler", status: groqRes.status, detail: detail.slice(0, 300) }, 502, request);
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return json({ error: "Leere Antwort von Groq" }, 502, request);
    }
    return json({ reply, model: data.model ?? null }, 200, request);
  },
};
