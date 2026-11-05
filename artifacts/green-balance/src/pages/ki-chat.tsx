import { useEffect, useRef, useState } from "react";
import { Bot, Send, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Der Chat laeuft ueber einen Cloudflare Worker, der die Groq-API aufruft.
// Der Schluessel liegt dort als Secret, nicht im Browser.
const CHAT_ENDPOINT =
  (import.meta.env.VITE_CHAT_ENDPOINT as string | undefined) ??
  "https://green-balance-chat.chowdoryrintu.workers.dev";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER = [
  "Warum ist der Kohleausstieg wirtschaftlich so schwierig?",
  "Was würde ein Tempolimit wirklich für das Klima bringen?",
  "Wie hängen Strompreis und Industriearbeitsplätze zusammen?",
];

export default function KiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || pending) return;

    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);

    try {
      const res = await fetch(`${CHAT_ENDPOINT}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.reply !== "string") {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("Groq")
          ? "Der Assistent ist gerade ausgelastet. Bitte in einem Moment nochmal versuchen."
          : "Die Antwort kam nicht an. Bitte Verbindung prüfen und nochmal senden."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          KI-Chat
        </h1>
        <p className="text-muted-foreground text-lg">
          Fragen zu Klima, Wirtschaft und den Konflikten auf dieser Seite. Die Antworten kommen von
          einem Sprachmodell über Groq.
        </p>
      </div>

      <Card className="flex-1">
        <CardContent className="p-5 space-y-4 min-h-[22rem]">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Zum Einstieg ein paar Fragen, die oft gestellt werden:
              </p>
              <div className="flex flex-col gap-2">
                {STARTER.map((question) => (
                  <button
                    key={question}
                    onClick={() => send(question)}
                    className="text-left text-sm rounded-lg border px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto max-w-[85%]"
                  : "bg-muted max-w-[90%]"
              }`}
            >
              {message.content}
            </div>
          ))}

          {pending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Antwort wird erstellt ...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div ref={endRef} />
        </CardContent>
      </Card>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Frage zu Klima und Wirtschaft ..."
          aria-label="Nachricht an den KI-Chat"
          className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          disabled={pending}
        />
        <Button type="submit" disabled={pending || input.trim().length === 0} className="px-4">
          <Send className="w-4 h-4" />
        </Button>
        {messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            disabled={pending}
            aria-label="Gespräch zurücksetzen"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </form>

      <p className="text-xs text-muted-foreground">
        Antworten können falsch sein. Das Modell kennt die Seiten dieser Website, prüft aber keine
        Quellen. Keine personenbezogenen Daten eingeben.
      </p>
    </div>
  );
}
