import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Newspaper, BookOpen, Search, Shield } from 'lucide-react';
import { AppRole } from '@/types/admin';

interface RoleCard {
  role: AppRole;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  redirectTo: string;
}

const roleCards: RoleCard[] = [
  {
    role: 'client',
    title: 'Client',
    description: 'View your EB1 strategy dashboard, action plan, and evidence vault',
    icon: User,
    color: 'bg-primary',
    redirectTo: '/dashboard',
  },
  {
    role: 'press',
    title: 'PRD Team',
    description: 'Manage press releases, vendor workflows, and publishing tasks',
    icon: Newspaper,
    color: 'bg-teal-600',
    redirectTo: '/command/press',
  },
  {
    role: 'paper',
    title: 'Paper Publishing Team',
    description: 'Handle journal submissions, book publishing, and peer reviews',
    icon: BookOpen,
    color: 'bg-amber-600',
    redirectTo: '/command/paper',
  },
  {
    role: 'research',
    title: 'Research Team',
    description: 'Manage opportunities, salary analysis, and gap assessments',
    icon: Search,
    color: 'bg-violet-600',
    redirectTo: '/command/research',
  },
  {
    role: 'admin',
    title: 'Administrator',
    description: 'Full access to all workflows, teams, and system configuration',
    icon: Shield,
    color: 'bg-rose-600',
    redirectTo: '/admin',
  },
];

export default function MockLogin() {
  const navigate = useNavigate();
  const { login } = useRole();

  const handleLogin = (card: RoleCard) => {
    login(card.role);
    navigate(card.redirectTo);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            EB1 Workflow Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a role to explore the application from different perspectives. 
            Each role has access to specific workflows and dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.role}
                className="cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
                onClick={() => handleLogin(card)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          This is a prototype with mock authentication. No real login required.
        </p>
      </div>
    </div>
  );
}
