import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_OPPORTUNITIES, Opportunity } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Sparkles, Zap, Clock, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FREE_LIMIT = 3;

export function OpportunityGrid() {
  const navigate = useNavigate();
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);

  const handleStartApplication = (opportunity: Opportunity, index: number) => {
    if (index >= FREE_LIMIT) {
      toast.info('Upgrade to unlock this opportunity', {
        description: 'Get access to all premium opportunities with our Pro plan.',
      });
      return;
    }

    toast.success(`Starting: ${opportunity.title}`, {
      description: 'Creating your discovery ticket...',
    });

    setTimeout(() => {
      navigate(`/ticket/new?opportunity=${opportunity.id}`);
    }, 1000);
  };

  const handleUpgrade = () => {
    toast.info('Upgrade flow coming soon!', {
      description: 'This would open the upgrade/payment flow.',
    });
  };

  const getDifficultyIcon = (difficulty: Opportunity['difficulty']) => {
    switch (difficulty) {
      case 'easy': return Zap;
      case 'medium': return Clock;
      case 'hard': return Trophy;
    }
  };

  const getDifficultyColor = (difficulty: Opportunity['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success-light';
      case 'medium': return 'text-gold bg-gold-light';
      case 'hard': return 'text-destructive bg-destructive/10';
    }
  };

  // Split opportunities into tiers
  const quickWins = opportunities.slice(0, 3);
  const highValue = opportunities.slice(3, 6);
  const longTerm = opportunities.slice(6);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Opportunity Explorer
          </h3>
          <p className="text-muted-foreground">
            Curated opportunities based on your profile
          </p>
        </div>
        <Button variant="gradient" onClick={handleUpgrade} className="shadow-brand">
          <Sparkles className="w-4 h-4" />
          Upgrade to Pro
        </Button>
      </div>

      {/* Tier 1: Quick Wins (Unlocked) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success-light flex items-center justify-center">
            <Zap className="w-4 h-4 text-success" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Quick Wins</h4>
            <p className="text-xs text-muted-foreground">Start building your profile today</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {quickWins.map((opportunity, index) => {
            const DifficultyIcon = getDifficultyIcon(opportunity.difficulty);
            return (
              <div
                key={opportunity.id}
                className="relative bg-card rounded-2xl border-2 border-accent/30 overflow-hidden transition-all duration-300 group hover:shadow-brand hover:border-accent"
              >
                {/* FREE Badge */}
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                  <Zap className="w-3 h-3" />
                  FREE
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {opportunity.category}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full capitalize flex items-center gap-1",
                        getDifficultyColor(opportunity.difficulty)
                      )}
                    >
                      <DifficultyIcon className="w-3 h-3" />
                      {opportunity.difficulty}
                    </span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {opportunity.title}
                  </h4>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {opportunity.description}
                  </p>

                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={() => handleStartApplication(opportunity, index)}
                  >
                    Start Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier 2: High Value (Locked with blur) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-light flex items-center justify-center">
            <Trophy className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">High Value Opportunities</h4>
            <p className="text-xs text-muted-foreground">Requires Premium Strategy</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {highValue.map((opportunity) => {
            const DifficultyIcon = getDifficultyIcon(opportunity.difficulty);
            return (
              <div
                key={opportunity.id}
                className="relative bg-card rounded-2xl border border-border overflow-hidden group"
              >
                {/* Blur Overlay */}
                <div className="absolute inset-0 bg-background/70 backdrop-blur-md z-10 flex flex-col items-center justify-center gap-3 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-muted/80 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Premium Opportunity</p>
                  <Button variant="gradient" size="sm" onClick={handleUpgrade}>
                    Upgrade to Reveal
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>

                {/* Blurred Content */}
                <div className="p-5 filter blur-[2px]">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {opportunity.category}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full capitalize flex items-center gap-1",
                        getDifficultyColor(opportunity.difficulty)
                      )}
                    >
                      <DifficultyIcon className="w-3 h-3" />
                      {opportunity.difficulty}
                    </span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-foreground mb-2">
                    {opportunity.title}
                  </h4>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {opportunity.description}
                  </p>

                  <Button variant="outline" className="w-full" disabled>
                    Locked
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier 3: Long Term (Future Unlocks) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Future Trajectory</h4>
            <p className="text-xs text-muted-foreground">Unlocks based on your progress</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {longTerm.map((opportunity) => (
            <div
              key={opportunity.id}
              className="relative bg-muted/30 rounded-2xl border border-dashed border-border overflow-hidden"
            >
              <div className="p-5 flex flex-col items-center justify-center text-center min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  {opportunity.title}
                </h4>
                <p className="text-xs text-muted-foreground/70">
                  Complete more criteria to unlock
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
