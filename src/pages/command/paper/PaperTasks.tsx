import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketDetail } from '@/components/tickets/TicketDetail';
import { getTicketsByRole, getWorkflowSteps, Ticket } from '@/data/mockWorkflowData';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function PaperTasks() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const tickets = getTicketsByRole('paper');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            All tickets assigned to you across Journal and Book workflows
          </p>
        </div>

        <TicketList 
          tickets={tickets} 
          onTicketClick={(ticket) => setSelectedTicket(ticket)} 
        />

        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                workflowSteps={getWorkflowSteps(selectedTicket.workflowType)}
                onStepComplete={() => setSelectedTicket(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CommandCenterLayout>
  );
}
