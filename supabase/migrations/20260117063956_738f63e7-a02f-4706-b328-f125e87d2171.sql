-- Add communication preference columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN DEFAULT true;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT false;

-- Add communication preference columns to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN DEFAULT true;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT false;

-- Add communication preference columns to equipment_sell_requests table
ALTER TABLE equipment_sell_requests ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN DEFAULT true;
ALTER TABLE equipment_sell_requests ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT false;