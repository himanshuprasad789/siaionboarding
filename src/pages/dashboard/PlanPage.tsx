import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Clock, CheckCircle2, AlertTriangle, Loader2, Calendar, User } from 'lucide-react';
import { useClientTickets, Ticket, useUpdateTicket } from '@/hooks/useTickets';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

const statusConfig = {
  open: { label: 'Waiting for Team', color: 'bg-warning/10 text-warning border-warning/20' },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary border-primary/20' },
  pending_review: { label: 'Waiting for You', color: 'bg-accent/10 text-accent border-accent/20' },
  closed: { label: 'Completed', color: 'bg-success/10 text-success border-success/20' },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  high: { label: 'High', color: 'bg-destructive/10 text-destructive' },
  urgent: { label: 'Urgent', color: 'bg-destructive text-destructive-foreground' },
};

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const status = statusConfig[ticket.status] || statusConfig.open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: `hsl(var(--${ticket.status === 'pending_review' ? 'accent' : ticket.status === 'closed' ? 'success' : 'warning'}))` }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{ticket.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {ticket.description || 'No description provided'}
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {ticket.assigned_team && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {ticket.assigned_team}
                </span>
              )}
              {ticket.due_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(ticket.due_date), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={status.color} variant="outline">
              {status.label}
            </Badge>
            <Badge className={priority.color} variant="secondary">
              {priority.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PlanPage() {
  const { data: tickets = [], isLoading } = useClientTickets();
  const updateTicket = useUpdateTicket();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const waitingForYou = tickets.filter(t => t.status === 'pending_review');
  const waitingForTeam = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const completed = tickets.filter(t => t.status === 'closed');

  const handleMarkComplete = async (ticket: Ticket) => {
    try {
      await updateTicket.mutateAsync({
        id: ticket.id,
        updates: { status: 'closed' },
      });
      toast.success('Ticket marked as complete');
      setSelectedTicket(null);
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Plan</h1>
          <p className="text-muted-foreground mt-1">
            Track your EB1 case progress and action items
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <AlertTriangle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{waitingForYou.length}</p>
                <p className="text-sm text-muted-foreground">Waiting for You</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{waitingForTeam.length}</p>
                <p className="text-sm text-muted-foreground">Waiting for Team</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completed.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="waiting-for-you" className="w-full">
          <TabsList>
            <TabsTrigger value="waiting-for-you" className="gap-2">
              Waiting for You
              {waitingForYou.length > 0 && (
                <Badge variant="secondary" className="ml-1">{waitingForYou.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="waiting-for-team" className="gap-2">
              Waiting for Team
              {waitingForTeam.length > 0 && (
                <Badge variant="secondary" className="ml-1">{waitingForTeam.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              Completed
              {completed.length > 0 && (
                <Badge variant="secondary" className="ml-1">{completed.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waiting-for-you" className="mt-6">
            {waitingForYou.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold text-lg">You're all caught up!</h3>
                  <p className="text-muted-foreground mt-1">No items waiting for your action</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {waitingForYou.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="waiting-for-team" className="mt-6">
            {waitingForTeam.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg">No pending items</h3>
                  <p className="text-muted-foreground mt-1">All tasks are with your team</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {waitingForTeam.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completed.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg">No completed items yet</h3>
                  <p className="text-muted-foreground mt-1">Start working on your tasks!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {completed.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Ticket Detail Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-lg">
            {selectedTicket && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTicket.title}</DialogTitle>
                  <DialogDescription>
                    Created {formatDistanceToNow(new Date(selectedTicket.created_at), { addSuffix: true })}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                    <p className="text-foreground">{selectedTicket.description || 'No description'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                      <Badge className={statusConfig[selectedTicket.status]?.color} variant="outline">
                        {statusConfig[selectedTicket.status]?.label}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Priority</h4>
                      <Badge className={priorityConfig[selectedTicket.priority]?.color} variant="secondary">
                        {priorityConfig[selectedTicket.priority]?.label}
                      </Badge>
                    </div>
                    {selectedTicket.assigned_team && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned Team</h4>
                        <p className="text-foreground capitalize">{selectedTicket.assigned_team}</p>
                      </div>
                    )}
                    {selectedTicket.due_date && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h4>
                        <p className="text-foreground">{format(new Date(selectedTicket.due_date), 'MMM d, yyyy')}</p>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  {selectedTicket.status === 'pending_review' && (
                    <Button onClick={() => handleMarkComplete(selectedTicket)}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
