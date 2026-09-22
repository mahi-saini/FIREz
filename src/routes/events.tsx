import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarHeart, MapPin, Sparkles, ShieldAlert, Info, Check } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { EmberAvatar, EmberNote } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import img3a from "@/assets/event-3a.jpg";
import imgBudget from "@/assets/event-budget.jpg";
import imgEtf from "@/assets/event-etf.jpg";
import imgMaternity from "@/assets/event-maternity.jpg";
import imgDrawdown from "@/assets/event-drawdown.jpg";
import imgEstate from "@/assets/event-estate.jpg";


export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events, Workshops & Partners — FIREz" },
      {
        name: "description",
        content:
          "Monthly workshops grouped by financial readiness level, an AI event matcher, and unbiased partner comparison cards for VIAC, finpension, Swissquote, ZKB and UBS.",
      },
      { property: "og:title", content: "Events, Workshops & Partners — FIREz" },
      { property: "og:description", content: "Find the workshop that fits where you actually are today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Events,
});

const levels = [
  { id: 1, name: "Level 1 · Novice", tone: "bg-mint text-mint-foreground" },
  { id: 2, name: "Level 2 · Active Accumulator", tone: "bg-lavender text-lavender-foreground" },
  { id: 3, name: "Level 3 · Legacy Planner", tone: "bg-peach text-peach-foreground" },
];

const events = [
  {
    level: 1,
    title: "Your first 3a account, together",
    date: "Tue 14 Oct · 18:30",
    place: "Kreis 4, Zürich",
    host: "FIREz",
    img: img3a,
    about: "We open a Pillar 3a account together, step by step, on your own phone. Bring your ID and a snack — you leave with it done.",
    expect: ["90 minutes, small group", "No maths, we click through it live", "Free, tea included"],
  },
  {
    level: 1,
    title: "Budgeting on 2k CHF in Zürich",
    date: "Sat 18 Oct · 10:00",
    place: "Online",
    host: "FIREz",
    img: imgBudget,
    about: "A calm morning where we build a simple monthly plan for a small Zürich salary — rent, health insurance, fun, and the little bit that gets invested.",
    expect: ["60 minutes on video", "You get a filled-in budget sheet", "Cameras optional"],
  },
  {
    level: 2,
    title: "ETF portfolios & currency risk",
    date: "Thu 23 Oct · 19:00",
    place: "Enge, Zürich",
    host: "Swissquote (partner)",
    img: imgEtf,
    about: "What an ETF actually holds, why CHF vs USD matters, and how to pick one mix you can leave alone for years.",
    expect: ["2 hours with a live demo", "Fees compared in CHF, not percentages", "No products sold in the room"],
  },
  {
    level: 2,
    title: "Maternity leave & your 2nd pillar",
    date: "Wed 5 Nov · 18:00",
    place: "Online",
    host: "FIREz",
    img: imgMaternity,
    about: "What happens to your pension during leave or part-time years, and the small moves that close the gap later.",
    expect: ["75 minutes, Q&A at the end", "Real numbers for a 2k–5k salary", "Babies very welcome"],
  },
  {
    level: 3,
    title: "Drawdown & withdrawal timing",
    date: "Tue 11 Nov · 17:30",
    place: "Paradeplatz, Zürich",
    host: "ZKB (partner)",
    img: imgDrawdown,
    about: "How to take money out without a big tax bill: staggered 3a withdrawals, pension vs lump sum, and how long the money lasts.",
    expect: ["2 hours, seated workshop", "Worked examples on paper", "Bring your pension statement"],
  },
  {
    level: 3,
    title: "Estate planning for women",
    date: "Sat 22 Nov · 10:00",
    place: "Oerlikon, Zürich",
    host: "FIREz",
    img: imgEstate,
    about: "Wills, marital property and passing things on in Switzerland — explained kindly, without legal jargon.",
    expect: ["Half day with a break", "Checklist to take home", "Partners welcome"],
  },
];


const partners = [
  { name: "VIAC", ter: "0.44% all-in", custody: "Included", stamp: "None (fund level)", risks: "Currency (unhedged equity), 3a lock-in until 5 yrs before AHV age" },
  { name: "finpension", ter: "0.39% all-in", custody: "Included", stamp: "None on institutional funds", risks: "Volatility up to 99% equity, 3a withdrawal restrictions" },
  { name: "Swissquote", ter: "0.10–0.25% (ETF)", custody: "0.085%/yr, min CHF 20/quarter", stamp: "0.075% CH / 0.15% foreign", risks: "Currency conversion spread, self-directed decisions" },
  { name: "ZKB", ter: "0.45–0.95%", custody: "0.20%/yr", stamp: "Standard Swiss stamp duty", risks: "Higher fee drag, advisory product bias" },
  { name: "UBS", ter: "0.60–1.20%", custody: "0.25%/yr", stamp: "Standard Swiss stamp duty", risks: "Fee drag, structured product complexity, liquidity lockups" },
];

type Msg = { from: "ember" | "you"; text: string };

const quiz = [
  { q: "How would you feel if your money dropped 20% in a month?", a: ["I'd panic", "Uneasy but hold", "I'd buy more"] },
  { q: "Which age group are you in?", a: ["18–29", "30–49", "50+"] },
  { q: "What's your main goal right now?", a: ["Just start", "Grow faster", "Protect & pass on"] },
];

function Matcher() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ember", text: "Three quick questions and I'll find your track and a mentor. No wrong answers." },
    { from: "ember", text: quiz[0]!.q },
  ]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const answer = (a: string, i: number) => {
    const nextScore = score + i;
    const next = step + 1;
    const add: Msg[] = [{ from: "you", text: a }];
    if (next < quiz.length) {
      add.push({ from: "ember", text: quiz[next]!.q });
    } else {
      const level = nextScore <= 2 ? 1 : nextScore <= 4 ? 2 : 3;
      const info = levels.find((l) => l.id === level)!;
      add.push({
        from: "ember",
        text: `You're ${info.name}. I've suggested the matching workshop track below and paired you with a mentor one life stage ahead who started where you are.`,
      });
    }
    setMsgs((m) => [...m, ...add]);
    setScore(nextScore);
    setStep(next);
  };

  return (
    <div className="soft-card p-5">
      <div className="flex items-center gap-2">
        <EmberAvatar className="h-10 w-10 animate-float" />
        <h2 className="font-display text-lg font-bold">Ember's event matcher</h2>
      </div>
      <div className="mt-4 space-y-2">
        {msgs.map((m, i) => (
          <p
            key={i}
            className={`max-w-[85%] animate-pop rounded-3xl px-4 py-2.5 text-sm ${
              m.from === "ember"
                ? "bg-lavender text-lavender-foreground rounded-tl-md"
                : "ml-auto bg-mint text-mint-foreground rounded-tr-md"
            }`}
          >
            {m.text}
          </p>
        ))}
      </div>
      {step < quiz.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {quiz[step]!.a.map((a, i) => (
            <Button key={a} size="sm" variant="secondary" className="rounded-full" onClick={() => answer(a, i)}>
              {a}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function Events() {
  const [level, setLevel] = useState<number | null>(null);
  const [active, setActive] = useState<(typeof events)[number] | null>(null);
  const shown = level ? events.filter((e) => e.level === level) : events;


  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Workshops for where you are</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Filtered by readiness, not by date. Come to a Level 1 evening even if you've never bought
          anything.
        </p>

        <EmberNote tone="sky" className="mt-6">
          Most first-timers pick Level 1 and bring a friend. Tea and zero jargon guaranteed.
        </EmberNote>

        <Tabs defaultValue="events" className="mt-8">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="events" className="rounded-full">Events</TabsTrigger>
            <TabsTrigger value="matcher" className="rounded-full">Match me</TabsTrigger>
            <TabsTrigger value="partners" className="rounded-full">Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLevel(null)}
                className={`rounded-full border border-border px-4 py-2 text-sm font-semibold ${level === null ? "bg-butter text-butter-foreground border-transparent" : ""}`}
              >
                All levels
              </button>
              {levels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`rounded-full border border-border px-4 py-2 text-sm font-semibold ${level === l.id ? `${l.tone} border-transparent` : ""}`}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {shown.map((e) => {
                const tone = levels.find((l) => l.id === e.level)!;
                return (
                  <button
                    key={e.title}
                    onClick={() => setActive(e)}
                    className="soft-card overflow-hidden text-left transition-transform hover:-translate-y-1"
                  >
                    <img
                      src={e.img}
                      alt={`Women at the workshop ${e.title}`}
                      loading="lazy"
                      width={768}
                      height={512}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tone.tone}`}>
                        {tone.name}
                      </span>
                      <h2 className="mt-3 font-display text-lg font-bold">{e.title}</h2>
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarHeart className="h-4 w-4" /> {e.date}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {e.place} · {e.host}
                      </p>
                      <span className="mt-4 inline-flex rounded-full bg-mint px-4 py-2 text-sm font-semibold text-mint-foreground">
                        See what to expect
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
              <DialogContent className="max-w-lg rounded-4xl">
                {active && (
                  <>
                    <img
                      src={active.img}
                      alt={`Women at the workshop ${active.title}`}
                      loading="lazy"
                      width={768}
                      height={512}
                      className="h-44 w-full rounded-3xl object-cover"
                    />
                    <DialogHeader>
                      <DialogTitle className="font-display text-xl">{active.title}</DialogTitle>
                      <DialogDescription className="text-sm leading-relaxed">
                        {active.about}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-3xl bg-sky p-4 text-sm text-sky-foreground">
                      <p className="font-bold">What to expect</p>
                      <ul className="mt-2 space-y-1.5">
                        {active.expect.map((x) => (
                          <li key={x} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0" /> {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarHeart className="h-4 w-4" /> {active.date} · {active.place}
                    </p>
                    <Button
                      className="rounded-full"
                      onClick={() => {
                        toast.success("Seat saved — Ember will remind you", {
                          description: `${active.title} · ${active.date}`,
                        });
                        setActive(null);
                      }}
                    >
                      Save my seat
                    </Button>
                  </>
                )}
              </DialogContent>
            </Dialog>

          </TabsContent>

          <TabsContent value="matcher" className="mt-6">
            <Matcher />
          </TabsContent>

          <TabsContent value="partners" className="mt-6 space-y-4">
            <div className="rounded-4xl bg-calm p-5">
              <span className="inline-flex items-center gap-2 text-sm font-bold">
                <ShieldAlert className="h-4 w-4" /> Independent sponsorship model
              </span>
              <p className="mt-2 text-sm leading-relaxed">
                Membership fees fund FIREz. Sponsor money pays only for room hire and catering and
                never influences rankings, recommendations or curriculum. Partners cannot sell during
                workshops, and every partner completes the same standardized comparison card below.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {partners.map((p) => (
                <div key={p.name} className="soft-card p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold">{p.name}</h2>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                      Self-declared
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4 rounded-2xl bg-mint px-3 py-2 text-mint-foreground">
                      <dt className="font-semibold">TER</dt>
                      <dd className="text-right">{p.ter}</dd>
                    </div>
                    <div className="flex justify-between gap-4 rounded-2xl bg-sky px-3 py-2 text-sky-foreground">
                      <dt className="font-semibold">Custody fees</dt>
                      <dd className="text-right">{p.custody}</dd>
                    </div>
                    <div className="flex justify-between gap-4 rounded-2xl bg-lavender px-3 py-2 text-lavender-foreground">
                      <dt className="font-semibold">Stamp & conversion</dt>
                      <dd className="text-right">{p.stamp}</dd>
                    </div>
                    <div className="rounded-2xl bg-blush px-3 py-2 text-blush-foreground">
                      <dt className="font-semibold">Key risks</dt>
                      <dd className="mt-1">{p.risks}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <p className="flex items-start gap-2 rounded-3xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Disclosure matrix: partners marked “(partner)” pay a flat annual venue contribution. FIREz
              receives no commission, revenue share or referral fee on any product you open. Figures are
              provider-declared and last verified quarterly.
            </p>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> New workshops are added at the start of every month.
        </div>
      </div>
    </Layout>
  );
}
