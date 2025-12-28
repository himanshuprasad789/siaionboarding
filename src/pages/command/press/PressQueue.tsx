import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { useTicketsByTeam, Ticket } from '@/hooks/useTickets';
import { useWorkflowsByTeam } from '@/hooks/useWorkflows';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function PressQueue() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { data: tickets = [], isLoading } = useTicketsByTeam('press');
  const { data: workflows = [] } = useWorkflowsByTeam('press');

  // Get workflow stages for Kanban view
  const pressWorkflow = workflows.find(w => w.name.toLowerCase().includes('press'));
  const stages = pressWorkflow?.stages || [];

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Press Queue</h1>
          <p className="text-muted-foreground mt-1">
            Kanban view of all press release workflows
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="kanban">
            <TabsList>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="kanban" className="mt-6">
              <div className="grid grid-cols-5 gap-4 overflow-x-auto">
                {stages.length > 0 ? stages.map((stage) => (
                  <div key={stage.id} className="min-w-[250px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">{stage.name}</h3>
                      <Badge variant="secondary">
                        {tickets.filter(t => t.status === 'open').length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {tickets.slice(0, 3).map((ticket) => (
                        <Card 
                          key={ticket.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <CardContent className="p-3">
                            <p className="font-medium text-sm mb-1">{ticket.title}</p>
                            <p className="text-xs text-muted-foreground">{ticket.client_name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge 
                                variant={ticket.priority === 'high' || ticket.priority === 'urgent' ? 'destructive' : 'outline'}
                                className="text-xs"
                              >
                                {ticket.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {ticket.assigned_to_name?.split(' ')[0] || 'Unassigned'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {tickets.length === 0 && (
                        <div className="p-4 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
                          No tickets
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-5 text-center py-8 text-muted-foreground">
                    No workflow stages configured
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <TicketList 
                tickets={tickets} 
                onTicketClick={(ticket) => setSelectedTicket(ticket)} 
              />
            </TabsContent>
          </Tabs>
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
