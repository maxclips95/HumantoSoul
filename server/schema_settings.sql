-- Create settings table for storing key/value config (OAuth tokens, etc.)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access" ON public.settings;
CREATE POLICY "Enable all access" ON public.settings FOR ALL USING (true) WITH CHECK (true);
