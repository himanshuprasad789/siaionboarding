import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Users, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { getTicketsByRole, mockTickets } from '@/data/mockWorkflowData';

const stats = [
  { label: 'Active Tickets', value: 5, icon: Newspaper, color: 'bg-blue-500' },
  { label: 'Waiting for Client', value: 2, icon: Clock, color: 'bg-amber-500' },
  { label: 'High Priority', value: 1, icon: AlertTriangle, color: 'bg-red-500' },
  { label: 'Completed Today', value: 3, icon: CheckCircle2, color: 'bg-green-500' },
];

export default function PressDashboard() {
  const tickets = getTicketsByRole('press');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">PRD Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage press releases, vendor workflows, and publishing tasks
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
                <Newspaper className="w-5 h-5" />
                Press Queue Overview
              </CardTitle>
              <CardDescription>Active press release workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.filter(t => t.workflowType === 'press').slice(0, 3).map((ticket) => (
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Vendor Status
              </CardTitle>
              <CardDescription>Active vendor assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.filter(t => t.workflowType === 'vendor').slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">{ticket.clientName}</p>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                ))}
                {tickets.filter(t => t.workflowType === 'vendor').length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No active vendor tickets</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
