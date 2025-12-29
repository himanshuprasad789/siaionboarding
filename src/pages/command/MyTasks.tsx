import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { format } from "date-fns";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";

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

export default function MyTasks() {
  const { user } = useAuth();
  const { user: roleUser } = useRole();
  const { data: tickets, isLoading } = useTickets();

  // Filter tickets by user's team and assigned to them
  const team = roleUser?.primaryRole || '';
  const teamTickets = tickets?.filter((t) => t.assigned_team === team) || [];
  const myTickets = teamTickets.filter((t) => t.assigned_to === user?.id);
  const unassigned = teamTickets.filter((t) => !t.assigned_to);

  if (isLoading) {
    return (
      <CommandCenterLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CommandCenterLayout>
    );
  }

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <p className="text-muted-foreground">Tickets assigned to you</p>
        </div>

        {/* My Assigned Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned to Me ({myTickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {myTickets.length > 0 ? (
              <div className="space-y-3">
                {myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.client_name}
                          </span>
                          {ticket.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(ticket.due_date), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={PRIORITY_CONFIG[ticket.priority]?.variant}>
                          {PRIORITY_CONFIG[ticket.priority]?.label}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${STATUS_CONFIG[ticket.status]?.color}`} />
                          <span className="text-xs">{STATUS_CONFIG[ticket.status]?.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No tickets assigned to you
              </p>
            )}
          </CardContent>
        </Card>

        {/* Unassigned Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Unassigned ({unassigned.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {unassigned.length > 0 ? (
              <div className="space-y-3">
                {unassigned.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.client_name}
                          </span>
                          {ticket.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(ticket.due_date), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={PRIORITY_CONFIG[ticket.priority]?.variant}>
                          {PRIORITY_CONFIG[ticket.priority]?.label}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${STATUS_CONFIG[ticket.status]?.color}`} />
                          <span className="text-xs">{STATUS_CONFIG[ticket.status]?.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No unassigned tickets
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </CommandCenterLayout>
  );
}
