import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'];

const MOCK_EXTRACTED_DATA = {
  fullName: 'Dr. Sarah Chen',
  jobTitle: 'Senior Machine Learning Engineer',
  yearsExperience: 8,
};

export function StepEssentials() {
  const { data, updateEssentials, setCurrentStep } = useOnboarding();
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      updateEssentials({ resumeFile: file });
      setIsAnalyzing(true);
      setAnalysisComplete(false);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        updateEssentials({
          fullName: MOCK_EXTRACTED_DATA.fullName,
          jobTitle: MOCK_EXTRACTED_DATA.jobTitle,
          yearsExperience: MOCK_EXTRACTED_DATA.yearsExperience,
        });
      }, 2000);
    }
  };

  const handleNext = () => setCurrentStep(2);
  const isValid = data.essentials.fullName && data.essentials.jobTitle && data.essentials.salary > 0;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Let's start with your resume
        </h1>
        <p className="text-muted-foreground">
          Upload once, and we'll extract your details automatically
        </p>
      </div>

      <div className="space-y-8">
        {/* Resume Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group",
              fileName
                ? "border-accent bg-accent/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm font-medium text-foreground">Analyzing resume...</p>
                </motion.div>
              ) : analysisComplete ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-foreground">{fileName}</p>
                  <p className="text-xs text-muted-foreground">Profile extracted</p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Drop your resume here</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF format</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: analysisComplete || !fileName ? 1 : 0.5 }}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                value={data.essentials.fullName}
                onChange={(e) => updateEssentials({ fullName: e.target.value })}
                className={cn(
                  "h-11",
                  analysisComplete && data.essentials.fullName && "border-accent/50"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="Current role"
                value={data.essentials.jobTitle}
                onChange={(e) => updateEssentials({ jobTitle: e.target.value })}
                className={cn(
                  "h-11",
                  analysisComplete && data.essentials.jobTitle && "border-accent/50"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">Annual Salary</Label>
              <Input
                id="salary"
                type="number"
                placeholder="150000"
                value={data.essentials.salary || ''}
                onChange={(e) => updateEssentials({ salary: Number(e.target.value) })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency</Label>
              <Select
                value={data.essentials.currency}
                onValueChange={(value) => updateEssentials({ currency: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-medium">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              placeholder="10"
              value={data.essentials.yearsExperience || ''}
              onChange={(e) => updateEssentials({ yearsExperience: Number(e.target.value) })}
              className={cn(
                "h-11",
                analysisComplete && data.essentials.yearsExperience > 0 && "border-accent/50"
              )}
            />
          </div>
        </motion.div>

        <Button
          size="lg"
          className="w-full h-12"
          onClick={handleNext}
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
