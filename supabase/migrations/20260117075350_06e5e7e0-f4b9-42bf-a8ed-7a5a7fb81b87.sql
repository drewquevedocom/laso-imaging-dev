-- Add discount column to quotes table (fixes frontend error)
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS discount numeric(12,2) DEFAULT 0;