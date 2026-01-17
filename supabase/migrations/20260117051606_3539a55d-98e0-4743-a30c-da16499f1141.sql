-- Create quotes table for storing quote documents
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES public.leads(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  customer_phone TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  valid_until DATE,
  status TEXT DEFAULT 'Draft',
  acceptance_token UUID DEFAULT gen_random_uuid() UNIQUE,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all quotes" ON public.quotes
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert quotes" ON public.quotes
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update quotes" ON public.quotes
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete quotes" ON public.quotes
  FOR DELETE USING (public.is_admin());

-- Allow public access via acceptance token (for quote portal)
CREATE POLICY "Public can view quotes by token" ON public.quotes
  FOR SELECT USING (acceptance_token IS NOT NULL);

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_quotes_acceptance_token ON quotes (acceptance_token);
CREATE INDEX IF NOT EXISTS idx_quotes_lead_id ON quotes (lead_id);

-- Add urgency column to leads for hot list filtering
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'Normal';

-- Create index for hot list queries
CREATE INDEX IF NOT EXISTS idx_leads_hot_list ON leads (urgency, status, created_at);

-- Enable realtime for quotes
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;