import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface WorkflowField {
  id: string;
  workflow_id: string;
  name: string;
  label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url' | 'email';
  options: { label: string; value: string }[];
  is_required: boolean;
  default_value: unknown;
  order_index: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketFieldValue {
  id: string;
  ticket_id: string;
  field_id: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

export function useWorkflowFields(workflowId: string | undefined) {
  return useQuery({
    queryKey: ['workflow-fields', workflowId],
    queryFn: async () => {
      if (!workflowId) return [];
      const { data, error } = await supabase
        .from('workflow_fields')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return (data || []) as WorkflowField[];
    },
    enabled: !!workflowId,
  });
}

export function useTicketFieldValues(ticketId: string | undefined) {
  return useQuery({
    queryKey: ['ticket-field-values', ticketId],
    queryFn: async () => {
      if (!ticketId) return [];
      const { data, error } = await supabase
        .from('ticket_field_values')
        .select('*')
        .eq('ticket_id', ticketId);

      if (error) throw error;
      return (data || []) as TicketFieldValue[];
    },
    enabled: !!ticketId,
  });
}

export function useCreateWorkflowField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field: Omit<WorkflowField, 'id' | 'created_at' | 'updated_at'>) => {
      const insertData: {
        workflow_id: string;
        name: string;
        label: string;
        field_type: string;
        options: Json;
        is_required: boolean;
        default_value: Json;
        order_index: number;
        description: string | null;
      } = {
        workflow_id: field.workflow_id,
        name: field.name,
        label: field.label,
        field_type: field.field_type,
        options: field.options as Json,
        is_required: field.is_required,
        default_value: field.default_value as Json,
        order_index: field.order_index,
        description: field.description,
      };

      const { data, error } = await supabase
        .from('workflow_fields')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflow-fields', variables.workflow_id] });
      toast.success('Custom field created');
    },
    onError: (error) => {
      toast.error('Failed to create field: ' + error.message);
    },
  });
}

export function useUpdateWorkflowField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, workflow_id, name, label, field_type, options, is_required, default_value, order_index, description }: Partial<WorkflowField> & { id: string }) => {
      const updateData: Record<string, unknown> = {};
      if (workflow_id !== undefined) updateData.workflow_id = workflow_id;
      if (name !== undefined) updateData.name = name;
      if (label !== undefined) updateData.label = label;
      if (field_type !== undefined) updateData.field_type = field_type;
      if (options !== undefined) updateData.options = options as Json;
      if (is_required !== undefined) updateData.is_required = is_required;
      if (default_value !== undefined) updateData.default_value = default_value as Json;
      if (order_index !== undefined) updateData.order_index = order_index;
      if (description !== undefined) updateData.description = description;

      const { data, error } = await supabase
        .from('workflow_fields')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-fields'] });
      toast.success('Custom field updated');
    },
    onError: (error) => {
      toast.error('Failed to update field: ' + error.message);
    },
  });
}

export function useDeleteWorkflowField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('workflow_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-fields'] });
      toast.success('Custom field deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete field: ' + error.message);
    },
  });
}

export function useUpdateTicketFieldValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, fieldId, value }: { ticketId: string; fieldId: string; value: unknown }) => {
      const upsertData: {
        ticket_id: string;
        field_id: string;
        value: Json;
      } = {
        ticket_id: ticketId,
        field_id: fieldId,
        value: value as Json,
      };

      const { data, error } = await supabase
        .from('ticket_field_values')
        .upsert(upsertData, {
          onConflict: 'ticket_id,field_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-field-values', variables.ticketId] });
    },
    onError: (error) => {
      toast.error('Failed to update field value: ' + error.message);
    },
  });
}
