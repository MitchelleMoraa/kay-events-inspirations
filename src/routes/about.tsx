import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Kay Events — Celebrations with care" },
    { name: "description", content: "Discover Kay Events: event planning, decoration and styling for weddings, proposals and celebrations." },
    { property: "og:title", content: "About Kay Events" },
    { property: "og:description", content: "Thoughtful decoration and styling for your next celebration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src="/images/wedding.jpg" alt="Floral wedding arch and celebration setting" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-primary-foreground">
          <p className="text-sm uppercase tracking-widest text-gold">About us</p>
          <h1 className="mt-4"><Brand inverse /></h1>
          <p className="mt-5 max-w-xl font-display text-3xl leading-relaxed">A thoughtful setting for life's meaningful moments.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-burgundy">Made for your celebration</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Kay Events brings together event planning, decoration and styling for weddings, birthdays, proposals and other celebrations. From floral details to the overall setting, every event starts with your ideas and the occasion you want to create.</p>
        </div>
        <div>
          <h2 className="font-display text-3xl text-burgundy">Your vision, thoughtfully arranged</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Share your date, venue, guest count and budget with us. We'll discuss the details and prepare a quotation for the agreed services, setup and arrangements.</p>
          <Button asChild className="mt-6"><Link to="/contact">Let's plan your event</Link></Button>
        </div>
      </section>
    </main>
  );
}