
-- Update handle_new_customer to read customer_type and phone from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_customer()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.customer_profiles (user_id, contact_name, customer_type, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'customer_type', 'general'),
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;
