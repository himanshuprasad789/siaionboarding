import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CriteriaItem, ActivityTicket } from '@/types/onboarding';
import { ArrowRight, ArrowLeft, FileText, X } from 'lucide-react';
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

function TicketBadge({ ticket, onRemove }: { ticket: ActivityTicket; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 px-2.5 py-1.5 bg-muted rounded-lg text-xs group"
    >
      <FileText className="w-3 h-3 text-muted-foreground shrink-0" />
      <span className="text-foreground truncate max-w-[180px]">{ticket.title}</span>
      <span className="text-muted-foreground text-[10px] px-1.5 py-0.5 bg-background/50 rounded">
        {ticket.source}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/10 rounded"
      >
        <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
      </button>
    </motion.div>
  );
}

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

  const removeTicket = (criteriaId: string, ticketId: string) => {
    const updated = data.criteria.map((c) =>
      c.id === criteriaId
        ? { ...c, tickets: c.tickets.filter((t) => t.id !== ticketId) }
        : c
    );
    updateCriteria(updated);
  };

  const evidenceCount = data.criteria.filter((c) => c.hasEvidence).length;
  const totalTickets = data.criteria.reduce((acc, c) => acc + c.tickets.length, 0);

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          What evidence do you have?
        </h1>
        <p className="text-muted-foreground">
          Select the criteria where you have existing proof
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium">
            <span className="text-foreground">{evidenceCount}</span>
            <span className="text-muted-foreground">of 10 selected</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary">{totalTickets} activities found</span>
          </div>
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
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm">{criteria.label}</h4>
                {criteria.tickets.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    {criteria.tickets.length} {criteria.tickets.length === 1 ? 'activity' : 'activities'}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{criteria.description}</p>
            </div>

            {/* Activity Tickets */}
            {criteria.tickets.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 space-y-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence>
                  {criteria.tickets.map((ticket) => (
                    <TicketBadge
                      key={ticket.id}
                      ticket={ticket}
                      onRemove={() => removeTicket(criteria.id, ticket.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {criteria.hasEvidence && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Textarea
                  placeholder="Add additional context..."
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
