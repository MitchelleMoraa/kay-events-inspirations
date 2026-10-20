import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Inspiration } from "./kay";

export const inspirationsQuery = (eventType?: string) =>
  queryOptions({
    queryKey: ["inspirations", eventType ?? "all"],
    queryFn: async () => {
      let q = supabase.from("inspirations").select("*").order("created_at", { ascending: false });
      if (eventType) q = q.ilike("event_type", eventType);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Inspiration[];
    },
  });

export const testimonialsQuery = () =>
  queryOptions({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
