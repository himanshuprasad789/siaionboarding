import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const NICHE_SUGGESTIONS = [
  'Computational Biology',
  'Bioinformatics',
  'Genomic Data Analysis',
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
    
    // Filter suggestions based on input
    if (value.length >= 2) {
      const filtered = NICHE_SUGGESTIONS.filter(s => 
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
        <h2 className="text-3xl font-display font-bold text-foreground">Define Your Impact</h2>
        <p className="text-muted-foreground">Complete these sentences to articulate your unique value</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Mad Libs Style - Sentence 1 */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-baseline flex-wrap gap-2 text-lg leading-relaxed">
            <span className="text-foreground font-medium">I am a specialist in</span>
            <div className="relative inline-block min-w-[200px]">
              <Input
                value={data.niche.specificNiche}
                onChange={(e) => handleNicheChange(e.target.value)}
                onFocus={() => data.niche.specificNiche.length >= 2 && filteredSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="your niche..."
                className="h-10 text-base font-medium border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-1"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-10 overflow-hidden">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-primary/5 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3 text-primary" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Be specific. Instead of "AI", say "Transformer-based NLP for low-resource languages"
          </p>
        </div>

        {/* Mad Libs Style - Sentence 2 */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-start flex-wrap gap-3 text-lg leading-relaxed">
            <span className="text-foreground font-medium pt-2">focused on solving the problem of</span>
            <div className="flex-1 min-w-[250px]">
              <Textarea
                value={data.niche.criticalChallenges}
                onChange={(e) => updateNiche({ criticalChallenges: e.target.value })}
                placeholder="the critical challenge you're addressing..."
                className="min-h-[80px] text-base resize-none"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Example: "Current diagnostic AI models are 'black boxes' that clinicians don't trust"
          </p>
        </div>

        {/* Mad Libs Style - Sentence 3 */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-start flex-wrap gap-3 text-lg leading-relaxed">
            <span className="text-foreground font-medium pt-2">My unique role involves</span>
            <div className="flex-1 min-w-[250px]">
              <Textarea
                value={data.niche.uniquePosition}
                onChange={(e) => updateNiche({ uniquePosition: e.target.value })}
                placeholder="what makes your approach or position unique..."
                className="min-h-[80px] text-base resize-none"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Example: "Bridging clinical oncology and machine learning, having published 12 papers on this intersection"
          </p>
        </div>

        {/* Preview Card */}
        {data.niche.specificNiche && data.niche.uniquePosition && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 animate-fade-in">
            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Your Impact Statement
            </h4>
            <p className="text-foreground leading-relaxed">
              I am a specialist in <strong>{data.niche.specificNiche}</strong>
              {data.niche.criticalChallenges && (
                <>, focused on solving the problem of <strong>{data.niche.criticalChallenges}</strong></>
              )}
              . My unique role involves <strong>{data.niche.uniquePosition}</strong>.
            </p>
          </div>
        )}

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
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
