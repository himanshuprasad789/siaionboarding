import { ColumnDef } from '@tanstack/react-table';
import { EnhancedDataTable } from '@/components/ui/enhanced-data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableRowActions, DataTableAction } from '@/components/ui/data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/hooks/useTickets';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type TicketStatus = Database["public"]["Enums"]["ticket_status"];
type TicketPriority = Database["public"]["Enums"]["ticket_priority"];

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
  isLoading?: boolean;
}

const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  pending_review: { label: 'Pending Review', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Done', color: 'bg-green-100 text-green-700' },
};

const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
  high: { label: 'High', color: 'bg-red-100 text-red-700' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  low: { label: 'Low', color: 'bg-green-100 text-green-700' },
};

const teamFilterOptions = [
  { label: 'Press', value: 'press' },
  { label: 'Research', value: 'research' },
  { label: 'Paper', value: 'paper' },
  { label: 'Unassigned', value: 'unassigned' },
];

const statusFilterOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Closed', value: 'closed' },
];

const priorityFilterOptions = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export function TicketList({ tickets, onTicketClick, isLoading }: TicketListProps) {
  const actions: DataTableAction<Ticket>[] = [
    { label: 'View Details', onClick: (row) => onTicketClick?.(row) },
    { label: 'Reassign', onClick: (row) => toast.info(`Reassigning ${row.title}`) },
    { label: 'Mark Complete', onClick: (row) => toast.success(`Marked ${row.title} complete`) },
  ];

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground">{row.original.client_name || 'Unknown Client'}</p>
        </div>
      ),
      meta: {
        filterType: 'text' as const,
        filterLabel: 'Title',
      },
    },
    {
      accessorKey: 'assigned_team',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Team" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.assigned_team || 'unassigned'}
        </Badge>
      ),
      meta: {
        filterType: 'select' as const,
        filterLabel: 'Team',
        filterOptions: teamFilterOptions,
      },
      filterFn: (row, id, value) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
          return (row.original.assigned_team || 'unassigned') === value.value;
        }
        if (Array.isArray(value)) {
          return value.includes(row.original.assigned_team || 'unassigned');
        }
        return (row.original.assigned_team || 'unassigned') === value;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = statusConfig[row.original.status];
        return (
          <Badge className={`font-normal ${status.color}`}>
            {status.label}
          </Badge>
        );
      },
      meta: {
        filterType: 'select' as const,
        filterLabel: 'Status',
        filterOptions: statusFilterOptions,
      },
      filterFn: (row, id, value) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
          return row.original.status === value.value;
        }
        if (Array.isArray(value)) {
          return value.includes(row.original.status);
        }
        return row.original.status === value;
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = priorityConfig[row.original.priority];
        return (
          <Badge variant="outline" className={`font-normal ${priority.color}`}>
            {priority.label}
          </Badge>
        );
      },
      meta: {
        filterType: 'select' as const,
        filterLabel: 'Priority',
        filterOptions: priorityFilterOptions,
      },
      filterFn: (row, id, value) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
          return row.original.priority === value.value;
        }
        if (Array.isArray(value)) {
          return value.includes(row.original.priority);
        }
        return row.original.priority === value;
      },
    },
    {
      accessorKey: 'assigned_to_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.assigned_to_name || 'Unassigned'}</span>
      ),
      meta: {
        filterType: 'text' as const,
        filterLabel: 'Assigned To',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={actions}
        />
      ),
    },
  ];

  return (
    <EnhancedDataTable
      data={tickets}
      columns={columns}
      isLoading={isLoading}
      searchPlaceholder="Search tickets..."
      filterableColumns={[
        { id: 'status', title: 'Status', options: statusFilterOptions },
        { id: 'priority', title: 'Priority', options: priorityFilterOptions },
        { id: 'assigned_team', title: 'Team', options: teamFilterOptions },
      ]}
      onRowClick={onTicketClick}
      getRowId={(row) => row.id}
      emptyMessage="No tickets found. All caught up!"
    />
  );
}
