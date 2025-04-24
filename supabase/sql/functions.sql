
-- Function to get daily tasks
CREATE OR REPLACE FUNCTION public.get_daily_tasks()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  points INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    dt.id,
    dt.name,
    dt.description,
    dt.points
  FROM 
    public.daily_tasks dt;
END;
$$;

-- Function to get user task completions for the current user after a given date
CREATE OR REPLACE FUNCTION public.get_user_task_completions(min_date TIMESTAMPTZ)
RETURNS TABLE (
  task_id UUID,
  completed_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    utc.task_id,
    utc.completed_at
  FROM 
    public.user_task_completions utc
  WHERE 
    utc.user_id = auth.uid() AND
    utc.completed_at >= min_date;
END;
$$;

-- Function to complete a task for the current user
CREATE OR REPLACE FUNCTION public.complete_task(task_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today DATE := current_date;
  task_exists BOOLEAN;
BEGIN
  -- Check if task exists
  SELECT EXISTS(SELECT 1 FROM public.daily_tasks WHERE id = task_id_param) INTO task_exists;
  
  IF NOT task_exists THEN
    RAISE EXCEPTION 'Task not found';
  END IF;
  
  -- Check if already completed today
  IF EXISTS(
    SELECT 1 
    FROM public.user_task_completions 
    WHERE 
      user_id = auth.uid() AND 
      task_id = task_id_param AND 
      completed_at::date = today
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Insert new completion
  INSERT INTO public.user_task_completions (user_id, task_id)
  VALUES (auth.uid(), task_id_param);
  
  RETURN TRUE;
END;
$$;
