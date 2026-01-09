-- Create contractor timecards table
CREATE TABLE public.contractor_timecards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payee_name TEXT NOT NULL,
  payee_email TEXT NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  time_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_hours NUMERIC NOT NULL DEFAULT 0,
  rate_per_hour NUMERIC NOT NULL DEFAULT 0,
  total_pay NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  expense_reimb NUMERIC NOT NULL DEFAULT 0,
  net_pay NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_date DATE,
  send_to_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.contractor_timecards ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit timecards"
ON public.contractor_timecards
FOR INSERT
WITH CHECK (true);

-- Only admins can view all timecards
CREATE POLICY "Admins can view all timecards"
ON public.contractor_timecards
FOR SELECT
USING (is_admin());

-- Only admins can update timecards
CREATE POLICY "Admins can update timecards"
ON public.contractor_timecards
FOR UPDATE
USING (is_admin());

-- Only admins can delete timecards
CREATE POLICY "Admins can delete timecards"
ON public.contractor_timecards
FOR DELETE
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_contractor_timecards_updated_at
BEFORE UPDATE ON public.contractor_timecards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();