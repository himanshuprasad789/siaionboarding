import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { MOCK_FIELDS, FieldOfEndeavor } from '@/types/onboarding';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompleteOnboarding } from '@/hooks/useClientOnboarding';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

export function StepFOE() {
  const { data, updateSelectedFields, setCurrentStep, setIsComplete } = useOnboarding();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<FieldOfEndeavor[]>([]);
  const completeOnboarding = useCompleteOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setFields(MOCK_FIELDS);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const toggleField = (id: string) => {
    const isSelected = data.selectedFields.includes(id);
    if (isSelected) {
      updateSelectedFields(data.selectedFields.filter((f) => f !== id));
    } else if (data.selectedFields.length < 5) {
      updateSelectedFields([...data.selectedFields, id]);
    }
  };

  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding.mutateAsync({
        essentials: {
          fullName: data.essentials.fullName,
          jobTitle: data.essentials.jobTitle,
          yearsExperience: data.essentials.yearsExperience,
          niche: data.niche.specificNiche,
        },
        selectedFields: data.selectedFields,
      });
      setIsComplete(true);
      toast.success('Profile setup complete! Welcome to your dashboard.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = data.selectedFields.length;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[300px] space-y-6"
      >
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="text-center space-y-1">
          <p className="font-medium text-foreground">Analyzing your profile...</p>
          <p className="text-sm text-muted-foreground">Generating field recommendations</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Select your target fields
        </h1>
        <p className="text-muted-foreground">
          Choose exactly 5 fields to unlock tailored opportunities
        </p>
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          selectedCount === 5 ? "bg-accent/10 text-accent" : "bg-muted text-foreground"
        )}>
          {selectedCount}/5 selected
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        <AnimatePresence>
          {fields.map((field) => {
            const isSelected = data.selectedFields.includes(field.id);
            const isDisabled = !isSelected && selectedCount >= 5;

            return (
              <motion.button
                key={field.id}
                variants={item}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                onClick={() => toggleField(field.id)}
                disabled={isDisabled}
                className={cn(
                  "relative p-4 rounded-xl border text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : isDisabled
                    ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                    : "border-border hover:border-primary/40"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {field.category}
                </span>
                <h4 className="font-medium text-sm mt-1 text-foreground leading-tight">
                  {field.name}
                </h4>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" className="flex-1 h-12" onClick={() => setCurrentStep(4)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12"
          onClick={handleFinalize}
          disabled={selectedCount !== 5 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Setting up...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </div>
  );
}
