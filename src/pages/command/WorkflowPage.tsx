import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, FileText, Clock, User, CheckCircle2 } from "lucide-react";
import { useWorkflowById } from "@/hooks/useWorkflows";
import { useTicketsByWorkflow, useWorkflowStages } from "@/hooks/useTickets";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

export default function WorkflowPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const { data: workflow, isLoading: workflowLoading } = useWorkflowById(workflowId);
  const { data: tickets, isLoading: ticketsLoading } = useTicketsByWorkflow(workflowId);
  const { data: stages } = useWorkflowStages(workflowId);

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

  // Group tickets by current stage
  const ticketsByStage = stages?.reduce((acc, stage) => {
    acc[stage.id] = tickets?.filter(t => t.current_stage_id === stage.id) || [];
    return acc;
  }, {} as Record<string, typeof tickets>) || {};

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
            {tickets && tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <Link key={ticket.id} to={`/command/tickets/${ticket.id}`} className="block p-4 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{ticket.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{ticket.client_name}</span>
                          {ticket.due_date && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(ticket.due_date), "MMM d")}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant={PRIORITY_CONFIG[ticket.priority].variant}>{PRIORITY_CONFIG[ticket.priority].label}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {ticket.current_stage_name || "Not Started"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No tickets yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </CommandCenterLayout>
  );
}
