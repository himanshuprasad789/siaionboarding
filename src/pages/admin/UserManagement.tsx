import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EnhancedDataTable } from '@/components/ui/enhanced-data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableRowActions, DataTableAction } from '@/components/ui/data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useClientsWithDetails, useStaffMembers, ClientWithDetails, StaffMemberWithDetails } from '@/hooks/useAdminData';
import { useTeams } from '@/hooks/useTeams';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

type AppRole = Database["public"]["Enums"]["app_role"];

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('clients');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  const { data: clients = [], isLoading: clientsLoading } = useClientsWithDetails();
  const { data: staffMembers = [], isLoading: staffLoading } = useStaffMembers();
  const { data: teams = [] } = useTeams();

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role, teamId }: { userId: string; role: AppRole; teamId?: string }) => {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      if (roleError) throw roleError;

      if (teamId) {
        const { error: teamError } = await supabase
          .from('profiles')
          .update({ team_id: teamId })
          .eq('id', userId);
        if (teamError) throw teamError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      queryClient.invalidateQueries({ queryKey: ['clients-with-details'] });
      setIsAddUserOpen(false);
      setSelectedUserId('');
      setSelectedRole('');
      setSelectedTeamId('');
      toast.success('User role assigned successfully');
    },
    onError: (error) => {
      console.error('Error adding role:', error);
      toast.error('Failed to assign role');
    },
  });

  const handleAddUser = () => {
    if (!selectedUserId || !selectedRole) {
      toast.error('Please select a user and role');
      return;
    }
    addRoleMutation.mutate({ 
      userId: selectedUserId, 
      role: selectedRole as AppRole, 
      teamId: selectedTeamId || undefined 
    });
  };

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

  // Client columns with TanStack Table format
  const clientColumns: ColumnDef<ClientWithDetails>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(row.original.profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.profile?.full_name || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">{row.original.profile?.email}</p>
          </div>
        </div>
      ),
      filterFn: (row, id, value) => {
        const name = row.original.profile?.full_name?.toLowerCase() || '';
        const email = row.original.profile?.email?.toLowerCase() || '';
        const search = value.toLowerCase();
        return name.includes(search) || email.includes(search);
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status || 'onboarding';
        const statusColors: Record<string, string> = {
          active: 'bg-green-100 text-green-700',
          onboarding: 'bg-blue-100 text-blue-700',
          paused: 'bg-muted text-muted-foreground',
        };
        return (
          <Badge className={`font-normal ${statusColors[status] || ''}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.original.status || 'onboarding');
      },
    },
    {
      accessorKey: 'team',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned Team" />,
      cell: ({ row }) => row.original.team ? (
        <Badge variant="outline">{row.original.team.name}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.original.team?.name || '');
      },
    },
    {
      accessorKey: 'workflows',
      header: "Active Workflows",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.activeWorkflows.length > 0 ? (
            row.original.activeWorkflows.map((workflow) => (
              <Badge key={workflow.id} variant="outline" className="text-xs font-normal">
                {workflow.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'lastActive',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Active" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.original.last_active_at)}</span>
      ),
      accessorFn: (row) => row.last_active_at,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={clientActions}
        />
      ),
    },
  ];

  // Staff member columns
  const memberColumns: ColumnDef<StaffMemberWithDetails>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-secondary">
              {getInitials(row.original.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.full_name || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
      filterFn: (row, id, value) => {
        const name = row.original.full_name?.toLowerCase() || '';
        const email = row.original.email?.toLowerCase() || '';
        const search = value.toLowerCase();
        return name.includes(search) || email.includes(search);
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const roleColors: Record<AppRole, string> = {
          admin: 'bg-red-100 text-red-700',
          press: 'bg-blue-100 text-blue-700',
          research: 'bg-purple-100 text-purple-700',
          paper: 'bg-green-100 text-green-700',
          client: 'bg-muted text-muted-foreground',
        };
        const primaryRole = row.original.roles[0]?.role as AppRole | undefined;
        return primaryRole ? (
          <Badge variant="outline" className={`font-normal ${roleColors[primaryRole] || ''}`}>
            {primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      accessorFn: (row) => row.roles[0]?.role || '',
      filterFn: (row, id, value) => {
        return value.includes(row.original.roles[0]?.role || '');
      },
    },
    {
      accessorKey: 'team',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Team" />,
      cell: ({ row }) => row.original.team ? (
        <Badge variant="outline">{row.original.team.name}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
      accessorFn: (row) => row.team?.name || '',
      filterFn: (row, id, value) => {
        return value.includes(row.original.team?.name || '');
      },
    },
    {
      accessorKey: 'workflows',
      header: "Workflow Access",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.workflowAccess.length > 0 ? (
            row.original.workflowAccess.map((workflow) => (
              <Badge key={workflow.id} variant="outline" className="text-xs font-normal">
                {workflow.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={memberActions}
        />
      ),
    },
  ];

  const clientActions: DataTableAction<ClientWithDetails>[] = [
    { label: 'View Profile', onClick: (row) => toast.info(`Viewing ${row.profile?.full_name}`) },
    { label: 'Edit', onClick: (row) => toast.info(`Editing ${row.profile?.full_name}`) },
    { label: 'Reassign Team', onClick: (row) => toast.info(`Reassigning ${row.profile?.full_name}`) },
    { label: 'Pause', onClick: (row) => toast.warning(`Pausing ${row.profile?.full_name}`), variant: 'destructive', separator: true },
  ];

  const memberActions: DataTableAction<StaffMemberWithDetails>[] = [
    { label: 'View Profile', onClick: (row) => toast.info(`Viewing ${row.full_name}`) },
    { label: 'Edit', onClick: (row) => toast.info(`Editing ${row.full_name}`) },
    { label: 'Change Role', onClick: (row) => toast.info(`Changing role for ${row.full_name}`) },
    { label: 'Remove', onClick: (row) => toast.error(`Removing ${row.full_name}`), variant: 'destructive', separator: true },
  ];

  const isLoading = clientsLoading || staffLoading;

  // Filter options
  const statusFilterOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Onboarding', value: 'onboarding' },
    { label: 'Paused', value: 'paused' },
  ];

  const roleFilterOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Press', value: 'press' },
    { label: 'Research', value: 'research' },
    { label: 'Paper', value: 'paper' },
  ];

  const teamFilterOptions = teams.map(team => ({
    label: team.name,
    value: team.name,
  }));

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
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role to User</DialogTitle>
                <DialogDescription>
                  Users must sign up first before being assigned a role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <Input 
                    placeholder="Enter email of registered user"
                    value={selectedUserId ? staffMembers.find(m => m.id === selectedUserId)?.email || '' : ''}
                    onChange={(e) => {
                      const email = e.target.value;
                      const found = staffMembers.find(m => m.email === email);
                      setSelectedUserId(found?.id || '');
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    User must have signed up before they can be assigned a role.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="press">Press</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="paper">Paper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team (Optional)</Label>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={addRoleMutation.isPending || !selectedRole}>
                  {addRoleMutation.isPending ? 'Assigning...' : 'Assign Role'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <EnhancedDataTable
              data={clients}
              columns={clientColumns}
              isLoading={isLoading}
              searchPlaceholder="Search clients..."
              filterableColumns={[
                { id: 'status', title: 'Status', options: statusFilterOptions },
                { id: 'team', title: 'Team', options: teamFilterOptions },
              ]}
              onRowClick={(row) => toast.info(`Selected: ${row.profile?.full_name}`)}
              emptyMessage="No clients found. Clients appear here after they complete signup."
            />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <EnhancedDataTable
              data={staffMembers}
              columns={memberColumns}
              isLoading={isLoading}
              searchPlaceholder="Search team members..."
              filterableColumns={[
                { id: 'role', title: 'Role', options: roleFilterOptions },
                { id: 'team', title: 'Team', options: teamFilterOptions },
              ]}
              onRowClick={(row) => toast.info(`Selected: ${row.full_name}`)}
              emptyMessage="No team members found. Use 'Add User' to assign roles."
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
