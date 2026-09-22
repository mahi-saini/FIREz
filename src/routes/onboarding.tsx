import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmberAvatar } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useProfile, riskOf, riskReturn, goalOptions, toggleGoal, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Meet Ember — your gentle FIREz intro" },
      {
        name: "description",
        content: "A soft, chat-like intro where Ember learns about your income, life and goals — no scary forms.",
      },
      { property: "og:title", content: "Meet Ember — your gentle FIREz intro" },
      { property: "og:description", content: "Nine calm questions, pastel tones, zero judgement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const chip =
  "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted";
const chipOn = "bg-peach text-peach-foreground border-transparent";

function Onboarding() {
  const { profile, update } = useProfile();
  const [step, setStep] = useState(0);

  const steps: { q: string; hint: string; body: React.ReactNode }[] = [
    {
      q: "First — what should I call you?",
      hint: "I'll keep it between us.",
      body: (
        <Input
          value={profile.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Sarah"
          className="rounded-2xl"
        />
      ),
    },
    {
      q: "Roughly what lands in your account each month?",
      hint: "There is no number too small. Really.",
      body: (
        <div className="space-y-3">
          <p className="text-3xl font-bold">{profile.income} CHF</p>
          <Slider
            value={[profile.income]}
            min={500}
            max={12000}
            step={100}
            onValueChange={([v = 0]) => update({ income: v })}
          />
        </div>
      ),
    },
    {
      q: "Where do you live?",
      hint: "Rent and taxes differ a lot per canton.",
      body: (
        <div className="flex flex-wrap gap-2">
          {["Zürich", "Bern", "Basel", "Lausanne", "Zug", "Lugano"].map((c) => (
            <button
              key={c}
              className={`${chip} ${profile.city === c ? chipOn : ""}`}
              onClick={() => update({ city: c })}
            >
              {c}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: "Who do you share your everyday costs with?",
      hint: "Living alone in Zürich is expensive — I'll account for it.",
      body: (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["alone", "Just me"],
              ["partner", "With a partner"],
              ["shared", "Flatshare"],
              ["family", "With family"],
            ] as [Profile["living"], string][]
          ).map(([v, l]) => (
            <button
              key={v}
              className={`${chip} ${profile.living === v ? chipOn : ""}`}
              onClick={() => update({ living: v })}
            >
              {l}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: "Children in the picture?",
      hint: "Only so I can show pension gaps honestly later.",
      body: (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["none", "Not for me"],
              ["planning", "Maybe one day"],
              ["have", "Already a mum"],
              ["unsure", "Not sure yet"],
              ["private", "I do not want to answer"],
            ] as [Profile["children"], string][]

          ).map(([v, l]) => (
            <button
              key={v}
              className={`${chip} ${profile.children === v ? chipOn : ""}`}
              onClick={() => update({ children: v })}
            >
              {l}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: "Your rough tax rate?",
      hint: "Not sure? The slider default fits most Zürich salaries under 4k.",
      body: (
        <div className="space-y-3">
          <p className="text-3xl font-bold">{profile.taxRate}%</p>
          <Slider
            value={[profile.taxRate]}
            min={5}
            max={40}
            step={1}
            onValueChange={([v = 0]) => update({ taxRate: v })}
          />
        </div>
      ),
    },
    {
      q: "What matters to you in what you own?",
      hint: "Pick as many as you like.",
      body: (
        <div className="flex flex-wrap gap-2">
          {["Green & ethical", "Women-led companies", "Swiss made", "Low fees above all", "No preference"].map(
            (v) => {
              const on = profile.values.includes(v);
              return (
                <button
                  key={v}
                  className={`${chip} ${on ? chipOn : ""}`}
                  onClick={() =>
                    update({
                      values: on ? profile.values.filter((x) => x !== v) : [...profile.values, v],
                    })
                  }
                >
                  {v}
                </button>
              );
            },
          )}
        </div>
      ),
    },
    {
      q: "How bumpy a ride can you sleep through?",
      hint: "Crashes happen. Choosing calm is completely valid.",
      body: (
        <div className="space-y-3">
          <p className="text-xl font-bold">{riskOf(profile.risk).label}</p>
          <p className="text-sm text-muted-foreground">{riskOf(profile.risk).blurb}</p>
          <Slider
            value={[profile.risk]}
            min={1}
            max={5}
            step={1}
            onValueChange={([v = 0]) => update({ risk: v as Profile["risk"] })}
          />
        </div>
      ),
    },
    {
      q: "Any planned breaks from work?",
      hint: "Maternity leave, a sabbatical, part-time years.",
      body: (
        <div className="space-y-3">
          <p className="text-xl font-bold">
            {profile.breakYears === 0 ? "None planned" : `${profile.breakYears} year(s)`}
          </p>
          <Slider
            value={[profile.breakYears]}
            min={0}
            max={6}
            step={1}
            onValueChange={([v = 0]) => update({ breakYears: v })}
          />
        </div>
      ),
    },
    {
      q: "And finally — what's this all for?",
      hint: "Pick as many as feel true. Dreams are allowed to be specific.",
      body: (
        <div className="flex flex-wrap gap-2">
          {goalOptions.map((g) => (
            <button
              key={g}
              className={`${chip} ${profile.goals.includes(g) ? chipOn : ""}`}
              onClick={() => update({ goals: toggleGoal(profile.goals, g) })}
            >
              {g}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const last = step === steps.length - 1;
  const current = steps[step]!;

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-mint transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="mt-8 flex items-start gap-3">
          <EmberAvatar className="h-14 w-14 shrink-0 animate-float" />
          <div className="rounded-3xl rounded-tl-md bg-lavender px-5 py-4 text-lavender-foreground">
            <h1 className="font-display text-xl font-bold">{current.q}</h1>
            <p className="mt-1 text-sm opacity-80">{current.hint}</p>
          </div>
        </div>

        <div className="soft-card mt-6 p-6">{current.body}</div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="rounded-full"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {last ? (
            <Button asChild size="lg" className="rounded-full">
              <Link to="/simulator">
                <Check className="mr-1 h-4 w-4" /> Let's start building, gently
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="rounded-full" onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Everything you tell Ember stays on your device.{" "}
          <Link to="/data" className="font-semibold underline">
            See exactly where your data lives
          </Link>
          .
        </p>
      </div>
    </Layout>
  );
}
