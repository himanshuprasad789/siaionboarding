-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add status and team fields to client_profiles
ALTER TABLE public.client_profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'onboarding',
ADD COLUMN IF NOT EXISTS assigned_team_id UUID REFERENCES public.teams(id),
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add team_id to profiles for staff team membership
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id);

-- Create team_workflow_access junction table
CREATE TABLE public.team_workflow_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, workflow_id)
);

-- Enable RLS on teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- RLS policies for teams
CREATE POLICY "Staff can view teams"
ON public.teams
FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Admin can manage teams"
ON public.teams
FOR ALL
USING (is_admin(auth.uid()));

-- Enable RLS on team_workflow_access
ALTER TABLE public.team_workflow_access ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_workflow_access
CREATE POLICY "Staff can view team workflow access"
ON public.team_workflow_access
FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Admin can manage team workflow access"
ON public.team_workflow_access
FOR ALL
USING (is_admin(auth.uid()));

-- Create trigger for updated_at on teams
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();