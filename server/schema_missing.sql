-- ============================================================
-- STEP 1: Create the users table (if not already done)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow full access (restrict further if needed)
DROP POLICY IF EXISTS "Enable all access" ON public.users;
CREATE POLICY "Enable all access" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- STEP 2: Seed the admin user
-- IMPORTANT: Replace the password_hash below with your actual bcrypt hash.
-- To generate a hash, run this in Node.js:
--   const bcrypt = require('bcryptjs');
--   bcrypt.hash('YOUR_PASSWORD', 12).then(console.log);
-- ============================================================
INSERT INTO public.users (username, password_hash, role)
VALUES (
    'admin',
    '$2b$12$06lkVhmPJo66BPK29zCI5.KP7g8Yqm/3jDye/Lkrx7paI4bLqunY.',
    'admin'
)
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- STEP 3: content_chunks table (for AI Search - Optional)
-- Requires pgvector extension. If this fails, skip it.
-- ============================================================
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE TABLE IF NOT EXISTS public.content_chunks (
--     id SERIAL PRIMARY KEY,
--     document_id INTEGER,
--     source_table TEXT,
--     chunk_text TEXT,
--     embedding TEXT,  -- stored as JSON string
--     chunk_index INTEGER,
--     language TEXT DEFAULT 'en',
--     section_type TEXT DEFAULT 'general',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
