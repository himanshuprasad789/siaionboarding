import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Paperclip, Users, FileText } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

interface Thread {
  id: string;
  title: string;
  type: 'support' | 'ticket';
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
}

const mockThreads: Thread[] = [
  { id: '1', title: 'Team Support', type: 'support', lastMessage: 'Your press draft looks great! Just a few tweaks...', timestamp: '2 hours ago', unread: 2 },
  { id: '2', title: 'Press Draft - TechCrunch', type: 'ticket', lastMessage: 'Attached the revised version with your feedback.', timestamp: '1 day ago', unread: 0 },
  { id: '3', title: 'Award Application Help', type: 'ticket', lastMessage: 'We need your updated bio for the submission.', timestamp: '2 days ago', unread: 1 },
  { id: '4', title: 'Salary Documentation', type: 'ticket', lastMessage: 'All documents received. Processing now.', timestamp: '3 days ago', unread: 0 },
];

const mockMessages: Message[] = [
  { id: '1', sender: 'Sarah (CSM)', content: 'Hi! I reviewed your press draft for TechCrunch. It looks great overall!', timestamp: '10:30 AM', isUser: false },
  { id: '2', sender: 'Sarah (CSM)', content: 'Just a few suggestions: Could you add more details about your AI work at Google? That would strengthen the narrative.', timestamp: '10:31 AM', isUser: false },
  { id: '3', sender: 'You', content: 'Thanks Sarah! Sure, I can add more details about the ML infrastructure work I led there.', timestamp: '10:45 AM', isUser: true },
  { id: '4', sender: 'You', content: 'Should I also mention the patent we filed?', timestamp: '10:46 AM', isUser: true },
  { id: '5', sender: 'Sarah (CSM)', content: 'Yes, definitely! The patent adds strong credibility. I\'ll send you a template for how to frame it.', timestamp: '11:00 AM', isUser: false },
];

function ThreadItem({ thread, isActive, onClick }: { thread: Thread; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${isActive ? 'bg-muted' : ''}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={thread.avatar} />
          <AvatarFallback className={thread.type === 'support' ? 'bg-primary/10 text-primary' : 'bg-muted'}>
            {thread.type === 'support' ? <Users className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-foreground truncate">{thread.title}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">{thread.timestamp}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-1">{thread.lastMessage}</p>
        </div>
        {thread.unread > 0 && (
          <Badge className="bg-primary text-primary-foreground">{thread.unread}</Badge>
        )}
      </div>
    </button>
  );
}

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState(mockThreads[0]);
  const [message, setMessage] = useState('');

  const supportThreads = mockThreads.filter(t => t.type === 'support');
  const ticketThreads = mockThreads.filter(t => t.type === 'ticket');

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full">
          <div className="flex h-full">
            {/* Thread List */}
            <div className="w-80 border-r border-border flex flex-col">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="text-lg">Messages</CardTitle>
              </CardHeader>
              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="tickets">Tickets</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-auto">
                  <TabsContent value="all" className="m-0">
                    {mockThreads.map(thread => (
                      <ThreadItem 
                        key={thread.id} 
                        thread={thread} 
                        isActive={activeThread.id === thread.id}
                        onClick={() => setActiveThread(thread)}
                      />
                    ))}
                  </TabsContent>
                  <TabsContent value="support" className="m-0">
                    {supportThreads.map(thread => (
                      <ThreadItem 
                        key={thread.id} 
                        thread={thread} 
                        isActive={activeThread.id === thread.id}
                        onClick={() => setActiveThread(thread)}
                      />
                    ))}
                  </TabsContent>
                  <TabsContent value="tickets" className="m-0">
                    {ticketThreads.map(thread => (
                      <ThreadItem 
                        key={thread.id} 
                        thread={thread} 
                        isActive={activeThread.id === thread.id}
                        onClick={() => setActiveThread(thread)}
                      />
                    ))}
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <CardHeader className="border-b border-border py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Users className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{activeThread.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {activeThread.type === 'support' ? 'General Support' : 'Ticket Thread'}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {mockMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${msg.isUser ? 'order-2' : ''}`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        msg.isUser 
                          ? 'bg-primary text-primary-foreground rounded-br-md' 
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className={`text-xs text-muted-foreground mt-1 ${msg.isUser ? 'text-right' : ''}`}>
                        {msg.sender} • {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
