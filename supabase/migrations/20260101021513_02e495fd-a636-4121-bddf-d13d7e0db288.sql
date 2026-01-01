-- Create leads table for storing lead information
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  interest TEXT NOT NULL,
  message TEXT,
  source_page TEXT NOT NULL,
  lead_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  is_hot BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_scoring_rules table for configurable scoring
CREATE TABLE public.lead_scoring_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  condition_field TEXT NOT NULL,
  condition_value TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table to track admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table
-- Anyone can submit a lead (INSERT)
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update leads
CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- RLS Policies for lead_scoring_rules
CREATE POLICY "Anyone can view scoring rules" 
ON public.lead_scoring_rules 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage scoring rules" 
ON public.lead_scoring_rules 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on leads
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default scoring rules
INSERT INTO public.lead_scoring_rules (rule_name, points, condition_field, condition_value) VALUES
('Interest in 3.0T MRI', 30, 'interest', '3T Systems'),
('Interest in 1.5T MRI', 25, 'interest', '1.5T Systems'),
('Has phone number', 15, 'phone', 'not_empty'),
('Has company name', 10, 'company', 'not_empty'),
('Interest in Parts', 20, 'interest', 'Parts'),
('Interest in Service', 15, 'interest', 'Service');

-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- Create index for faster lead queries
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_is_hot ON public.leads(is_hot);
CREATE INDEX idx_leads_lead_score ON public.leads(lead_score DESC);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);