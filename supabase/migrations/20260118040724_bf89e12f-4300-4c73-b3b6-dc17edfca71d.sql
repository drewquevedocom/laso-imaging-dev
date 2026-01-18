-- Create product_offers table for tracking formal offers
CREATE TABLE public.product_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  
  -- Offer details
  list_price NUMERIC,
  offer_amount NUMERIC NOT NULL,
  target_price NUMERIC,
  offer_type TEXT DEFAULT 'soft' CHECK (offer_type IN ('soft', 'firm', 'final')),
  validity_days INTEGER DEFAULT 7,
  expires_at TIMESTAMPTZ,
  
  -- Context
  reason TEXT,
  competitor_info TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'countered')),
  margin_percentage NUMERIC,
  
  -- Approval workflow
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create pricing_rules table for centralized configuration
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL CHECK (rule_type IN ('min_margin', 'auto_expiration', 'discount_threshold', 'approval_threshold')),
  modality TEXT,
  value NUMERIC NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add tracking columns to inventory table
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS open_quotes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS open_offers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_quotes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_offers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversion_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_discount_percentage NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_quote_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_offer_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sales_strategy TEXT DEFAULT 'all' CHECK (sales_strategy IN ('list_only', 'quote_only', 'offer_enabled', 'all'));

-- Enable RLS on new tables
ALTER TABLE public.product_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_offers
CREATE POLICY "Admins can manage offers" ON public.product_offers
FOR ALL USING (is_admin());

CREATE POLICY "Public can view own offers" ON public.product_offers
FOR SELECT USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS policies for pricing_rules
CREATE POLICY "Admins can manage pricing rules" ON public.pricing_rules
FOR ALL USING (is_admin());

CREATE POLICY "Authenticated can view active rules" ON public.pricing_rules
FOR SELECT USING (is_active = true);

-- Create trigger for updated_at on product_offers
CREATE TRIGGER update_product_offers_updated_at
BEFORE UPDATE ON public.product_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on pricing_rules
CREATE TRIGGER update_pricing_rules_updated_at
BEFORE UPDATE ON public.pricing_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing rules
INSERT INTO public.pricing_rules (rule_type, modality, value, description) VALUES
('min_margin', NULL, 15, 'Minimum margin percentage for all products'),
('min_margin', 'MRI', 18, 'Minimum margin percentage for MRI systems'),
('min_margin', 'CT', 16, 'Minimum margin percentage for CT systems'),
('auto_expiration', NULL, 30, 'Default quote expiration in days'),
('discount_threshold', NULL, 10, 'Discount percentage requiring approval'),
('approval_threshold', NULL, 20, 'Discount percentage requiring manager approval');