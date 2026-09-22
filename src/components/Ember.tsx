import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import emberImg from "@/assets/ember.png";
import { cn } from "@/lib/utils";

type Tone = "mint" | "peach" | "lavender" | "sky" | "butter";

const toneClass: Record<Tone, string> = {
  mint: "bg-mint text-mint-foreground",
  peach: "bg-peach text-peach-foreground",
  lavender: "bg-lavender text-lavender-foreground",
  sky: "bg-sky text-sky-foreground",
  butter: "bg-butter text-butter-foreground",
};

export function EmberAvatar({ className }: { className?: string }) {
  return (
    <img
      src={emberImg}
      alt="Ember, the pastel tortoise finance buddy"
      loading="lazy"
      width={816}
      height={816}
      className={cn("h-12 w-12 object-contain", className)}
    />
  );
}

/** Inline Ember note — used inside sections as a gentle guide. */
export function EmberNote({
  children,
  tone = "mint",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-3xl px-4 py-3 text-sm leading-relaxed",
        toneClass[tone],
        className,
      )}
    >
      <EmberAvatar className="h-10 w-10 shrink-0 animate-float" />
      <p className="pt-1">{children}</p>
    </div>
  );
}

/**
 * Floating Ember easter egg. Appears after a delay, cycles encouragements,
 * and can be dismissed. Present across the whole app.
 */
export function EmberFloating({ messages }: { messages: string[] }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setOpen(true);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 9000);
    return () => clearTimeout(t);
  }, [open, index]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-50 flex max-w-[min(20rem,calc(100vw-2rem))] flex-col items-end gap-2 md:bottom-8">
      {open && (
        <div className="pointer-events-auto animate-pop rounded-3xl bg-lavender px-4 py-3 text-sm text-lavender-foreground shadow-[var(--shadow-float)]">
          <p className="font-semibold">Ember says</p>
          <p className="mt-1 leading-relaxed">{messages[index % messages.length]}</p>
          <Link to="/ember" className="mt-2 inline-block text-xs font-semibold underline underline-offset-2">
            Chat with me
          </Link>
        </div>
      )}
      <button
        type="button"
        aria-label="Talk to Ember"
        onClick={() => {
          setIndex((i) => i + 1);
          setOpen(true);
        }}
        className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full bg-mint shadow-[var(--shadow-float)] transition-transform hover:scale-105 active:scale-95"
      >
        <EmberAvatar className="h-12 w-12 animate-float" />
      </button>
    </div>
  );
}
