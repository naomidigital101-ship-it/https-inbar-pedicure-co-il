-- AI Content Generation System

-- 1. Topics queue
CREATE TABLE public.ai_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  reasoning TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ai_topics_status_check CHECK (status IN ('pending','approved','rejected','used'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_topics TO authenticated;
GRANT ALL ON public.ai_topics TO service_role;

ALTER TABLE public.ai_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage topics" ON public.ai_topics
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 2. AI articles
CREATE TABLE public.ai_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.ai_topics(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  payload JSONB NOT NULL,
  hero_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  qa_attempts INTEGER NOT NULL DEFAULT 0,
  qa_report JSONB,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ai_articles_status_check CHECK (status IN ('draft','qa_pending','qa_failed','qa_passed','scheduled','published','archived'))
);

CREATE INDEX idx_ai_articles_status ON public.ai_articles(status);
CREATE INDEX idx_ai_articles_scheduled ON public.ai_articles(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_ai_articles_published ON public.ai_articles(published_at DESC) WHERE status = 'published';

GRANT SELECT ON public.ai_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_articles TO authenticated;
GRANT ALL ON public.ai_articles TO service_role;

ALTER TABLE public.ai_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published articles" ON public.ai_articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins manage articles" ON public.ai_articles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 3. QA logs
CREATE TABLE public.ai_qa_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.ai_articles(id) ON DELETE CASCADE,
  attempt INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_qa_logs_article ON public.ai_qa_logs(article_id, attempt);

GRANT SELECT, INSERT ON public.ai_qa_logs TO authenticated;
GRANT ALL ON public.ai_qa_logs TO service_role;

ALTER TABLE public.ai_qa_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read qa logs" ON public.ai_qa_logs
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert qa logs" ON public.ai_qa_logs
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. Settings singleton
CREATE TABLE public.ai_generation_settings (
  id INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
  posts_per_week INTEGER NOT NULL DEFAULT 10,
  publish_days INTEGER[] NOT NULL DEFAULT ARRAY[0,1,2,3,4,5,6],
  publish_hour INTEGER NOT NULL DEFAULT 9,
  auto_publish BOOLEAN NOT NULL DEFAULT false,
  topic_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-pro',
  article_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-pro',
  qa_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  image_model TEXT NOT NULL DEFAULT 'google/gemini-3.1-flash-image-preview',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton_row CHECK (id = 1)
);

INSERT INTO public.ai_generation_settings (id) VALUES (1);

GRANT SELECT, UPDATE ON public.ai_generation_settings TO authenticated;
GRANT ALL ON public.ai_generation_settings TO service_role;

ALTER TABLE public.ai_generation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read settings" ON public.ai_generation_settings
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update settings" ON public.ai_generation_settings
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 5. updated_at trigger function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_ai_topics_updated BEFORE UPDATE ON public.ai_topics
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_ai_articles_updated BEFORE UPDATE ON public.ai_articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_ai_settings_updated BEFORE UPDATE ON public.ai_generation_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. Storage bucket for AI-generated hero images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read article images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Admins upload article images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role manages article images" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'article-images')
  WITH CHECK (bucket_id = 'article-images');