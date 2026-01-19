-- Add follow-up tracking columns to product_offers table
ALTER TABLE public.product_offers 
ADD COLUMN IF NOT EXISTS purchase_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS follow_up_sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS follow_up_count integer DEFAULT 0;