import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Marquee } from "@/components/Marquee";
import { InspirationCard } from "@/components/InspirationCard";
import { BookingDialog } from "@/components/BookingDialog";
import { Button } from "@/components/ui/button";
import { EVENT_TYPES, slugify, unslug } from "@/lib/kay";
import { inspirationsQuery } from "@/lib/queries";

export const Route = createFileRoute("/events/$type")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(inspirationsQuery(unslug(params.type))),
  head: ({ params }) => {
    const t = unslug(params.type);
    return {
      meta: [
        { title: `${t} Inspirations — Kay Events` },
        { name: "description", content: `${t} decor inspirations with budget plans, prices and setup times from Kay Events.` },
        { property: "og:title", content: `${t} Inspirations — Kay Events` },
        { property: "og:description", content: `Browse and book ${t.toLowerCase()} setups by Kay Events.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventPage,
});

function EventPage() {
  const { type } = Route.useParams();
  const eventType = unslug(type);
  const { data } = useSuspenseQuery(inspirationsQuery(eventType));

  return (
    <main>
      <Marquee />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((t) => (
            <Link
              key={t}
              to="/events/$type"
              params={{ type: slugify(t) }}
              className={`rounded-full border px-4 py-1 text-sm ${t === eventType ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}
            >
              {t}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Inspirations</p>
            <h1 className="font-display text-5xl text-burgundy">{eventType}</h1>
          </div>
          <BookingDialog eventType={eventType} trigger={<Button size="lg">Request / Book a {eventType}</Button>} />
        </div>
        {data.length === 0 ? (
          <p className="mt-12 rounded-2xl bg-secondary p-10 text-center text-muted-foreground">
            New {eventType.toLowerCase()} inspirations are coming soon — request a custom design above.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {data.map((i) => <InspirationCard key={i.id} insp={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
