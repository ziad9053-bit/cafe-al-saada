-- شغّل في Supabase → SQL Editor (مرة واحدة)

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_settings_select" ON public.app_settings;
CREATE POLICY "app_settings_select"
ON public.app_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "app_settings_insert" ON public.app_settings;
CREATE POLICY "app_settings_insert"
ON public.app_settings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "app_settings_update" ON public.app_settings;
CREATE POLICY "app_settings_update"
ON public.app_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
