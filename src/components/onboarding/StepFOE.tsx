import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { MOCK_FIELDS, FieldOfEndeavor } from '@/types/onboarding';
import { ArrowLeft, Sparkles, Check, Loader2, Brain, FileSearch, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const loadingSteps = [
  { icon: Brain, text: 'AI Analyzing Resume...' },
  { icon: FileSearch, text: 'Extracting Niche Keywords...' },
  { icon: Zap, text: 'Generating Field Options...' },
];

export function StepFOE() {
  const { data, updateSelectedFields, setCurrentStep, setIsComplete } = useOnboarding();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [fields, setFields] = useState<FieldOfEndeavor[]>([]);

  useEffect(() => {
    // Simulate AI analysis with loading steps
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      setFields(MOCK_FIELDS);
      clearInterval(interval);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const toggleField = (id: string) => {
    const selectedCount = data.selectedFields.length;
    const isSelected = data.selectedFields.includes(id);

    if (isSelected) {
      updateSelectedFields(data.selectedFields.filter((f) => f !== id));
    } else if (selectedCount < 5) {
      updateSelectedFields([...data.selectedFields, id]);
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  const handleFinalize = () => {
    setIsComplete(true);
    navigate('/dashboard/strategy');
  };

  const selectedCount = data.selectedFields.length;

  if (isLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[400px] space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-soft">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-ping" />
        </div>

        <div className="space-y-4 text-center">
          {loadingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 transition-all duration-500",
                  index <= loadingStep ? "opacity-100" : "opacity-30"
                )}
              >
                {index < loadingStep ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : index === loadingStep ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-lg font-medium",
                    index === loadingStep ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">
          Field of Endeavor Selection
        </h2>
        <p className="text-muted-foreground">
          Select exactly 5 fields you want to target for opportunities
        </p>
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            selectedCount === 5
              ? "bg-accent/10 text-accent"
              : "bg-primary/10 text-primary"
          )}
        >
          {selectedCount}/5 Fields Selected
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {fields.map((field) => {
          const isSelected = data.selectedFields.includes(field.id);
          const isDisabled = !isSelected && selectedCount >= 5;

          return (
            <button
              key={field.id}
              onClick={() => toggleField(field.id)}
              disabled={isDisabled}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                isSelected
                  ? "border-primary bg-primary/5 shadow-glow"
                  : isDisabled
                  ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                  : "border-border hover:border-primary/50 hover:shadow-medium"
              )}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <span className="text-xs font-medium text-primary/70 uppercase tracking-wide">
                {field.category}
              </span>
              <h4 className="font-semibold text-sm mt-1 text-foreground group-hover:text-primary transition-colors">
                {field.name}
              </h4>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 max-w-xl mx-auto">
        <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleFinalize}
          className="flex-1"
          disabled={selectedCount !== 5}
        >
          Finalize Profile
          <Sparkles className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
