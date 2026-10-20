CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- First account to sign up becomes the owner/admin
CREATE OR REPLACE FUNCTION public.handle_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_first_admin();

CREATE TABLE public.inspirations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  setup_duration text NOT NULL DEFAULT '',
  budget_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.inspirations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspirations TO authenticated;
GRANT ALL ON public.inspirations TO service_role;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read inspirations" ON public.inspirations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert inspirations" ON public.inspirations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update inspirations" ON public.inspirations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete inspirations" ON public.inspirations FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  event_type text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quote text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 40),
  event_type text NOT NULL CHECK (char_length(event_type) <= 60),
  inspiration_title text NOT NULL DEFAULT '' CHECK (char_length(inspiration_title) <= 200),
  event_date date,
  guests int CHECK (guests IS NULL OR guests BETWEEN 1 AND 100000),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.booking_requests TO anon;
GRANT SELECT, INSERT, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request booking" ON public.booking_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read bookings" ON public.booking_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete bookings" ON public.booking_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.inspirations (event_type,title,description,image_url,price,setup_duration,budget_items) VALUES
('Wedding','Blush & Gold Garden Romance','An outdoor garden ceremony with cascading baby-pink roses, gold chiavari chairs and a floral arch draped in silk.','/images/wedding.jpg',450000,'2 days','[{"item":"Floral arch & aisle florals","cost":120000},{"item":"Gold chiavari chairs (150)","cost":75000},{"item":"Tent & draping","cost":110000},{"item":"Lighting & fairy lights","cost":60000},{"item":"Table settings & centrepieces","cost":85000}]'),
('Wedding','Burgundy Velvet Evening Reception','A moody indoor reception with burgundy velvet linens, candlelit tablescapes and rose-gold accents.','/images/wedding.jpg',380000,'1.5 days','[{"item":"Burgundy linens & runners","cost":60000},{"item":"Candle installations","cost":70000},{"item":"Head table backdrop","cost":95000},{"item":"Rose-gold cutlery & glassware","cost":80000},{"item":"Centrepieces","cost":75000}]'),
('Wedding','Sage Minimalist Ceremony','Clean lines, sage greenery, pampas grass and soft neutral tones for an intimate ceremony.','/images/wedding.jpg',220000,'1 day','[{"item":"Greenery & pampas installations","cost":70000},{"item":"Seating & aisle styling","cost":50000},{"item":"Arbor backdrop","cost":60000},{"item":"Signage & stationery","cost":40000}]'),
('Birthday','Magenta Glam Birthday Bash','Bold magenta balloon garland, gold sequin backdrop and a dessert table fit for a celebration.','/images/birthday.jpg',95000,'6 hours','[{"item":"Balloon garland","cost":25000},{"item":"Sequin backdrop & neon sign","cost":30000},{"item":"Dessert table styling","cost":25000},{"item":"Table & chair decor","cost":15000}]'),
('Birthday','Mustard & Sage Picnic Party','A relaxed boho picnic setup with low tables, cushions and mustard and sage accents.','/images/birthday.jpg',65000,'4 hours','[{"item":"Low tables & cushions","cost":25000},{"item":"Rugs & umbrellas","cost":15000},{"item":"Florals","cost":15000},{"item":"Picnic tableware","cost":10000}]'),
('Baby Shower','Baby Pink Cloud Shower','Soft baby-pink and white clouds, pastel balloons and a sweet treats station.','/images/babyshower.jpg',80000,'5 hours','[{"item":"Cloud & balloon backdrop","cost":30000},{"item":"Treats station","cost":20000},{"item":"Seating decor","cost":15000},{"item":"Games & favour table","cost":15000}]'),
('Corporate','Rose Gold Gala Dinner','An elegant corporate gala with rose-gold staging, branded backdrops and plated dinner setup.','/images/corporate.jpg',600000,'2 days','[{"item":"Stage & branded backdrop","cost":180000},{"item":"Lighting & AV","cost":150000},{"item":"Table settings (200 guests)","cost":170000},{"item":"Entrance & welcome area","cost":100000}]');

INSERT INTO public.testimonials (name,event_type,rating,quote) VALUES
('Wanjiru & Brian','Wedding',5,'Kay Events turned our garden into a fairytale. Every detail was exactly what we dreamed of.'),
('Achieng O.','Birthday',5,'My 30th was pure glam! The magenta setup had everyone talking for weeks.'),
('Faith M.','Baby Shower',4,'Beautiful, soft and so well organised. Set-up was done before guests arrived.'),
('Daniel K.','Corporate',5,'Professional from start to finish. Our gala dinner looked world-class.');