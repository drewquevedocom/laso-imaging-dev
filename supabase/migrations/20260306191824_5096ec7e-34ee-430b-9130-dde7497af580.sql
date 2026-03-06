
-- Add columns to timecard_entries
ALTER TABLE public.timecard_entries
  ADD COLUMN IF NOT EXISTS break_minutes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS entry_type text NOT NULL DEFAULT 'clock',
  ADD COLUMN IF NOT EXISTS locked_by_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS unlocked_at timestamptz;

-- Create timecard_weeks table
CREATE TABLE public.timecard_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  week_end date NOT NULL,
  total_hours numeric NOT NULL DEFAULT 0,
  submitted boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.timecard_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weeks" ON public.timecard_weeks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weeks" ON public.timecard_weeks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weeks" ON public.timecard_weeks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all weeks" ON public.timecard_weeks
  FOR ALL USING (is_admin());

-- Create timecard_audit_log table
CREATE TABLE public.timecard_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timecard_entry_id uuid REFERENCES public.timecard_entries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  action text NOT NULL,
  old_value text,
  new_value text,
  edit_reason text,
  performed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timecard_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" ON public.timecard_audit_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own audit logs" ON public.timecard_audit_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all audit logs" ON public.timecard_audit_log
  FOR ALL USING (is_admin());

-- Create timecard_breaks table
CREATE TABLE public.timecard_breaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.timecard_entries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  break_start timestamptz NOT NULL DEFAULT now(),
  break_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timecard_breaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own breaks" ON public.timecard_breaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own breaks" ON public.timecard_breaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own breaks" ON public.timecard_breaks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all breaks" ON public.timecard_breaks
  FOR ALL USING (is_admin());
