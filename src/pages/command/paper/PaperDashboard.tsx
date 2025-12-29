import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { useTicketsByTeam } from '@/hooks/useTickets';
import { useWorkflowsByTeam } from '@/hooks/useWorkflows';

export default function PaperDashboard() {
  const { data: tickets, isLoading: ticketsLoading } = useTicketsByTeam('paper');
  const { data: workflows, isLoading: workflowsLoading } = useWorkflowsByTeam('paper');

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t) => t.status === 'open').length || 0,
    inProgress: tickets?.filter((t) => t.status === 'in_progress').length || 0,
    pendingReview: tickets?.filter((t) => t.status === 'pending_review').length || 0,
    closed: tickets?.filter((t) => t.status === 'closed').length || 0,
  };

  const statCards = [
    { label: 'Active Papers', value: stats.total - stats.closed, icon: FileText, color: 'bg-blue-500' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-amber-500' },
    { label: 'Pending Review', value: stats.pendingReview, icon: AlertTriangle, color: 'bg-violet-500' },
    { label: 'Published', value: stats.closed, icon: CheckCircle2, color: 'bg-green-500' },
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
          <h1 className="text-3xl font-bold text-foreground">Paper Publishing Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage journal submissions, book publishing, and peer reviews
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workflows from Database */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows && workflows.length > 0 ? (
            workflows.map((workflow) => {
              const workflowTickets = tickets?.filter(t => t.related_workflow_id === workflow.id) || [];
              const activeTickets = workflowTickets.filter(t => t.status !== 'closed');
              
              return (
                <Card key={workflow.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {workflow.name}
                    </CardTitle>
                    <CardDescription>
                      {workflow.description || `${workflow.stages?.length || 0} stages`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeTickets.slice(0, 3).map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{ticket.title}</p>
                            <p className="text-sm text-muted-foreground">{ticket.client_name}</p>
                          </div>
                          <Badge variant={ticket.priority === 'high' || ticket.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      ))}
                      {activeTickets.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No active tickets</p>
                      )}
                      {activeTickets.length > 3 && (
                        <Link 
                          to={`/command/paper/workflow/${workflow.id}`}
                          className="block text-center text-sm text-primary hover:underline"
                        >
                          View all {activeTickets.length} tickets
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="col-span-2">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No workflows configured for this team</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CommandCenterLayout>
  );
}
