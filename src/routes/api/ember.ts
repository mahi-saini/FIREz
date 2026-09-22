import { createFileRoute } from "@tanstack/react-router";
import { EMBER_SYSTEM_PROMPT } from "@/lib/ember-prompt";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/ember")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Ember is not connected yet." }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const body = (await request.json()) as { messages?: Msg[]; context?: string };
        const messages = (body.messages ?? []).slice(-24).filter((m) => typeof m.content === "string");

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "google/gemini-3.6-flash",
            stream: true,
            messages: [
              { role: "system", content: EMBER_SYSTEM_PROMPT },
              ...(body.context
                ? [{ role: "system", content: `What the user already told FIREz (use it, but confirm gently rather than assuming): ${body.context}` }]
                : []),
              ...messages,
            ],
          }),
        });

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => "");
          const message =
            res.status === 429
              ? "Ember is a little busy right now — please try again in a moment."
              : res.status === 402
                ? "Ember's AI credits have run out. The FIREz team needs to top them up."
                : text || "Ember could not answer just now.";
          return new Response(JSON.stringify({ error: message }), {
            status: res.status,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(res.body, {
          headers: {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            connection: "keep-alive",
          },
        });
      },
    },
  },
});
