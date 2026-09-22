import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, HeartHandshake, LineChart } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmberNote } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-women.jpg";
import woman1 from "@/assets/woman-1.jpg";
import woman2 from "@/assets/woman-2.jpg";
import woman3 from "@/assets/woman-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIREz — Start investing in Zürich with 20 CHF a month" },
      {
        name: "description",
        content:
          "FIREz is a soft, pastel finance app for early-career women in Switzerland. Learn the 3-pillar system, simulate your future, and meet mentors.",
      },
      { property: "og:title", content: "FIREz — Financial independence for Gen Z women in Zürich" },
      {
        property: "og:description",
        content: "You don't need 20'000 CHF to start. Learn, simulate and grow with Ember, your pastel finance buddy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pillars = [
  {
    icon: Sparkles,
    tone: "bg-peach text-peach-foreground",
    title: "Learn softly",
    text: "AHV, BVG and 3a explained in a few calm taps — no jargon, no panic.",
    to: "/knowledge" as const,
  },
  {
    icon: LineChart,
    tone: "bg-mint text-mint-foreground",
    title: "See your future",
    text: "Move a slider, watch 20 CHF a month grow. Tax savings included.",
    to: "/simulator" as const,
  },
  {
    icon: HeartHandshake,
    tone: "bg-lavender text-lavender-foreground",
    title: "Never alone",
    text: "Mentors from 50+ women, workshops by level, and honest stories.",
    to: "/community" as const,
  },
];

function Index() {
  return (
    <Layout>
      <section className="bg-dawn">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Build the wealth to lead life on your terms.
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg">
              FIREz is the gentlest place to start investing in Switzerland. Ember, your tortoise
              buddy, walks with you — slowly, calmly, all the way.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/onboarding">
                  Meet Ember <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link to="/simulator">Try the simulator</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-3">
                {[woman1, woman2, woman3].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="FIREz member"
                    loading="lazy"
                    width={640}
                    height={640}
                    className="h-10 w-10 rounded-full border-2 border-card object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/70">4'200 women started with under 50 CHF/month.</p>
            </div>
          </div>
          <img
            src={hero}
            alt="Three young women of diverse backgrounds laughing together in a bright Zürich apartment"
            width={1280}
            height={960}
            className="rounded-4xl object-cover shadow-[var(--shadow-float)]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <EmberNote tone="mint">
          Hi, I'm Ember. I'm slow on purpose. Money grows the same way — and that's exactly why it
          works.
        </EmberNote>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="soft-card group p-6 transition-transform hover:-translate-y-1"
            >
              <span className={`inline-grid h-12 w-12 place-items-center rounded-2xl ${p.tone}`}>
                <p.icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-4 text-xl font-bold">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-4xl bg-calm p-6 md:p-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Made for Swiss realities</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "The three pillars",
                d: "AHV covers the basics, BVG comes from your job, 3a is the one you control.",
              },
              {
                t: "Wealth tax & fees",
                d: "We show cantonal wealth tax, TER and stamp duty in plain CHF, not percentages only.",
              },
              {
                t: "Low-rate history",
                d: "Your savings account lost value for years. Investing isn't the risky option — standing still was.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-3xl bg-card/80 p-5">
                <h3 className="font-bold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
