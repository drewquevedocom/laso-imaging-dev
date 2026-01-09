-- Fix PUBLIC_DATA_EXPOSURE: Restrict chat data to session-based access
-- Users can only read their own conversations based on session_id passed in request headers

-- First, drop the overly permissive policies
DROP POLICY IF EXISTS "Users can view their own conversations by session" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update conversations by session" ON public.chat_conversations;

-- Create a function to get session_id from request headers (for anonymous session-based access)
CREATE OR REPLACE FUNCTION public.get_session_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-session-id',
    ''
  )
$$;

-- Create secure SELECT policy for chat_conversations
-- Users can only view conversations matching their session_id from headers
CREATE POLICY "Users can view own conversations by session"
ON public.chat_conversations
FOR SELECT
USING (
  session_id = get_session_id()
  OR is_admin()
);

-- Create secure UPDATE policy for chat_conversations
-- Users can only update their own conversations
CREATE POLICY "Users can update own conversations by session"
ON public.chat_conversations
FOR UPDATE
USING (session_id = get_session_id())
WITH CHECK (session_id = get_session_id());

-- Create secure SELECT policy for chat_messages
-- Users can only view messages from their own conversations
CREATE POLICY "Users can view own messages"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.session_id = get_session_id()
  )
  OR is_admin()
);