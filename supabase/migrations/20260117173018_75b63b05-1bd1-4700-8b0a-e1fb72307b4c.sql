-- Create equipment_images table for photo gallery
CREATE TABLE public.equipment_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sell_request_id uuid REFERENCES equipment_sell_requests(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  image_type text DEFAULT 'general',
  caption text,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.equipment_images ENABLE ROW LEVEL SECURITY;

-- Policies for equipment_images
CREATE POLICY "Admins can manage images" ON public.equipment_images FOR ALL USING (is_admin());
CREATE POLICY "Anyone can upload images" ON public.equipment_images FOR INSERT WITH CHECK (true);

-- Create email_templates table
CREATE TABLE public.email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  variables jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Policies for email_templates
CREATE POLICY "Admins can manage templates" ON public.email_templates FOR ALL USING (is_admin());

-- Create site_visits table
CREATE TABLE public.site_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sell_request_id uuid REFERENCES equipment_sell_requests(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  scheduled_date date NOT NULL,
  scheduled_time time,
  duration_hours integer DEFAULT 2,
  location_address text,
  location_notes text,
  contact_name text,
  contact_phone text,
  contact_email text,
  assigned_to uuid,
  status text DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Policies for site_visits
CREATE POLICY "Admins can manage site visits" ON public.site_visits FOR ALL USING (is_admin());

-- Enable realtime for site visits
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;

-- Create storage bucket for equipment photos
INSERT INTO storage.buckets (id, name, public) VALUES ('equipment-photos', 'equipment-photos', true);

-- Storage policies for equipment-photos bucket
CREATE POLICY "Anyone can view equipment photos" ON storage.objects FOR SELECT USING (bucket_id = 'equipment-photos');
CREATE POLICY "Admins can upload equipment photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'equipment-photos' AND is_admin());
CREATE POLICY "Admins can update equipment photos" ON storage.objects FOR UPDATE USING (bucket_id = 'equipment-photos' AND is_admin());
CREATE POLICY "Admins can delete equipment photos" ON storage.objects FOR DELETE USING (bucket_id = 'equipment-photos' AND is_admin());

-- Insert default email templates
INSERT INTO public.email_templates (name, category, subject, body_html, body_text, variables) VALUES
(
  'General Follow-Up',
  'follow_up',
  'Following up on your {{equipment_type}} inquiry',
  '<html><body style="font-family: sans-serif; color: #1f2937;"><p>Dear {{name}},</p><p>I wanted to follow up on your recent inquiry about {{equipment_type}} equipment.</p><p>We have several options that might be perfect for your needs. Would you be available for a quick call to discuss your requirements in more detail?</p><p>Please let me know a convenient time, or feel free to reply to this email with any questions.</p><p>Best regards,<br/>LASO Imaging Team</p><hr/><p style="color: #6b7280; font-size: 12px;">LASO Imaging Solutions<br/>14900 Magnolia Blvd #5442<br/>Sherman Oaks, CA 91413</p></body></html>',
  'Dear {{name}}, I wanted to follow up on your recent inquiry about {{equipment_type}} equipment. We have several options that might be perfect for your needs. Would you be available for a quick call to discuss your requirements in more detail? Best regards, LASO Imaging Team',
  '["name", "equipment_type", "company"]'::jsonb
),
(
  'Pricing Information',
  'pricing',
  'Pricing for {{manufacturer}} {{model}} - LASO Imaging',
  '<html><body style="font-family: sans-serif; color: #1f2937;"><p>Dear {{name}},</p><p>Thank you for your interest in the {{manufacturer}} {{model}}.</p><p>Based on our current inventory and market conditions, I''m pleased to provide the following pricing information:</p><ul><li><strong>Equipment:</strong> {{manufacturer}} {{model}}</li><li><strong>Condition:</strong> {{condition}}</li><li><strong>Price Range:</strong> Please contact us for current pricing</li></ul><p>This pricing includes:</p><ul><li>Complete system inspection and testing</li><li>Standard warranty coverage</li><li>Technical documentation</li></ul><p>Additional services available:</p><ul><li>Professional de-installation</li><li>Rigging and transportation</li><li>Installation and commissioning</li><li>Extended warranty options</li></ul><p>Ready to proceed? Reply to this email or call us to discuss next steps.</p><p>Best regards,<br/>LASO Imaging Team</p><hr/><p style="color: #6b7280; font-size: 12px;">LASO Imaging Solutions<br/>14900 Magnolia Blvd #5442<br/>Sherman Oaks, CA 91413</p></body></html>',
  'Dear {{name}}, Thank you for your interest in the {{manufacturer}} {{model}}. Please contact us for current pricing information. Best regards, LASO Imaging Team',
  '["name", "manufacturer", "model", "condition", "company"]'::jsonb
),
(
  'Shipping & Logistics',
  'shipping',
  'Shipping & Delivery Information for Your Equipment',
  '<html><body style="font-family: sans-serif; color: #1f2937;"><p>Dear {{name}},</p><p>Thank you for your order! Here are the shipping and delivery details for your equipment:</p><h3>Equipment Details</h3><ul><li><strong>System:</strong> {{manufacturer}} {{model}}</li><li><strong>Order Reference:</strong> {{order_number}}</li></ul><h3>Shipping Information</h3><p>Our logistics team will coordinate the following:</p><ul><li>Professional crating and packaging</li><li>Climate-controlled transportation</li><li>White glove delivery service</li><li>On-site placement assistance</li></ul><h3>Timeline</h3><p>Estimated delivery: {{delivery_date}}</p><p>Our team will contact you 48-72 hours before delivery to confirm the schedule and ensure your site is prepared.</p><h3>Site Preparation</h3><p>Please ensure the following before delivery:</p><ul><li>Clear pathway from delivery point to installation location</li><li>Required electrical connections ready</li><li>HVAC requirements met</li></ul><p>Questions? Reply to this email or call us anytime.</p><p>Best regards,<br/>LASO Imaging Logistics Team</p><hr/><p style="color: #6b7280; font-size: 12px;">LASO Imaging Solutions<br/>14900 Magnolia Blvd #5442<br/>Sherman Oaks, CA 91413</p></body></html>',
  'Dear {{name}}, Thank you for your order! Our team will coordinate delivery of your {{manufacturer}} {{model}}. Estimated delivery: {{delivery_date}}. Best regards, LASO Imaging Logistics Team',
  '["name", "manufacturer", "model", "order_number", "delivery_date", "company"]'::jsonb
),
(
  'Site Visit Confirmation',
  'site_visit',
  'Site Visit Confirmed - {{scheduled_date}}',
  '<html><body style="font-family: sans-serif; color: #1f2937;"><p>Dear {{name}},</p><p>This email confirms your scheduled site visit for equipment inspection.</p><h3>📅 Visit Details</h3><ul><li><strong>Date:</strong> {{scheduled_date}}</li><li><strong>Time:</strong> {{scheduled_time}}</li><li><strong>Duration:</strong> {{duration}} hours</li><li><strong>Location:</strong> {{location}}</li></ul><h3>🔍 What to Expect</h3><p>Our team will:</p><ul><li>Conduct a thorough visual inspection</li><li>Review system functionality and performance</li><li>Document current condition with photos/video</li><li>Assess logistics for removal and transportation</li></ul><h3>📋 Please Have Ready</h3><ul><li>Service history and maintenance records</li><li>Access to the equipment room</li><li>Any relevant documentation (manuals, certificates)</li><li>Site contact available during the visit</li></ul><p>Need to reschedule? Reply to this email at least 24 hours before the visit.</p><p>Best regards,<br/>LASO Imaging Acquisitions Team</p><hr/><p style="color: #6b7280; font-size: 12px;">LASO Imaging Solutions<br/>14900 Magnolia Blvd #5442<br/>Sherman Oaks, CA 91413</p></body></html>',
  'Dear {{name}}, This confirms your site visit on {{scheduled_date}} at {{scheduled_time}}. Location: {{location}}. Please have service records and equipment access ready. Best regards, LASO Imaging Team',
  '["name", "scheduled_date", "scheduled_time", "duration", "location", "company"]'::jsonb
),
(
  'Asset Documentation Request',
  'asset_request',
  'Request for Equipment Photos & Video - LASO Imaging',
  '<html><body style="font-family: sans-serif; color: #1f2937;"><h2>Equipment Documentation Request</h2><p>Dear {{name}},</p><p>Thank you for your interest in selling your {{manufacturer}} {{model}}.</p><p>To provide you with an accurate valuation, we need some visual documentation:</p><h3>📷 Photos Requested:</h3><ul><li>Full system exterior (all 4 sides)</li><li>Console/operator workstation</li><li>Serial number and model plates</li><li>Any areas with visible wear or damage</li><li>Coil cabinet and RF coils (for MRI)</li><li>Cold head display showing helium level (for MRI)</li></ul><h3>🎥 Video Requested:</h3><p>A 30-60 second walkthrough showing the system powering on and general condition.</p><p>You can reply directly to this email with attachments.</p><p>Best regards,<br/>LASO Imaging Acquisitions Team</p><hr/><p style="color: #6b7280; font-size: 12px;">LASO Imaging Solutions<br/>14900 Magnolia Blvd #5442<br/>Sherman Oaks, CA 91413</p></body></html>',
  'Dear {{name}}, Thank you for your interest in selling your {{manufacturer}} {{model}}. To provide an accurate valuation, please send photos of the equipment exterior, console, serial plates, and any wear areas. A short video walkthrough would also be helpful. Best regards, LASO Imaging Team',
  '["name", "manufacturer", "model", "equipment_type", "company"]'::jsonb
);

-- Add updated_at trigger for email_templates
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for site_visits
CREATE TRIGGER update_site_visits_updated_at
  BEFORE UPDATE ON public.site_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();