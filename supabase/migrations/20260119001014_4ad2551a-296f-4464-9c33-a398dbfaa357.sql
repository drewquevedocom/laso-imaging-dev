-- Add columns to track offer creator for notifications
ALTER TABLE product_offers 
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS created_by_email text;