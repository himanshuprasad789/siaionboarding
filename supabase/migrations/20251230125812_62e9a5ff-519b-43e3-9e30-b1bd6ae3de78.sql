-- Create workflow_fields table for custom field definitions
CREATE TABLE public.workflow_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox', 'url', 'email')),
  options JSONB DEFAULT '[]'::jsonb,
  is_required BOOLEAN DEFAULT false,
  default_value JSONB,
  order_index INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workflow_id, name)
);

-- Create ticket_field_values table for storing custom field values per ticket
CREATE TABLE public.ticket_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES public.workflow_fields(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ticket_id, field_id)
);

-- Enable RLS
ALTER TABLE public.workflow_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_field_values ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflow_fields (admin manage, staff read)
CREATE POLICY "Admin can manage workflow fields"
ON public.workflow_fields
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Staff can view workflow fields"
ON public.workflow_fields
FOR SELECT
USING (is_staff(auth.uid()));

-- RLS policies for ticket_field_values (staff full access, clients read own)
CREATE POLICY "Staff can manage ticket field values"
ON public.ticket_field_values
FOR ALL
USING (is_staff(auth.uid()));

CREATE POLICY "Clients can view their ticket field values"
ON public.ticket_field_values
FOR SELECT
USING (
  ticket_id IN (
    SELECT id FROM public.tickets 
    WHERE client_id = get_client_profile_id(auth.uid())
  )
);

-- Add updated_at triggers
CREATE TRIGGER update_workflow_fields_updated_at
BEFORE UPDATE ON public.workflow_fields
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ticket_field_values_updated_at
BEFORE UPDATE ON public.ticket_field_values
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();