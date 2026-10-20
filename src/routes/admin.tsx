import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPES, formatKES } from "@/lib/kay";
import { inspirationsQuery } from "@/lib/queries";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner dashboard — Kay Events" },
      { name: "description", content: "Manage Kay Events inspirations and booking requests." },
      { property: "og:title", content: "Owner dashboard — Kay Events" },
      { property: "og:description", content: "Private area for the Kay Events owner." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin")
      .then(({ data }) => setIsAdmin(!!data?.length));
  }, [session]);

  if (!ready) return <main className="p-20 text-center">Loading…</main>;
  if (!session) return <AuthForm />;
  if (!isAdmin)
    return (
      <main className="mx-auto max-w-md p-20 text-center">
        <p>This account isn't the owner account.</p>
        <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </main>
    );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-burgundy">Owner dashboard</h1>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <AddInspiration />
        <Bookings />
      </div>
      <ManageInspirations />
    </main>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")); const password = String(f.get("password"));
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account.");
  }
  return (
    <main className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-3xl text-burgundy">Owner {mode === "in" ? "sign in" : "sign up"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">The first account created becomes the owner.</p>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <div className="grid gap-1"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
        <div className="grid gap-1"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
        <Button disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
      </form>
      <button className="mt-4 text-sm text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "No account yet? Sign up" : "Have an account? Sign in"}
      </button>
    </main>
  );
}

function AddInspiration() {
  const qc = useQueryClient();
  const [items, setItems] = useState([{ item: "", cost: "" }]);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    let image_url = "";
    const file = f.get("image") as File | null;
    if (file && file.size) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
      const up = await supabase.storage.from("inspirations").upload(path, file);
      if (up.error) { setBusy(false); return toast.error(up.error.message); }
      image_url = supabase.storage.from("inspirations").getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from("inspirations").insert({
      event_type: String(f.get("event_type")),
      title: String(f.get("title")),
      description: String(f.get("description")),
      price: Number(f.get("price")) || 0,
      setup_duration: String(f.get("setup_duration")),
      image_url,
      budget_items: items.filter((i) => i.item).map((i) => ({ item: i.item, cost: Number(i.cost) || 0 })),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Inspiration added");
    form.reset(); setItems([{ item: "", cost: "" }]);
    qc.invalidateQueries({ queryKey: ["inspirations"] });
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
      <h2 className="font-display text-2xl text-burgundy">Add an inspiration</h2>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor="event_type">Event type</Label>
          <select id="event_type" name="event_type" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid gap-1"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
        <div className="grid gap-1"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1"><Label htmlFor="price">Price (KES)</Label><Input id="price" name="price" type="number" min={0} required /></div>
          <div className="grid gap-1"><Label htmlFor="setup_duration">Setup duration</Label><Input id="setup_duration" name="setup_duration" placeholder="e.g. 1 day" required /></div>
        </div>
        <div className="grid gap-1"><Label htmlFor="image">Photo</Label><Input id="image" name="image" type="file" accept="image/*" /></div>
        <div className="grid gap-2">
          <Label>Budget plan</Label>
          {items.map((it, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="Item" value={it.item} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, item: e.target.value } : x))} />
              <Input placeholder="Cost" type="number" className="w-32" value={it.cost} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, cost: e.target.value } : x))} />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { item: "", cost: "" }])}><Plus className="mr-1 h-4 w-4" />Add line</Button>
        </div>
        <Button disabled={busy}>{busy ? "Saving…" : "Publish inspiration"}</Button>
      </form>
    </section>
  );
}

function Bookings() {
  const { data } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => (await supabase.from("booking_requests").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
      <h2 className="font-display text-2xl text-burgundy">Booking requests</h2>
      <div className="mt-4 max-h-[640px] space-y-3 overflow-auto">
        {!data?.length && <p className="text-sm text-muted-foreground">No requests yet.</p>}
        {data?.map((b) => (
          <div key={b.id} className="rounded-xl bg-secondary/60 p-4 text-sm">
            <p className="font-semibold">{b.name} · {b.event_type}{b.inspiration_title ? ` — ${b.inspiration_title}` : ""}</p>
            <p className="text-muted-foreground">{b.email} {b.phone && `· ${b.phone}`} {b.event_date && `· ${b.event_date}`} {b.guests && `· ${b.guests} guests`}</p>
            {b.message && <p className="mt-1">{b.message}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ManageInspirations() {
  const qc = useQueryClient();
  const { data } = useQuery(inspirationsQuery());
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl text-burgundy">All inspirations</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {data?.map((i) => (
          <div key={i.id} className="flex items-center justify-between gap-4 p-4 text-sm">
            <span><b>{i.title}</b> · {i.event_type} · {formatKES(i.price)}</span>
            <Button variant="ghost" size="sm" onClick={async () => {
              if (!confirm(`Delete “${i.title}”?`)) return;
              const { error } = await supabase.from("inspirations").delete().eq("id", i.id);
              if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["inspirations"] });
            }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </section>
  );
}
