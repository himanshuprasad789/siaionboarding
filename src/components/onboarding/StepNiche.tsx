import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const NICHE_SUGGESTIONS = [
  'Computational Biology',
  'Machine Learning for Healthcare',
  'Natural Language Processing',
  'Computer Vision',
  'Quantum Computing',
  'Cybersecurity',
  'FinTech',
  'Climate Tech',
];

export function StepNiche() {
  const { data, updateNiche, setCurrentStep } = useOnboarding();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleNicheChange = (value: string) => {
    updateNiche({ specificNiche: value });
    if (value.length >= 2) {
      const filtered = NICHE_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    updateNiche({ specificNiche: suggestion });
    setShowSuggestions(false);
  };

  const isValid = data.niche.specificNiche && data.niche.uniquePosition;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Define your impact
        </h1>
        <p className="text-muted-foreground">
          Complete these statements to articulate your unique value
        </p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-foreground">
            I am a specialist in...
          </label>
          <div className="relative">
            <Input
              value={data.niche.specificNiche}
              onChange={(e) => handleNicheChange(e.target.value)}
              onFocus={() => data.niche.specificNiche.length >= 2 && filteredSuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g., Transformer-based NLP for low-resource languages"
              className="h-11"
            />
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden"
                >
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => selectSuggestion(s)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-foreground">
            Focused on solving the problem of...
          </label>
          <Textarea
            value={data.niche.criticalChallenges}
            onChange={(e) => updateNiche({ criticalChallenges: e.target.value })}
            placeholder="e.g., Current diagnostic AI models are 'black boxes' that clinicians don't trust"
            className="min-h-[80px] resize-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-foreground">
            My unique role involves...
          </label>
          <Textarea
            value={data.niche.uniquePosition}
            onChange={(e) => updateNiche({ uniquePosition: e.target.value })}
            placeholder="e.g., Bridging clinical oncology and machine learning with 12 published papers"
            className="min-h-[80px] resize-none"
          />
        </motion.div>

        {data.niche.specificNiche && data.niche.uniquePosition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-muted/50 border border-border"
          >
            <p className="text-sm text-muted-foreground mb-1">Your impact statement</p>
            <p className="text-foreground leading-relaxed">
              I am a specialist in <span className="font-medium">{data.niche.specificNiche}</span>
              {data.niche.criticalChallenges && (
                <>, focused on solving <span className="font-medium">{data.niche.criticalChallenges}</span></>
              )}
              . My unique role involves <span className="font-medium">{data.niche.uniquePosition}</span>.
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" className="flex-1 h-12" onClick={() => setCurrentStep(2)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button size="lg" className="flex-1 h-12" onClick={() => setCurrentStep(4)} disabled={!isValid}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
