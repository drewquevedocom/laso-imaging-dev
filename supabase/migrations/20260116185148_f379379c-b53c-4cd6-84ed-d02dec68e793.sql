-- Create customer_reviews table for collecting testimonials
CREATE TABLE public.customer_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  title TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  service_used TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews"
ON public.customer_reviews
FOR INSERT
WITH CHECK (true);

-- Only admins can view reviews
CREATE POLICY "Admins can view reviews"
ON public.customer_reviews
FOR SELECT
USING (is_admin());

-- Only admins can update reviews
CREATE POLICY "Admins can update reviews"
ON public.customer_reviews
FOR UPDATE
USING (is_admin());

-- Only admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.customer_reviews
FOR DELETE
USING (is_admin());