export function Marquee() {
  const items = Array.from({ length: 12 });
  return (
    <div className="w-full overflow-hidden bg-burgundy py-3 text-burgundy-foreground">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-10" aria-hidden={k === 1}>
            {items.map((_, i) => (
              <span key={i} className="font-display text-lg italic tracking-wide">
                Book us today <span className="mx-4 text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
