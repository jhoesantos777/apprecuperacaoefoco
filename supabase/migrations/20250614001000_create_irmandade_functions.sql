
-- Function to check if user is a member of Irmandade
CREATE OR REPLACE FUNCTION public.check_irmandade_membership(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user exists in irmandade_members
  RETURN EXISTS (
    SELECT 1
    FROM public.irmandade_members
    WHERE user_id = user_id_param
  );
END;
$$;

-- Function to join Irmandade
CREATE OR REPLACE FUNCTION public.join_irmandade(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert user into irmandade_members if not already there
  INSERT INTO public.irmandade_members (user_id)
  VALUES (user_id_param)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to leave Irmandade
CREATE OR REPLACE FUNCTION public.leave_irmandade(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove user from irmandade_members
  DELETE FROM public.irmandade_members
  WHERE user_id = user_id_param;
END;
$$;
