import { Link } from "@tanstack/react-router";
import { BookHeart, Calculator, Users, CalendarHeart, ShieldCheck, Home, MessageCircleHeart } from "lucide-react";
import logoAsset from "@/assets/firez-logo.png.asset.json";
import { EmberFloating } from "@/components/Ember";
import { EmberWelcome } from "@/components/EmberWelcome";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/ember", label: "Ask Ember", icon: MessageCircleHeart },
  { to: "/knowledge", label: "Learn", icon: BookHeart },
  { to: "/simulator", label: "Simulate", icon: Calculator },
  { to: "/community", label: "Community", icon: Users },
  { to: "/events", label: "Events", icon: CalendarHeart },
  { to: "/data", label: "Your data", icon: ShieldCheck },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logoAsset.url} alt="FIREz flame logo" width={816} height={816} className="h-8 w-8 object-contain" />
      <span className="font-display text-xl font-bold tracking-tight">
        FIRE<span className="text-primary-foreground/80">z</span>
      </span>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&.active]:bg-peach [&.active]:text-peach-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 hidden border-t border-border/60 px-4 py-10 md:block">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted-foreground">
          <Logo />
          <p>Financial Independence, Retire Early — for Gen Z, made in Zürich.</p>
          <p>Educational content only. FIREz does not give personalised investment advice.</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1.5">
          {nav.map((item) => (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold text-muted-foreground transition-colors [&.active]:bg-mint [&.active]:text-mint-foreground"
              >
                <item.icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <EmberWelcome />

      <EmberFloating
        messages={[
          "Hi Sarah! You don't need 20'000 CHF to start. 20 CHF a month is a real beginning.",
          "Slow and steady wins. That's literally my whole brand.",
          "Crashes are scary, I know. Time in the market is your comfort blanket.",
          "Your 3a contribution lowers your Zürich tax bill. Free money, basically.",
          "You've looked at your money today. That's already more than most people do.",
        ]}
      />
    </div>
  );
}
