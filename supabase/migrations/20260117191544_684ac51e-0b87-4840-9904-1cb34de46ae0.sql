-- Add tracking fields to email_templates for analytics
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS total_sent integer DEFAULT 0;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS total_opened integer DEFAULT 0;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS total_clicked integer DEFAULT 0;

-- Create email_sends table to track individual sends
CREATE TABLE IF NOT EXISTS email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  sell_request_id uuid REFERENCES equipment_sell_requests(id) ON DELETE SET NULL,
  resend_email_id text,
  recipient text NOT NULL,
  subject text,
  status text DEFAULT 'sent',
  opened_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email sends" ON email_sends FOR ALL USING (is_admin());

-- Email automation sequences
CREATE TABLE email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL, -- 'status_change', 'time_delay', 'manual'
  trigger_config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sequences" ON email_sequences FOR ALL USING (is_admin());

-- Steps within a sequence
CREATE TABLE email_sequence_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_order integer NOT NULL,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  delay_days integer DEFAULT 0,
  delay_hours integer DEFAULT 0,
  condition_type text DEFAULT 'always', -- 'always', 'if_no_response', 'if_not_opened'
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage steps" ON email_sequence_steps FOR ALL USING (is_admin());

-- Track sequence enrollments per lead
CREATE TABLE email_sequence_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  current_step integer DEFAULT 0,
  status text DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  next_email_at timestamptz,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(sequence_id, lead_id)
);

ALTER TABLE email_sequence_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage enrollments" ON email_sequence_enrollments FOR ALL USING (is_admin());

-- Add trigger for updated_at on email_sequences
CREATE TRIGGER update_email_sequences_updated_at
  BEFORE UPDATE ON email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();