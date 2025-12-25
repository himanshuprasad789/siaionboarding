import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketDetail } from '@/components/tickets/TicketDetail';
import { getTicketsByWorkflow, salaryWorkflow, Ticket } from '@/data/mockWorkflowData';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, FileText, ExternalLink } from 'lucide-react';

const recentAnalyses = [
  { client: 'John Doe', role: 'VP Engineering', salary: '$185,000', premium: '+47%', date: '2024-12-24' },
  { client: 'Jane Smith', role: 'Data Science Lead', salary: '$165,000', premium: '+38%', date: '2024-12-23' },
  { client: 'Mike Johnson', role: 'ML Architect', salary: '$210,000', premium: '+52%', date: '2024-12-22' },
];

export default function SalaryAnalysis() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const tickets = getTicketsByWorkflow('salary');

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salary Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Compare client compensation to prevailing wage data
          </p>
        </div>

        {/* Active Analyses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pending Analyses
            </CardTitle>
            <CardDescription>Salary comparisons awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketList 
              tickets={tickets} 
              onTicketClick={(ticket) => setSelectedTicket(ticket)} 
            />
          </CardContent>
        </Card>

        {/* Recent Completed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recently Completed
            </CardTitle>
            <CardDescription>Verified high-salary evidence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnalyses.map((analysis, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{analysis.client}</p>
                        <p className="text-sm text-muted-foreground">{analysis.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">{analysis.salary}</p>
                      <p className="text-sm text-muted-foreground">Annual</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      {analysis.premium}
                    </Badge>
                    <a href="#" className="text-primary hover:underline flex items-center gap-1 text-sm">
                      <FileText className="w-4 h-4" />
                      PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Reference databases for wage comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'O*NET Online', url: 'https://www.onetonline.org/' },
                { name: 'FLC Data Center', url: 'https://www.flcdatacenter.com/' },
                { name: 'BLS OES', url: 'https://www.bls.gov/oes/' },
                { name: 'Glassdoor', url: 'https://www.glassdoor.com/' },
              ].map((source) => (
                <a 
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">{source.name}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                workflowSteps={salaryWorkflow}
                onStepComplete={() => setSelectedTicket(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CommandCenterLayout>
  );
}
