
-- Autopilot runs history
CREATE TABLE public.autopilot_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  trigger text NOT NULL DEFAULT 'cron',
  suggested int NOT NULL DEFAULT 0,
  generated int NOT NULL DEFAULT 0,
  passed int NOT NULL DEFAULT 0,
  scheduled int NOT NULL DEFAULT 0,
  published int NOT NULL DEFAULT 0,
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  error_message text,
  email_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.autopilot_runs TO authenticated;
GRANT ALL ON public.autopilot_runs TO service_role;

ALTER TABLE public.autopilot_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read autopilot runs"
ON public.autopilot_runs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_autopilot_runs_started_at ON public.autopilot_runs (started_at DESC);

-- Schedule daily autopilot at 10:00 Israel time (07:00 UTC during IDT/summer)
DO $$
BEGIN
  PERFORM cron.unschedule('autopilot-daily-10am');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'autopilot-daily-10am',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--76bdbefc-b3ea-4afb-b0d2-d9365597c52d.lovable.app/api/public/hooks/autopilot-daily',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbGZ2YXpqamtsemFzcGpva2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTIxODIsImV4cCI6MjA5NTAyODE4Mn0.AVt7Q7H6_rifBmJ3MNS-MnvTUa1unf3YTGZJyF2fEBU"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
