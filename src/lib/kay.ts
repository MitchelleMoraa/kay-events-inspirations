export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Baby Shower",
  "Corporate",
  "Bridal Shower",
  "Graduation",
  "Anniversary",
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
  price: number;
  setup_duration: string;
  budget_items: BudgetItem[];
};

export const formatKES = (n: number) => "KES " + Number(n).toLocaleString("en-KE");
