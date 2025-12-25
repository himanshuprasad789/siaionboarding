// Mock data for admin panel

import { Team, TeamMember, Workflow, WorkflowPermission, Opportunity, AppRole } from '@/types/admin';

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'press' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'press' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'research' },
  { id: '4', name: 'David Lee', email: 'david@example.com', role: 'research' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'paper' },
  { id: '6', name: 'Frank Wilson', email: 'frank@example.com', role: 'admin' },
];

export const mockTeams: Team[] = [
  {
    id: 'team-press',
    name: 'Press Team',
    description: 'Handles press releases and media outreach',
    members: mockTeamMembers.filter(m => m.role === 'press'),
    workflowAccess: ['press', 'vendor'],
  },
  {
    id: 'team-research',
    name: 'Research Team',
    description: 'Manages opportunities and salary analysis',
    members: mockTeamMembers.filter(m => m.role === 'research'),
    workflowAccess: ['opportunities', 'remuneration'],
  },
  {
    id: 'team-paper',
    name: 'Paper Publishing Team',
    description: 'Handles paper and book publishing workflows',
    members: mockTeamMembers.filter(m => m.role === 'paper'),
    workflowAccess: ['paper_publishing', 'book_publishing'],
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: 'press',
    name: 'Press Release',
    stages: [
      { id: 'discovery', name: 'Discovery' },
      { id: 'drafting', name: 'Drafting' },
      { id: 'review', name: 'Review' },
      { id: 'publishing', name: 'Publishing' },
      { id: 'done', name: 'Done' },
    ],
  },
  {
    id: 'vendor',
    name: 'Vendor Management',
    stages: [
      { id: 'selection', name: 'Selection' },
      { id: 'negotiation', name: 'Negotiation' },
      { id: 'execution', name: 'Execution' },
      { id: 'completed', name: 'Completed' },
    ],
  },
  {
    id: 'salary',
    name: 'Salary Analysis',
    stages: [
      { id: 'upload', name: 'Document Upload' },
      { id: 'analysis', name: 'Analysis' },
      { id: 'comparison', name: 'Comparison' },
      { id: 'verified', name: 'Verified' },
    ],
  },
  {
    id: 'paper_publishing',
    name: 'Paper Publishing',
    stages: [
      { id: 'outline', name: 'Outline' },
      { id: 'peer_review', name: 'Peer Review' },
      { id: 'acceptance', name: 'Acceptance' },
      { id: 'published', name: 'Published' },
    ],
  },
];

export const mockPermissions: WorkflowPermission[] = [
  // Press workflow permissions
  { workflowId: 'press', stageId: 'discovery', role: 'client', permission: 'edit' },
  { workflowId: 'press', stageId: 'discovery', role: 'press', permission: 'read' },
  { workflowId: 'press', stageId: 'discovery', role: 'research', permission: 'hidden' },
  { workflowId: 'press', stageId: 'drafting', role: 'client', permission: 'read' },
  { workflowId: 'press', stageId: 'drafting', role: 'press', permission: 'edit' },
  { workflowId: 'press', stageId: 'drafting', role: 'research', permission: 'hidden' },
  { workflowId: 'press', stageId: 'review', role: 'client', permission: 'edit' },
  { workflowId: 'press', stageId: 'review', role: 'press', permission: 'edit' },
  { workflowId: 'press', stageId: 'review', role: 'research', permission: 'hidden' },
  { workflowId: 'press', stageId: 'publishing', role: 'client', permission: 'read' },
  { workflowId: 'press', stageId: 'publishing', role: 'press', permission: 'edit' },
  { workflowId: 'press', stageId: 'publishing', role: 'research', permission: 'hidden' },
  // Salary workflow permissions
  { workflowId: 'salary', stageId: 'upload', role: 'client', permission: 'edit' },
  { workflowId: 'salary', stageId: 'upload', role: 'research', permission: 'read' },
  { workflowId: 'salary', stageId: 'analysis', role: 'client', permission: 'read' },
  { workflowId: 'salary', stageId: 'analysis', role: 'research', permission: 'edit' },
  { workflowId: 'salary', stageId: 'comparison', role: 'client', permission: 'read' },
  { workflowId: 'salary', stageId: 'comparison', role: 'research', permission: 'edit' },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'AI Summit 2025 Speaker',
    description: 'Apply to speak at the leading AI conference',
    criteriaCategory: 'Judging',
    isPremium: false,
    imageUrl: '/placeholder.svg',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-24',
  },
  {
    id: 'opp-2',
    title: 'Forbes Technology Council',
    description: 'Invitation-only community for tech executives',
    criteriaCategory: 'Membership',
    isPremium: true,
    imageUrl: '/placeholder.svg',
    createdAt: '2024-12-18',
    updatedAt: '2024-12-23',
  },
  {
    id: 'opp-3',
    title: 'Press Package - Premium Outlets',
    description: 'Get featured in top-tier tech publications',
    criteriaCategory: 'Press',
    isPremium: true,
    imageUrl: '/placeholder.svg',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-22',
  },
];

export const allRoles: AppRole[] = ['client', 'press', 'research', 'paper', 'admin'];

export const permissionLevels = ['hidden', 'read', 'edit', 'masked'] as const;
