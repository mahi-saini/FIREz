import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Sparkles, Gift } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmberNote } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import woman1 from "@/assets/woman-1.jpg";
import woman2 from "@/assets/woman-2.jpg";
import woman3 from "@/assets/woman-3.jpg";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community & Mentorship — FIREz" },
      {
        name: "description",
        content:
          "A safe space for women investing in Switzerland: honest stories, success stories, and 1-on-1 mentorship across life stages.",
      },
      { property: "og:title", content: "Community & Mentorship — FIREz" },
      { property: "og:description", content: "Share, learn and get matched with a mentor who's been there." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

const seedPosts = [
  {
    name: "Nadia, 24 · Zürich",
    img: woman2,
    tone: "bg-mint",
    text: "I started with 20 CHF into a 3a fund. Six months later it's 140 CHF and I no longer avoid opening my banking app.",
    likes: 84,
  },
  {
    name: "Amara, 31 · Basel",
    img: woman1,
    tone: "bg-lavender",
    text: "Took 14 months of maternity leave. Topped my 3a back up over two years. The gap was smaller than my fear.",
    likes: 132,
  },
  {
    name: "Leila, 62 · Bern",
    img: woman3,
    tone: "bg-peach",
    text: "Nobody taught me this at 25. Mentoring three of you this year is my way of fixing that.",
    likes: 201,
  },
];

const successStories = [
  { name: "Amara", img: woman1, stat: "CHF 96'000", text: "Built from 150 CHF/month over 12 years while working part-time." },
  { name: "Nadia", img: woman2, stat: "CHF 1'640", text: "Nine months in, from a 2'100 CHF salary. Proof that the start is the hard part." },
  { name: "Leila", img: woman3, stat: "CHF 410'000", text: "Retired at 61 on a drawdown plan she built herself after her divorce." },
];

const tiers = [
  {
    tone: "bg-mint text-mint-foreground",
    stage: "Early Career · 20s",
    focus: ["Budgeting that doesn't hurt", "Emergency fund first", "Entry ETFs", "Opening Pillar 3a"],
  },
  {
    tone: "bg-lavender text-lavender-foreground",
    stage: "Mid-Life · 30s–40s",
    focus: ["Career breaks", "Maternity pension impact", "Property in Switzerland", "Direct equities"],
  },
  {
    tone: "bg-peach text-peach-foreground",
    stage: "Wealth Preservation · 50+",
    focus: ["Drawdown strategies", "Estate & inheritance", "Pension withdrawal timing", "Mentoring others"],
  },
];

function Community() {
  const [posts, setPosts] = useState(seedPosts);
  const [draft, setDraft] = useState("");

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">You're not doing this alone</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Real women, real numbers, zero flexing. Anonymous by default.
        </p>

        <EmberNote tone="peach" className="mt-6">
          Reading other people's beginnings is the fastest cure for “I'm too late”.
        </EmberNote>

        <Tabs defaultValue="feed" className="mt-8">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="feed" className="rounded-full">Feed</TabsTrigger>
            <TabsTrigger value="stories" className="rounded-full">Success stories</TabsTrigger>
            <TabsTrigger value="mentor" className="rounded-full">Mentorship</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6 space-y-4">
            <div className="soft-card p-5">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share a small win or an honest worry…"
                className="min-h-24 rounded-2xl"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  className="rounded-full"
                  disabled={!draft.trim()}
                  onClick={() => {
                    setPosts([
                      { name: "You · Zürich", img: woman2, tone: "bg-sky", text: draft.trim(), likes: 0 },
                      ...posts,
                    ]);
                    setDraft("");
                  }}
                >
                  Share gently
                </Button>
              </div>
            </div>

            {posts.map((p, i) => (
              <article key={i} className={`rounded-4xl p-5 ${p.tone}`}>
                <div className="flex items-center gap-3">
                  <img src={p.img} alt="" loading="lazy" width={640} height={640} className="h-11 w-11 rounded-full object-cover" />
                  <p className="text-sm font-bold">{p.name}</p>
                </div>
                <p className="mt-3 leading-relaxed">{p.text}</p>
                <div className="mt-4 flex gap-4 text-sm font-semibold opacity-70">
                  <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" /> {p.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" /> Reply</span>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="stories" className="mt-6 grid gap-4 md:grid-cols-3">
            {successStories.map((s) => (
              <div key={s.name} className="soft-card overflow-hidden">
                <img src={s.img} alt={`${s.name}, FIREz member`} loading="lazy" width={640} height={640} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <p className="font-display text-2xl font-bold">{s.stat}</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.name}'s portfolio</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="mentor" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {tiers.map((t) => (
                <div key={t.stage} className={`rounded-4xl p-5 ${t.tone}`}>
                  <h2 className="font-display text-lg font-bold">{t.stage}</h2>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {t.focus.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="soft-card p-6">
              <h2 className="font-display text-xl font-bold">Life Stage Pass-It-On</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Each member is matched one tier up: 20s pair with 30s–40s, who pair with 50+. You
                receive guidance and pass it down when you're ready.
              </p>
              <div className="mt-4 rounded-3xl bg-butter p-5 text-butter-foreground">
                <span className="inline-flex items-center gap-2 text-sm font-bold">
                  <Gift className="h-4 w-4" /> For mentors 50+
                </span>
                <p className="mt-2 text-sm">
                  Mentor one younger member per quarter and receive free access to advanced workshops,
                  the annual legacy-planning masterclass and our seasonal mentor dinners in Zürich.
                </p>
                <Button className="mt-4 rounded-full">Become a mentor</Button>
              </div>
              <Button variant="secondary" className="mt-4 rounded-full">Find me a mentor</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
