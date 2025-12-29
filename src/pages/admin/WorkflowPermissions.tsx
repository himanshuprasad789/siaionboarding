import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Trash2, Edit, Settings2, GripVertical } from 'lucide-react';
import { useWorkflows, useWorkflowPermissions } from '@/hooks/useWorkflows';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type PermissionLevel = Database["public"]["Enums"]["permission_level"];
type AppRole = Database["public"]["Enums"]["app_role"];

const allRoles: AppRole[] = ['client', 'press', 'research', 'paper', 'admin'];
const permissionLevels: PermissionLevel[] = ['hidden', 'read', 'edit', 'masked'];
const teamOptions = ['press', 'research', 'paper'];

export default function WorkflowPermissions() {
  const queryClient = useQueryClient();
  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();
  const { data: permissions = [], isLoading: permissionsLoading } = useWorkflowPermissions();
  
  const [activeWorkflow, setActiveWorkflow] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'workflows' | 'permissions'>('workflows');
  
  // Create workflow dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '', team: 'press', is_active: true });
  
  // Edit workflow dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<{ id: string; name: string; description: string; team: string; is_active: boolean } | null>(null);
  
  // Add stage dialog state
  const [addStageDialogOpen, setAddStageDialogOpen] = useState(false);
  const [newStage, setNewStage] = useState({ name: '', description: '', estimated_hours: 0 });
  const [stageWorkflowId, setStageWorkflowId] = useState<string | null>(null);

  // Set default active workflow when data loads
  const defaultWorkflowId = useMemo(() => {
    if (workflows.length > 0 && !activeWorkflow) {
      return workflows[0].id;
    }
    return activeWorkflow;
  }, [workflows, activeWorkflow]);

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; team: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('workflows')
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow created');
      setCreateDialogOpen(false);
      setNewWorkflow({ name: '', description: '', team: 'press', is_active: true });
    },
    onError: (error) => {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    },
  });

  // Update workflow mutation
  const updateWorkflowMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; description: string; team: string; is_active: boolean }) => {
      const { id, ...updateData } = data;
      const { error } = await supabase
        .from('workflows')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow updated');
      setEditDialogOpen(false);
      setEditingWorkflow(null);
    },
    onError: (error) => {
      console.error('Error updating workflow:', error);
      toast.error('Failed to update workflow');
    },
  });

  // Delete workflow state
  const [deleteWorkflowDialogOpen, setDeleteWorkflowDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<typeof workflows[0] | null>(null);

  // Delete workflow mutation - cascades to stages and permissions
  const deleteWorkflowMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      // First delete workflow permissions for all stages of this workflow
      const { error: permError } = await supabase
        .from('workflow_permissions')
        .delete()
        .eq('workflow_id', workflowId);
      if (permError) throw permError;

      // Then delete workflow stages
      const { error: stageError } = await supabase
        .from('workflow_stages')
        .delete()
        .eq('workflow_id', workflowId);
      if (stageError) throw stageError;

      // Finally delete the workflow itself
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-permissions'] });
      toast.success('Workflow and all related data deleted');
      setDeleteWorkflowDialogOpen(false);
      setWorkflowToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
    },
  });

  // Create stage mutation
  const createStageMutation = useMutation({
    mutationFn: async (data: { workflow_id: string; name: string; description: string; estimated_hours: number; order_index: number }) => {
      const { error } = await supabase
        .from('workflow_stages')
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Stage added');
      setAddStageDialogOpen(false);
      setNewStage({ name: '', description: '', estimated_hours: 0 });
      setStageWorkflowId(null);
    },
    onError: (error) => {
      console.error('Error creating stage:', error);
      toast.error('Failed to create stage');
    },
  });

  // Delete stage mutation
  const deleteStageMutation = useMutation({
    mutationFn: async (stageId: string) => {
      const { error } = await supabase
        .from('workflow_stages')
        .delete()
        .eq('id', stageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Stage deleted');
    },
    onError: (error) => {
      console.error('Error deleting stage:', error);
      toast.error('Failed to delete stage');
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async ({
      workflowId,
      stageId,
      role,
      permission,
    }: {
      workflowId: string;
      stageId: string;
      role: AppRole;
      permission: PermissionLevel;
    }) => {
      const existing = permissions.find(
        p => p.workflow_id === workflowId && p.stage_id === stageId && p.role === role
      );

      if (existing) {
        const { error } = await supabase
          .from('workflow_permissions')
          .update({ permission_level: permission })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('workflow_permissions')
          .insert({
            workflow_id: workflowId,
            stage_id: stageId,
            role,
            permission_level: permission,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-permissions'] });
      toast.success('Permission updated');
    },
    onError: (error) => {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    },
  });

  // Bulk permission update mutation
  const bulkUpdatePermissionsMutation = useMutation({
    mutationFn: async ({
      workflowId,
      role,
      permission,
      stageIds,
    }: {
      workflowId: string;
      role: AppRole;
      permission: PermissionLevel;
      stageIds: string[];
    }) => {
      // Delete existing permissions for this workflow/role combination
      for (const stageId of stageIds) {
        const existing = permissions.find(
          p => p.workflow_id === workflowId && p.stage_id === stageId && p.role === role
        );
        
        if (existing) {
          const { error } = await supabase
            .from('workflow_permissions')
            .update({ permission_level: permission })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('workflow_permissions')
            .insert({
              workflow_id: workflowId,
              stage_id: stageId,
              role,
              permission_level: permission,
            });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-permissions'] });
      toast.success('All stage permissions updated');
    },
    onError: (error) => {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    },
  });

  const handleBulkPermissionUpdate = (workflowId: string, role: AppRole, permission: PermissionLevel) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;
    const stageIds = workflow.stages.map(s => s.id);
    bulkUpdatePermissionsMutation.mutate({ workflowId, role, permission, stageIds });
  };

  const getPermission = (workflowId: string, stageId: string, role: AppRole): PermissionLevel => {
    const perm = permissions.find(
      p => p.workflow_id === workflowId && p.stage_id === stageId && p.role === role
    );
    return perm?.permission_level || 'hidden';
  };

  const updatePermission = (
    workflowId: string, 
    stageId: string, 
    role: AppRole, 
    permission: PermissionLevel
  ) => {
    updatePermissionMutation.mutate({ workflowId, stageId, role, permission });
  };

  const getPermissionBadgeVariant = (permission: PermissionLevel) => {
    switch (permission) {
      case 'edit': return 'default';
      case 'read': return 'secondary';
      case 'masked': return 'outline';
      case 'hidden': return 'destructive';
      default: return 'outline';
    }
  };

  const handleEditWorkflow = (workflow: typeof workflows[0]) => {
    setEditingWorkflow({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description || '',
      team: workflow.team,
      is_active: workflow.is_active ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleAddStage = (workflowId: string) => {
    setStageWorkflowId(workflowId);
    setAddStageDialogOpen(true);
  };

  const handleCreateStage = () => {
    if (!stageWorkflowId) return;
    const workflow = workflows.find(w => w.id === stageWorkflowId);
    const nextOrder = workflow ? workflow.stages.length : 0;
    createStageMutation.mutate({
      workflow_id: stageWorkflowId,
      name: newStage.name,
      description: newStage.description,
      estimated_hours: newStage.estimated_hours,
      order_index: nextOrder,
    });
  };

  const isLoading = workflowsLoading || permissionsLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Workflow Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage workflows and their permissions.
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Workflow</DialogTitle>
                <DialogDescription>
                  Add a new workflow to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="e.g., Press Release Workflow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="Describe the workflow..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <Select
                    value={newWorkflow.team}
                    onValueChange={(value) => setNewWorkflow({ ...newWorkflow, team: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teamOptions.map((team) => (
                        <SelectItem key={team} value={team} className="capitalize">
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={newWorkflow.is_active}
                    onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createWorkflowMutation.mutate(newWorkflow)}
                  disabled={!newWorkflow.name || createWorkflowMutation.isPending}
                >
                  {createWorkflowMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Tabs: Workflows vs Permissions */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'workflows' | 'permissions')}>
          <TabsList>
            <TabsTrigger value="workflows">
              <Settings2 className="h-4 w-4 mr-2" />
              Workflows & Stages
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <GripVertical className="h-4 w-4 mr-2" />
              Stage Permissions
            </TabsTrigger>
          </TabsList>

          {/* Workflows & Stages Tab */}
          <TabsContent value="workflows" className="space-y-4">
            {workflows.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No workflows found. Create one to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {workflow.name}
                          <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                            {workflow.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {workflow.team}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {workflow.description || 'No description'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditWorkflow(workflow)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => {
                            setWorkflowToDelete(workflow);
                            setDeleteWorkflowDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Stages ({workflow.stages.length})</h4>
                          <Button variant="outline" size="sm" onClick={() => handleAddStage(workflow.id)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Stage
                          </Button>
                        </div>
                        {workflow.stages.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No stages defined yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {workflow.stages.map((stage, index) => (
                              <div
                                key={stage.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <p className="text-sm font-medium">{stage.name}</p>
                                    {stage.description && (
                                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {stage.estimated_hours && (
                                    <Badge variant="outline" className="text-xs">
                                      {stage.estimated_hours}h
                                    </Badge>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Stage?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will delete "{stage.name}" from this workflow.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteStageMutation.mutate(stage.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">Edit</Badge>
              <span className="text-sm text-muted-foreground">= Full access</span>
              <Badge variant="secondary" className="ml-4">Read</Badge>
              <span className="text-sm text-muted-foreground">= View only</span>
              <Badge variant="outline" className="ml-4">Masked</Badge>
              <span className="text-sm text-muted-foreground">= Delayed visibility</span>
              <Badge variant="destructive" className="ml-4">Hidden</Badge>
              <span className="text-sm text-muted-foreground">= No access</span>
            </div>

            {workflows.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No workflows found. Create workflows first.
              </div>
            ) : (
              <Tabs value={defaultWorkflowId} onValueChange={setActiveWorkflow} className="space-y-4">
                <TabsList className="flex-wrap h-auto">
                  {workflows.map((workflow) => (
                    <TabsTrigger key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {workflows.map((workflow) => (
                  <TabsContent key={workflow.id} value={workflow.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{workflow.name} Workflow</CardTitle>
                        <CardDescription>
                          Configure access levels for each stage and role.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {workflow.stages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No stages defined for this workflow.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                                    Stage
                                  </th>
                                  {allRoles.map((role) => (
                                    <th 
                                      key={role} 
                                      className="text-center py-3 px-4 font-medium text-sm text-muted-foreground capitalize"
                                    >
                                      {role}
                                    </th>
                                  ))}
                                </tr>
                                {/* Bulk permission row */}
                                <tr className="border-b border-border bg-muted/50">
                                  <td className="py-2 px-4">
                                    <span className="text-sm font-medium text-muted-foreground italic">Set all stages →</span>
                                  </td>
                                  {allRoles.map((role) => (
                                    <td key={role} className="py-2 px-4 text-center">
                                      <Select
                                        value=""
                                        onValueChange={(value: PermissionLevel) => 
                                          handleBulkPermissionUpdate(workflow.id, role, value)
                                        }
                                      >
                                        <SelectTrigger className="w-28 mx-auto">
                                          <span className="text-xs text-muted-foreground">Bulk set...</span>
                                        </SelectTrigger>
                                        <SelectContent>
                                          {permissionLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                              <Badge variant={getPermissionBadgeVariant(level)}>
                                                {level}
                                              </Badge>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </td>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {workflow.stages.map((stage) => (
                                  <tr key={stage.id} className="border-b border-border last:border-0">
                                    <td className="py-3 px-4">
                                      <span className="font-medium text-sm">{stage.name}</span>
                                    </td>
                                    {allRoles.map((role) => {
                                      const currentPerm = getPermission(workflow.id, stage.id, role);
                                      return (
                                        <td key={role} className="py-3 px-4 text-center">
                                          <Select
                                            value={currentPerm}
                                            onValueChange={(value: PermissionLevel) => 
                                              updatePermission(workflow.id, stage.id, role, value)
                                            }
                                          >
                                            <SelectTrigger className="w-28 mx-auto">
                                              <Badge variant={getPermissionBadgeVariant(currentPerm)}>
                                                {currentPerm}
                                              </Badge>
                                            </SelectTrigger>
                                            <SelectContent>
                                              {permissionLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                  <Badge variant={getPermissionBadgeVariant(level)}>
                                                    {level}
                                                  </Badge>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Workflow Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Workflow</DialogTitle>
              <DialogDescription>
                Update workflow details.
              </DialogDescription>
            </DialogHeader>
            {editingWorkflow && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingWorkflow.name}
                    onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingWorkflow.description}
                    onChange={(e) => setEditingWorkflow({ ...editingWorkflow, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-team">Team</Label>
                  <Select
                    value={editingWorkflow.team}
                    onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow, team: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teamOptions.map((team) => (
                        <SelectItem key={team} value={team} className="capitalize">
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_active"
                    checked={editingWorkflow.is_active}
                    onCheckedChange={(checked) => setEditingWorkflow({ ...editingWorkflow, is_active: checked })}
                  />
                  <Label htmlFor="edit-is_active">Active</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => editingWorkflow && updateWorkflowMutation.mutate(editingWorkflow)}
                disabled={!editingWorkflow?.name || updateWorkflowMutation.isPending}
              >
                {updateWorkflowMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Stage Dialog */}
        <Dialog open={addStageDialogOpen} onOpenChange={setAddStageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stage</DialogTitle>
              <DialogDescription>
                Add a new stage to this workflow.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="stage-name">Stage Name</Label>
                <Input
                  id="stage-name"
                  value={newStage.name}
                  onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                  placeholder="e.g., Initial Review"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage-description">Description</Label>
                <Textarea
                  id="stage-description"
                  value={newStage.description}
                  onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                  placeholder="What happens in this stage..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage-hours">Estimated Hours</Label>
                <Input
                  id="stage-hours"
                  type="number"
                  min="0"
                  value={newStage.estimated_hours}
                  onChange={(e) => setNewStage({ ...newStage, estimated_hours: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddStageDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStage}
                disabled={!newStage.name || createStageMutation.isPending}
              >
                {createStageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Stage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Workflow Dialog */}
        <Dialog open={deleteWorkflowDialogOpen} onOpenChange={setDeleteWorkflowDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Workflow</DialogTitle>
              <DialogDescription>
                This will permanently delete the workflow and all associated data.
              </DialogDescription>
            </DialogHeader>
            {workflowToDelete && (
              <div className="space-y-4 py-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-3">
                  <p className="font-medium text-destructive">
                    You are about to delete "{workflowToDelete.name}"
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>This action will also delete:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>
                        <strong>{workflowToDelete.stages.length}</strong> workflow stage{workflowToDelete.stages.length !== 1 ? 's' : ''}
                        {workflowToDelete.stages.length > 0 && (
                          <span className="text-xs ml-1">
                            ({workflowToDelete.stages.map(s => s.name).join(', ')})
                          </span>
                        )}
                      </li>
                      <li>
                        All permission settings for each stage
                      </li>
                      <li>
                        Team workflow access configurations
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteWorkflowDialogOpen(false);
                  setWorkflowToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => workflowToDelete && deleteWorkflowMutation.mutate(workflowToDelete.id)}
                disabled={deleteWorkflowMutation.isPending}
              >
                {deleteWorkflowMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
