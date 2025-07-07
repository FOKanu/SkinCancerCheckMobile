-- =====================================================
-- SUPABASE ROW-LEVEL SECURITY (RLS) POLICIES
-- For SkinCheckAI Application
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- =====================================================
-- SPOTS TABLE POLICIES
-- =====================================================

-- Users can view only their own spots
CREATE POLICY "Users can view own spots"
ON public.spots
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert spots with their own user ID
CREATE POLICY "Users can insert own spots"
ON public.spots
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update only their own spots
CREATE POLICY "Users can update own spots"
ON public.spots
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete only their own spots
CREATE POLICY "Users can delete own spots"
ON public.spots
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =====================================================
-- SCANS TABLE POLICIES
-- =====================================================

-- Users can view only their own scans (via spots relationship)
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

-- Users can insert scans for their own spots
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

-- Users can update only their own scans
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

-- Users can delete only their own scans
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

-- =====================================================
-- COMMENTS TABLE POLICIES
-- =====================================================

-- Users can view comments on their own scans
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

-- Users can insert comments on their own scans
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

-- Users can update only their own comments
CREATE POLICY "Users can update own comments"
ON public.comments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete only their own comments
CREATE POLICY "Users can delete own comments"
ON public.comments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =====================================================
-- ADDITIONAL SECURITY MEASURES
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_spots_user_id ON public.spots(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_spot_id ON public.scans(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_scan_id ON public.comments(scan_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- =====================================================
-- AUDIT TRAIL (OPTIONAL)
-- =====================================================

-- Create audit table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit table
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own audit entries
CREATE POLICY "Users can view own audit entries"
ON public.audit_log
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
