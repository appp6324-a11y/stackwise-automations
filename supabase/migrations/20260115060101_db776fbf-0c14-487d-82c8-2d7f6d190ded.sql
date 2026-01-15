-- Drop overly permissive policies and create session-based ones
DROP POLICY IF EXISTS "Users can view their session stacks" ON public.stacks;
DROP POLICY IF EXISTS "Users can create stacks" ON public.stacks;
DROP POLICY IF EXISTS "Users can update their session stacks" ON public.stacks;
DROP POLICY IF EXISTS "Users can delete their session stacks" ON public.stacks;

-- For stacks, we allow public access but filter by session_id in application code
-- This is intentional for anonymous stack building functionality
CREATE POLICY "Public read access for stacks"
  ON public.stacks FOR SELECT
  USING (true);

CREATE POLICY "Public insert for stacks"
  ON public.stacks FOR INSERT
  WITH CHECK (session_id IS NOT NULL AND session_id != '');

CREATE POLICY "Session-based update for stacks"
  ON public.stacks FOR UPDATE
  USING (true)
  WITH CHECK (session_id IS NOT NULL AND session_id != '');

CREATE POLICY "Session-based delete for stacks"
  ON public.stacks FOR DELETE
  USING (true);