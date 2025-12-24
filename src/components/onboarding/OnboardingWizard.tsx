import { AnimatePresence, motion } from 'framer-motion';
import { Stepper } from './Stepper';
import { StepEssentials } from './StepEssentials';
import { StepEvidence } from './StepEvidence';
import { StepNiche } from './StepNiche';
import { StepSIAI } from './StepSIAI';
import { StepFOE } from './StepFOE';
import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';

const STEPS = [
  { number: 1, label: 'Profile', benefit: 'Identity' },
  { number: 2, label: 'Evidence', benefit: 'Strengths' },
  { number: 3, label: 'Niche', benefit: 'Focus' },
  { number: 4, label: 'SIAI', benefit: 'Titles' },
  { number: 5, label: 'Fields', benefit: 'Opportunities' },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function WizardContent() {
  const { currentStep } = useOnboarding();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-display font-semibold tracking-tight text-foreground">
              EB1 Strategy
            </span>
            <Stepper currentStep={currentStep} steps={STEPS} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {currentStep === 1 && <StepEssentials />}
            {currentStep === 2 && <StepEvidence />}
            {currentStep === 3 && <StepNiche />}
            {currentStep === 4 && <StepSIAI />}
            {currentStep === 5 && <StepFOE />}
          </motion.div>
        </AnimatePresence>
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
