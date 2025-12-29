import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, ChevronRight, User, Calendar } from "lucide-react";
import { useTicketsByTeam, useUpdateTicket, Ticket } from "@/hooks/useTickets";
import { useWorkflowsByTeam } from "@/hooks/useWorkflows";
import { useAllProfiles } from "@/hooks/useProfiles";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-yellow-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500" },
  pending_review: { label: "Pending Review", color: "bg-purple-500" },
  closed: { label: "Closed", color: "bg-green-500" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

export default function WorkflowTickets() {
  const { team, workflowId } = useParams<{ team: string; workflowId: string }>();
  const { data: tickets, isLoading: ticketsLoading } = useTicketsByTeam(team || "");
  const { data: workflows, isLoading: workflowsLoading } = useWorkflowsByTeam(team || "");
  const { data: profiles } = useAllProfiles();
  const updateTicket = useUpdateTicket();
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStage, setFilterStage] = useState<string>("all");

  const workflow = workflows?.find((w) => w.id === workflowId);
  const workflowTickets = tickets?.filter((t) => 
    t.assigned_team === team
  ) || [];

  const stages = workflow?.stages || [];

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        updates: { status: newStatus as any },
      });
      toast.success("Ticket status updated");
    } catch (error) {
      toast.error("Failed to update ticket status");
    }
  };

  const handleAssigneeChange = async (ticketId: string, assigneeId: string) => {
    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        updates: { assigned_to: assigneeId === "unassigned" ? null : assigneeId },
      });
      toast.success("Ticket assignee updated");
    } catch (error) {
      toast.error("Failed to update ticket assignee");
    }
  };

  const moveToNextStage = async (ticket: Ticket) => {
    const currentStageIndex = stages.findIndex(s => s.name === ticket.status);
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];
      await handleStatusChange(ticket.id, nextStage.name);
    }
  };

  if (ticketsLoading || workflowsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Workflow not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workflow.name}</h2>
          <p className="text-muted-foreground">{workflow.description}</p>
        </div>
        <Badge variant="outline">{workflowTickets.length} tickets</Badge>
      </div>

      {/* Stage Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Workflow Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <button
                  onClick={() => setFilterStage(stage.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterStage === stage.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {stage.name}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({workflowTickets.filter(t => t.status === stage.name).length})
                  </span>
                </button>
                {index < stages.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                )}
              </div>
            ))}
            <button
              onClick={() => setFilterStage("all")}
              className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterStage === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowTickets
          .filter((t) => filterStage === "all" || t.status === stages.find(s => s.id === filterStage)?.name)
          .map((ticket) => (
            <Card
              key={ticket.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium line-clamp-2">{ticket.title}</h4>
                    <Badge variant={PRIORITY_CONFIG[ticket.priority]?.variant}>
                      {PRIORITY_CONFIG[ticket.priority]?.label}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{ticket.client_name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${STATUS_CONFIG[ticket.status]?.color}`} />
                      <span className="text-xs">{STATUS_CONFIG[ticket.status]?.label}</span>
                    </div>
                    {ticket.due_date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(ticket.due_date), "MMM d")}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {workflowTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tickets in this workflow</p>
        </div>
      )}

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription>{selectedTicket?.description}</DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assignee</label>
                  <Select
                    value={selectedTicket.assigned_to || "unassigned"}
                    onValueChange={(value) => handleAssigneeChange(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {profiles?.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.full_name || profile.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <p>Client: {selectedTicket.client_name}</p>
                  {selectedTicket.due_date && (
                    <p>Due: {format(new Date(selectedTicket.due_date), "PPP")}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {stages.findIndex(s => s.name === selectedTicket.status) < stages.length - 1 && (
                    <Button onClick={() => moveToNextStage(selectedTicket)}>
                      Move to Next Stage
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
