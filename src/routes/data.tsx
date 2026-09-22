import { createFileRoute } from "@tanstack/react-router";
import { Database, Lock, EyeOff, Server, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { EmberNote } from "@/components/Ember";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Where your data lives — FIREz" },
      {
        name: "description",
        content:
          "Plain-language transparency on what FIREz stores, where it is hosted, who can see it, and a one-tap button to delete everything.",
      },
      { property: "og:title", content: "Where your data lives — FIREz" },
      { property: "og:description", content: "Swiss-hosted, never sold, deletable in one tap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DataPage,
});

const rows = [
  {
    icon: Database,
    tone: "bg-mint text-mint-foreground",
    what: "Your answers to Ember",
    where: "Only on this device, in your browser's local storage",
    why: "To pre-fill the simulator so you never retype anything",
    keep: "Until you delete it",
  },
  {
    icon: Server,
    tone: "bg-lavender text-lavender-foreground",
    what: "Account email & login",
    where: "Encrypted servers in Zürich, Switzerland (Swiss data protection law, FADP)",
    why: "So you can sign in and recover your account",
    keep: "While your account is open, then 30 days",
  },
  {
    icon: EyeOff,
    tone: "bg-peach text-peach-foreground",
    what: "Community posts",
    where: "Swiss servers, shown under your chosen display name",
    why: "To run the feed and mentorship matching",
    keep: "Until you delete the post or your account",
  },
  {
    icon: Lock,
    tone: "bg-sky text-sky-foreground",
    what: "Usage analytics",
    where: "Aggregated and anonymised — no individual profiles",
    why: "To see which lessons confuse people",
    keep: "13 months, then deleted",
  },
];

function DataPage() {
  const { reset } = useProfile();

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Where your data lives</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          No small print. Here is everything we hold, why, and how to make it disappear.
        </p>

        <EmberNote tone="mint" className="mt-6">
          We never sell your data, never share it with banks or partners, and never use it to target
          ads at you.
        </EmberNote>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <div key={r.what} className="soft-card p-5">
              <span className={`inline-grid h-10 w-10 place-items-center rounded-2xl ${r.tone}`}>
                <r.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-3 font-display text-lg font-bold">{r.what}</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="font-semibold">Stored</dt>
                  <dd className="text-muted-foreground">{r.where}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Used for</dt>
                  <dd className="text-muted-foreground">{r.why}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Kept for</dt>
                  <dd className="text-muted-foreground">{r.keep}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-4xl bg-dawn p-6">
          <h2 className="font-display text-2xl font-bold">Your rights, any time</h2>
          <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            {[
              "Download a copy of everything we hold",
              "Correct anything that's wrong",
              "Withdraw consent for analytics",
              "Delete your personal information permanently",
            ].map((r) => (
              <li key={r} className="rounded-2xl bg-card/70 px-4 py-3">{r}</li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-full" onClick={() => toast("Your data export is on its way to your inbox.")}>
              Download my data
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg" className="rounded-full">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete my personal information
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-4xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete everything?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes your answers, posts and account data from your device and
                    from our Swiss servers within 30 days. Ember will miss you — but this is your right
                    and it takes one tap.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Keep my data</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-full"
                    onClick={() => {
                      reset();
                      toast("Deleted. Everything on this device is gone.", {
                        description: "Server-side removal completes within 30 days.",
                      });
                    }}
                  >
                    Yes, delete it all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Questions? Write to privacy@firez.ch — a human in Zürich answers within 5 working days.
        </p>
      </div>
    </Layout>
  );
}
