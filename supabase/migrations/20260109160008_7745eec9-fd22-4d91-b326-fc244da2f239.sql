-- Drop public SELECT policy on lead_scoring_rules to hide business logic
DROP POLICY IF EXISTS "Anyone can view scoring rules" ON public.lead_scoring_rules;