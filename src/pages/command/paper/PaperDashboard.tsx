import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { getTicketsByRole } from '@/data/mockWorkflowData';

const stats = [
  { label: 'Active Papers', value: 3, icon: FileText, color: 'bg-blue-500' },
  { label: 'In Peer Review', value: 2, icon: Clock, color: 'bg-amber-500' },
  { label: 'Pending Acceptance', value: 1, icon: AlertTriangle, color: 'bg-violet-500' },
  { label: 'Published This Month', value: 4, icon: CheckCircle2, color: 'bg-green-500' },
];

export default function PaperDashboard() {
  const tickets = getTicketsByRole('paper');

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
          {stats.map((stat) => {
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Journal Queue
              </CardTitle>
              <CardDescription>Research papers in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.filter(t => t.workflowType === 'paper').map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">{ticket.clientName}</p>
                    </div>
                    <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                      {ticket.priority}
                    </Badge>
                  </div>
                ))}
                {tickets.filter(t => t.workflowType === 'paper').length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No active papers</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Book Queue
              </CardTitle>
              <CardDescription>Book publishing projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.filter(t => t.workflowType === 'book').map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">{ticket.clientName}</p>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                ))}
                {tickets.filter(t => t.workflowType === 'book').length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No active books</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
