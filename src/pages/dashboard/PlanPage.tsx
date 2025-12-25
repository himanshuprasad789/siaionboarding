import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, MessageSquare, CheckCircle2, Clock, AlertCircle, FileText, Award, Newspaper } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  category: string;
  type: 'managed' | 'guided';
  status: 'waiting_you' | 'waiting_team' | 'completed';
  dueDate?: string;
  icon: typeof FileText;
}

const mockTickets: Ticket[] = [
  { id: '1', title: 'Review Press Draft - TechCrunch Feature', category: 'Press', type: 'managed', status: 'waiting_you', dueDate: 'Due in 2 days', icon: Newspaper },
  { id: '2', title: 'Upload Salary Slips (2022-2024)', category: 'High Salary', type: 'guided', status: 'waiting_you', icon: FileText },
  { id: '3', title: 'CSM Writing Press Pitch', category: 'Press', type: 'managed', status: 'waiting_team', icon: Newspaper },
  { id: '4', title: 'Submit Award Application - AI Summit', category: 'Awards', type: 'guided', status: 'waiting_you', dueDate: 'Due in 5 days', icon: Award },
  { id: '5', title: 'Verify Recommendation Letter', category: 'Judging', type: 'managed', status: 'waiting_team', icon: FileText },
  { id: '6', title: 'Forbes Article Published', category: 'Press', type: 'managed', status: 'completed', icon: Newspaper },
  { id: '7', title: 'Google Scholar Profile Verified', category: 'Original Contribution', type: 'guided', status: 'completed', icon: FileText },
];

function TicketCard({ ticket }: { ticket: Ticket }) {
  const Icon = ticket.icon;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            ticket.category === 'Press' ? 'bg-primary/10 text-primary' :
            ticket.category === 'Awards' ? 'bg-gold/10 text-gold' :
            'bg-accent/10 text-accent'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-foreground truncate">{ticket.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                  <span className="text-xs text-muted-foreground capitalize">{ticket.type}</span>
                </div>
              </div>
              <Badge 
                variant={ticket.status === 'waiting_you' ? 'destructive' : ticket.status === 'waiting_team' ? 'secondary' : 'default'}
                className="flex-shrink-0"
              >
                {ticket.status === 'waiting_you' ? 'Waiting for You' : 
                 ticket.status === 'waiting_team' ? 'Waiting for Team' : 'Completed'}
              </Badge>
            </div>
            
            {ticket.dueDate && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {ticket.dueDate}
              </p>
            )}
            
            {ticket.status !== 'completed' && (
              <div className="flex gap-2 mt-3">
                {ticket.status === 'waiting_you' && (
                  <>
                    <Button size="sm" variant="outline" className="h-8">
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                    <Button size="sm" variant="outline" className="h-8">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="h-8">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PlanPage() {
  const waitingForYou = mockTickets.filter(t => t.status === 'waiting_you');
  const waitingForTeam = mockTickets.filter(t => t.status === 'waiting_team');
  const completed = mockTickets.filter(t => t.status === 'completed');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Plan</h1>
          <p className="text-muted-foreground">Track all your active tickets in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{waitingForYou.length}</p>
                  <p className="text-sm text-muted-foreground">Waiting for You</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{waitingForTeam.length}</p>
                  <p className="text-sm text-muted-foreground">Waiting for Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{completed.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({mockTickets.length})</TabsTrigger>
            <TabsTrigger value="action" className="text-destructive">Needs Action ({waitingForYou.length})</TabsTrigger>
            <TabsTrigger value="waiting">In Progress ({waitingForTeam.length})</TabsTrigger>
            <TabsTrigger value="done">Completed ({completed.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3 mt-4">
            {mockTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </TabsContent>
          
          <TabsContent value="action" className="space-y-3 mt-4">
            {waitingForYou.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </TabsContent>
          
          <TabsContent value="waiting" className="space-y-3 mt-4">
            {waitingForTeam.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </TabsContent>
          
          <TabsContent value="done" className="space-y-3 mt-4">
            {completed.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
