import { useState } from 'react';
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
import { mockWorkflows, mockPermissions, allRoles, permissionLevels } from '@/data/mockAdminData';
import { WorkflowPermission, PermissionLevel, AppRole } from '@/types/admin';
import { toast } from 'sonner';

export default function WorkflowPermissions() {
  const [permissions, setPermissions] = useState<WorkflowPermission[]>(mockPermissions);

  const getPermission = (workflowId: string, stageId: string, role: AppRole): PermissionLevel => {
    const perm = permissions.find(
      p => p.workflowId === workflowId && p.stageId === stageId && p.role === role
    );
    return perm?.permission || 'hidden';
  };

  const updatePermission = (
    workflowId: string, 
    stageId: string, 
    role: AppRole, 
    permission: PermissionLevel
  ) => {
    const existingIndex = permissions.findIndex(
      p => p.workflowId === workflowId && p.stageId === stageId && p.role === role
    );

    if (existingIndex >= 0) {
      const newPermissions = [...permissions];
      newPermissions[existingIndex] = { workflowId, stageId, role, permission };
      setPermissions(newPermissions);
    } else {
      setPermissions([...permissions, { workflowId, stageId, role, permission }]);
    }

    toast.success('Permission updated');
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

        <Tabs defaultValue={mockWorkflows[0]?.id} className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            {mockWorkflows.map((workflow) => (
              <TabsTrigger key={workflow.id} value={workflow.id}>
                {workflow.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {mockWorkflows.map((workflow) => (
            <TabsContent key={workflow.id} value={workflow.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{workflow.name} Workflow</CardTitle>
                  <CardDescription>
                    Configure access levels for each stage and role.
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
