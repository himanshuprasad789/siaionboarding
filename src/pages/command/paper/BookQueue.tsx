import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { useTicketsByTeam, Ticket } from '@/hooks/useTickets';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Building2, Truck, Loader2 } from 'lucide-react';

const distributionChannels = [
  { name: 'Amazon KDP', status: 'Active', books: 12 },
  { name: 'Barnes & Noble Press', status: 'Active', books: 8 },
  { name: 'IngramSpark', status: 'Active', books: 15 },
  { name: 'Apple Books', status: 'Pending', books: 0 },
];

export default function BookQueue() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { data: tickets = [], isLoading } = useTicketsByTeam('paper');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Book Queue</h1>
          <p className="text-muted-foreground mt-1">
            Book publishing and distribution management
          </p>
        </div>

        {/* Active Book Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Active Projects
            </CardTitle>
            <CardDescription>Books currently in the pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <TicketList 
                tickets={tickets} 
                onTicketClick={(ticket) => setSelectedTicket(ticket)} 
              />
            )}
          </CardContent>
        </Card>

        {/* Distribution Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Distribution Channels
            </CardTitle>
            <CardDescription>Connected publishing platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {distributionChannels.map((channel) => (
                <div key={channel.name} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{channel.name}</h4>
                    <Badge variant={channel.status === 'Active' ? 'default' : 'secondary'}>
                      {channel.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {channel.books} books published
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publishers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Partner Publishers
            </CardTitle>
            <CardDescription>Approved publishing partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Hachette', 'Macmillan', 'Wiley', 'McGraw Hill', 'Self-Publishing'].map((publisher) => (
                <div key={publisher} className="p-3 rounded-lg border text-center hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-sm">{publisher}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
