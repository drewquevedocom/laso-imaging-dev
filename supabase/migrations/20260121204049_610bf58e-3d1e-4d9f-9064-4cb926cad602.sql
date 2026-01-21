-- 1. Add notification preferences to customer_profiles
ALTER TABLE customer_profiles 
ADD COLUMN IF NOT EXISTS push_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"quotes": true, "orders": true, "messages": true}'::jsonb;

-- 2. Create customer notifications table
CREATE TABLE IF NOT EXISTS customer_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customer_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own notifications"
ON customer_notifications FOR SELECT
USING (customer_id IN (
  SELECT id FROM customer_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Customers can update their own notifications"
ON customer_notifications FOR UPDATE
USING (customer_id IN (
  SELECT id FROM customer_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all notifications"
ON customer_notifications FOR ALL
USING (is_admin());

-- 3. Link quotes to customers
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customer_profiles(id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);

-- Update quotes RLS for customer access
CREATE POLICY "Customers can view their own quotes"
ON quotes FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
  )
);

-- 4. Create saved equipment table
CREATE TABLE IF NOT EXISTS customer_saved_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  shopify_product_id TEXT,
  product_name TEXT NOT NULL,
  product_data JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, inventory_id),
  UNIQUE(customer_id, shopify_product_id)
);

ALTER TABLE customer_saved_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage their saved equipment"
ON customer_saved_equipment FOR ALL
USING (customer_id IN (
  SELECT id FROM customer_profiles WHERE user_id = auth.uid()
));

-- 5. Enhance chat tables for support messaging
ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'ai',
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS unread_count INTEGER DEFAULT 0;

ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_customer_type 
ON chat_conversations(customer_id, type);

-- RLS for support conversations
CREATE POLICY "Customers can view their support conversations"
ON chat_conversations FOR SELECT
USING (
  type = 'support' AND customer_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Customers can create support conversations"
ON chat_conversations FOR INSERT
WITH CHECK (
  type = 'support' AND customer_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Customers can insert support messages"
ON chat_messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE type = 'support' AND customer_id IN (
      SELECT id FROM customer_profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Customers can view support messages"
ON chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE type = 'support' AND customer_id IN (
      SELECT id FROM customer_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE customer_notifications;