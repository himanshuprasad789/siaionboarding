import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  steps: { number: number; label: string; benefit: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.number ? 1 : 0.9,
                opacity: currentStep >= step.number ? 1 : 0.4,
              }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                currentStep > step.number
                  ? "bg-accent text-accent-foreground"
                  : currentStep === step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > step.number ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </motion.div>
            <span className={cn(
              "text-sm font-medium hidden sm:block transition-colors",
              currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
            )}>
              {step.benefit}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "w-8 h-px transition-colors",
              currentStep > step.number ? "bg-accent" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
