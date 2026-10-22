import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Admin login — Kay Events" },
    { name: "description", content: "Sign in to manage Kay Events inspirations and booking requests." },
    { property: "og:title", content: "Admin login — Kay Events" },
    { property: "og:description", content: "Administrator access for Kay Events." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/admin", replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    return () => subscription.subscription.unsubscribe();
  }, [navigate]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")); const password = String(f.get("password"));
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account.");
  }
  return (
    <main className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-3xl text-burgundy">Admin {mode === "in" ? "sign in" : "sign up"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">The first account created becomes the owner.</p>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <div className="grid gap-1"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
        <div className="grid gap-1"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
        <Button disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
      </form>
      <Button type="button" variant="link" className="mt-4 px-0 text-sm text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "No account yet? Sign up" : "Have an account? Sign in"}
      </Button>
    </main>
  );
}

