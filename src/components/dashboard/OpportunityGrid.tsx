import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_OPPORTUNITIES, Opportunity } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Sparkles, Zap } from 'lucide-react';
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

    // In a real app, this would create a ticket and redirect
    toast.success(`Starting: ${opportunity.title}`, {
      description: 'Creating your discovery ticket...',
    });

    // Simulate ticket creation
    setTimeout(() => {
      navigate(`/ticket/new?opportunity=${opportunity.id}`);
    }, 1000);
  };

  const handleUpgrade = () => {
    toast.info('Upgrade flow coming soon!', {
      description: 'This would open the upgrade/payment flow.',
    });
  };

  const getDifficultyColor = (difficulty: Opportunity['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-success bg-success-light';
      case 'medium':
        return 'text-gold bg-gold-light';
      case 'hard':
        return 'text-destructive bg-destructive/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Opportunity Explorer
          </h3>
          <p className="text-muted-foreground">
            Curated opportunities based on your selected fields
          </p>
        </div>
        <Button variant="accent" onClick={handleUpgrade}>
          <Sparkles className="w-4 h-4" />
          Upgrade to Pro
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity, index) => {
          const isLocked = index >= FREE_LIMIT;

          return (
            <div
              key={opportunity.id}
              className={cn(
                "relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 group",
                isLocked
                  ? "opacity-80"
                  : "hover:shadow-large hover:border-primary/30"
              )}
            >
              {/* Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Premium Opportunity
                  </p>
                  <Button variant="gradient" size="sm" onClick={handleUpgrade}>
                    Upgrade to Unlock
                  </Button>
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {opportunity.category}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full capitalize",
                      getDifficultyColor(opportunity.difficulty)
                    )}
                  >
                    {opportunity.difficulty}
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {opportunity.title}
                </h4>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {opportunity.description}
                </p>

                {!isLocked && (
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleStartApplication(opportunity, index)}
                  >
                    Start Application
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Free Badge */}
              {!isLocked && index < FREE_LIMIT && (
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  FREE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
