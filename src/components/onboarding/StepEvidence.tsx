import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CriteriaItem } from '@/types/onboarding';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function StepEvidence() {
  const { data, updateCriteria, setCurrentStep } = useOnboarding();

  const toggleCriteria = (id: string) => {
    const updated = data.criteria.map((c) =>
      c.id === id ? { ...c, hasEvidence: !c.hasEvidence } : c
    );
    updateCriteria(updated);
  };

  const updateDescription = (id: string, description: string) => {
    const updated = data.criteria.map((c) =>
      c.id === id ? { ...c, evidenceDescription: description } : c
    );
    updateCriteria(updated);
  };

  const evidenceCount = data.criteria.filter((c) => c.hasEvidence).length;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          What evidence do you have?
        </h1>
        <p className="text-muted-foreground">
          Select the criteria where you have existing proof
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium">
          <span className="text-foreground">{evidenceCount}</span>
          <span className="text-muted-foreground">of 10 selected</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 gap-3"
      >
        {data.criteria.map((criteria: CriteriaItem) => (
          <motion.div
            key={criteria.id}
            variants={item}
            className={cn(
              "relative border rounded-xl p-4 cursor-pointer transition-all",
              criteria.hasEvidence
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
            onClick={() => toggleCriteria(criteria.id)}
          >
            {criteria.hasEvidence && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}

            <div className="space-y-1">
              <h4 className="font-medium text-foreground text-sm">{criteria.label}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{criteria.description}</p>
            </div>

            {criteria.hasEvidence && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Textarea
                  placeholder="Briefly describe your evidence..."
                  value={criteria.evidenceDescription}
                  onChange={(e) => updateDescription(criteria.id, e.target.value)}
                  className="text-sm min-h-[60px] resize-none"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" className="flex-1 h-12" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button size="lg" className="flex-1 h-12" onClick={() => setCurrentStep(3)}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
