-- Create activities table for lead communication tracking
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  direction TEXT DEFAULT 'outbound',
  subject TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admins can view all activities" ON public.activities
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert activities" ON public.activities
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update activities" ON public.activities
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete activities" ON public.activities
  FOR DELETE USING (public.is_admin());

-- Enable realtime for activities
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;