import { Check, User, FileSearch, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface StepperProps {
  currentStep: number;
  steps: { number: number; label: string; benefit: string }[];
}

const STEP_ICONS = [User, FileSearch, Target, Sparkles];

export function Stepper({ currentStep, steps }: StepperProps) {
  const { data } = useOnboarding();
  const evidenceCount = data.criteria.filter((c) => c.hasEvidence).length;
  
  // Calculate potential opportunities based on progress
  const getOpportunityCount = () => {
    if (currentStep === 1) return 3;
    if (currentStep === 2) return 3 + Math.floor(evidenceCount / 2);
    if (currentStep === 3) return 5 + Math.floor(evidenceCount / 2);
    return 7 + Math.floor(evidenceCount / 2);
  };

  // Progress starts at 10% (sunk cost psychology)
  const progress = 10 + ((currentStep - 1) / (steps.length - 1)) * 90;
  const opportunityCount = getOpportunityCount();

  return (
    <div className="w-full py-4 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Progress Bar with sunk cost start */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Profile Completion</span>
            <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                      currentStep > step.number
                        ? "bg-accent text-accent-foreground"
                        : currentStep === step.number
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span
                      className={cn(
                        "block text-xs font-semibold transition-colors",
                        currentStep >= step.number
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.benefit}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 md:w-20 h-0.5 mx-1 transition-colors duration-300",
                      currentStep > step.number ? "bg-accent" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Teaser Stats */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gold-light text-gold px-4 py-2 rounded-full text-sm font-medium animate-pulse-soft">
            <Sparkles className="w-4 h-4" />
            <span>{opportunityCount} Potential Opportunities Detected...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
