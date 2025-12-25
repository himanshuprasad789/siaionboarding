// Admin types for role-based access control

export type AppRole = 'admin' | 'press' | 'research' | 'paper' | 'client';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: AppRole;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  workflowAccess: string[];
}

export interface WorkflowStage {
  id: string;
  name: string;
}

export interface Workflow {
  id: string;
  name: string;
  stages: WorkflowStage[];
}

export type PermissionLevel = 'hidden' | 'read' | 'edit' | 'masked';

export interface WorkflowPermission {
  workflowId: string;
  stageId: string;
  role: AppRole;
  permission: PermissionLevel;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  criteriaCategory: string;
  isPremium: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
