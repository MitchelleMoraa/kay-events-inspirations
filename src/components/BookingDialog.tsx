import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";

export function BookingDialog({
  eventType, inspirationTitle = "", trigger,
}: { eventType: string; inspirationTitle?: string; trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter your name and a valid email.");
      return;
    }
    setBusy(true);
    const guests = Number(f.get("guests")) || null;
    const { error } = await supabase.from("booking_requests").insert({
      name: name.slice(0, 120),
      email: email.slice(0, 255),
      phone: String(f.get("phone") || "").slice(0, 40),
      event_type: eventType,
      inspiration_title: inspirationTitle,
      event_date: (f.get("date") as string) || null,
      guests,
      message: String(f.get("message") || "").slice(0, 2000),
    });
    setBusy(false);
    if (error) { toast.error("Could not send your request. Please try again."); return; }
    toast.success("Request sent! Kay Events will get in touch soon.");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book your {eventType}</DialogTitle>
          <DialogDescription>
            {inspirationTitle ? `Interested in “${inspirationTitle}”. ` : ""}Tell us about your event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-1"><Label htmlFor="name">Full name</Label><Input id="name" name="name" required maxLength={120} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div className="grid gap-1"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" maxLength={40} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1"><Label htmlFor="date">Event date</Label><Input id="date" name="date" type="date" /></div>
            <div className="grid gap-1"><Label htmlFor="guests">Guests</Label><Input id="guests" name="guests" type="number" min={1} /></div>
          </div>
          <div className="grid gap-1"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" maxLength={2000} /></div>
          <Button type="submit" disabled={busy}>{busy ? "Sending..." : "Send request"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
