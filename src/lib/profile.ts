import { useCallback, useEffect, useState } from "react";

export type Profile = {
  investedBefore: "never" | "a-little" | "regularly" | "";
  welcomed: boolean;
  name: string;
  income: number;
  city: string;
  living: "alone" | "partner" | "shared" | "family";
  children: "none" | "planning" | "have" | "unsure" | "private";
  taxRate: number;
  values: string[];
  risk: 1 | 2 | 3 | 4 | 5;
  breakYears: number;
  contribution: number;
  goals: string[];
};

export const defaultProfile: Profile = {
  investedBefore: "",
  welcomed: false,
  name: "Sarah",
  income: 2000,
  city: "Zürich",
  living: "alone",
  children: "planning",
  taxRate: 12,
  values: ["Green & ethical"],
  risk: 3,
  breakYears: 0,
  contribution: 20,
  goals: ["Feel safe"],
};

const KEY = "firez.profile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Profile>;
        const clean = Object.fromEntries(
          Object.entries(saved).filter(([, v]) => v !== undefined && v !== null),
        ) as Partial<Profile>;
        setProfile({
          ...defaultProfile,
          ...clean,
          goals: Array.isArray(clean.goals) ? clean.goals : defaultProfile.goals,
          values: Array.isArray(clean.values) ? clean.values : defaultProfile.values,
        });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setProfile(defaultProfile);
  }, []);

  return { profile, update, reset, hydrated };
}

/** Expected annual return by risk level (conservative, long-run assumptions). */
export const riskReturn: Record<number, { label: string; rate: number; blurb: string }> = {
  1: { label: "Very calm", rate: 0.02, blurb: "Mostly cash & bonds. Barely moves, grows slowly." },
  2: { label: "Calm", rate: 0.035, blurb: "Bond-heavy mix with a slice of shares." },
  3: { label: "Balanced", rate: 0.05, blurb: "A classic 60/40 style world portfolio." },
  4: { label: "Growth", rate: 0.06, blurb: "Mostly global shares. Bumpy years happen." },
  5: { label: "Bold", rate: 0.07, blurb: "Fully invested in global equities." },
};

export type Point = { year: number; contributed: number; value: number; withBreak: number };

export function projectGrowth(
  monthly: number,
  years: number,
  rate: number,
  breakYears = 0,
): Point[] {
  const points: Point[] = [];
  let value = 0;
  let withBreak = 0;
  let contributed = 0;
  const breakStart = 8; // simulated career break begins in year 8
  for (let y = 0; y <= years; y++) {
    if (y > 0) {
      const paused = breakYears > 0 && y > breakStart && y <= breakStart + breakYears;
      for (let m = 0; m < 12; m++) {
        value = (value + monthly) * (1 + rate / 12);
        withBreak = (withBreak + (paused ? 0 : monthly)) * (1 + rate / 12);
      }
      contributed += monthly * 12;
    }
    points.push({
      year: y,
      contributed: Math.round(contributed),
      value: Math.round(value),
      withBreak: Math.round(withBreak),
    });
  }
  return points;
}

/** Rough Swiss marginal tax saving from Pillar 3a contributions. */
export function pillar3aSaving(annualContribution: number, taxRate: number) {
  const capped = Math.min(annualContribution, 7258);
  return { capped, saving: Math.round(capped * (taxRate / 100)) };
}

export const chf = (n: number) =>
  new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n);

/** Life goals a user can pick (multi-select) — personalises later insights. */
export const goalOptions = [
  "Feel safe",
  "Travel after retiring",
  "A flat of my own",
  "Freedom to choose",
  "Support my future family",
  "A career break one day",
  "Start something of my own",
  "Give back to causes I love",
] as const;

export function toggleGoal(goals: string[], goal: string) {
  return goals.includes(goal) ? goals.filter((g) => g !== goal) : [...goals, goal];
}

export function riskOf(level: number) {
  return riskReturn[level] ?? riskReturn[3]!;
}
