export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Baby Shower",
  "Corporate",
  "Bridal Shower",
  "Graduation",
  "Anniversary",
  "Proposal",
] as const;

export const slugify = (t: string) => t.toLowerCase().replace(/\s+/g, "-");
export const unslug = (s: string) =>
  EVENT_TYPES.find((t) => slugify(t) === s) ?? s.replace(/-/g, " ");

// Placeholder contact details — replace with the real ones.
export const CONTACT = {
  email: "hello@kayevents.co.ke",
  phone: "+254700000000",
  whatsapp: "254700000000",
  instagram: "kayevents",
  tiktok: "kayevents",
};

export type BudgetItem = { item: string; cost: number };
export type Inspiration = {
  id: string;
  event_type: string;
  title: string;
  description: string;
  image_url: string;
  additional_image_urls?: string[];
  guest_count?: number | null;
  price: number;
  setup_duration: string;
  budget_items: BudgetItem[];
};

export const formatKES = (n: number) => "KES " + Number(n).toLocaleString("en-KE");

export function inspirationPhotos(insp: Pick<Inspiration, "image_url" | "additional_image_urls">) {
  return [insp.image_url, ...(insp.additional_image_urls ?? [])].filter(Boolean);
}

export function photoUpdate(retained: string[], added: string[]) {
  const photos = [...retained, ...added];
  return { image_url: photos[0] ?? "", additional_image_urls: photos.slice(1) };
}

export function parseGuestCount(value: string) {
  if (!value.trim()) return null;
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 1) throw new Error("Enter a whole number of guests greater than zero.");
  return count;
}
