import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CriteriaItem } from '@/types/onboarding';
import { ArrowRight, ArrowLeft, Check, HelpCircle, BookOpen, Award, Users, Scale, Lightbulb, Newspaper, Image, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CRITERIA_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'authorship': BookOpen,
  'awards': Award,
  'membership': Users,
  'judging': Scale,
  'original-contributions': Lightbulb,
  'press': Newspaper,
  'exhibitions': Image,
  'leading-role': Building2,
  'high-salary': DollarSign,
  'commercial-success': TrendingUp,
};

const CRITERIA_EXAMPLES: Record<string, string> = {
  'authorship': 'Includes scholarly articles, trade publications, white papers, or contributions to major industry blogs',
  'awards': 'National or international recognition - grants, fellowships, industry awards, hackathon wins',
  'membership': 'Professional associations with selective admission (IEEE Senior, ACM Distinguished, etc.)',
  'judging': 'Conference paper reviews, grant panels, competition judging, thesis committees',
  'original-contributions': 'Patents, novel algorithms, open-source projects with adoption, research breakthroughs',
  'press': 'Interviews, profiles, op-eds in major media, podcasts, industry publications',
  'exhibitions': 'Keynote speeches, demo showcases, gallery exhibitions, conference presentations',
  'leading-role': 'Director+, founding team member, department head, chief architect',
  'high-salary': 'Top 10% compensation in your field and geography',
  'commercial-success': 'Revenue impact, successful product launches, box office, sales figures',
};

function getStrengthLabel(count: number): { label: string; color: string } {
  if (count === 0) return { label: 'Not Started', color: 'text-muted-foreground bg-muted' };
  if (count <= 2) return { label: 'Building', color: 'text-warning bg-warning/10' };
  if (count <= 4) return { label: 'Growing', color: 'text-gold bg-gold-light' };
  if (count <= 6) return { label: 'Strong', color: 'text-accent bg-accent/10' };
  return { label: 'Outstanding', color: 'text-success bg-success-light' };
}

export function StepEvidence() {
  const { data, updateCriteria, setCurrentStep } = useOnboarding();

  const toggleCriteria = (id: string) => {
    const updated = data.criteria.map((item) =>
      item.id === id ? { ...item, hasEvidence: !item.hasEvidence } : item
    );
    updateCriteria(updated);
  };

  const updateEvidenceDescription = (id: string, description: string) => {
    const updated = data.criteria.map((item) =>
      item.id === id ? { ...item, evidenceDescription: description } : item
    );
    updateCriteria(updated);
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const evidenceCount = data.criteria.filter((c) => c.hasEvidence).length;
  const strength = getStrengthLabel(evidenceCount);

  return (
    <TooltipProvider>
      <div className="animate-fade-in space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold text-foreground">Evidence Inventory</h2>
          <p className="text-muted-foreground">Select the criteria you have evidence for</p>
          
          {/* Dynamic Strength Counter */}
          <div className="flex items-center justify-center gap-4">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
              strength.color
            )}>
              <span className="text-lg">{evidenceCount}</span>
              <span>/10 Criteria</span>
            </div>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300",
              strength.color
            )}>
              {strength.label}
            </div>
          </div>
        </div>

        {/* Criteria Grid - Large Clickable Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          {data.criteria.map((item: CriteriaItem) => {
            const Icon = CRITERIA_ICONS[item.id] || BookOpen;
            const example = CRITERIA_EXAMPLES[item.id];
            
            return (
              <div
                key={item.id}
                className={cn(
                  "relative border-2 rounded-2xl p-5 transition-all duration-300 cursor-pointer group",
                  item.hasEvidence
                    ? "border-accent bg-accent/5 shadow-brand"
                    : "border-border hover:border-primary/40 hover:shadow-soft"
                )}
                onClick={() => toggleCriteria(item.id)}
              >
                {/* Selection indicator */}
                {item.hasEvidence && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    item.hasEvidence 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{item.label}</h4>
                      <Tooltip>
                        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="text-muted-foreground hover:text-primary transition-colors">
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">{example}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>

                {/* Expandable textarea */}
                {item.hasEvidence && (
                  <div className="mt-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <Textarea
                      placeholder={`Briefly describe your ${item.label.toLowerCase()}...`}
                      value={item.evidenceDescription}
                      onChange={(e) => updateEvidenceDescription(item.id, e.target.value)}
                      className="min-h-[80px] text-sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 max-w-xl mx-auto">
          <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <Button variant="gradient" size="lg" onClick={handleNext} className="flex-1">
            Next: Define Your Niche
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
