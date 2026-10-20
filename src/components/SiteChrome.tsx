import { Link } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, Instagram, Music2 } from "lucide-react";
import { CONTACT } from "@/lib/kay";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl font-bold text-burgundy">
          Kay <span className="text-primary">Events</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <Link to="/admin" className="text-muted-foreground hover:text-primary">Owner</Link>
        </nav>
      </div>
      <div className="h-0.5 bg-gold-line" />
    </header>
  );
}

export function ContactLinks({ className = "" }: { className?: string }) {
  const links = [
    { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Phone, label: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${CONTACT.whatsapp}` },
    { icon: Instagram, label: `@${CONTACT.instagram}`, href: `https://instagram.com/${CONTACT.instagram}` },
    { icon: Music2, label: `TikTok @${CONTACT.tiktok}`, href: `https://tiktok.com/@${CONTACT.tiktok}` },
  ];
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(({ icon: Icon, label, href }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-rose-gold bg-card px-4 py-2 text-sm transition hover:bg-secondary"
        >
          <Icon className="h-4 w-4 text-primary" /> {label}
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-burgundy text-burgundy-foreground">
      <div className="h-1 bg-gold-line" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-display text-2xl">Kay Events</p>
        <p className="mt-1 text-sm opacity-80">Weddings, celebrations & unforgettable moments.</p>
        <ContactLinks className="mt-6 [&_a]:text-foreground" />
        <p className="mt-8 text-xs opacity-60">© {new Date().getFullYear()} Kay Events</p>
      </div>
    </footer>
  );
}
