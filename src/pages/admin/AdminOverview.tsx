import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Sparkles, Activity, Loader2 } from 'lucide-react';
import { useAdminStats, useRecentActivity } from '@/hooks/useAdminData';
import { formatDistanceToNow } from 'date-fns';

export default function AdminOverview() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: activityLog = [], isLoading: activityLoading } = useRecentActivity();

  const statItems = [
    { 
      label: 'Total Teams', 
      value: stats?.teams ?? 0, 
      icon: Users, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Active Workflows', 
      value: stats?.workflows ?? 0, 
      icon: Activity, 
      color: 'text-green-500' 
    },
    { 
      label: 'Total Opportunities', 
      value: stats?.opportunities ?? 0, 
      icon: Sparkles, 
      color: 'text-amber-500' 
    },
    { 
      label: 'Permission Rules', 
      value: stats?.permissions ?? 0, 
      icon: Shield, 
      color: 'text-purple-500' 
    },
  ];

  const formatActivityTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const getActivityDescription = (activity: { action: string; entity_type: string; metadata?: unknown }) => {
    const metadata = typeof activity.metadata === 'object' && activity.metadata !== null 
      ? activity.metadata as Record<string, string> 
      : undefined;
    return metadata?.description || `${activity.action} on ${activity.entity_type}`;
  };

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
          {statItems.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
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
              {activityLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : activityLog.length > 0 ? (
                <div className="space-y-4">
                  {activityLog.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium capitalize">{activity.action.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{getActivityDescription(activity)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatActivityTime(activity.created_at)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              )}
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
