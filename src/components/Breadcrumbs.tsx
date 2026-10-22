import { Link, useLocation } from "@tanstack/react-router";
import { unslug } from "@/lib/kay";

export function Breadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  const label = pathname.startsWith("/events/")
    ? unslug(decodeURIComponent(pathname.split("/")[2] ?? ""))
    : ({ "/about": "About", "/contact": "Contact", "/admin": "Admin", "/login": "Admin login", "/terms": "Terms and conditions" }[pathname] ?? "Page");
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link to="/" className="hover:text-primary">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-burgundy">{label}</li>
      </ol>
    </nav>
  );
}