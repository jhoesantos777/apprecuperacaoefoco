
-- Create the irmandade_members table
CREATE TABLE IF NOT EXISTS public.irmandade_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT irmandade_members_user_id_key UNIQUE (user_id)
);

-- Add Row Level Security
ALTER TABLE public.irmandade_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all members
CREATE POLICY "Users can read all irmandade members"
  ON public.irmandade_members
  FOR SELECT
  USING (true);

-- Create policy to allow users to insert their own membership
CREATE POLICY "Users can insert their own membership"
  ON public.irmandade_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own membership
CREATE POLICY "Users can delete their own membership"
  ON public.irmandade_members
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add story column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS story TEXT;
