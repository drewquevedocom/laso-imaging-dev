-- Create table for equipment sell requests
CREATE TABLE public.equipment_sell_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  equipment_type TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  year_manufactured INTEGER,
  condition TEXT,
  software_version TEXT,
  location TEXT,
  reason_for_selling TEXT,
  timeline TEXT,
  has_service_history BOOLEAN DEFAULT false,
  message TEXT,
  status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.equipment_sell_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for anonymous sell requests
CREATE POLICY "Anyone can submit sell requests"
ON public.equipment_sell_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view sell requests
CREATE POLICY "Admins can view sell requests"
ON public.equipment_sell_requests
FOR SELECT
USING (public.is_admin());

-- Only admins can update sell requests
CREATE POLICY "Admins can update sell requests"
ON public.equipment_sell_requests
FOR UPDATE
USING (public.is_admin());