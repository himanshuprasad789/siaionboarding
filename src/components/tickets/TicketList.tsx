import { DataTable, DataTableColumn, StatusBadge, TypeBadge } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Ticket, getWorkflowSteps } from '@/data/mockWorkflowData';
import { toast } from 'sonner';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

export function TicketList({ tickets, onTicketClick }: TicketListProps) {
  const getStatusType = (status: Ticket['status']): 'done' | 'in_progress' | 'waiting' | 'pending' => {
    switch (status) {
      case 'completed':
        return 'done';
      case 'in_progress':
        return 'in_progress';
      case 'waiting_client':
      case 'waiting_team':
        return 'waiting';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'waiting_client':
        return 'Waiting Client';
      case 'waiting_team':
        return 'Waiting Team';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Done';
      default:
        return status;
    }
  };

  const columns: DataTableColumn<Ticket>[] = [
    {
      key: 'title',
      header: 'Title',
      cell: (row) => (
        <div>
          <p className="font-medium">{row.title}</p>
          <p className="text-sm text-muted-foreground">{row.clientName}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Workflow Type',
      cell: (row) => <TypeBadge type={row.workflowType} />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <StatusBadge 
          status={getStatusType(row.status)} 
          label={getStatusLabel(row.status)} 
        />
      ),
    },
    {
      key: 'step',
      header: 'Current Step',
      cell: (row) => {
        const steps = getWorkflowSteps(row.workflowType);
        const currentStepName = steps[row.currentStep]?.name || 'Unknown';
        return <span className="text-muted-foreground">{currentStepName}</span>;
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (row) => {
        const priorityColors = {
          high: 'bg-red-100 text-red-700',
          medium: 'bg-amber-100 text-amber-700',
          low: 'bg-green-100 text-green-700',
        };
        return (
          <Badge variant="outline" className={`font-normal ${priorityColors[row.priority]}`}>
            {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      cell: (row) => <span className="text-muted-foreground">{row.assignedTo}</span>,
    },
  ];

  const actions = [
    { label: 'View Details', onClick: (row: Ticket) => onTicketClick?.(row) },
    { label: 'Reassign', onClick: (row: Ticket) => toast.info(`Reassigning ${row.title}`) },
    { label: 'Mark Complete', onClick: (row: Ticket) => toast.success(`Marked ${row.title} complete`) },
  ];

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="text-lg font-medium text-foreground">No tickets found</h3>
        <p className="text-muted-foreground">All caught up! Check back later for new tasks.</p>
      </div>
    );
  }

  return (
    <DataTable
      data={tickets}
      columns={columns}
      actions={actions}
      onRowClick={onTicketClick}
      getRowId={(row) => row.id}
    />
  );
}
