-- Add email tracking columns to contractor_timecards
ALTER TABLE public.contractor_timecards 
ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ;

-- Create email delivery events table for webhook tracking
CREATE TABLE public.email_delivery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  timecard_id UUID REFERENCES public.contractor_timecards(id),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_delivery_events ENABLE ROW LEVEL SECURITY;

-- Allow webhook inserts (no auth required)
CREATE POLICY "Allow webhook inserts"
  ON public.email_delivery_events
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all events
CREATE POLICY "Admins can view events"
  ON public.email_delivery_events
  FOR SELECT
  USING (public.is_admin());