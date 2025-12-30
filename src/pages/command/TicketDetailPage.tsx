import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle,
  Loader2,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { useTicketById, useUpdateTicket, useWorkflowStages } from "@/hooks/useTickets";
import { useWorkflowFields, useTicketFieldValues } from "@/hooks/useWorkflowFields";
import { CustomFieldRenderer } from "@/components/tickets/CustomFieldRenderer";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { data: ticket, isLoading } = useTicketById(ticketId);
  const { data: stages } = useWorkflowStages(ticket?.related_workflow_id || undefined);
  const { data: customFields = [] } = useWorkflowFields(ticket?.related_workflow_id || undefined);
  const { data: fieldValues = [] } = useTicketFieldValues(ticketId);
  const updateTicket = useUpdateTicket();

  const currentStageIndex = stages?.findIndex(s => s.id === ticket?.current_stage_id) ?? -1;
  const canMoveNext = stages && currentStageIndex < stages.length - 1;
  const canMovePrev = stages && currentStageIndex > 0;

  const handleMoveToStage = async (stageId: string) => {
    if (!ticketId) return;
    
    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        updates: { current_stage_id: stageId },
      });
      toast.success("Ticket moved to new stage");
    } catch (error) {
      toast.error("Failed to move ticket");
    }
  };

  const handleMoveNext = () => {
    if (!stages || !canMoveNext) return;
    handleMoveToStage(stages[currentStageIndex + 1].id);
  };

  const handleMovePrev = () => {
    if (!stages || !canMovePrev) return;
    handleMoveToStage(stages[currentStageIndex - 1].id);
  };

  if (isLoading) {
    return (
      <CommandCenterLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CommandCenterLayout>
    );
  }

  if (!ticket) {
    return (
      <CommandCenterLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Ticket not found</h3>
          <p className="text-muted-foreground mb-4">
            The ticket you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild variant="outline">
            <Link to="/command">Back to Dashboard</Link>
          </Button>
        </div>
      </CommandCenterLayout>
    );
  }

  const priorityConfig = PRIORITY_CONFIG[ticket.priority];
  const currentStage = stages?.find(s => s.id === ticket.current_stage_id);

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/command">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-muted-foreground">Ticket ID: {ticket.id.slice(0, 8)}...</p>
          </div>
          <Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {currentStage?.name || "Not Started"}
          </Badge>
        </div>

        {/* Stage Progress */}
        {stages && stages.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {stages.map((stage, index) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = stage.id === ticket.current_stage_id;
                  return (
                    <div key={stage.id} className="flex items-center">
                      <button
                        onClick={() => handleMoveToStage(stage.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors min-w-fit",
                          isCurrent && "border-primary bg-primary/10 text-primary",
                          isCompleted && "border-green-500/50 bg-green-500/10 text-green-600",
                          !isCurrent && !isCompleted && "border-border hover:bg-accent"
                        )}
                        disabled={updateTicket.isPending}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium",
                          isCurrent && "bg-primary text-primary-foreground",
                          isCompleted && "bg-green-500 text-white",
                          !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                        )}>
                          {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{stage.name}</span>
                      </button>
                      {index < stages.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMovePrev}
                  disabled={!canMovePrev || updateTicket.isPending}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous Stage
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMoveNext}
                  disabled={!canMoveNext || updateTicket.isPending}
                >
                  Next Stage
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {ticket.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Comments Section Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  No comments yet.
                </p>
              </CardContent>
            </Card>

            {/* Custom Fields Section */}
            {customFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Custom Fields</CardTitle>
                  <CardDescription>
                    Additional fields specific to this workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customFields.map((field) => {
                    const value = fieldValues.find(v => v.field_id === field.id);
                    return (
                      <CustomFieldRenderer
                        key={field.id}
                        field={field}
                        value={value}
                        ticketId={ticket.id}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{ticket.client_name}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{ticket.assigned_to_name}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team</p>
                    <p className="font-medium capitalize">{ticket.assigned_team || "Unassigned"}</p>
                  </div>
                </div>
                {ticket.due_date && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-medium">
                          {format(new Date(ticket.due_date), "PPP")}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {format(new Date(ticket.created_at), "PPP")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
