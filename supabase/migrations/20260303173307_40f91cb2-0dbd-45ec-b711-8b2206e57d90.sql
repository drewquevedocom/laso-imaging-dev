
-- ============================================
-- FIX 1: chat_messages - Remove overly permissive policies, keep session-based + customer + admin
-- ============================================
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;

-- Allow inserts with a valid session (chatbot widget uses session_id header)
CREATE POLICY "Session users can insert messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.chat_conversations
    WHERE session_id = public.get_session_id()
  )
  OR
  conversation_id IN (
    SELECT id FROM public.chat_conversations
    WHERE type = 'support' AND customer_id IN (
      SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
    )
  )
  OR is_admin()
);

-- Allow viewing messages for own session, own support conversations, or admins
CREATE POLICY "Session users can view messages"
ON public.chat_messages
FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM public.chat_conversations
    WHERE session_id = public.get_session_id()
  )
  OR
  conversation_id IN (
    SELECT id FROM public.chat_conversations
    WHERE type = 'support' AND customer_id IN (
      SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
    )
  )
  OR is_admin()
);

-- Admins can update/delete messages
CREATE POLICY "Admins can manage messages"
ON public.chat_messages
FOR ALL
USING (is_admin());

-- ============================================
-- FIX 2: chat_conversations - Remove overly permissive policies
-- ============================================
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can view conversations" ON public.chat_conversations;

-- Session-based insert for chatbot widget
CREATE POLICY "Session users can create conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (
  session_id = public.get_session_id()
  OR (type = 'support' AND customer_id IN (
    SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
  ))
  OR is_admin()
);

-- Session-based view
CREATE POLICY "Session users can view conversations"
ON public.chat_conversations
FOR SELECT
USING (
  session_id = public.get_session_id()
  OR (type = 'support' AND customer_id IN (
    SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
  ))
  OR is_admin()
);

-- Session-based update (for last_message_at, unread_count)
CREATE POLICY "Session users can update conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  session_id = public.get_session_id()
  OR (type = 'support' AND customer_id IN (
    SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
  ))
  OR is_admin()
);

-- ============================================
-- FIX 3: quotes - Fix token-based access to require matching specific token
-- ============================================
DROP POLICY IF EXISTS "Public can view quotes by token" ON public.quotes;

-- Only allow viewing a specific quote when the acceptance_token matches the request
-- This prevents listing all quotes; callers must know the exact token
CREATE POLICY "Public can view quote by acceptance token"
ON public.quotes
FOR SELECT
USING (
  acceptance_token IS NOT NULL 
  AND acceptance_token::text = coalesce(
    current_setting('request.headers', true)::json->>'x-acceptance-token',
    ''
  )
);

-- ============================================
-- FIX 4: quotes - Allow public UPDATE for acceptance (accept/reject via token)
-- ============================================
CREATE POLICY "Public can update quote via acceptance token"
ON public.quotes
FOR UPDATE
USING (
  acceptance_token IS NOT NULL 
  AND acceptance_token::text = coalesce(
    current_setting('request.headers', true)::json->>'x-acceptance-token',
    ''
  )
);
