-- 1. Create helper function to check admin status (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
$$;

-- 2. Fix admin_users policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

CREATE POLICY "Admins can view admin users" 
ON admin_users FOR SELECT 
USING (public.is_admin());

-- 3. Fix leads policies to use the helper function
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
DROP POLICY IF EXISTS "Admins can update leads" ON leads;

CREATE POLICY "Admins can view all leads" 
ON leads FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update leads" 
ON leads FOR UPDATE 
USING (public.is_admin());