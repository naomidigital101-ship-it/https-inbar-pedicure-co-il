-- Additive clinic workspace. No old system or public website rows are modified.
BEGIN;
CREATE TABLE IF NOT EXISTS public.clinic_clients (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL CHECK(length(name) BETWEEN 1 AND 160),
 phone text NOT NULL CHECK(length(phone) BETWEEN 8 AND 16), email text NOT NULL DEFAULT '',
 birthday date, notes text NOT NULL DEFAULT '', health_notes text NOT NULL DEFAULT '',
 source_lead_id uuid UNIQUE REFERENCES public.leads(id), created_at timestamptz NOT NULL DEFAULT now(),
 created_by uuid NOT NULL REFERENCES auth.users(id), UNIQUE(phone)
);
CREATE TABLE IF NOT EXISTS public.clinic_appointments (
 id uuid PRIMARY KEY, client_id uuid NOT NULL REFERENCES public.clinic_clients(id),
 starts_at timestamptz NOT NULL, duration integer NOT NULL CHECK(duration BETWEEN 10 AND 240),
 service text NOT NULL CHECK(length(service) BETWEEN 1 AND 160), notes text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','completed','cancelled')),
 created_at timestamptz NOT NULL DEFAULT now(), created_by uuid NOT NULL REFERENCES auth.users(id)
);
CREATE INDEX IF NOT EXISTS clinic_appointments_start ON public.clinic_appointments(starts_at);
CREATE TABLE IF NOT EXISTS public.clinic_visits (
 id uuid PRIMARY KEY, client_id uuid NOT NULL REFERENCES public.clinic_clients(id),
 appointment_id uuid UNIQUE REFERENCES public.clinic_appointments(id), visited_at timestamptz NOT NULL,
 service text NOT NULL, price_cents integer NOT NULL CHECK(price_cents BETWEEN 0 AND 10000000),
 notes text NOT NULL DEFAULT '', home_care text NOT NULL DEFAULT '', next_visit date,
 before_path text, after_path text, created_by uuid NOT NULL REFERENCES auth.users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS clinic_visits_client_date ON public.clinic_visits(client_id,visited_at DESC);
CREATE TABLE IF NOT EXISTS public.clinic_payments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), client_id uuid NOT NULL REFERENCES public.clinic_clients(id),
 visit_id uuid NOT NULL REFERENCES public.clinic_visits(id), amount_cents integer NOT NULL CHECK(amount_cents > 0 AND amount_cents <= 10000000),
 method text NOT NULL CHECK(method IN ('מזומן','העברה','אשראי','ביט')), paid_at timestamptz NOT NULL,
 request_id uuid NOT NULL UNIQUE, created_by uuid NOT NULL REFERENCES auth.users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.clinic_followups (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), client_id uuid NOT NULL REFERENCES public.clinic_clients(id),
 visit_id uuid NOT NULL UNIQUE REFERENCES public.clinic_visits(id), due_date date NOT NULL, completed_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
-- All access goes through authenticated, admin-checked server functions.
ALTER TABLE public.clinic_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_followups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.clinic_clients,public.clinic_appointments,public.clinic_visits,public.clinic_payments,public.clinic_followups FROM anon, authenticated;
GRANT ALL ON public.clinic_clients,public.clinic_appointments,public.clinic_visits,public.clinic_payments,public.clinic_followups TO service_role;

CREATE OR REPLACE FUNCTION public.clinic_write(p_actor uuid, p_action text, p_data jsonb) RETURNS jsonb
LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
DECLARE v_id uuid; v_client uuid; v_start timestamptz; v_duration integer; v_amount integer; v_price integer; v_due integer; v_existing jsonb; v_visit public.clinic_visits; v_lead public.leads; v_phone text;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=p_actor AND role='admin') THEN RAISE EXCEPTION 'אין הרשאת ניהול'; END IF;
 -- Serialize small clinic writes: avoid duplicate lead conversion and overlapping appointments.
 PERFORM pg_advisory_xact_lock(20261115, 101);
 IF p_action='client' THEN
  v_id := NULLIF(p_data->>'id','')::uuid;
  v_phone := regexp_replace(p_data->>'phone','[^0-9+]','','g');
  v_phone := regexp_replace(v_phone,'^\+?972','0');
  IF v_id IS NULL THEN
   INSERT INTO public.clinic_clients(name,phone,email,birthday,notes,health_notes,created_by)
   VALUES(trim(p_data->>'name'),v_phone,coalesce(p_data->>'email',''),NULLIF(p_data->>'birthday','')::date,coalesce(p_data->>'notes',''),coalesce(p_data->>'health_notes',''),p_actor)
   RETURNING id INTO v_id;
  ELSE
   UPDATE public.clinic_clients SET name=trim(p_data->>'name'),phone=v_phone,email=coalesce(p_data->>'email',''),birthday=NULLIF(p_data->>'birthday','')::date,notes=coalesce(p_data->>'notes',''),health_notes=coalesce(p_data->>'health_notes','') WHERE id=v_id;
   IF NOT FOUND THEN RAISE EXCEPTION 'הלקוחה לא נמצאה'; END IF;
  END IF;
 ELSIF p_action='lead' THEN
  SELECT * INTO v_lead FROM public.leads WHERE id=(p_data->>'lead_id')::uuid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'הפנייה לא נמצאה'; END IF;
  v_phone := regexp_replace(coalesce(v_lead.phone,''),'[^0-9+]','','g');
  v_phone := regexp_replace(v_phone,'^\+?972','0');
  IF length(v_phone)<8 THEN RAISE EXCEPTION 'יש להשלים מספר טלפון תקין בפנייה לפני פתיחת כרטיס'; END IF;
  SELECT id INTO v_id FROM public.clinic_clients WHERE source_lead_id=v_lead.id OR phone=v_phone LIMIT 1;
  IF v_id IS NULL THEN
   INSERT INTO public.clinic_clients(name,phone,email,notes,source_lead_id,created_by) VALUES(coalesce(NULLIF(v_lead.name,''),'לקוחה חדשה'),v_phone,coalesce(v_lead.email,''),coalesce(v_lead.message,''),v_lead.id,p_actor) RETURNING id INTO v_id;
  END IF;
  UPDATE public.leads SET status=CASE WHEN status='new' THEN 'contacted' ELSE status END WHERE id=v_lead.id;
 ELSIF p_action='appointment' THEN
  v_id := (p_data->>'id')::uuid; v_client := (p_data->>'client_id')::uuid;
  v_start := (p_data->>'start_local')::timestamp AT TIME ZONE 'Asia/Jerusalem'; v_duration := (p_data->>'duration')::integer;
  IF EXISTS(SELECT 1 FROM public.clinic_appointments WHERE id=v_id AND status='completed') THEN RAISE EXCEPTION 'לא ניתן לשנות תור שהושלם'; END IF;
  IF EXISTS(SELECT 1 FROM public.clinic_appointments WHERE id<>v_id AND status='scheduled' AND starts_at < v_start+make_interval(mins=>v_duration) AND starts_at+make_interval(mins=>duration)>v_start) THEN RAISE EXCEPTION 'כבר קיים תור בשעות האלה. בחרי שעה פנויה.'; END IF;
  INSERT INTO public.clinic_appointments(id,client_id,starts_at,duration,service,notes,created_by)
  VALUES(v_id,v_client,v_start,v_duration,p_data->>'service',coalesce(p_data->>'notes',''),p_actor)
  ON CONFLICT(id) DO UPDATE SET client_id=excluded.client_id,starts_at=excluded.starts_at,duration=excluded.duration,service=excluded.service,notes=excluded.notes,status='scheduled';
  UPDATE public.leads SET status='scheduled' WHERE id=(SELECT source_lead_id FROM public.clinic_clients WHERE id=v_client) AND status IN ('new','contacted','scheduled');
 ELSIF p_action='cancel' THEN
  v_id := (p_data->>'id')::uuid;
  UPDATE public.clinic_appointments SET status='cancelled' WHERE id=v_id AND status='scheduled';
  IF NOT FOUND THEN RAISE EXCEPTION 'התור כבר בוטל או הושלם'; END IF;
 ELSIF p_action='visit' THEN
  v_id := (p_data->>'id')::uuid; v_client := (p_data->>'client_id')::uuid;
  IF EXISTS(SELECT 1 FROM public.clinic_visits WHERE id=v_id) THEN RETURN jsonb_build_object('id',v_id); END IF;
  v_price := (p_data->>'price_cents')::integer; v_amount := (p_data->>'paid_cents')::integer;
  IF v_amount<0 OR v_amount>v_price THEN RAISE EXCEPTION 'סכום התשלום צריך להיות בין אפס למחיר הטיפול'; END IF;
  IF NULLIF(p_data->>'appointment_id','') IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.clinic_appointments WHERE id=(p_data->>'appointment_id')::uuid AND client_id=v_client AND status='scheduled') THEN RAISE EXCEPTION 'התור אינו פעיל או שייך ללקוחה אחרת'; END IF;
  INSERT INTO public.clinic_visits(id,client_id,appointment_id,visited_at,service,price_cents,notes,home_care,next_visit,before_path,after_path,created_by)
  VALUES(v_id,v_client,NULLIF(p_data->>'appointment_id','')::uuid,(p_data->>'visit_local')::timestamp AT TIME ZONE 'Asia/Jerusalem',p_data->>'service',v_price,coalesce(p_data->>'notes',''),coalesce(p_data->>'home_care',''),NULLIF(p_data->>'next_visit','')::date,NULLIF(p_data->>'before_path',''),NULLIF(p_data->>'after_path',''),p_actor);
  IF v_amount>0 THEN INSERT INTO public.clinic_payments(client_id,visit_id,amount_cents,method,paid_at,request_id,created_by) VALUES(v_client,v_id,v_amount,p_data->>'method',(p_data->>'visit_local')::timestamp AT TIME ZONE 'Asia/Jerusalem',v_id,p_actor); END IF;
  UPDATE public.clinic_followups SET completed_at=now() WHERE client_id=v_client AND completed_at IS NULL;
  IF NULLIF(p_data->>'next_visit','') IS NOT NULL THEN INSERT INTO public.clinic_followups(client_id,visit_id,due_date) VALUES(v_client,v_id,(p_data->>'next_visit')::date); END IF;
  UPDATE public.clinic_appointments SET status='completed' WHERE id=NULLIF(p_data->>'appointment_id','')::uuid AND client_id=v_client;
 ELSIF p_action='payment' THEN
  v_id := (p_data->>'id')::uuid;
  IF EXISTS(SELECT 1 FROM public.clinic_payments WHERE request_id=v_id) THEN RETURN jsonb_build_object('id',v_id); END IF;
  SELECT * INTO v_visit FROM public.clinic_visits WHERE id=(p_data->>'visit_id')::uuid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'הטיפול לא נמצא'; END IF;
  SELECT v_visit.price_cents-coalesce(sum(amount_cents),0) INTO v_due FROM public.clinic_payments WHERE visit_id=v_visit.id;
  v_amount := (p_data->>'amount_cents')::integer;
  IF v_amount<=0 OR v_amount>v_due THEN RAISE EXCEPTION 'סכום התשלום גבוה מהיתרה או אינו תקין'; END IF;
  INSERT INTO public.clinic_payments(client_id,visit_id,amount_cents,method,paid_at,request_id,created_by) VALUES(v_visit.client_id,v_visit.id,v_amount,p_data->>'method',now(),v_id,p_actor);
 ELSIF p_action='followup' THEN
  v_id := (p_data->>'id')::uuid;
  UPDATE public.clinic_followups SET completed_at=now() WHERE id=v_id AND completed_at IS NULL;
 ELSE RAISE EXCEPTION 'פעולה לא מוכרת';
 END IF;
 RETURN jsonb_build_object('id',v_id);
END $$;
REVOKE ALL ON FUNCTION public.clinic_write(uuid,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.clinic_write(uuid,text,jsonb) TO service_role;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('clinic-photos','clinic-photos',false,2097152,ARRAY['image/jpeg','image/png','image/webp']) ON CONFLICT(id) DO NOTHING;
COMMIT;
