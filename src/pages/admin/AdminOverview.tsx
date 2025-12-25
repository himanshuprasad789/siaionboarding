import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Sparkles, Activity } from 'lucide-react';
import { mockTeams, mockWorkflows, mockOpportunities } from '@/data/mockAdminData';

const stats = [
  { 
    label: 'Total Teams', 
    value: mockTeams.length, 
    icon: Users, 
    color: 'text-blue-500' 
  },
  { 
    label: 'Active Workflows', 
    value: mockWorkflows.length, 
    icon: Activity, 
    color: 'text-green-500' 
  },
  { 
    label: 'Total Opportunities', 
    value: mockOpportunities.length, 
    icon: Sparkles, 
    color: 'text-amber-500' 
  },
  { 
    label: 'Permission Rules', 
    value: 18, 
    icon: Shield, 
    color: 'text-purple-500' 
  },
];

export default function AdminOverview() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">
            Manage teams, workflows, and permissions from the Command Center.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Permission updated', detail: 'Press → Drafting stage', time: '2 hours ago' },
                  { action: 'Team member added', detail: 'Alice joined Press Team', time: '5 hours ago' },
                  { action: 'Opportunity created', detail: 'AI Summit 2025 Speaker', time: '1 day ago' },
                  { action: 'Workflow modified', detail: 'Added vendor stage', time: '2 days ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  { label: 'Create New Team', href: '/admin/teams' },
                  { label: 'Update Permissions', href: '/admin/permissions' },
                  { label: 'Add Opportunity', href: '/admin/opportunities' },
                  { label: 'View All Workflows', href: '/admin/permissions' },
                ].map((action, i) => (
                  <a
                    key={i}
                    href={action.href}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{action.label}</span>
                    <span className="text-muted-foreground">→</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
