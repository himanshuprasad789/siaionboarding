import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, DataTableColumn, StatusBadge, TypeBadge } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Columns, Loader2 } from 'lucide-react';
import { useClientsWithDetails, useStaffMembers, ClientWithDetails, StaffMemberWithDetails } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { format } from 'date-fns';

type AppRole = 'admin' | 'press' | 'research' | 'paper' | 'client';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('clients');
  
  const { data: clients = [], isLoading: clientsLoading } = useClientsWithDetails();
  const { data: staffMembers = [], isLoading: staffLoading } = useStaffMembers();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return 'Invalid date';
    }
  };

  // Client columns
  const clientColumns: DataTableColumn<ClientWithDetails>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(row.profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.profile?.full_name || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">{row.profile?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => {
        const status = row.status || 'onboarding';
        const statusMap: Record<string, 'done' | 'in_progress' | 'pending'> = {
          active: 'done',
          onboarding: 'in_progress',
          paused: 'pending',
        };
        return <StatusBadge status={statusMap[status] || 'pending'} label={status.charAt(0).toUpperCase() + status.slice(1)} />;
      },
    },
    {
      key: 'team',
      header: 'Assigned Team',
      cell: (row) => row.team ? <TypeBadge type={row.team.name} /> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'workflows',
      header: 'Active Workflows',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.activeWorkflows.length > 0 ? (
            row.activeWorkflows.map((workflow) => (
              <Badge key={workflow.id} variant="outline" className="text-xs font-normal">
                {workflow.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      cell: (row) => <span className="text-muted-foreground">{formatDate(row.last_active_at)}</span>,
    },
  ];

  // Staff member columns
  const memberColumns: DataTableColumn<StaffMemberWithDetails>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-secondary">
              {getInitials(row.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.full_name || 'Unknown'}</p>
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
        const primaryRole = row.roles[0]?.role as AppRole | undefined;
        return primaryRole ? (
          <Badge variant="outline" className={`font-normal ${roleColors[primaryRole] || ''}`}>
            {primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      key: 'team',
      header: 'Team',
      cell: (row) => row.team ? <TypeBadge type={row.team.name} /> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'workflows',
      header: 'Workflow Access',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.workflowAccess.length > 0 ? (
            row.workflowAccess.map((workflow) => (
              <Badge key={workflow.id} variant="outline" className="text-xs font-normal">
                {workflow.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
  ];

  const clientActions = [
    { label: 'View Profile', onClick: (row: ClientWithDetails) => toast.info(`Viewing ${row.profile?.full_name}`) },
    { label: 'Edit', onClick: (row: ClientWithDetails) => toast.info(`Editing ${row.profile?.full_name}`) },
    { label: 'Reassign Team', onClick: (row: ClientWithDetails) => toast.info(`Reassigning ${row.profile?.full_name}`) },
    { label: 'Pause', onClick: (row: ClientWithDetails) => toast.warning(`Pausing ${row.profile?.full_name}`), variant: 'destructive' as const },
  ];

  const memberActions = [
    { label: 'View Profile', onClick: (row: StaffMemberWithDetails) => toast.info(`Viewing ${row.full_name}`) },
    { label: 'Edit', onClick: (row: StaffMemberWithDetails) => toast.info(`Editing ${row.full_name}`) },
    { label: 'Change Role', onClick: (row: StaffMemberWithDetails) => toast.info(`Changing role for ${row.full_name}`) },
    { label: 'Remove', onClick: (row: StaffMemberWithDetails) => toast.error(`Removing ${row.full_name}`), variant: 'destructive' as const },
  ];

  const isLoading = clientsLoading || staffLoading;

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
                {clients.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="team">
              Team Members
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {staffMembers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : clients.length > 0 ? (
              <DataTable
                data={clients}
                columns={clientColumns}
                actions={clientActions}
                onRowClick={(row) => toast.info(`Selected: ${row.profile?.full_name}`)}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No clients found
              </div>
            )}
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : staffMembers.length > 0 ? (
              <DataTable
                data={staffMembers}
                columns={memberColumns}
                actions={memberActions}
                onRowClick={(row) => toast.info(`Selected: ${row.full_name}`)}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No team members found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
