-- =============================================================================
-- PHASE 1: CORE DATABASE SCHEMA FOR IMMIGRATION PLATFORM
-- =============================================================================

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Application role enum (for user roles)
CREATE TYPE public.app_role AS ENUM ('client', 'press', 'research', 'paper', 'admin');

-- Opportunity status enum
CREATE TYPE public.opportunity_status AS ENUM ('draft', 'review', 'published', 'archived');

-- Ticket status enum
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'pending_review', 'closed');

-- Ticket priority enum
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Evidence type enum
CREATE TYPE public.evidence_type AS ENUM (
  'publication',
  'citation',
  'patent',
  'award',
  'grant',
  'media_coverage',
  'speaking_engagement',
  'review_work',
  'membership',
  'leadership',
  'salary_evidence',
  'other'
);

-- Evidence status enum
CREATE TYPE public.evidence_status AS ENUM ('pending', 'approved', 'rejected', 'needs_revision');

-- Workflow stage status enum
CREATE TYPE public.workflow_stage_status AS ENUM ('pending', 'in_progress', 'completed', 'blocked');

-- Permission level enum
CREATE TYPE public.permission_level AS ENUM ('hidden', 'masked', 'read', 'edit');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- =============================================================================
-- CLIENT-FACING TABLES
-- =============================================================================

-- Client profiles (extended profile for immigration clients)
CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  field_of_expertise TEXT,
  niche TEXT,
  years_experience INTEGER,
  current_employer TEXT,
  current_title TEXT,
  target_visa_type TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Opportunities (immigration categories/criteria)
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  evidence_types TEXT[] DEFAULT '{}',
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_time_weeks INTEGER,
  status opportunity_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Client opportunities (junction table for client's selected opportunities)
CREATE TABLE public.client_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, opportunity_id)
);

-- Evidence items (submitted by clients)
CREATE TABLE public.evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  evidence_type evidence_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status evidence_status NOT NULL DEFAULT 'pending',
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- WORKFLOW TABLES
-- =============================================================================

-- Workflows (templates for different processes)
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  team TEXT NOT NULL CHECK (team IN ('press', 'research', 'paper')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workflow stages
CREATE TABLE public.workflow_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_hours INTEGER,
  required_role app_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workflow_id, order_index)
);

-- Workflow permissions (role-based access per stage)
CREATE TABLE public.workflow_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  permission_level permission_level NOT NULL DEFAULT 'read',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workflow_id, stage_id, role)
);

-- Client workflow instances (active workflows for a client)
CREATE TABLE public.client_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  current_stage_id UUID REFERENCES public.workflow_stages(id),
  status workflow_stage_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workflow stage progress (tracks progress through each stage)
CREATE TABLE public.workflow_stage_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_workflow_id UUID NOT NULL REFERENCES public.client_workflows(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  status workflow_stage_status NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_workflow_id, stage_id)
);

-- =============================================================================
-- TICKET SYSTEM
-- =============================================================================

-- Tickets
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  assigned_team TEXT CHECK (assigned_team IN ('press', 'research', 'paper', 'admin')),
  assigned_to UUID REFERENCES auth.users(id),
  related_workflow_id UUID REFERENCES public.client_workflows(id),
  related_evidence_id UUID REFERENCES public.evidence_items(id),
  due_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ticket comments
CREATE TABLE public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- MESSAGING SYSTEM
-- =============================================================================

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- AUDIT & ACTIVITY LOGGING
-- =============================================================================

-- Activity log
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stage_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECURITY DEFINER FUNCTIONS (for role checking without recursion)
-- =============================================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user has any staff role
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('press', 'research', 'paper', 'admin')
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Function to get user's client profile ID
CREATE OR REPLACE FUNCTION public.get_client_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.client_profiles WHERE user_id = _user_id
$$;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies (only admin can manage, users can view their own)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Client profiles policies
CREATE POLICY "Clients can view their own client profile"
  ON public.client_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can update their own client profile"
  ON public.client_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can insert their own client profile"
  ON public.client_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all client profiles"
  ON public.client_profiles FOR SELECT
  USING (public.is_staff(auth.uid()));

-- Opportunities policies (public read, staff write)
CREATE POLICY "Anyone can view published opportunities"
  ON public.opportunities FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update opportunities"
  ON public.opportunities FOR UPDATE
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin can delete opportunities"
  ON public.opportunities FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Client opportunities policies
CREATE POLICY "Clients can view their own opportunities"
  ON public.client_opportunities FOR SELECT
  USING (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Clients can manage their own opportunities"
  ON public.client_opportunities FOR INSERT
  WITH CHECK (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Clients can update their own opportunities"
  ON public.client_opportunities FOR UPDATE
  USING (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Clients can delete their own opportunities"
  ON public.client_opportunities FOR DELETE
  USING (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Staff can view all client opportunities"
  ON public.client_opportunities FOR SELECT
  USING (public.is_staff(auth.uid()));

-- Evidence items policies
CREATE POLICY "Clients can view their own evidence"
  ON public.evidence_items FOR SELECT
  USING (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Clients can insert their own evidence"
  ON public.evidence_items FOR INSERT
  WITH CHECK (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Clients can update their own pending evidence"
  ON public.evidence_items FOR UPDATE
  USING (client_id = public.get_client_profile_id(auth.uid()) AND status = 'pending');

CREATE POLICY "Staff can view all evidence"
  ON public.evidence_items FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update evidence"
  ON public.evidence_items FOR UPDATE
  USING (public.is_staff(auth.uid()));

-- Workflows policies (staff only)
CREATE POLICY "Staff can view workflows"
  ON public.workflows FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin can manage workflows"
  ON public.workflows FOR ALL
  USING (public.is_admin(auth.uid()));

-- Workflow stages policies
CREATE POLICY "Staff can view workflow stages"
  ON public.workflow_stages FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin can manage workflow stages"
  ON public.workflow_stages FOR ALL
  USING (public.is_admin(auth.uid()));

-- Workflow permissions policies
CREATE POLICY "Staff can view workflow permissions"
  ON public.workflow_permissions FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin can manage workflow permissions"
  ON public.workflow_permissions FOR ALL
  USING (public.is_admin(auth.uid()));

-- Client workflows policies
CREATE POLICY "Clients can view their own workflows"
  ON public.client_workflows FOR SELECT
  USING (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Staff can view all client workflows"
  ON public.client_workflows FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage client workflows"
  ON public.client_workflows FOR ALL
  USING (public.is_staff(auth.uid()));

-- Workflow stage progress policies
CREATE POLICY "Clients can view their own workflow progress"
  ON public.workflow_stage_progress FOR SELECT
  USING (
    client_workflow_id IN (
      SELECT id FROM public.client_workflows 
      WHERE client_id = public.get_client_profile_id(auth.uid())
    )
  );

CREATE POLICY "Staff can view all workflow progress"
  ON public.workflow_stage_progress FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage workflow progress"
  ON public.workflow_stage_progress FOR ALL
  USING (public.is_staff(auth.uid()));

-- Tickets policies
CREATE POLICY "Clients can view their own tickets"
  ON public.tickets FOR SELECT
  USING (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Clients can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (client_id = public.get_client_profile_id(auth.uid()));

CREATE POLICY "Staff can view all tickets"
  ON public.tickets FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage tickets"
  ON public.tickets FOR ALL
  USING (public.is_staff(auth.uid()));

-- Ticket comments policies
CREATE POLICY "Clients can view non-internal comments on their tickets"
  ON public.ticket_comments FOR SELECT
  USING (
    is_internal = false AND
    ticket_id IN (
      SELECT id FROM public.tickets 
      WHERE client_id = public.get_client_profile_id(auth.uid())
    )
  );

CREATE POLICY "Clients can create comments on their tickets"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    is_internal = false AND
    ticket_id IN (
      SELECT id FROM public.tickets 
      WHERE client_id = public.get_client_profile_id(auth.uid())
    )
  );

CREATE POLICY "Staff can view all comments"
  ON public.ticket_comments FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can create comments"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()) AND author_id = auth.uid());

CREATE POLICY "Authors can update their own comments"
  ON public.ticket_comments FOR UPDATE
  USING (author_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update messages (mark read)"
  ON public.messages FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Activity log policies (staff only read, system insert)
CREATE POLICY "Staff can view activity logs"
  ON public.activity_log FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Authenticated users can create activity logs"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evidence_items_updated_at
  BEFORE UPDATE ON public.evidence_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_workflows_updated_at
  BEFORE UPDATE ON public.client_workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_stage_progress_updated_at
  BEFORE UPDATE ON public.workflow_stage_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ticket_comments_updated_at
  BEFORE UPDATE ON public.ticket_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_client_profiles_user_id ON public.client_profiles(user_id);
CREATE INDEX idx_opportunities_status ON public.opportunities(status);
CREATE INDEX idx_opportunities_category ON public.opportunities(category);
CREATE INDEX idx_client_opportunities_client_id ON public.client_opportunities(client_id);
CREATE INDEX idx_evidence_items_client_id ON public.evidence_items(client_id);
CREATE INDEX idx_evidence_items_status ON public.evidence_items(status);
CREATE INDEX idx_workflow_stages_workflow_id ON public.workflow_stages(workflow_id);
CREATE INDEX idx_client_workflows_client_id ON public.client_workflows(client_id);
CREATE INDEX idx_workflow_stage_progress_client_workflow_id ON public.workflow_stage_progress(client_workflow_id);
CREATE INDEX idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity_type ON public.activity_log(entity_type);