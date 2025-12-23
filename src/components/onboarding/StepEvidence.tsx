import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CriteriaItem } from '@/types/onboarding';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">Evidence Inventory</h2>
        <p className="text-muted-foreground">What assets do you currently have?</p>
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
          <Check className="w-4 h-4" />
          {evidenceCount} of 10 criteria claimed
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid gap-4">
        {data.criteria.map((item: CriteriaItem) => (
          <div
            key={item.id}
            className={cn(
              "border rounded-xl p-4 transition-all duration-200",
              item.hasEvidence
                ? "border-accent bg-accent/5 shadow-medium"
                : "border-border hover:border-primary/30"
            )}
          >
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() => toggleCriteria(item.id)}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors",
                  item.hasEvidence
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.hasEvidence ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{item.label}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>

            {item.hasEvidence && (
              <div className="mt-4 ml-10 animate-slide-up">
                <Textarea
                  placeholder={`Briefly list your ${item.label.toLowerCase()} (e.g., top journals, conferences, awards...)`}
                  value={item.evidenceDescription}
                  onChange={(e) => updateEvidenceDescription(item.id, e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 max-w-xl mx-auto">
        <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button variant="gradient" size="lg" onClick={handleNext} className="flex-1">
          Next: Niche Deep Dive
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
