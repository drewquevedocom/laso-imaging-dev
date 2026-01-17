-- Add new columns to equipment_sell_requests for enhanced MRI/CT intake

-- Systems overview fields
ALTER TABLE public.equipment_sell_requests 
ADD COLUMN IF NOT EXISTS systems_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS systems_count_range text DEFAULT '1',
ADD COLUMN IF NOT EXISTS has_mri boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_ct boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_mobile boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS mobile_units_count integer,
ADD COLUMN IF NOT EXISTS trailer_included boolean,
ADD COLUMN IF NOT EXISTS mobile_status text;

-- Equipment detail fields
ALTER TABLE public.equipment_sell_requests 
ADD COLUMN IF NOT EXISTS magnet_strength text,
ADD COLUMN IF NOT EXISTS year_installed integer,
ADD COLUMN IF NOT EXISTS equipment_status text DEFAULT 'clinical',
ADD COLUMN IF NOT EXISTS daily_scan_volume text;

-- Commercial fields
ALTER TABLE public.equipment_sell_requests 
ADD COLUMN IF NOT EXISTS desired_price text;

-- Location fields (country, city already exist as location)
ALTER TABLE public.equipment_sell_requests 
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS city text;

-- Seller fields
ALTER TABLE public.equipment_sell_requests 
ADD COLUMN IF NOT EXISTS facility_type text,
ADD COLUMN IF NOT EXISTS seller_role text;

-- Deal management fields
ALTER TABLE public.equipment_sell_requests 
ADD COLUMN IF NOT EXISTS deal_priority text DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS systems_detail jsonb DEFAULT '[]'::jsonb;

-- Create index for fast filtering by priority
CREATE INDEX IF NOT EXISTS idx_equipment_sell_requests_priority 
ON public.equipment_sell_requests (deal_priority);

-- Create index for modality filtering
CREATE INDEX IF NOT EXISTS idx_equipment_sell_requests_modality 
ON public.equipment_sell_requests (has_mri, has_ct);

-- Create function to auto-calculate deal priority
CREATE OR REPLACE FUNCTION public.calculate_sell_request_priority()
RETURNS TRIGGER AS $$
DECLARE
  priority_score integer := 0;
  priority_level text := 'normal';
BEGIN
  -- Multiple systems bonus
  IF NEW.systems_count >= 2 THEN
    priority_score := priority_score + 20;
  END IF;
  
  -- Mobile units bonus
  IF NEW.is_mobile = true THEN
    priority_score := priority_score + 15;
  END IF;
  
  -- Trailer included bonus
  IF NEW.trailer_included = true THEN
    priority_score := priority_score + 10;
  END IF;
  
  -- Timeline urgency
  IF NEW.timeline = 'Immediately' OR NEW.timeline = 'immediately' THEN
    priority_score := priority_score + 25;
  ELSIF NEW.timeline = '1-3 months' THEN
    priority_score := priority_score + 15;
  END IF;
  
  -- MRI bonus
  IF NEW.has_mri = true THEN
    priority_score := priority_score + 10;
  END IF;
  
  -- 3T magnet bonus
  IF NEW.magnet_strength = '3.0T' THEN
    priority_score := priority_score + 10;
  END IF;
  
  -- Calculate priority level
  IF priority_score >= 50 THEN
    priority_level := 'urgent';
  ELSIF priority_score >= 30 THEN
    priority_level := 'high';
  ELSE
    priority_level := 'normal';
  END IF;
  
  NEW.deal_priority := priority_level;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate priority
DROP TRIGGER IF EXISTS trigger_calculate_sell_priority ON public.equipment_sell_requests;
CREATE TRIGGER trigger_calculate_sell_priority
BEFORE INSERT OR UPDATE ON public.equipment_sell_requests
FOR EACH ROW
EXECUTE FUNCTION public.calculate_sell_request_priority();