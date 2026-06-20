CREATE TABLE public.instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea JSONB,
  post_type TEXT NOT NULL DEFAULT 'tip',
  caption TEXT NOT NULL DEFAULT '',
  hashtags TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  ig_media_id TEXT,
  publish_error TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.instagram_posts TO authenticated;
GRANT ALL ON public.instagram_posts TO service_role;

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage instagram posts"
ON public.instagram_posts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_instagram_posts_updated_at
BEFORE UPDATE ON public.instagram_posts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_instagram_posts_status_created ON public.instagram_posts(status, created_at DESC);