import { createFileRoute } from "@tanstack/react-router";
import { ContactLinks } from "@/components/SiteChrome";
import { BookingDialog } from "@/components/BookingDialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Kay Events" },
      { name: "description", content: "Reach Kay Events by email, phone, WhatsApp, Instagram or TikTok." },
      { property: "og:title", content: "Contact Kay Events" },
      { property: "og:description", content: "Inquiries and support for your next event." },
    ],
  }),
  component: () => (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-5xl text-burgundy">Let's plan something beautiful</h1>
      <p className="mt-3 text-muted-foreground">Email, call, or message us on WhatsApp, Instagram or TikTok.</p>
      <ContactLinks className="mt-8 justify-center" />
      <BookingDialog eventType="Event" trigger={<Button size="lg" className="mt-10">Send an inquiry</Button>} />
    </main>
  ),
});
