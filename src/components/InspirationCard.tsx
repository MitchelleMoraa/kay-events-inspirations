import { useState } from "react";
import { Clock, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./BookingDialog";
import { downloadInspiration } from "@/lib/download-inspiration";
import { formatKES, inspirationPhotos, type Inspiration } from "@/lib/kay";

export function InspirationCard({ insp }: { insp: Inspiration }) {
  const [dl, setDl] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const photos = inspirationPhotos(insp);
  const activePhoto = selectedPhoto && photos.includes(selectedPhoto) ? selectedPhoto : photos[0];
  const total = insp.budget_items.reduce((s, b) => s + Number(b.cost), 0);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
      {activePhoto && (
        <img src={activePhoto} alt={insp.title} loading="lazy" width={1280} height={896} className="aspect-[4/3] w-full object-cover" />
      )}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3" aria-label={`${insp.title} photos`}>
          {photos.map((url, index) => (
            <Button key={url} variant="outline" className="h-16 w-20 shrink-0 overflow-hidden p-0" aria-label={`View photo ${index + 1} of ${insp.title}`} aria-pressed={activePhoto === url} onClick={() => setSelectedPhoto(url)}>
              <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </Button>
          ))}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl text-burgundy">{insp.title}</h3>
          <span className="shrink-0 rounded-full bg-mustard px-3 py-1 text-sm font-semibold text-burgundy">{formatKES(insp.price)}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{insp.description}</p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-accent-foreground">
          <Clock className="h-4 w-4" /> Setup: {insp.setup_duration}
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Number of guests: {insp.guest_count ?? "On request"}</p>
        <div className="mt-4 rounded-xl bg-secondary/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Budget plan</p>
          <ul className="space-y-1 text-sm">
            {insp.budget_items.map((b, i) => (
              <li key={i} className="flex justify-between border-b border-border/60 pb-1">
                <span>{b.item}</span><span>{formatKES(b.cost)}</span>
              </li>
            ))}
            <li className="flex justify-between pt-1 font-semibold"><span>Total</span><span>{formatKES(total)}</span></li>
          </ul>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <BookingDialog guestCount={insp.guest_count} eventType={insp.event_type} inspirationTitle={insp.title} trigger={<Button>Book this event</Button>} />
          <Button variant="outline" disabled={dl} onClick={async () => { setDl(true); await downloadInspiration(insp); setDl(false); }}>
            <Download className="mr-1 h-4 w-4" /> {dl ? "Preparing..." : "Download"}
          </Button>
        </div>
      </div>
    </article>
  );
}
