import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { useTicketsByTeam, Ticket } from '@/hooks/useTickets';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export default function PressTasks() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { data: tickets = [], isLoading } = useTicketsByTeam('press');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            All tickets assigned to you across Press and Vendor workflows
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TicketList 
            tickets={tickets} 
            onTicketClick={(ticket) => setSelectedTicket(ticket)} 
          />
        )}

        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTicket && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
                <p className="text-muted-foreground">{selectedTicket.description}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CommandCenterLayout>
  );
}
