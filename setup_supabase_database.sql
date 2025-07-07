-- =====================================================
-- SKINCHECKAI DATABASE SETUP
-- For Supabase Instance: fpkbrdyzkarkfsluxksg
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SPOTS TABLE
CREATE TABLE IF NOT EXISTS public.spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SCANS TABLE
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE,
  prediction TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- USERS TABLE POLICIES
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- SPOTS TABLE POLICIES
CREATE POLICY "Users can view own spots"
ON public.spots
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own spots"
ON public.spots
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own spots"
ON public.spots
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own spots"
ON public.spots
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- SCANS TABLE POLICIES
CREATE POLICY "Users can view own scans"
ON public.scans
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.spots
    WHERE spots.id = scans.spot_id
    AND spots.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own scans"
ON public.scans
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.spots
    WHERE spots.id = scans.spot_id
    AND spots.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own scans"
ON public.scans
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.spots
    WHERE spots.id = scans.spot_id
    AND spots.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.spots
    WHERE spots.id = scans.spot_id
    AND spots.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own scans"
ON public.scans
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.spots
    WHERE spots.id = scans.spot_id
    AND spots.user_id = auth.uid()
  )
);

-- COMMENTS TABLE POLICIES
CREATE POLICY "Users can view comments on own scans"
ON public.comments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.scans
    JOIN public.spots ON spots.id = scans.spot_id
    WHERE scans.id = comments.scan_id
    AND spots.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert comments on own scans"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.scans
    JOIN public.spots ON spots.id = scans.spot_id
    WHERE scans.id = comments.scan_id
    AND spots.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own comments"
ON public.comments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
ON public.comments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =====================================================
-- TRIGGERS FOR AUTOMATIC USER_ID SETTING
-- =====================================================

-- Create function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for spots table
CREATE TRIGGER on_spots_insert
  BEFORE INSERT ON public.spots
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for comments table
CREATE TRIGGER on_comments_insert
  BEFORE INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_spots_user_id ON public.spots(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_spot_id ON public.scans(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_scan_id ON public.comments(scan_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert a demo user (optional)
INSERT INTO public.users (id, name, email) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo User', 'demo@skincheckai.com')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'spots', 'scans', 'comments');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'spots', 'scans', 'comments');
