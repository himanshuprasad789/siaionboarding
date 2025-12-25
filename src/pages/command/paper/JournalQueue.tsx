import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketDetail } from '@/components/tickets/TicketDetail';
import { getTicketsByWorkflow, paperWorkflow, Ticket } from '@/data/mockWorkflowData';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JournalQueue() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const tickets = getTicketsByWorkflow('paper');

  // Group tickets by current step for Kanban view
  const ticketsByStep = paperWorkflow.reduce((acc, step, index) => {
    acc[step.id] = tickets.filter(t => t.currentStep === index);
    return acc;
  }, {} as Record<string, Ticket[]>);

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journal Queue</h1>
          <p className="text-muted-foreground mt-1">
            Research paper submissions and peer review management
          </p>
        </div>

        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            <div className="grid grid-cols-4 gap-4 overflow-x-auto">
              {paperWorkflow.map((step) => (
                <div key={step.id} className="min-w-[250px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">{step.name}</h3>
                    <Badge variant="secondary">{ticketsByStep[step.id]?.length || 0}</Badge>
                  </div>
                  <div className="space-y-3">
                    {ticketsByStep[step.id]?.map((ticket) => (
                      <Card 
                        key={ticket.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <CardContent className="p-3">
                          <p className="font-medium text-sm mb-1">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground">{ticket.clientName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge 
                              variant={ticket.priority === 'high' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!ticketsByStep[step.id] || ticketsByStep[step.id].length === 0) && (
                      <div className="p-4 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
                        No papers
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <TicketList 
              tickets={tickets} 
              onTicketClick={(ticket) => setSelectedTicket(ticket)} 
            />
          </TabsContent>
        </Tabs>

        {/* Target Journals */}
        <Card>
          <CardHeader>
            <CardTitle>Target Journals</CardTitle>
            <CardDescription>Pre-approved publication venues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['IEEE', 'Nature', 'Science', 'ACM', 'Springer', 'Elsevier', 'PLOS ONE', 'arXiv'].map((journal) => (
                <div key={journal} className="p-3 rounded-lg border text-center hover:bg-muted/50 transition-colors">
                  <p className="font-medium">{journal}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                workflowSteps={paperWorkflow}
                onStepComplete={() => setSelectedTicket(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CommandCenterLayout>
  );
}
