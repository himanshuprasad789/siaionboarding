import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Star, Clock, DollarSign, Newspaper, Award, Users, FileText } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'recommended' | 'service' | 'diy';
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  price?: string;
  icon: typeof Newspaper;
  tags: string[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'AI Summit 2024 Speaker Application',
    description: 'Apply to speak at one of the largest AI conferences. Great for building speaking credentials.',
    category: 'Awards',
    type: 'recommended',
    difficulty: 'medium',
    timeEstimate: '2-3 weeks',
    icon: Award,
    tags: ['AI', 'Speaking', 'Conference'],
  },
  {
    id: '2',
    title: 'Press Package - Tier 1 Outlets',
    description: 'Our team will pitch and secure coverage in TechCrunch, Forbes, or similar top-tier publications.',
    category: 'Press',
    type: 'service',
    difficulty: 'easy',
    timeEstimate: '4-6 weeks',
    price: '$2,500',
    icon: Newspaper,
    tags: ['Managed', 'Premium'],
  },
  {
    id: '3',
    title: 'IEEE Senior Member Application',
    description: 'Apply for senior membership in IEEE. Requires 10 years of experience and 3 references.',
    category: 'Membership',
    type: 'diy',
    difficulty: 'hard',
    timeEstimate: '2-3 months',
    icon: Users,
    tags: ['Engineering', 'Prestigious'],
  },
  {
    id: '4',
    title: 'NeurIPS 2024 Reviewer Signup',
    description: 'Register as a reviewer for NeurIPS. Based on your publication history, you qualify.',
    category: 'Judging',
    type: 'recommended',
    difficulty: 'easy',
    timeEstimate: '1 week',
    icon: FileText,
    tags: ['AI/ML', 'Academic'],
  },
  {
    id: '5',
    title: 'Patent Filing Assistance',
    description: 'Work with our IP attorneys to file a patent for your original contribution.',
    category: 'Original Contribution',
    type: 'service',
    difficulty: 'hard',
    timeEstimate: '3-6 months',
    price: '$5,000+',
    icon: FileText,
    tags: ['Legal', 'Premium'],
  },
];

const weakAreas = ['Press', 'Critical Role', 'Membership'];

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const Icon = opportunity.icon;
  const isRecommended = weakAreas.includes(opportunity.category);

  return (
    <Card className={`hover:shadow-md transition-all ${isRecommended ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            opportunity.type === 'service' ? 'bg-primary/10 text-primary' :
            opportunity.type === 'recommended' ? 'bg-gold/10 text-gold' :
            'bg-muted text-muted-foreground'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{opportunity.title}</h3>
                  {isRecommended && (
                    <Badge className="bg-primary/10 text-primary border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{opportunity.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline">{opportunity.category}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {opportunity.timeEstimate}
              </div>
              {opportunity.price && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="w-3 h-3" />
                  {opportunity.price}
                </div>
              )}
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i <= (opportunity.difficulty === 'easy' ? 1 : opportunity.difficulty === 'medium' ? 2 : 3)
                        ? 'fill-gold text-gold'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button size="sm" className="gap-1">
                Start
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarketplacePage() {
  const recommended = mockOpportunities.filter(o => weakAreas.includes(o.category));
  const services = mockOpportunities.filter(o => o.type === 'service');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">Discover ways to strengthen your EB1 case</p>
        </div>

        {/* Weak Areas Banner */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Based on your profile analysis</h3>
                <p className="text-sm text-muted-foreground">
                  You're weak in <span className="font-medium text-destructive">{weakAreas.join(', ')}</span>. 
                  Here are opportunities to strengthen these areas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" />
            Recommended for You
          </h2>
          <div className="grid gap-4">
            {recommended.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Premium Services</h2>
          <div className="grid gap-4">
            {services.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>

        {/* All Opportunities */}
        <div>
          <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
          <div className="grid gap-4">
            {mockOpportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
