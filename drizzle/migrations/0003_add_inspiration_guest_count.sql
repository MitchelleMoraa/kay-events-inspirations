ALTER TABLE public.inspirations ADD COLUMN guest_count integer;
ALTER TABLE public.inspirations ADD CONSTRAINT inspirations_guest_count_positive CHECK (guest_count IS NULL OR guest_count > 0);