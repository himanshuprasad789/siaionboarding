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

// Mock Clients data
export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'onboarding' | 'paused';
  assignedTeam: string;
  activeWorkflows: string[];
  createdAt: string;
  lastActive: string;
}

export const mockClients: Client[] = [
  { 
    id: 'client-1', 
    name: 'Dr. Sarah Johnson', 
    email: 'sarah.j@research.edu', 
    status: 'active',
    assignedTeam: 'team-press',
    activeWorkflows: ['press', 'paper_publishing'],
    createdAt: '2024-10-15',
    lastActive: '2024-12-24',
  },
  { 
    id: 'client-2', 
    name: 'Michael Chen', 
    email: 'm.chen@techcorp.io', 
    status: 'active',
    assignedTeam: 'team-research',
    activeWorkflows: ['salary', 'opportunities'],
    createdAt: '2024-11-01',
    lastActive: '2024-12-23',
  },
  { 
    id: 'client-3', 
    name: 'Emily Rodriguez', 
    email: 'emily.r@startup.com', 
    status: 'onboarding',
    assignedTeam: 'team-press',
    activeWorkflows: ['press'],
    createdAt: '2024-12-10',
    lastActive: '2024-12-22',
  },
  { 
    id: 'client-4', 
    name: 'James Kim', 
    email: 'jkim@university.edu', 
    status: 'active',
    assignedTeam: 'team-paper',
    activeWorkflows: ['paper_publishing', 'book_publishing'],
    createdAt: '2024-09-20',
    lastActive: '2024-12-24',
  },
  { 
    id: 'client-5', 
    name: 'Lisa Wang', 
    email: 'lwang@enterprise.co', 
    status: 'paused',
    assignedTeam: 'team-research',
    activeWorkflows: ['salary'],
    createdAt: '2024-08-15',
    lastActive: '2024-11-30',
  },
  { 
    id: 'client-6', 
    name: 'Robert Taylor', 
    email: 'rtaylor@consulting.biz', 
    status: 'active',
    assignedTeam: 'team-press',
    activeWorkflows: ['press', 'vendor'],
    createdAt: '2024-11-20',
    lastActive: '2024-12-24',
  },
  { 
    id: 'client-7', 
    name: 'Amanda Foster', 
    email: 'afoster@biotech.org', 
    status: 'active',
    assignedTeam: 'team-paper',
    activeWorkflows: ['paper_publishing'],
    createdAt: '2024-10-01',
    lastActive: '2024-12-23',
  },
  { 
    id: 'client-8', 
    name: 'Daniel Martinez', 
    email: 'dmartinez@fintech.io', 
    status: 'onboarding',
    assignedTeam: 'team-research',
    activeWorkflows: ['opportunities'],
    createdAt: '2024-12-18',
    lastActive: '2024-12-24',
  },
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
  {
    id: 'book_publishing',
    name: 'Book Publishing',
    stages: [
      { id: 'manuscript', name: 'Manuscript' },
      { id: 'editing', name: 'Editing' },
      { id: 'design', name: 'Design' },
      { id: 'distribution', name: 'Distribution' },
    ],
  },
  {
    id: 'opportunities',
    name: 'Opportunities',
    stages: [
      { id: 'discovery', name: 'Discovery' },
      { id: 'application', name: 'Application' },
      { id: 'review', name: 'Review' },
      { id: 'accepted', name: 'Accepted' },
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
