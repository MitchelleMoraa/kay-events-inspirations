export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${inverse ? "text-burgundy-foreground" : "text-burgundy"}`}>
      <svg viewBox="0 0 40 48" aria-hidden="true" className="h-10 w-8 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M20 43V21M20 33C5 34 5 22 5 22c12 0 15 11 15 11Zm0-5c15 0 15-12 15-12-12 0-15 12-15 12ZM20 21c-8-1-12-8-8-12 3-3 8 0 8 0s5-3 8 0c4 4 0 11-8 12Z" />
        <path d="M20 9s-5-6 0-8c5 2 0 8 0 8Z" />
      </svg>
      <span className="font-script text-4xl leading-normal">Kay Events</span>
    </span>
  );
}