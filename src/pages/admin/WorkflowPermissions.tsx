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
import { Loader2 } from 'lucide-react';
import { useWorkflows, useWorkflowPermissions } from '@/hooks/useWorkflows';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type PermissionLevel = Database["public"]["Enums"]["permission_level"];
type AppRole = Database["public"]["Enums"]["app_role"];

const allRoles: AppRole[] = ['client', 'press', 'research', 'paper', 'admin'];
const permissionLevels: PermissionLevel[] = ['hidden', 'read', 'edit', 'masked'];

export default function WorkflowPermissions() {
  const queryClient = useQueryClient();
  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();
  const { data: permissions = [], isLoading: permissionsLoading } = useWorkflowPermissions();
  
  const [activeWorkflow, setActiveWorkflow] = useState<string | undefined>(undefined);

  // Set default active workflow when data loads
  const defaultWorkflowId = useMemo(() => {
    if (workflows.length > 0 && !activeWorkflow) {
      return workflows[0].id;
    }
    return activeWorkflow;
  }, [workflows, activeWorkflow]);

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
      // Check if permission exists
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

  if (workflows.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Workflow Permissions</h1>
            <p className="text-muted-foreground mt-1">
              Control who sees what at each workflow stage.
            </p>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            No workflows found. Create workflows first.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Workflow Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Control who sees what at each workflow stage.
          </p>
        </div>

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
      </div>
    </AdminLayout>
  );
}
