import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useTicketsByUserTeams } from "@/hooks/useTickets";
import { useAccessibleWorkflows } from "@/hooks/useWorkflows";
import { Link } from "react-router-dom";
import { CommandCenterLayout } from "@/components/command/CommandCenterLayout";

export default function CommandDashboard() {
  const { data: tickets, isLoading: ticketsLoading } = useTicketsByUserTeams();
  const { data: workflows, isLoading: workflowsLoading } = useAccessibleWorkflows();

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t) => t.status === "open").length || 0,
    inProgress: tickets?.filter((t) => t.status === "in_progress").length || 0,
    pendingReview: tickets?.filter((t) => t.status === "pending_review").length || 0,
    closed: tickets?.filter((t) => t.status === "closed").length || 0,
    highPriority: tickets?.filter((t) => t.priority === "high" || t.priority === "urgent").length || 0,
  };

  const statCards = [
    { label: "Total Tickets", value: stats.total, icon: ClipboardList, color: "text-primary" },
    { label: "Open", value: stats.open, icon: AlertCircle, color: "text-yellow-500" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-blue-500" },
    { label: "Completed", value: stats.closed, icon: CheckCircle, color: "text-green-500" },
  ];

  if (ticketsLoading || workflowsLoading) {
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
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your team's tickets and workflows</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflows Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              {workflows && workflows.length > 0 ? (
                <div className="space-y-3">
                  {workflows.map((workflow) => {
                    const workflowTickets = tickets?.filter(
                      (t) => t.related_workflow_id === workflow.id
                    );
                    return (
                      <Link
                        key={workflow.id}
                        to={`/command/workflows/${workflow.id}`}
                        className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{workflow.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {workflow.stages?.length || 0} stages • {workflow.team}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {workflowTickets?.length || 0} tickets
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No workflows available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              {tickets && stats.highPriority > 0 ? (
                <div className="space-y-3">
                  {tickets
                    .filter((t) => t.priority === "high" || t.priority === "urgent")
                    .slice(0, 5)
                    .map((ticket) => (
                      <Link
                        key={ticket.id}
                        to={`/command/tickets/${ticket.id}`}
                        className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{ticket.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {ticket.client_name}
                            </p>
                          </div>
                          <Badge variant={ticket.priority === "urgent" ? "destructive" : "default"}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No high priority tickets
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
