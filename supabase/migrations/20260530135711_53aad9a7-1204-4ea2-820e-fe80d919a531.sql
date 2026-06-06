ALTER TABLE public.ai_articles
  ADD COLUMN IF NOT EXISTS fact_checked_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS fact_check_report jsonb;