// Mock workflow data for the role-based simulator

export interface WorkflowStep {
  id: string;
  name: string;
  role: 'client' | 'press' | 'paper' | 'research' | 'admin';
  type: 'form' | 'editor' | 'approval' | 'upload' | 'analysis' | 'vendor_setup' | 'monitoring' | 'checklist';
  description: string;
}

export interface Ticket {
  id: string;
  title: string;
  workflowType: string;
  currentStep: number;
  clientId: string;
  clientName: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'waiting_client' | 'waiting_team' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Press Workflow Steps
export const pressWorkflow: WorkflowStep[] = [
  { id: 'discovery', name: 'Discovery Review', role: 'press', type: 'form', description: 'Review client questionnaire and approve for drafting' },
  { id: 'drafting', name: 'Drafting', role: 'press', type: 'editor', description: 'Create press release draft using AI tools' },
  { id: 'client_review', name: 'Client Review', role: 'client', type: 'approval', description: 'Client reviews and approves the draft' },
  { id: 'publishing_setup', name: 'Publishing Setup', role: 'press', type: 'vendor_setup', description: 'Configure target outlet and assign to vendor' },
  { id: 'vendor_wait', name: 'Vendor Processing', role: 'press', type: 'monitoring', description: 'Monitor vendor progress and publication status' },
];

// Vendor Workflow Steps
export const vendorWorkflow: WorkflowStep[] = [
  { id: 'assignment', name: 'Assignment', role: 'press', type: 'form', description: 'Review assets from parent ticket' },
  { id: 'monitoring', name: 'Monitoring', role: 'press', type: 'monitoring', description: 'Track vendor progress and live URL' },
];

// Paper Publishing Workflow Steps
export const paperWorkflow: WorkflowStep[] = [
  { id: 'topic_selection', name: 'Topic Selection', role: 'paper', type: 'form', description: 'Review client niche and propose paper title' },
  { id: 'peer_review', name: 'Peer Review', role: 'paper', type: 'checklist', description: 'Manage reviewer invitations and feedback' },
  { id: 'journal_submission', name: 'Journal Submission', role: 'paper', type: 'form', description: 'Submit to target journal' },
  { id: 'acceptance', name: 'Acceptance', role: 'paper', type: 'upload', description: 'Upload acceptance letter and finalize' },
];

// Book Publishing Workflow Steps
export const bookWorkflow: WorkflowStep[] = [
  { id: 'manuscript_review', name: 'Manuscript Review', role: 'paper', type: 'editor', description: 'Review and mark edits on manuscript' },
  { id: 'isbn_metadata', name: 'ISBN & Metadata', role: 'paper', type: 'form', description: 'Enter ISBN, publisher, and publication details' },
  { id: 'distribution', name: 'Distribution', role: 'paper', type: 'form', description: 'Release to distribution channels' },
];

// Salary Analysis Workflow Steps
export const salaryWorkflow: WorkflowStep[] = [
  { id: 'data_intake', name: 'Data Intake', role: 'client', type: 'upload', description: 'Client uploads pay stubs and tax returns' },
  { id: 'comparative_analysis', name: 'Comparative Analysis', role: 'research', type: 'analysis', description: 'Compare salary to O*Net/FLC data' },
  { id: 'verification', name: 'Verification', role: 'research', type: 'form', description: 'Generate high-salary evidence PDF' },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  // Press Team Tickets
  {
    id: 'ticket-001',
    title: 'Press Release - AI Innovation',
    workflowType: 'press',
    currentStep: 1,
    clientId: 'client-001',
    clientName: 'John Doe',
    assignedTo: 'Alice Chen',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-24',
  },
  {
    id: 'ticket-002',
    title: 'Press Release - Healthcare Tech',
    workflowType: 'press',
    currentStep: 2,
    clientId: 'client-002',
    clientName: 'Jane Smith',
    assignedTo: 'Bob Smith',
    priority: 'medium',
    status: 'waiting_client',
    createdAt: '2024-12-18',
    updatedAt: '2024-12-23',
  },
  {
    id: 'ticket-003',
    title: 'Vendor - TechCrunch Publication',
    workflowType: 'vendor',
    currentStep: 1,
    clientId: 'client-001',
    clientName: 'John Doe',
    assignedTo: 'Alice Chen',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-12-22',
    updatedAt: '2024-12-24',
  },
  // Paper Team Tickets
  {
    id: 'ticket-004',
    title: 'Research Paper - Machine Learning',
    workflowType: 'paper',
    currentStep: 1,
    clientId: 'client-003',
    clientName: 'Mike Johnson',
    assignedTo: 'Eva Martinez',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-24',
  },
  {
    id: 'ticket-005',
    title: 'Book Publishing - AI Leadership',
    workflowType: 'book',
    currentStep: 0,
    clientId: 'client-004',
    clientName: 'Sarah Lee',
    assignedTo: 'Eva Martinez',
    priority: 'low',
    status: 'waiting_team',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-20',
  },
  // Research Team Tickets
  {
    id: 'ticket-006',
    title: 'Salary Analysis - Tech Executive',
    workflowType: 'salary',
    currentStep: 1,
    clientId: 'client-001',
    clientName: 'John Doe',
    assignedTo: 'Carol Davis',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-12-21',
    updatedAt: '2024-12-24',
  },
  {
    id: 'ticket-007',
    title: 'Salary Analysis - Data Scientist',
    workflowType: 'salary',
    currentStep: 0,
    clientId: 'client-005',
    clientName: 'Tom Wilson',
    assignedTo: 'David Lee',
    priority: 'medium',
    status: 'waiting_client',
    createdAt: '2024-12-19',
    updatedAt: '2024-12-22',
  },
];

// Get workflow by type
export function getWorkflowSteps(workflowType: string): WorkflowStep[] {
  switch (workflowType) {
    case 'press':
      return pressWorkflow;
    case 'vendor':
      return vendorWorkflow;
    case 'paper':
      return paperWorkflow;
    case 'book':
      return bookWorkflow;
    case 'salary':
      return salaryWorkflow;
    default:
      return [];
  }
}

// Get tickets by workflow type
export function getTicketsByWorkflow(workflowType: string): Ticket[] {
  return mockTickets.filter(t => t.workflowType === workflowType);
}

// Get tickets assigned to a role
export function getTicketsByRole(role: string): Ticket[] {
  const roleWorkflows: Record<string, string[]> = {
    press: ['press', 'vendor'],
    paper: ['paper', 'book'],
    research: ['salary'],
  };
  
  const workflows = roleWorkflows[role] || [];
  return mockTickets.filter(t => workflows.includes(t.workflowType));
}
