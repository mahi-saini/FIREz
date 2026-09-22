import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { EmberAvatar } from "@/components/Ember";
import { useProfile, goalOptions, toggleGoal, type Profile } from "@/lib/profile";

const chip =
  "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted";
const chipOn = "bg-peach text-peach-foreground border-transparent";

type Step = {
  q: (name: string) => string;
  note: string;
  body: React.ReactNode;
};

export function EmberWelcome() {
  const { profile, update, hydrated } = useProfile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const selectedGoals = profile.goals ?? [];

  useEffect(() => {
    if (!hydrated || profile.welcomed) return;
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, [hydrated, profile.welcomed]);

  const steps: Step[] = [
    {
      q: () => "Hi! I'm Ember 🐢 What should I call you?",
      note: "So lovely to meet you. I'll keep everything just between us — on your device.",
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
      q: (n) => `Nice to meet you, ${n || "friend"}! Have you ever invested before?`,
      note:
        profile.investedBefore === "never"
          ? "That's completely okay! 68% of the women who join FIREz have never invested either. You're in wonderful company. 🌱"
          : profile.investedBefore === "a-little"
            ? "That already puts you ahead of most people your age. We'll build on it gently."
            : profile.investedBefore === "regularly"
              ? "Wonderful — then we'll skip the basics and go straight to growing what you've started."
              : "There is no wrong answer here. Honestly.",
      body: (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["never", "Never — and it scares me a bit"],
              ["a-little", "A little, here and there"],
              ["regularly", "Yes, regularly"],
            ] as [Profile["investedBefore"], string][]
          ).map(([v, l]) => (
            <button
              key={v}
              className={`${chip} ${profile.investedBefore === v ? chipOn : ""}`}
              onClick={() => update({ investedBefore: v })}
            >
              {l}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: () => "Roughly what lands in your account each month?",
      note:
        profile.income <= 2500
          ? "That's a real income and it's truly enough to start. Most of our community began with less than 3'000 CHF."
          : "Lovely. Whatever the number, it's enough to begin — we start small on purpose.",
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
      q: () => "Last one — what would you love this money to do for you?",
      note:
        "Pick as many as feel true — there's no wrong answer and no promise attached. I'll keep these in mind and cheer you on, gently, every step of the way. 💛",
      body: (
        <div className="flex flex-wrap gap-2">
          {goalOptions.map((g) => (
            <button
              key={g}
              className={`${chip} ${selectedGoals.includes(g) ? chipOn : ""}`}
              onClick={() => update({ goals: toggleGoal(selectedGoals, g) })}
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

  const finish = () => {
    update({ welcomed: true });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : finish())}>
      <DialogContent className="rounded-3xl border-none bg-card p-6 sm:max-w-md">
        <DialogTitle className="sr-only">Welcome to FIREz — a few gentle questions from Ember</DialogTitle>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-mint transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="mt-5 flex items-start gap-3">
          <EmberAvatar className="h-14 w-14 shrink-0 animate-float" />
          <div className="rounded-3xl rounded-tl-md bg-lavender px-5 py-4 text-lavender-foreground">
            <p className="font-display text-lg font-bold leading-snug">{current.q(profile.name)}</p>
          </div>
        </div>

        <div className="mt-4">{current.body}</div>

        <p className="mt-4 rounded-2xl bg-mint px-4 py-3 text-sm leading-relaxed text-mint-foreground">
          {current.note}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline"
            onClick={finish}
          >
            Skip for now
          </button>
          {last ? (
            <Button asChild size="lg" className="rounded-full" onClick={finish}>
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
      </DialogContent>
    </Dialog>
  );
}
