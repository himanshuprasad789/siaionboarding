import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, FileText, Clock, User, CheckCircle2 } from "lucide-react";
import { useWorkflowById } from "@/hooks/useWorkflows";
import { useTicketsByWorkflow, useWorkflowStages, Ticket } from "@/hooks/useTickets";
import { useWorkflowFields } from "@/hooks/useWorkflowFields";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { InlinePrioritySelect } from "@/components/tickets/InlinePrioritySelect";
import { InlineAssigneeSelect } from "@/components/tickets/InlineAssigneeSelect";
import { InlineDatePicker } from "@/components/tickets/InlineDatePicker";

const PRIORITY_CONFIG = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

// Hook to fetch all field values for tickets in a workflow
function useTicketFieldValuesByWorkflow(ticketIds: string[]) {
  return useQuery({
    queryKey: ['ticket-field-values-bulk', ticketIds],
    queryFn: async () => {
      if (ticketIds.length === 0) return [];
      const { data, error } = await supabase
        .from('ticket_field_values')
        .select('*')
        .in('ticket_id', ticketIds);
      if (error) throw error;
      return data || [];
    },
    enabled: ticketIds.length > 0,
  });
}

export default function WorkflowPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { data: workflow, isLoading: workflowLoading } = useWorkflowById(workflowId);
  const { data: tickets, isLoading: ticketsLoading } = useTicketsByWorkflow(workflowId);
  const { data: stages } = useWorkflowStages(workflowId);
  const { data: workflowFields } = useWorkflowFields(workflowId);
  
  // Fetch all field values for tickets in this workflow
  const ticketIds = useMemo(() => tickets?.map(t => t.id) || [], [tickets]);
  const { data: allFieldValues } = useTicketFieldValuesByWorkflow(ticketIds);

  // Create a map of ticket_id -> { field_id -> value }
  const fieldValuesMap = useMemo(() => {
    const map: Record<string, Record<string, unknown>> = {};
    allFieldValues?.forEach(fv => {
      if (!map[fv.ticket_id]) map[fv.ticket_id] = {};
      map[fv.ticket_id][fv.field_id] = fv.value;
    });
    return map;
  }, [allFieldValues]);

  // Build stage filter options dynamically
  const stageFilterOptions = stages?.map(stage => ({
    label: stage.name,
    value: stage.id,
  })) || [];

  const priorityFilterOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  // Base columns
  const baseColumns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px] truncate">{row.getValue("title")}</div>
      ),
      meta: {
        filterType: 'text' as const,
        filterLabel: 'Title',
      },
    },
    {
      accessorKey: "client_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("client_name") || "Unknown"}</span>
        </div>
      ),
      meta: {
        filterType: 'text' as const,
        filterLabel: 'Client',
      },
    },
    {
      accessorKey: "current_stage_id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stage" />,
      cell: ({ row }) => {
        const stageName = row.original.current_stage_name;
        return (
          <Badge variant="outline" className="flex items-center gap-1 w-fit">
            <CheckCircle2 className="h-3 w-3" />
            {stageName || "Not Started"}
          </Badge>
        );
      },
      meta: {
        filterType: 'select' as const,
        filterLabel: 'Stage',
        filterOptions: stageFilterOptions,
      },
      filterFn: (row, id, value) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
          return row.getValue(id) === value.value;
        }
        if (Array.isArray(value)) {
          return value.includes(row.getValue(id));
        }
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <InlinePrioritySelect
            ticketId={row.original.id}
            currentPriority={priority}
            workflowId={workflowId}
          />
        );
      },
      meta: {
        filterType: 'select' as const,
        filterLabel: 'Priority',
        filterOptions: priorityFilterOptions,
      },
      filterFn: (row, id, value) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
          return row.getValue(id) === value.value;
        }
        if (Array.isArray(value)) {
          return value.includes(row.getValue(id));
        }
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: "assigned_to_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
      cell: ({ row }) => (
        <InlineAssigneeSelect
          ticketId={row.original.id}
          currentAssigneeId={row.original.assigned_to}
          currentAssigneeName={row.getValue("assigned_to_name") as string | null}
          workflowId={workflowId!}
        />
      ),
      meta: {
        filterType: 'text' as const,
        filterLabel: 'Assigned To',
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
      cell: ({ row }) => {
        const date = row.getValue("due_date") as string | null;
        return (
          <InlineDatePicker
            ticketId={row.original.id}
            currentDate={date}
            workflowId={workflowId}
          />
        );
      },
      meta: {
        filterType: 'date' as const,
        filterLabel: 'Due Date',
      },
    },
  ];

  // Dynamic columns for custom fields
  const customFieldColumns: ColumnDef<Ticket>[] = useMemo(() => {
    if (!workflowFields || workflowFields.length === 0) return [];
    
    return workflowFields.map((field) => ({
      id: `custom_${field.id}`,
      accessorFn: (row: Ticket) => {
        const values = fieldValuesMap[row.id];
        return values?.[field.id] ?? null;
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title={field.label} />,
      cell: ({ row }) => {
        const values = fieldValuesMap[row.id];
        const value = values?.[field.id];
        
        if (value === null || value === undefined) {
          return <span className="text-muted-foreground">—</span>;
        }

        // Render based on field type
        switch (field.field_type) {
          case 'checkbox':
            return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>;
          case 'select':
            const option = field.options?.find(o => o.value === value);
            return <Badge variant="outline">{option?.label || String(value)}</Badge>;
          case 'multiselect':
            const selectedValues = Array.isArray(value) ? value : [];
            return (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((v: string) => {
                  const opt = field.options?.find(o => o.value === v);
                  return <Badge key={v} variant="outline" className="text-xs">{opt?.label || v}</Badge>;
                })}
              </div>
            );
          case 'date':
            try {
              return <span className="text-sm">{format(new Date(String(value)), "MMM d, yyyy")}</span>;
            } catch {
              return <span className="text-sm">{String(value)}</span>;
            }
          case 'url':
            return (
              <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[150px] block">
                {String(value)}
              </a>
            );
          default:
            return <span className="text-sm truncate max-w-[150px] block">{String(value)}</span>;
        }
      },
      meta: {
        filterType: field.field_type === 'select' || field.field_type === 'multiselect' 
          ? 'select' as const 
          : field.field_type === 'number' 
            ? 'number' as const 
            : field.field_type === 'date' 
              ? 'date' as const 
              : field.field_type === 'checkbox' 
                ? 'boolean' as const 
                : 'text' as const,
        filterLabel: field.label,
        filterOptions: field.options || [],
      },
    }));
  }, [workflowFields, fieldValuesMap]);

  const columns = useMemo(() => [...baseColumns, ...customFieldColumns], [baseColumns, customFieldColumns]);

  if (workflowLoading || ticketsLoading) {
    return (
      <CommandCenterLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CommandCenterLayout>
    );
  }

  if (!workflow) {
    return (
      <CommandCenterLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Workflow not found</h3>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/command">Back to Dashboard</Link>
          </Button>
        </div>
      </CommandCenterLayout>
    );
  }

  // Group tickets by current stage for overview
  const ticketsByStage = stages?.reduce((acc, stage) => {
    acc[stage.id] = tickets?.filter(t => t.current_stage_id === stage.id) || [];
    return acc;
  }, {} as Record<string, typeof tickets>) || {};

  const handleRowClick = (ticket: Ticket) => {
    navigate(`/command/tickets/${ticket.id}`);
  };

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/command"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <p className="text-muted-foreground">{workflow.description || "No description"}</p>
          </div>
          <Badge variant="outline" className="capitalize">{workflow.team}</Badge>
        </div>

        {/* Stages Overview */}
        {stages && stages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stages.map((stage, index) => {
              const stageTickets = ticketsByStage[stage.id] || [];
              return (
                <div 
                  key={stage.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border bg-card min-w-fit",
                    stageTickets.length > 0 && "border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{stage.name}</span>
                  <Badge variant="secondary" className="ml-1">{stageTickets.length}</Badge>
                </div>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Tickets</CardTitle>
            <CardDescription>{tickets?.length || 0} tickets in this workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedDataTable
              columns={columns}
              data={tickets || []}
              searchKey="title"
              searchPlaceholder="Search tickets..."
              filterableColumns={[
                {
                  id: "current_stage_id",
                  title: "Stage",
                  options: stageFilterOptions,
                },
                {
                  id: "priority",
                  title: "Priority",
                  options: priorityFilterOptions,
                },
              ]}
              onRowClick={handleRowClick}
              isLoading={ticketsLoading}
              pageSize={10}
              emptyMessage="No tickets in this workflow yet."
              getRowId={(row) => row.id}
            />
          </CardContent>
        </Card>
      </div>
    </CommandCenterLayout>
  );
}
