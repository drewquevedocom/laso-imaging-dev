-- Create function to calculate lead score automatically on insert
CREATE OR REPLACE FUNCTION public.calculate_lead_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rule RECORD;
  total_score INTEGER := 0;
  field_value TEXT;
BEGIN
  -- Loop through active scoring rules
  FOR rule IN 
    SELECT * FROM lead_scoring_rules WHERE is_active = true
  LOOP
    -- Get the field value from the new lead
    CASE rule.condition_field
      WHEN 'interest' THEN field_value := NEW.interest;
      WHEN 'phone' THEN field_value := NEW.phone;
      WHEN 'company' THEN field_value := NEW.company;
      WHEN 'email' THEN field_value := NEW.email;
      WHEN 'name' THEN field_value := NEW.name;
      WHEN 'source_page' THEN field_value := NEW.source_page;
      ELSE field_value := NULL;
    END CASE;
    
    -- Check if rule matches
    IF rule.condition_value = 'not_empty' THEN
      -- Check if field has a value
      IF field_value IS NOT NULL AND TRIM(field_value) <> '' THEN
        total_score := total_score + rule.points;
      END IF;
    ELSE
      -- Check if field contains the condition value (case-insensitive)
      IF field_value IS NOT NULL AND LOWER(field_value) LIKE '%' || LOWER(rule.condition_value) || '%' THEN
        total_score := total_score + rule.points;
      END IF;
    END IF;
  END LOOP;
  
  -- Update the lead with calculated score
  -- is_hot = true if score >= 50
  UPDATE leads 
  SET 
    lead_score = total_score,
    is_hot = (total_score >= 50)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically calculate score on insert
CREATE TRIGGER trigger_calculate_lead_score
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION calculate_lead_score();