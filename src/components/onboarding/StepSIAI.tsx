import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Newspaper,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'fieldsIndustries',
    label: 'Fields & Industries',
    question: 'What fields or industries do you work or will you work in?',
    placeholder: 'Describe your industry experience, areas of expertise, and key skills...'
  },
  {
    id: 'endApplications',
    label: 'End Applications',
    question: 'What are all the possible end applications of your past and present work?',
    placeholder: 'Think about the products and/or services your work can eventually flow into and impact...'
  },
  {
    id: 'knowledgeAreas',
    label: 'Knowledge Areas',
    question: 'What specific areas of your craft or industry do you have the most knowledge in?',
    placeholder: 'List them from highest to lowest expertise...'
  },
  {
    id: 'passionAreas',
    label: 'Passion Areas',
    question: 'What specific areas of your craft are you most passionate about?',
    placeholder: 'List them from highest to lowest passion...'
  },
  {
    id: 'workAspects',
    label: 'Work Aspects',
    question: 'What aspects are most important to you when it comes to your work and the products/services that you work on?',
    placeholder: 'Describe your priorities and values...'
  },
  {
    id: 'specializedSkills',
    label: 'Specialized Skills',
    question: 'What specific skills and abilities do you have that are very specialized?',
    placeholder: 'Combine different aspects to frame narrower specializations...'
  },
  {
    id: 'skillVariations',
    label: 'Skill Variations',
    question: 'What other variations of applications can your skills be applied to?',
    placeholder: 'List different domains where your skills transfer...'
  },
  {
    id: 'industryGaps',
    label: 'Industry Gaps',
    question: 'What are the gaps in your industry or workplace in general? What areas are underserved?',
    placeholder: 'Explain areas that need improvement...'
  },
  {
    id: 'fieldSizes',
    label: 'Field Sizes',
    question: 'List out the approximate size of each of the spaces/fields. How many people would you be competing with?',
    placeholder: 'Provide estimates for each niche...'
  },
  {
    id: 'workingSolutions',
    label: 'Working Solutions',
    question: 'What specific solutions are other people working on or providing in your field that are working well?',
    placeholder: 'Describe successful approaches in your industry...'
  },
  {
    id: 'notWorkingWell',
    label: 'Problem Areas',
    question: 'What about the problems that you can apply your skills to is not working well right now?',
    placeholder: 'How could these areas improve?'
  },
  {
    id: 'expertDemonstration',
    label: 'Expert Demonstration',
    question: 'How can you demonstrate that you are THE expert? Describe the specific solutions and results you can provide.',
    placeholder: 'Detail your unique value proposition...'
  },
  {
    id: 'uniqueSkills',
    label: 'Unique Skills',
    question: 'What specialized skills or experience do you have that most other people don\'t have?',
    placeholder: 'Describe in detail what makes you unique...'
  },
  {
    id: 'impactfulProjects',
    label: 'Impactful Projects',
    question: 'What are five of the biggest impactful projects you have worked on, and what are your proudest career accomplishments?',
    placeholder: 'List your top achievements...'
  },
  {
    id: 'biggestChallenges',
    label: 'Biggest Challenges',
    question: 'What were five of your biggest challenges on the way to the above accomplishments?',
    placeholder: 'Describe the obstacles you overcame...'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

function generateTitles(data: Record<string, string>, niche: string, jobTitle: string) {
  const keywords = extractKeywords(data);
  
  const paperTemplates = [
    `A Novel Approach to ${keywords.technical} in ${keywords.industry}`,
    `Scaling ${keywords.skill} for Enterprise-Level ${keywords.application}`,
    `The Future of ${keywords.technical}: Bridging ${keywords.gap}`,
    `Optimizing ${keywords.application} Through Advanced ${keywords.skill}`,
    `${keywords.industry} Transformation: A ${keywords.technical} Perspective`,
    `Building Resilient ${keywords.application} with ${keywords.skill}`,
    `From Theory to Practice: ${keywords.technical} in Modern ${keywords.industry}`,
    `Addressing ${keywords.gap} Through Innovative ${keywords.skill}`,
    `The Role of ${keywords.technical} in Next-Generation ${keywords.application}`,
    `Lessons Learned: Implementing ${keywords.skill} at Scale`,
    `${keywords.industry} Best Practices: A Deep Dive into ${keywords.technical}`,
    `Emerging Patterns in ${keywords.application} Development`,
    `Security-First ${keywords.technical}: A Framework for ${keywords.industry}`,
    `Performance Optimization Strategies for ${keywords.application}`,
    `Leadership in ${keywords.technical}: Building High-Performing Teams`,
    `Cross-Functional Approaches to ${keywords.skill} Implementation`,
    `The Economics of ${keywords.technical} in Modern ${keywords.industry}`,
    `User-Centric Design in ${keywords.application} Development`,
    `Bridging ${keywords.gap}: A Practitioner's Guide`,
    `The Evolution of ${keywords.skill}: Past, Present, and Future`
  ];

  const pressTemplates = [
    `${jobTitle} Revolutionizes ${keywords.industry} with Innovative ${keywords.technical} Solutions`,
    `How ${niche || keywords.skill} Expert is Solving ${keywords.gap}`,
    `Industry Leader Shares Insights on ${keywords.application} Transformation`,
    `From ${keywords.challenge} to Success: A ${keywords.industry} Innovation Story`,
    `New Research Reveals Best Practices for ${keywords.technical} Implementation`,
    `Expert Commentary: The Future of ${keywords.skill} in ${keywords.industry}`,
    `Breaking Barriers: How ${keywords.technical} is Reshaping ${keywords.application}`,
    `${keywords.industry} Professional Addresses Critical ${keywords.gap}`,
    `The Rise of ${keywords.skill}: An Expert's Perspective`,
    `Pioneering ${keywords.technical} Solutions for Modern ${keywords.application}`
  ];

  return {
    paperTitles: paperTemplates,
    pressReleaseTitles: pressTemplates
  };
}

function extractKeywords(data: Record<string, string>) {
  const allText = Object.values(data).join(' ').toLowerCase();
  
  // Extract common themes
  const technicalTerms = ['frontend', 'backend', 'architecture', 'security', 'api', 'cloud', 'devops', 'performance', 'scalability', 'machine learning', 'ai', 'data'];
  const industries = ['fintech', 'healthcare', 'e-commerce', 'cybersecurity', 'software', 'retail', 'enterprise', 'saas', 'edtech'];
  const skills = ['development', 'leadership', 'optimization', 'integration', 'design', 'management', 'engineering'];
  const applications = ['web applications', 'platforms', 'systems', 'solutions', 'tools', 'frameworks'];
  const gaps = ['scalability issues', 'security vulnerabilities', 'performance bottlenecks', 'accessibility gaps', 'integration challenges'];
  const challenges = ['tight deadlines', 'complex systems', 'cross-functional collaboration', 'legacy code', 'scaling demands'];

  const findMatch = (terms: string[], fallback: string) => {
    for (const term of terms) {
      if (allText.includes(term)) return term.charAt(0).toUpperCase() + term.slice(1);
    }
    return fallback;
  };

  return {
    technical: findMatch(technicalTerms, 'Software Architecture'),
    industry: findMatch(industries, 'Technology'),
    skill: findMatch(skills, 'Development'),
    application: findMatch(applications, 'Applications'),
    gap: findMatch(gaps, 'Industry Challenges'),
    challenge: findMatch(challenges, 'Complex Problems')
  };
}

export function StepSIAI() {
  const { data, updateSIAI, updateGeneratedTitles, setCurrentStep } = useOnboarding();
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>(['fieldsIndustries']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleInputChange = (id: string, value: string) => {
    updateSIAI({ [id]: value });
  };

  const answeredCount = QUESTIONS.filter(q => data.siai[q.id as keyof typeof data.siai]?.trim()).length;
  const canGenerate = answeredCount >= 3;

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const titles = generateTitles(
      data.siai as unknown as Record<string, string>,
      data.niche.specificNiche,
      data.essentials.jobTitle
    );
    
    updateGeneratedTitles(titles);
    setIsGenerating(false);
    setShowResults(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Personalisation</span>
        </motion.div>
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          SIAI Profile Analysis
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Answer these questions to generate personalized paper and press release titles tailored to your expertise.
        </p>
        <div className="text-sm text-muted-foreground">
          {answeredCount} of {QUESTIONS.length} questions answered
          {canGenerate && !showResults && (
            <span className="text-primary ml-2">• Ready to generate</span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="questions"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {QUESTIONS.map((q) => {
              const isExpanded = expandedQuestions.includes(q.id);
              const hasValue = !!data.siai[q.id as keyof typeof data.siai];
              
              return (
                <motion.div
                  key={q.id}
                  variants={item}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    hasValue ? 'border-primary/30 bg-primary/5' : 'border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {hasValue && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="font-medium text-foreground">{q.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <Label className="text-sm text-muted-foreground">
                            {q.question}
                          </Label>
                          <Textarea
                            value={data.siai[q.id as keyof typeof data.siai] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder={q.placeholder}
                            className="min-h-[120px] resize-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            <motion.div variants={item} className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full h-12"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Personalized Titles
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Paper Titles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  20 Paper Titles
                </h2>
              </div>
              <div className="grid gap-2">
                {data.generatedTitles.paperTitles.map((title, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    <span className="text-foreground">{title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Press Release Titles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  10 Press Release Titles
                </h2>
              </div>
              <div className="grid gap-2">
                {data.generatedTitles.pressReleaseTitles.map((title, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 + 0.6 }}
                    className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    <span className="text-foreground">{title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
              className="w-full"
            >
              Edit Answers
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(3)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(5)}
          disabled={!showResults}
          className="gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
