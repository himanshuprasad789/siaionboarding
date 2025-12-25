import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, DataTableColumn, StatusBadge, TypeBadge } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Columns } from 'lucide-react';
import { mockClients, mockTeamMembers, mockTeams, mockWorkflows, Client } from '@/data/mockAdminData';
import { TeamMember, AppRole } from '@/types/admin';
import { toast } from 'sonner';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('clients');

  // Get team name by ID
  const getTeamName = (teamId: string) => {
    return mockTeams.find(t => t.id === teamId)?.name || teamId;
  };

  // Get workflow names
  const getWorkflowNames = (workflowIds: string[]) => {
    return workflowIds.map(id => mockWorkflows.find(w => w.id === id)?.name || id);
  };

  // Client columns
  const clientColumns: DataTableColumn<Client>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => {
        const statusMap: Record<string, 'done' | 'in_progress' | 'pending'> = {
          active: 'done',
          onboarding: 'in_progress',
          paused: 'pending',
        };
        return <StatusBadge status={statusMap[row.status]} label={row.status.charAt(0).toUpperCase() + row.status.slice(1)} />;
      },
    },
    {
      key: 'team',
      header: 'Assigned Team',
      cell: (row) => <TypeBadge type={getTeamName(row.assignedTeam)} />,
    },
    {
      key: 'workflows',
      header: 'Active Workflows',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {getWorkflowNames(row.activeWorkflows).map((name, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      cell: (row) => <span className="text-muted-foreground">{row.lastActive}</span>,
    },
  ];

  // Team member columns
  const memberColumns: DataTableColumn<TeamMember>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-secondary">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (row) => {
        const roleColors: Record<AppRole, string> = {
          admin: 'bg-red-100 text-red-700',
          press: 'bg-blue-100 text-blue-700',
          research: 'bg-purple-100 text-purple-700',
          paper: 'bg-green-100 text-green-700',
          client: 'bg-muted text-muted-foreground',
        };
        return (
          <Badge variant="outline" className={`font-normal ${roleColors[row.role]}`}>
            {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'team',
      header: 'Team',
      cell: (row) => {
        const team = mockTeams.find(t => t.members.some(m => m.id === row.id));
        return team ? <TypeBadge type={team.name} /> : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      key: 'workflows',
      header: 'Workflow Access',
      cell: (row) => {
        const team = mockTeams.find(t => t.members.some(m => m.id === row.id));
        if (!team) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {getWorkflowNames(team.workflowAccess).map((name, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {name}
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];

  const clientActions = [
    { label: 'View Profile', onClick: (row: Client) => toast.info(`Viewing ${row.name}`) },
    { label: 'Edit', onClick: (row: Client) => toast.info(`Editing ${row.name}`) },
    { label: 'Reassign Team', onClick: (row: Client) => toast.info(`Reassigning ${row.name}`) },
    { label: 'Pause', onClick: (row: Client) => toast.warning(`Pausing ${row.name}`), variant: 'destructive' as const },
  ];

  const memberActions = [
    { label: 'View Profile', onClick: (row: TeamMember) => toast.info(`Viewing ${row.name}`) },
    { label: 'Edit', onClick: (row: TeamMember) => toast.info(`Editing ${row.name}`) },
    { label: 'Change Role', onClick: (row: TeamMember) => toast.info(`Changing role for ${row.name}`) },
    { label: 'Remove', onClick: (row: TeamMember) => toast.error(`Removing ${row.name}`), variant: 'destructive' as const },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all clients and team members.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Columns className="h-4 w-4" />
              Customize Columns
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="clients">
              Clients
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {mockClients.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="team">
              Team Members
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {mockTeamMembers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-6">
            <DataTable
              data={mockClients}
              columns={clientColumns}
              actions={clientActions}
              onRowClick={(row) => toast.info(`Selected: ${row.name}`)}
            />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <DataTable
              data={mockTeamMembers}
              columns={memberColumns}
              actions={memberActions}
              onRowClick={(row) => toast.info(`Selected: ${row.name}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
