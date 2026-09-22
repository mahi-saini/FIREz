import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmberAvatar } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile, chf } from "@/lib/profile";

export const Route = createFileRoute("/ember")({
  head: () => ({
    meta: [
      { title: "Ask Ember — your gentle Swiss finance buddy" },
      {
        name: "description",
        content:
          "Chat with Ember, the FIREz finance buddy: Swiss pillars, 3a, ETFs and career breaks explained kindly, with no pressure and no promises.",
      },
      { property: "og:title", content: "Ask Ember — your gentle Swiss finance buddy" },
      {
        property: "og:description",
        content: "Beginner-friendly Swiss money answers, one small step at a time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmberChat,
});

type Msg = { role: "user" | "assistant"; content: string };

const starters = [
  "Understand investing",
  "Explore my retirement future",
  "Build a starting plan",
  "Find a FIREz workshop",
  "Prepare for a life or career change",
];

const greeting: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Ember 🐢 — your FIREz finance buddy. I explain Swiss money things in plain language and help you picture your options, without judgement or pressure.\n\nWhat would you most like help with today?",
};

function render(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={line.trim() === "" ? "h-2" : "leading-relaxed"}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j}>{p.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{p}</span>
          ),
        )}
      </p>
    );
  });
}

function EmberChat() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const context = [
    profile.name && `name: ${profile.name}`,
    `monthly income: ${chf(profile.income)}`,
    `lives in ${profile.city}, ${profile.living}`,
    `investing experience: ${profile.investedBefore || "unknown"}`,
    `risk comfort level: ${profile.risk}/5`,
    profile.breakYears ? `planned break from work: ${profile.breakYears} year(s)` : null,
    (profile.goals ?? []).length ? `goals: ${(profile.goals ?? []).join(", ")}` : null,
    (profile.values ?? []).length ? `values: ${(profile.values ?? []).join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/ember", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1), context }),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Ember could not answer just now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as {
              choices?: { delta?: { content?: string } }[];
            };
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              setMessages([...next, { role: "assistant", content: answer }]);
            }
          } catch {
            /* partial chunk */
          }
        }
      }

      if (!answer) {
        setMessages([
          ...next,
          { role: "assistant", content: "I went quiet there, sorry. Could you ask me again?" },
        ]);
      }
    } catch (e) {
      setMessages(next);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-start gap-3">
          <EmberAvatar className="h-14 w-14 shrink-0 animate-float" />
          <div>
            <h1 className="font-display text-2xl font-bold">Ask Ember</h1>
            <p className="text-sm text-muted-foreground">
              Swiss money, explained kindly. Education only — never advice, never a promise.
            </p>
          </div>
        </div>

        <div className="soft-card mt-6 space-y-4 p-4 sm:p-6">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex items-start gap-3"}>
              {m.role === "assistant" && <EmberAvatar className="mt-1 h-9 w-9 shrink-0" />}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-3xl rounded-br-md bg-peach px-4 py-3 text-sm text-peach-foreground"
                    : "max-w-[90%] space-y-1 rounded-3xl rounded-tl-md bg-lavender px-4 py-3 text-sm text-lavender-foreground"
                }
              >
                {m.role === "assistant" && m.content === "" && busy ? (
                  <p className="animate-pulse">Ember is thinking, slowly and carefully…</p>
                ) : (
                  render(m.content)
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {messages.length === 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-mint hover:text-mint-foreground"
              >
                <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                {s}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-2xl bg-butter px-4 py-3 text-sm text-butter-foreground">{error}</p>
        )}

        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Ember anything about money in Switzerland…"
            className="rounded-full"
          />
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-full" disabled={busy}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Ember is an educational guide, not a financial adviser. Chats stay on your device.
        </p>
      </div>
    </Layout>
  );
}
