-- 1. Customers table for lightweight CRM
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT customers_email_unique UNIQUE (email)
);

-- Enable RLS on customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers
CREATE POLICY "Admins can manage customers" ON public.customers
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can insert customers" ON public.customers
  FOR INSERT WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Add email tracking columns to quotes
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS resend_email_id TEXT;

-- 3. Link email events to quotes for tracking
ALTER TABLE public.email_delivery_events 
ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES public.quotes(id);

-- Enable realtime for customers
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;