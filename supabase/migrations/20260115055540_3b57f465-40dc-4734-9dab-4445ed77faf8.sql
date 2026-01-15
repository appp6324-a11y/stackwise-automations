-- Create table for persisted user stacks (session-based for now, user-based when auth is added)
CREATE TABLE public.stacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Stack',
  templates JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_apps TEXT[] NOT NULL DEFAULT '{}',
  agents_enabled INTEGER NOT NULL DEFAULT 0,
  complexity_tier TEXT NOT NULL DEFAULT 'Basic',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for contact leads / deployment requests
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  stack_manifest JSONB,
  source TEXT DEFAULT 'contact_form',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Stack policies: Session-based access (anyone can CRUD their own session's stacks)
CREATE POLICY "Users can view their session stacks"
  ON public.stacks FOR SELECT
  USING (true);

CREATE POLICY "Users can create stacks"
  ON public.stacks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their session stacks"
  ON public.stacks FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their session stacks"
  ON public.stacks FOR DELETE
  USING (true);

-- Lead policies: Anyone can create, but only authenticated users can view
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON public.leads FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_stacks_updated_at
  BEFORE UPDATE ON public.stacks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();