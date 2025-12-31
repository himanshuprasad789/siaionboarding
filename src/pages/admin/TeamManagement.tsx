import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus, Users, Trash2, UserPlus, Loader2, Settings } from 'lucide-react';
import { useTeams, TeamWithWorkflows } from '@/hooks/useTeams';
import { useStaffMembers, StaffMemberWithDetails } from '@/hooks/useAdminData';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type AppRole = Database["public"]["Enums"]["app_role"];
type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"];

export default function TeamManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: staffMembers = [], isLoading: staffLoading } = useStaffMembers();
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMemberByTeam, setSelectedMemberByTeam] = useState<Record<string, string>>({});
  const [workflowDialogTeamId, setWorkflowDialogTeamId] = useState<string | null>(null);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  // Fetch all workflows
  const { data: allWorkflows = [] } = useQuery({
    queryKey: ['all-workflows'],
    queryFn: async (): Promise<WorkflowRow[]> => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createTeamMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const { error } = await supabase
        .from('teams')
        .insert({ name, description });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setNewTeamName('');
      setNewTeamDesc('');
      setIsCreateOpen(false);
      toast.success(`Team "${newTeamName}" created successfully`);
    },
    onError: (error) => {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team deleted');
    },
    onError: (error) => {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team');
    },
  });

  const updateMemberTeamMutation = useMutation({
    mutationFn: async ({ memberId, teamId }: { memberId: string; teamId: string | null }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ team_id: teamId })
        .eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
    },
    onError: (error) => {
      console.error('Error updating member team:', error);
      toast.error('Failed to update member');
    },
  });

  const updateWorkflowAccessMutation = useMutation({
    mutationFn: async ({ teamId, workflowIds }: { teamId: string; workflowIds: string[] }) => {
      // Delete existing access
      const { error: deleteError } = await supabase
        .from('team_workflow_access')
        .delete()
        .eq('team_id', teamId);
      if (deleteError) throw deleteError;

      // Insert new access
      if (workflowIds.length > 0) {
        const inserts = workflowIds.map(workflowId => ({
          team_id: teamId,
          workflow_id: workflowId,
        }));
        const { error: insertError } = await supabase
          .from('team_workflow_access')
          .insert(inserts);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setWorkflowDialogTeamId(null);
      toast.success('Workflow access updated');
    },
    onError: (error) => {
      console.error('Error updating workflow access:', error);
      toast.error('Failed to update workflow access');
    },
  });

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    createTeamMutation.mutate({ name: newTeamName, description: newTeamDesc });
  };

  const handleDeleteTeam = (teamId: string) => {
    deleteTeamMutation.mutate(teamId);
  };

  const handleAddMember = (teamId: string) => {
    const memberId = selectedMemberByTeam[teamId];
    if (!memberId) return;
    
    updateMemberTeamMutation.mutate({ memberId, teamId });
    setSelectedMemberByTeam(prev => ({ ...prev, [teamId]: '' }));
    toast.success('Member added to team');
  };

  const handleRemoveMember = (memberId: string) => {
    updateMemberTeamMutation.mutate({ memberId, teamId: null });
    toast.success('Member removed from team');
  };

  const openWorkflowDialog = (team: TeamWithWorkflows) => {
    setWorkflowDialogTeamId(team.id);
    setSelectedWorkflows(team.workflowAccess.map(w => w.id));
  };

  const handleSaveWorkflows = () => {
    if (!workflowDialogTeamId) return;
    updateWorkflowAccessMutation.mutate({ 
      teamId: workflowDialogTeamId, 
      workflowIds: selectedWorkflows 
    });
  };

  const toggleWorkflow = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const getTeamMembers = (teamId: string): StaffMemberWithDetails[] => {
    return staffMembers.filter(m => m.team_id === teamId);
  };

  const getAvailableMembers = (teamId: string): StaffMemberWithDetails[] => {
    // Include members with no team OR members in a different team (for reassignment)
    return staffMembers.filter(m => m.team_id === null || m.team_id !== teamId);
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'press': return 'default';
      case 'research': return 'secondary';
      case 'paper': return 'outline';
      default: return 'outline';
    }
  };

  const isLoading = teamsLoading || staffLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const currentTeamForDialog = teams.find(t => t.id === workflowDialogTeamId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground mt-1">
              Create teams, manage members, and assign workflow access.
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Add a new team to organize your internal members.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="e.g., Press Team"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-desc">Description</Label>
                  <Input
                    id="team-desc"
                    placeholder="What does this team do?"
                    value={newTeamDesc}
                    onChange={(e) => setNewTeamDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} disabled={createTeamMutation.isPending}>
                  {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workflow Access Dialog */}
        <Dialog open={!!workflowDialogTeamId} onOpenChange={(open) => !open && setWorkflowDialogTeamId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Workflow Access</DialogTitle>
              <DialogDescription>
                Select which workflows "{currentTeamForDialog?.name}" team can access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[300px] overflow-y-auto">
              {allWorkflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={workflow.id}
                    checked={selectedWorkflows.includes(workflow.id)}
                    onCheckedChange={() => toggleWorkflow(workflow.id)}
                  />
                  <div className="flex-1">
                    <label htmlFor={workflow.id} className="text-sm font-medium cursor-pointer">
                      {workflow.name}
                    </label>
                    {workflow.description && (
                      <p className="text-xs text-muted-foreground">{workflow.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {workflow.team}
                  </Badge>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWorkflowDialogTeamId(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWorkflows} disabled={updateWorkflowAccessMutation.isPending}>
                {updateWorkflowAccessMutation.isPending ? 'Saving...' : 'Save Access'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {teams.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No teams found. Create your first team to get started.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const teamMembers = getTeamMembers(team.id);
              const availableMembers = getAvailableMembers(team.id);
              
              return (
                <Card key={team.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {teamMembers.length} members
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => openWorkflowDialog(team)}
                          title="Manage Workflows"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {team.description || 'No description'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Workflow Access */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Workflow Access</p>
                      <div className="flex flex-wrap gap-1">
                        {team.workflowAccess.map((workflow) => (
                          <Badge key={workflow.id} variant="outline" className="text-xs">
                            {workflow.name}
                          </Badge>
                        ))}
                        {team.workflowAccess.length === 0 && (
                          <button 
                            onClick={() => openWorkflowDialog(team)}
                            className="text-xs text-primary hover:underline"
                          >
                            + Add workflows
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Team Members</p>
                      {teamMembers.map((member) => {
                        const primaryRole = member.roles[0]?.role as AppRole | undefined;
                        return (
                          <div 
                            key={member.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs">
                                  {member.full_name?.split(' ').map(n => n[0]).join('') || '??'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.full_name || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {primaryRole && (
                                <Badge variant={getRoleBadgeVariant(primaryRole)} className="text-xs">
                                  {primaryRole}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      {teamMembers.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No members in this team
                        </p>
                      )}
                    </div>

                    {/* Add Member */}
                    <div className="flex gap-2">
                      <Select 
                        value={selectedMemberByTeam[team.id] || ''} 
                        onValueChange={(value) => {
                          if (value) {
                            updateMemberTeamMutation.mutate({ memberId: value, teamId: team.id });
                            toast.success('Member added to team');
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add member..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMembers.length === 0 ? (
                            <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                              No available staff members
                            </div>
                          ) : (
                            availableMembers.map((member) => {
                              const role = member.roles[0]?.role;
                              return (
                                <SelectItem key={member.id} value={member.id}>
                                  <span className="flex items-center gap-2">
                                    {member.full_name || member.email}
                                    {role && (
                                      <Badge variant="outline" className="text-xs ml-1">
                                        {role}
                                      </Badge>
                                    )}
                                  </span>
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleAddMember(team.id)}
                                disabled={!selectedMemberByTeam[team.id] || availableMembers.length === 0}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {availableMembers.length === 0 
                              ? "No staff members available"
                              : "Select a member from dropdown to add"
                            }
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}