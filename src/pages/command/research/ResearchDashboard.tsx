import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Compass, Search, AlertTriangle, TrendingUp } from 'lucide-react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { getTicketsByRole } from '@/data/mockWorkflowData';

const stats = [
  { label: 'Salary Analyses', value: 5, icon: DollarSign, color: 'bg-green-500' },
  { label: 'Opportunities Curated', value: 24, icon: Compass, color: 'bg-blue-500' },
  { label: 'Gap Alerts', value: 3, icon: AlertTriangle, color: 'bg-amber-500' },
  { label: 'Avg Wage Premium', value: '+42%', icon: TrendingUp, color: 'bg-violet-500' },
];

const gapAlerts = [
  { client: 'John Doe', issue: '0 Awards evidence', severity: 'high' },
  { client: 'Jane Smith', issue: 'Weak Critical Role', severity: 'medium' },
  { client: 'Mike Johnson', issue: 'Missing Judging evidence', severity: 'low' },
];

export default function ResearchDashboard() {
  const tickets = getTicketsByRole('research');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Research Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage opportunities, salary analysis, and client gap assessments
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
                <DollarSign className="w-5 h-5" />
                Active Salary Analyses
              </CardTitle>
              <CardDescription>Pending remuneration reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.filter(t => t.workflowType === 'salary').map((ticket) => (
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
                {tickets.filter(t => t.workflowType === 'salary').length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No pending analyses</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Gap Analysis Alerts
              </CardTitle>
              <CardDescription>Clients needing attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gapAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{alert.client}</p>
                      <p className="text-sm text-muted-foreground">{alert.issue}</p>
                    </div>
                    <Badge variant={
                      alert.severity === 'high' ? 'destructive' : 
                      alert.severity === 'medium' ? 'default' : 'secondary'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
