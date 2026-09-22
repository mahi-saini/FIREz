import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PartyPopper, TrendingUp, PiggyBank, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { EmberNote, EmberAvatar } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile, riskOf, riskReturn, projectGrowth, pillar3aSaving, chf, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Your gentle money simulator — FIREz" },
      {
        name: "description",
        content:
          "See what 20 CHF a month becomes, how much tax Pillar 3a saves you, and what a career break really costs your pension.",
      },
      { property: "og:title", content: "Your gentle money simulator — FIREz" },
      { property: "og:description", content: "Calm charts, pastel sliders, real Swiss numbers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulator,
});

function Simulator() {
  const { profile, update } = useProfile();
  const [years, setYears] = useState(35);
  const [breakOn, setBreakOn] = useState(false);
  const [invested, setInvested] = useState(0);

  const rate = riskOf(profile.risk).rate;
  const data = useMemo(
    () => projectGrowth(profile.contribution, years, rate, breakOn ? Math.max(profile.breakYears, 2) : 0),
    [profile.contribution, years, rate, breakOn, profile.breakYears],
  );
  const end = data[data.length - 1]!;
  const gap = end.value - end.withBreak;
  const { capped, saving } = pillar3aSaving(profile.contribution * 12, profile.taxRate);
  const shareOfIncome = ((profile.contribution / profile.income) * 100).toFixed(1);

  const celebrate = () => {
    const n = invested + 1;
    setInvested(n);
    toast(`Ember is doing a happy shell wiggle 🎉`, {
      description: `${chf(profile.contribution)} invested — that's ${n} month${n > 1 ? "s" : ""} in a row. Future you just got a little freer.`,
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Hi {profile.name} — let's explore, gently
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Everything below is already filled in from your chat with Ember. Move anything you like;
          nothing breaks. This is an illustration, not a promise — markets wobble, and that's okay.
        </p>
        {profile.goals.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Growing towards:</span>
            {profile.goals.map((g) => (
              <span
                key={g}
                className="rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-lavender-foreground"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
          {/* Controls */}
          <div className="space-y-4">
            <div className="soft-card space-y-6 p-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-bold">I can put aside each month</label>
                  <span className="font-display text-2xl font-bold">{profile.contribution} CHF</span>
                </div>
                <Slider
                  className="mt-3"
                  value={[profile.contribution]}
                  min={10}
                  max={1000}
                  step={10}
                  onValueChange={([v = 0]) => update({ contribution: v })}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  That's {shareOfIncome}% of your {chf(profile.income)} monthly income. Two coffees a week.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-bold">I'll keep going for</label>
                  <span className="font-display text-2xl font-bold">{years} years</span>
                </div>
                <Slider className="mt-3" value={[years]} min={5} max={45} step={1} onValueChange={([v = 0]) => setYears(v)} />
              </div>

              <div>
                <label className="text-sm font-bold">My comfort level</label>
                <Select
                  value={String(profile.risk)}
                  onValueChange={(v) => update({ risk: Number(v) as Profile["risk"] })}
                >
                  <SelectTrigger className="mt-2 rounded-2xl bg-mint text-mint-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(riskReturn).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v.label} · ~{(v.rate * 100).toFixed(1)}% a year
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">{riskOf(profile.risk).blurb}</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-peach p-4 text-peach-foreground">
                <div>
                  <p className="text-sm font-bold">Simulate a life event</p>
                  <p className="text-xs opacity-80">Maternity leave or part-time years</p>
                </div>
                <Switch checked={breakOn} onCheckedChange={setBreakOn} />
              </div>
            </div>

            <EmberNote tone="lavender">
              Nothing here is locked in. You can pause, lower or stop any month — real life is
              allowed.
            </EmberNote>
          </div>

          {/* Chart + outputs */}
          <div className="space-y-6">
            <div className="soft-card p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">In {years} years you could have</p>
                  <p className="font-display text-4xl font-bold">{chf(breakOn ? end.withBreak : end.value)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You put in {chf(end.contributed)} — the rest, {chf((breakOn ? end.withBreak : end.value) - end.contributed)}, grew on its own.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-mint-foreground">
                  <TrendingUp className="h-4 w-4" /> {riskOf(profile.risk).label}
                </span>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="grow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.75} />
                        <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="paid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}y`}
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(v: number, n) => [chf(v), n === "value" ? "Invested value" : n === "withBreak" ? "With life event" : "Money you paid in"]}
                      labelFormatter={(l) => `Year ${l}`}
                      contentStyle={{
                        borderRadius: 18,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        fontSize: 13,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2.5}
                      fill="url(#grow)"
                    />
                    {breakOn && (
                      <Area
                        type="monotone"
                        dataKey="withBreak"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2.5}
                        strokeDasharray="6 5"
                        fill="none"
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="contributed"
                      stroke="var(--color-chart-3)"
                      strokeWidth={2}
                      fill="url(#paid)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Green = what your money could grow to. Purple = what you actually paid in. Illustrative
                only, not a promise.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-4xl bg-butter p-5 text-butter-foreground">
                <span className="inline-grid h-10 w-10 place-items-center rounded-2xl bg-card/60">
                  <PiggyBank className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-3 font-display text-xl font-bold">Pillar 3a tax saving</h2>
                <p className="mt-1 text-sm">
                  Paying {chf(capped)} a year into 3a at a {profile.taxRate}% marginal rate in {profile.city}:
                </p>
                <p className="mt-3 font-display text-3xl font-bold">{chf(saving)} back / year</p>
                <p className="mt-1 text-sm opacity-80">
                  That's {chf(saving * years)} over {years} years — before it even grows.
                </p>
              </div>

              <div className="rounded-4xl bg-blush p-5 text-blush-foreground">
                <span className="inline-grid h-10 w-10 place-items-center rounded-2xl bg-card/60">
                  <HeartPulse className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-3 font-display text-xl font-bold">Life event impact</h2>
                {breakOn ? (
                  <>
                    <p className="mt-1 text-sm">
                      A {Math.max(profile.breakYears, 2)}-year break from contributing (leave or part-time)
                      leaves a gap of:
                    </p>
                    <p className="mt-3 font-display text-3xl font-bold">{chf(gap)}</p>
                    <p className="mt-1 text-sm opacity-80">
                      Your 2nd pillar pauses too. Restarting later, or topping up 3a afterwards, closes
                      most of it.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm">
                    Flip the switch on the left to see what maternity leave, a sabbatical or part-time
                    years would do to your 2nd and 3rd pillar.
                  </p>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div className="soft-card p-5">
              <div className="flex items-start gap-4">
                <EmberAvatar className="h-14 w-14 animate-float" />
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold">Milestones with Ember</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Every contribution counts as a step toward freedom. {invested} of 12 months this
                    year.
                  </p>
                  <Progress value={(invested / 12) * 100} className="mt-3 h-3" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button className="rounded-full" onClick={celebrate}>
                      <PartyPopper className="mr-1 h-4 w-4" /> I invested {chf(profile.contribution)}
                    </Button>
                    <Button asChild variant="secondary" className="rounded-full">
                      <Link to="/onboarding">Update my details</Link>
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    {["First franc invested", "3 months in a row", "First 1'000 CHF", "3a opened"].map((m, i) => (
                      <span
                        key={m}
                        className={`rounded-full px-3 py-1.5 ${invested > i ? "bg-mint text-mint-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
