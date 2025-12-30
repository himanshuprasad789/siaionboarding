-- Step 1: Clear existing related_workflow_id values that reference client_workflows
UPDATE public.tickets SET related_workflow_id = NULL;

-- Step 2: Drop the old FK constraint that references client_workflows
ALTER TABLE public.tickets DROP CONSTRAINT tickets_related_workflow_id_fkey;

-- Step 3: Add new FK constraint referencing workflows table directly
ALTER TABLE public.tickets 
ADD CONSTRAINT tickets_related_workflow_id_fkey 
FOREIGN KEY (related_workflow_id) REFERENCES public.workflows(id);

-- Step 4: Add current_stage_id column
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS current_stage_id uuid REFERENCES public.workflow_stages(id);

-- Step 5: Update tickets with proper workflow references based on assigned_team
UPDATE public.tickets t
SET related_workflow_id = w.id
FROM public.workflows w
WHERE t.assigned_team = w.team;

-- Step 6: Set current_stage_id to the first stage of each workflow
UPDATE public.tickets t
SET current_stage_id = ws.id
FROM public.workflow_stages ws
WHERE t.related_workflow_id = ws.workflow_id
AND ws.order_index = (
  SELECT MIN(order_index) 
  FROM public.workflow_stages 
  WHERE workflow_id = t.related_workflow_id
);