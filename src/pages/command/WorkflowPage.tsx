import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, FileText, Clock, User, CheckCircle2 } from "lucide-react";
import { useWorkflowById } from "@/hooks/useWorkflows";
import { useTicketsByWorkflow, useWorkflowStages, Ticket } from "@/hooks/useTickets";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

const PRIORITY_CONFIG = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

export default function WorkflowPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { data: workflow, isLoading: workflowLoading } = useWorkflowById(workflowId);
  const { data: tickets, isLoading: ticketsLoading } = useTicketsByWorkflow(workflowId);
  const { data: stages } = useWorkflowStages(workflowId);

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

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px] truncate">{row.getValue("title")}</div>
      ),
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
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = row.getValue("priority") as keyof typeof PRIORITY_CONFIG;
        const config = PRIORITY_CONFIG[priority];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "assigned_to_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("assigned_to_name") || "Unassigned"}</span>
      ),
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
      cell: ({ row }) => {
        const date = row.getValue("due_date") as string | null;
        if (!date) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {format(new Date(date), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

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
