import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Target, Lightbulb, Wrench } from 'lucide-react';

export function StepNiche() {
  const { data, updateNiche, setCurrentStep } = useOnboarding();

  const handleNext = () => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  const isValid = data.niche.specificNiche && data.niche.uniquePosition;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">Niche Deep Dive</h2>
        <p className="text-muted-foreground">Define your unique impact in your field</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5 text-primary" />
            What is your specific Niche?
          </Label>
          <Textarea
            placeholder="e.g., Developing interpretable machine learning models for early-stage cancer detection in medical imaging..."
            value={data.niche.specificNiche}
            onChange={(e) => updateNiche({ specificNiche: e.target.value })}
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">
            Be specific. Instead of "AI", say "Transformer-based NLP for low-resource languages"
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base">
            <Lightbulb className="w-5 h-5 text-gold" />
            What is your unique position/role in this niche?
          </Label>
          <Textarea
            placeholder="e.g., I am one of the few researchers bridging the gap between clinical oncology and machine learning, having published 12 papers on this intersection..."
            value={data.niche.uniquePosition}
            onChange={(e) => updateNiche({ uniquePosition: e.target.value })}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base">
            <Wrench className="w-5 h-5 text-accent" />
            What critical challenges are you solving?
          </Label>
          <Textarea
            placeholder="e.g., Current diagnostic models are 'black boxes' that clinicians don't trust. My work makes AI decisions explainable to doctors..."
            value={data.niche.criticalChallenges}
            onChange={(e) => updateNiche({ criticalChallenges: e.target.value })}
            className="min-h-[120px]"
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleNext}
            className="flex-1"
            disabled={!isValid}
          >
            Analyze & Generate Fields
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
