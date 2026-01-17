-- Create inventory table if not exists (may already exist)
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  oem text NOT NULL,
  modality text NOT NULL,
  serial_number text,
  availability_status text DEFAULT 'Available',
  price numeric,
  description text,
  location text,
  condition text DEFAULT 'Good',
  year_manufactured integer,
  software_version text,
  magnet_type text,
  images jsonb DEFAULT '[]'::jsonb,
  notes text,
  -- Rental-specific fields
  is_rental boolean DEFAULT false,
  rental_daily_rate numeric,
  rental_weekly_rate numeric,
  rental_monthly_rate numeric,
  warehouse_location text,
  next_available_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add rental columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'is_rental') THEN
    ALTER TABLE public.inventory ADD COLUMN is_rental boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'rental_daily_rate') THEN
    ALTER TABLE public.inventory ADD COLUMN rental_daily_rate numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'rental_weekly_rate') THEN
    ALTER TABLE public.inventory ADD COLUMN rental_weekly_rate numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'rental_monthly_rate') THEN
    ALTER TABLE public.inventory ADD COLUMN rental_monthly_rate numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'warehouse_location') THEN
    ALTER TABLE public.inventory ADD COLUMN warehouse_location text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'next_available_date') THEN
    ALTER TABLE public.inventory ADD COLUMN next_available_date date;
  END IF;
END $$;

-- Enable RLS on inventory if not already
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Admins manage inventory" ON public.inventory;
DROP POLICY IF EXISTS "Public can view available" ON public.inventory;

-- Create RLS policies for inventory
CREATE POLICY "Admins manage inventory" ON public.inventory FOR ALL USING (is_admin());
CREATE POLICY "Public can view available" ON public.inventory FOR SELECT USING (availability_status = 'Available');

-- Create equipment_rentals table
CREATE TABLE IF NOT EXISTS public.equipment_rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES public.inventory(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_company text,
  customer_phone text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  pickup_date date,
  return_date date,
  daily_rate numeric,
  weekly_rate numeric,
  monthly_rate numeric,
  total_amount numeric,
  deposit_amount numeric,
  status text DEFAULT 'pending',
  notes text,
  delivery_address text,
  delivery_notes text,
  pickup_reminder_sent boolean DEFAULT false,
  return_reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on equipment_rentals
ALTER TABLE public.equipment_rentals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for equipment_rentals
DROP POLICY IF EXISTS "Admins manage rentals" ON public.equipment_rentals;
CREATE POLICY "Admins manage rentals" ON public.equipment_rentals FOR ALL USING (is_admin());

-- Create trigger for updated_at on inventory
DROP TRIGGER IF EXISTS update_inventory_updated_at ON public.inventory;
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on equipment_rentals
DROP TRIGGER IF EXISTS update_equipment_rentals_updated_at ON public.equipment_rentals;
CREATE TRIGGER update_equipment_rentals_updated_at
  BEFORE UPDATE ON public.equipment_rentals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for equipment_rentals
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment_rentals;