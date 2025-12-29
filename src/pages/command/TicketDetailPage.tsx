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
  MessageSquare 
} from "lucide-react";
import { useTicketById, useUpdateTicket } from "@/hooks/useTickets";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_CONFIG = {
  open: { label: "Open", variant: "secondary" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  pending_review: { label: "Pending Review", variant: "outline" as const },
  closed: { label: "Closed", variant: "secondary" as const },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "destructive" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { data: ticket, isLoading } = useTicketById(ticketId);
  const updateTicket = useUpdateTicket();

  const handleStatusChange = async (newStatus: string) => {
    if (!ticketId) return;
    
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

  const statusConfig = STATUS_CONFIG[ticket.status];
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];

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
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>

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

            {/* Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Update the ticket status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ticket.status !== "open" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("open")}
                      disabled={updateTicket.isPending}
                    >
                      Reopen
                    </Button>
                  )}
                  {ticket.status !== "in_progress" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("in_progress")}
                      disabled={updateTicket.isPending}
                    >
                      Start Progress
                    </Button>
                  )}
                  {ticket.status !== "pending_review" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("pending_review")}
                      disabled={updateTicket.isPending}
                    >
                      Submit for Review
                    </Button>
                  )}
                  {ticket.status !== "closed" && (
                    <Button
                      variant="default"
                      onClick={() => handleStatusChange("closed")}
                      disabled={updateTicket.isPending}
                    >
                      Close Ticket
                    </Button>
                  )}
                </div>
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
