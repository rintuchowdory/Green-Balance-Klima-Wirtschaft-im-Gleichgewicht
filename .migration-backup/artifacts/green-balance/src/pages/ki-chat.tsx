import { useState, useRef, useEffect } from "react";
import { Bot, Send, Plus, Trash2, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useListOpenaiConversations, useCreateOpenaiConversation, useDeleteOpenaiConversation } from "@workspace/api-client-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

const EXAMPLE_QUESTIONS = [
  "Wie hoch sind Deutschlands CO₂-Emissionen aktuell?",
  "Welche Bundesländer nutzen am meisten erneuerbare Energien?",
  "Was kostet die Energiewende die deutsche Wirtschaft?",
  "Wie viele Jobs schafft die Solarindustrie in Deutschland?",
  "Was sind die größten Konflikte zwischen Klimaschutz und Industrie?",
];

export default function KiChat() {
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversations = [], refetch: refetchConversations } = useListOpenaiConversations();
  const { mutateAsync: createConversation } = useCreateOpenaiConversation();
  const { mutateAsync: deleteConversation } = useDeleteOpenaiConversation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversation(id: number) {
    setSelectedConvId(id);
    const res = await fetch(`/api/openai/conversations/${id}`);
    const data = await res.json();
    setMessages(
      (data.messages ?? []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    );
  }

  async function startNewConversation() {
    const title = `Chat vom ${new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    const conv = await createConversation({ data: { title } });
    await refetchConversations();
    setSelectedConvId(conv.id);
    setMessages([]);
    inputRef.current?.focus();
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    await deleteConversation({ id });
    await refetchConversations();
    if (selectedConvId === id) {
      setSelectedConvId(null);
      setMessages([]);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    let convId = selectedConvId;
    if (!convId) {
      const title = text.slice(0, 60) + (text.length > 60 ? "…" : "");
      const conv = await createConversation({ data: { title } });
      await refetchConversations();
      convId = conv.id;
      setSelectedConvId(convId);
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsStreaming(true);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", streaming: true },
    ]);

    try {
      const res = await fetch(`/api/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(line.slice(6));
            if (json.done) break;
            if (json.content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + json.content,
                  };
                }
                return updated;
              });
            }
          } catch {}
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = { ...last, streaming: false };
        }
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: "Fehler beim Abrufen der Antwort. Bitte versuche es erneut.",
            streaming: false,
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2">
        <button
          onClick={startNewConversation}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Neues Gespräch
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 mt-2">
          <p className="text-xs text-muted-foreground px-2 mb-2 font-medium uppercase tracking-wider">
            Verlauf
          </p>
          {(conversations as Conversation[]).length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">
              Noch keine Gespräche
            </p>
          )}
          {(conversations as Conversation[]).map((conv) => (
            <div
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                selectedConvId === conv.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1 truncate">{conv.title}</span>
              <button
                onClick={(e) => handleDelete(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-card/30 rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">KI-Assistent</h2>
            <p className="text-xs text-muted-foreground">Fragen zu Klima & Wirtschaft in Deutschland</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Wie kann ich helfen?</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Stell mir Fragen zu Klimaschutz, Energiepolitik und wirtschaftlichen Zusammenhängen in Deutschland.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-4 py-2.5 rounded-lg border border-border hover:bg-muted hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-border bg-card/50">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Frag mich etwas über Klimapolitik in Deutschland…"
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground disabled:opacity-50 min-h-[44px] max-h-32"
              style={{ height: "auto" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Enter zum Senden · Shift+Enter für neue Zeile
          </p>
        </div>
      </div>
    </div>
  );
}
