import { useSuspenseQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { testimonialsQuery } from "@/lib/queries";

export function Testimonials() {
  const { data } = useSuspenseQuery(testimonialsQuery());
  const avg = data.length ? data.reduce((s, t) => s + t.rating, 0) / data.length : 0;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Kind words</p>
        <h2 className="mt-2 font-display text-4xl text-burgundy">What our clients say</h2>
        <p className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
          <Stars n={Math.round(avg)} /> {avg.toFixed(1)} average from {data.length} reviews
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.map((t) => (
          <figure key={t.id} className="rounded-2xl border border-rose-gold/50 bg-card p-6 shadow-elegant">
            <Stars n={t.rating} />
            <blockquote className="mt-3 font-display text-lg italic">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm"><span className="font-semibold">{t.name}</span> · <span className="text-sage">{t.event_type}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= n ? "fill-gold text-gold" : "text-border"}`} />
      ))}
    </span>
  );
}
