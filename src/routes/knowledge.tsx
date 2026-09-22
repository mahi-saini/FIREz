import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sun, Headphones, BookOpen, Play, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmberNote } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import imgPillars from "@/assets/learn-pillars.jpg";
import imgMarket from "@/assets/learn-market.jpg";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Hub & Daily Mindset — FIREz" },
      {
        name: "description",
        content:
          "Short visual lessons on the Swiss three-pillar system, ETFs and strategies, plus daily mindset insights from books, podcasts and TED talks.",
      },
      { property: "og:title", content: "Knowledge Hub & Daily Mindset — FIREz" },
      { property: "og:description", content: "Swiss pensions and investing, explained in calm pastel steps." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Knowledge,
});

const lessons = [
  {
    title: "Pillar 1 — AHV",
    tone: "bg-peach text-peach-foreground",
    minutes: 3,
    progress: 100,
    img: imgPillars,
    alt: "Pastel illustration of three pillars of different heights",
    bars: [
      { label: "AHV covers", value: 35, tone: "bg-peach" },
      { label: "Still missing", value: 65, tone: "bg-muted" },
    ],
    cards: [
      "Everyone working in Switzerland pays into AHV. It's the safety floor, not the dream.",
      "For most people AHV alone replaces roughly 30–40% of their salary.",
      "Gaps in AHV years reduce your pension — a year abroad or unregistered can cost you.",
    ],
  },
  {
    title: "Pillar 2 — BVG",
    tone: "bg-mint text-mint-foreground",
    minutes: 4,
    progress: 45,
    img: imgPillars,
    alt: "Pastel illustration of pension pillars",
    bars: [
      { label: "Full-time saver", value: 100, tone: "bg-mint" },
      { label: "Part-time 50%", value: 38, tone: "bg-sky" },
      { label: "3 years break", value: 24, tone: "bg-blush" },
    ],
    cards: [
      "Your employer's pension fund. It only kicks in above ~22'050 CHF salary per year.",
      "Part-time and multiple small jobs often mean you're barely insured. This hits women hardest.",
      "Career breaks pause contributions — the gap compounds quietly for decades.",
    ],
  },
  {
    title: "Pillar 3a — yours",
    tone: "bg-lavender text-lavender-foreground",
    minutes: 4,
    progress: 0,
    img: imgPillars,
    alt: "Pastel illustration of pension pillars",
    bars: [
      { label: "Left as cash 0.1%", value: 26, tone: "bg-butter" },
      { label: "Invested ~5%", value: 100, tone: "bg-lavender" },
    ],
    cards: [
      "Voluntary, and the one pillar you fully control. Max 7'258 CHF in 2025 if employed.",
      "Every franc you put in is deducted from your taxable income.",
      "You can invest 3a in equity funds — not just leave it as cash at 0.1%.",
    ],
  },
  {
    title: "Stock market, gently",
    tone: "bg-sky text-sky-foreground",
    minutes: 5,
    progress: 0,
    img: imgMarket,
    alt: "Pastel illustration of a gentle upward growth line with plants and coins",
    bars: [
      { label: "Years markets rose", value: 75, tone: "bg-mint" },
      { label: "Years they fell", value: 25, tone: "bg-blush" },
    ],
    cards: [
      "Buying a share means owning a tiny slice of real companies.",
      "An ETF buys thousands of companies at once, so no single one can sink you.",
      "Markets fall around 1 year in 4 — and have always recovered given time.",
    ],
  },
  {
    title: "Strategies without jargon",
    tone: "bg-butter text-butter-foreground",
    minutes: 4,
    progress: 0,
    img: imgMarket,
    alt: "Pastel illustration of coins growing along a rising path",
    bars: [
      { label: "Kept with 0.2% fees", value: 100, tone: "bg-mint" },
      { label: "Kept with 1.5% fees", value: 64, tone: "bg-peach" },
    ],
    cards: [
      "Monthly automatic investing means you never have to 'time' anything.",
      "Fees matter: 1.5% vs 0.2% per year can cost you a small flat over 40 years.",
      "Choose a mix you can sleep with, then leave it alone. Boring is the strategy.",
    ],
  },
];


const daily = [
  {
    icon: BookOpen,
    tone: "bg-peach text-peach-foreground",
    source: "Secrets of the Millionaire Mind",
    text: "“Your income can only grow to the extent that you do.” Today: name one money belief you inherited.",
  },
  {
    icon: BookOpen,
    tone: "bg-lavender text-lavender-foreground",
    source: "Think and Grow Rich",
    text: "Definiteness of purpose beats vague hoping. Write down your number, even if it feels silly.",
  },
  {
    icon: Headphones,
    tone: "bg-mint text-mint-foreground",
    source: "Podcast · 18 min",
    text: "“Investing in Switzerland on a small salary” — how three women started with under 100 CHF.",
  },
  {
    icon: Play,
    tone: "bg-sky text-sky-foreground",
    source: "TED · 12 min",
    text: "Why we're so bad at imagining our future selves — and the trick that fixes it.",
  },
  {
    icon: BookOpen,
    tone: "bg-butter text-butter-foreground",
    source: "The Psychology of Money",
    text: "Wealth is the money you don't see. The car not bought is the freedom quietly stored.",
  },
  {
    icon: BookOpen,
    tone: "bg-mint text-mint-foreground",
    source: "Atomic Habits",
    text: "Make it automatic. A standing order on payday removes willpower from the equation.",
  },
  {
    icon: BookOpen,
    tone: "bg-sky text-sky-foreground",
    source: "Rich Dad Poor Dad",
    text: "An asset feeds you, a liability eats you. Today: sort one thing you own into the right column.",
  },
  {
    icon: BookOpen,
    tone: "bg-peach text-peach-foreground",
    source: "Your Money or Your Life",
    text: "Every purchase costs hours of your life. What did last week's biggest buy cost you in hours?",
  },
  {
    icon: BookOpen,
    tone: "bg-lavender text-lavender-foreground",
    source: "The Millionaire Next Door",
    text: "Most quietly wealthy people look completely ordinary. Boring is allowed to be your plan.",
  },
  {
    icon: Headphones,
    tone: "bg-butter text-butter-foreground",
    source: "Podcast · 24 min",
    text: "Pillar 3a, unpacked: why the tax refund is the closest thing to free money you'll get this year.",
  },
  {
    icon: Headphones,
    tone: "bg-peach text-peach-foreground",
    source: "Podcast · 31 min",
    text: "What actually happens in a crash — told by a woman who kept investing through 2008 and 2020.",
  },
  {
    icon: Headphones,
    tone: "bg-lavender text-lavender-foreground",
    source: "Podcast · 15 min",
    text: "The gender pension gap in Switzerland, explained kindly — and what you can do at 23.",
  },
  {
    icon: Play,
    tone: "bg-mint text-mint-foreground",
    source: "TED · 9 min",
    text: "How to talk about money with friends without it getting weird. Scripts included.",
  },
  {
    icon: Play,
    tone: "bg-sky text-sky-foreground",
    source: "TED · 14 min",
    text: "One life-changing habit: paying your future self first, before anything else leaves your account.",
  },
  {
    icon: Sun,
    tone: "bg-butter text-butter-foreground",
    source: "Mindset · 2 min",
    text: "Nervous is normal. Do the smallest brave thing today: check one fee on an account you already have.",
  },
  {
    icon: Sun,
    tone: "bg-mint text-mint-foreground",
    source: "Mindset · 1 min",
    text: "You are not behind. You're early — you just started noticing.",
  },
];


function LessonCard({ lesson }: { lesson: (typeof lessons)[number] }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  return (
    <div className="soft-card overflow-hidden">
      <img
        src={lesson.img}
        alt={lesson.alt}
        loading="lazy"
        width={768}
        height={512}
        className="h-36 w-full object-cover"
      />
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left ${lesson.tone}`}
      >
        <span>
          <span className="block font-display text-lg font-bold">{lesson.title}</span>
          <span className="text-xs opacity-80">{lesson.minutes} min · {lesson.cards.length} cards</span>
        </span>
        <ChevronRight className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      <div className="px-5 py-4">
        <Progress value={open ? ((i + 1) / lesson.cards.length) * 100 : lesson.progress} className="h-2" />

        <div className="mt-4 space-y-2">
          {lesson.bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>{b.label}</span>
              </div>
              <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${b.tone} transition-all`} style={{ width: `${b.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div className="mt-4 animate-pop">
            <p className="min-h-20 text-sm leading-relaxed">{lesson.cards[i]}</p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                disabled={i === 0}
                onClick={() => setI((v) => v - 1)}
              >
                Back
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                disabled={i === lesson.cards.length - 1}
                onClick={() => setI((v) => v + 1)}
              >
                Next card
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Tiny visual simulation: monthly amount → value over time. */
function MiniSim() {
  const [monthly, setMonthly] = useState(20);
  const years = [5, 10, 20, 30, 40];
  const value = (y: number) => {
    const r = 0.05 / 12;
    const n = y * 12;
    return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r));
  };
  const max = value(40);
  return (
    <div className="soft-card p-5 md:col-span-2">
      <h2 className="font-display text-lg font-bold">Try it: what does {monthly} CHF a month become?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Move the slider. Assumes a calm 5% a year — some years more, some less.
      </p>
      <div className="mt-4 max-w-sm">
        <Slider value={[monthly]} min={20} max={500} step={10} onValueChange={([v = 20]) => setMonthly(v)} />
      </div>
      <div className="mt-6 flex items-end gap-3">
        {years.map((y, idx) => {
          const v = value(y);
          const tones = ["bg-mint", "bg-sky", "bg-lavender", "bg-peach", "bg-butter"];
          return (
            <div key={y} className="flex flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-bold">{v.toLocaleString("de-CH")}</span>
              <div
                className={`w-full rounded-t-2xl transition-all ${tones[idx]}`}
                style={{ height: `${Math.max(10, Math.round((v / max) * 140))}px` }}
              />
              <span className="text-xs text-muted-foreground">{y}y</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function Knowledge() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Learn & feel ready</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Tiny lessons and one calm thought a day. No homework, no shame.
        </p>

        <EmberNote tone="mint" className="mt-6">
          Start with Pillar 3a if you only have five minutes. It's the one that puts money back in
          your pocket this year.
        </EmberNote>

        <Tabs defaultValue="hub" className="mt-8">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="hub" className="rounded-full">
              Knowledge Hub
            </TabsTrigger>
            <TabsTrigger value="daily" className="rounded-full">
              Daily mindset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hub" className="mt-6 grid gap-4 md:grid-cols-2">
            <MiniSim />
            {lessons.map((l) => (
              <LessonCard key={l.title} lesson={l} />
            ))}
          </TabsContent>

          <TabsContent value="daily" className="mt-6">
            <div className="rounded-4xl bg-dawn p-6">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                <Sun className="h-4 w-4" /> Today's insight
              </div>
              <p className="mt-3 font-display text-2xl font-bold leading-snug">
                “The habit is worth more than the amount. 20 CHF every month beats 500 CHF once.”
              </p>
              <p className="mt-2 text-sm opacity-70">Awareness Area · Day 12 of your streak</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {daily.map((d) => (
                <div key={d.source} className="soft-card p-5">
                  <span className={`inline-grid h-10 w-10 place-items-center rounded-2xl ${d.tone}`}>
                    <d.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {d.source}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{d.text}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
