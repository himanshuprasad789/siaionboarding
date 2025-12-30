import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      const { data, error } = await supabase
        .from('workflow_fields')
        .insert({
          ...field,
          options: field.options as unknown as Record<string, unknown>,
          default_value: field.default_value as unknown as Record<string, unknown>,
        })
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
    mutationFn: async ({ id, ...updates }: Partial<WorkflowField> & { id: string }) => {
      const updateData = {
        ...updates,
        options: updates.options as unknown as Record<string, unknown>,
        default_value: updates.default_value as unknown as Record<string, unknown>,
      };
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
      const { data, error } = await supabase
        .from('ticket_field_values')
        .upsert({
          ticket_id: ticketId,
          field_id: fieldId,
          value: value as unknown as Record<string, unknown>,
        }, {
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
