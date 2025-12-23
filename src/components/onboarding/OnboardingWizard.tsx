import { Stepper } from './Stepper';
import { StepEssentials } from './StepEssentials';
import { StepEvidence } from './StepEvidence';
import { StepNiche } from './StepNiche';
import { StepFOE } from './StepFOE';
import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import { FileText } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Essentials' },
  { number: 2, label: 'Evidence' },
  { number: 3, label: 'Niche' },
  { number: 4, label: 'FOE' },
];

function WizardContent() {
  const { currentStep } = useOnboarding();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">
              EB1 Strategy
            </span>
          </div>
        </div>
        <Stepper currentStep={currentStep} steps={STEPS} />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {currentStep === 1 && <StepEssentials />}
        {currentStep === 2 && <StepEvidence />}
        {currentStep === 3 && <StepNiche />}
        {currentStep === 4 && <StepFOE />}
      </main>
    </div>
  );
}

export function OnboardingWizard() {
  return (
    <OnboardingProvider>
      <WizardContent />
    </OnboardingProvider>
  );
}
