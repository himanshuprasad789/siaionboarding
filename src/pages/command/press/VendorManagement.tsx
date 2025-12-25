import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketDetail } from '@/components/tickets/TicketDetail';
import { getTicketsByWorkflow, vendorWorkflow, Ticket } from '@/data/mockWorkflowData';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, DollarSign, Clock } from 'lucide-react';

const vendorStats = [
  { label: 'Active Vendors', value: 12, icon: Building2 },
  { label: 'Pending Assignments', value: 3, icon: Clock },
  { label: 'This Month Spend', value: '$15,200', icon: DollarSign },
];

export default function VendorManagement() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const tickets = getTicketsByWorkflow('vendor');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage vendor assignments and publications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendorStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Vendor Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Active Vendor Assignments</CardTitle>
            <CardDescription>Tickets currently with vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketList 
              tickets={tickets} 
              onTicketClick={(ticket) => setSelectedTicket(ticket)} 
            />
          </CardContent>
        </Card>

        {/* Vendor Directory */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Directory</CardTitle>
            <CardDescription>Approved publication vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'TechCrunch Network', tier: 'Premium', publications: 45 },
                { name: 'Forbes Contributors', tier: 'Premium', publications: 32 },
                { name: 'VentureBeat Media', tier: 'Standard', publications: 28 },
                { name: 'Wired Digital', tier: 'Premium', publications: 22 },
                { name: 'Inc. Magazine', tier: 'Standard', publications: 18 },
                { name: 'Entrepreneur Media', tier: 'Standard', publications: 15 },
              ].map((vendor) => (
                <div key={vendor.name} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{vendor.name}</h4>
                    <Badge variant={vendor.tier === 'Premium' ? 'default' : 'secondary'}>
                      {vendor.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vendor.publications} successful publications
                  </p>
                  <a href="#" className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline">
                    View Profile <ExternalLink className="w-3 h-3" />
                  </a>
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
                workflowSteps={vendorWorkflow}
                onStepComplete={() => setSelectedTicket(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CommandCenterLayout>
  );
}
