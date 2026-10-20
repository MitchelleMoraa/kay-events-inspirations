import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Marquee } from "@/components/Marquee";
import { Testimonials } from "@/components/Testimonials";
import { ContactLinks } from "@/components/SiteChrome";
import { BookingDialog } from "@/components/BookingDialog";
import { Button } from "@/components/ui/button";
import { EVENT_TYPES, slugify } from "@/lib/kay";
import { testimonialsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kay Events — Weddings, Birthdays & Celebrations" },
      { name: "description", content: "Find event inspirations with budget plans, prices and setup times. Book Kay Events today." },
      { property: "og:title", content: "Kay Events — Book us today" },
      { property: "og:description", content: "Wedding, birthday, baby shower and corporate event styling with clear budgets." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(testimonialsQuery()),
  component: Index,
});

const CARDS = [
  { type: "Wedding", img: "/images/wedding.jpg" },
  { type: "Birthday", img: "/images/birthday.jpg" },
  { type: "Baby Shower", img: "/images/babyshower.jpg" },
  { type: "Corporate", img: "/images/corporate.jpg" },
];

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const matches = EVENT_TYPES.filter((t) => t.toLowerCase().includes(q.toLowerCase()));

  function go(type: string) {
    navigate({ to: "/events/$type", params: { type: slugify(type) } });
  }

  return (
    <main>
      <Marquee />
      <section className="relative overflow-hidden">
        <img src="/images/wedding.jpg" alt="Kay Events wedding arch" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-4xl px-4 py-28 text-center text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Kay Events</p>
          <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">Your celebration, beautifully styled</h1>
          <p className="mx-auto mt-4 max-w-xl opacity-90">Choose your event and explore real inspirations — each with a budget plan, price and setup time.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (matches[0]) go(matches[0]); }}
            className="relative mx-auto mt-8 max-w-xl"
          >
            <div className="flex items-center gap-2 rounded-full bg-card p-2 shadow-elegant">
              <Search className="ml-3 h-5 w-5 text-primary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you celebrating? e.g. Wedding"
                className="flex-1 bg-transparent px-2 py-2 text-foreground outline-none"
                list="event-types"
              />
              <Button type="submit" className="rounded-full">Search</Button>
            </div>
            <datalist id="event-types">{EVENT_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
          </form>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {EVENT_TYPES.map((t) => (
              <button key={t} onClick={() => go(t)} className="rounded-full border border-gold/70 px-4 py-1 text-sm transition hover:bg-gold hover:text-burgundy">
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-4xl text-burgundy">Explore by event</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <Link key={c.type} to="/events/$type" params={{ type: slugify(c.type) }} className="group overflow-hidden rounded-2xl bg-card shadow-elegant">
              <img src={c.img} alt={c.type} loading="lazy" width={1280} height={896} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="flex items-center justify-between p-4">
                <span className="font-display text-xl text-burgundy">{c.type}</span>
                <span className="text-sm text-primary">View →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="bg-baby-pink/60"><Testimonials /></div>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-4xl text-burgundy">Inquiries & support</h2>
        <p className="mt-2 text-muted-foreground">Reach us on any channel — we usually reply the same day.</p>
        <ContactLinks className="mt-6 justify-center" />
        <BookingDialog eventType="Event" trigger={<Button size="lg" className="mt-8">Request an event</Button>} />
      </section>
    </main>
  );
}
