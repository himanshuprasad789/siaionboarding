import { Clock, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, getWorkflowSteps } from '@/data/mockWorkflowData';
import { cn } from '@/lib/utils';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

export function TicketList({ tickets, onTicketClick }: TicketListProps) {
  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'waiting_client':
        return <User className="w-4 h-4" />;
      case 'waiting_team':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'waiting_client':
        return <Badge variant="destructive" className="gap-1">{getStatusIcon(status)} Waiting for Client</Badge>;
      case 'waiting_team':
        return <Badge variant="secondary" className="gap-1">{getStatusIcon(status)} Waiting for Team</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="gap-1 bg-amber-500">{getStatusIcon(status)} In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="gap-1 bg-green-600">{getStatusIcon(status)} Completed</Badge>;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      case 'low':
        return 'border-l-green-500';
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium text-foreground">No tickets found</h3>
        <p className="text-muted-foreground">All caught up! Check back later for new tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const steps = getWorkflowSteps(ticket.workflowType);
        const currentStepName = steps[ticket.currentStep]?.name || 'Unknown';

        return (
          <Card
            key={ticket.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md border-l-4',
              getPriorityColor(ticket.priority)
            )}
            onClick={() => onTicketClick?.(ticket)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">{ticket.title}</h4>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {ticket.workflowType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.clientName} • Step: {currentStepName}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {getStatusBadge(ticket.status)}
                  <span className="text-xs text-muted-foreground">
                    Updated {ticket.updatedAt}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
