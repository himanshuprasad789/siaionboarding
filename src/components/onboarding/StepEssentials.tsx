import { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ArrowRight, Briefcase, DollarSign, Clock, FileText, Sparkles, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'];

// Simulated extracted data from resume
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
      
      // Start simulated AI analysis
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      
      // Simulate 2 second analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        
        // Auto-fill the fields with "extracted" data
        updateEssentials({
          fullName: MOCK_EXTRACTED_DATA.fullName,
          jobTitle: MOCK_EXTRACTED_DATA.jobTitle,
          yearsExperience: MOCK_EXTRACTED_DATA.yearsExperience,
        });
      }, 2000);
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const isValid = data.essentials.fullName && data.essentials.jobTitle && data.essentials.salary > 0;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">Start with Your Resume</h2>
        <p className="text-muted-foreground">Upload your resume and watch AI fill in the details</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Resume Upload - NOW FIRST */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Resume (PDF)
          </Label>
          <div 
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden",
              fileName 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">Analyzing Resume...</p>
                  <p className="text-xs text-muted-foreground">Extracting profile information</p>
                </div>
              </div>
            ) : analysisComplete ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-accent">{fileName}</p>
                  <p className="text-xs text-muted-foreground">Profile auto-filled! Review below.</p>
                </div>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm font-medium text-accent">{fileName}</p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-base font-medium">Drop your resume here</p>
                <p className="text-sm text-muted-foreground">or click to browse • PDF format</p>
              </>
            )}
          </div>
        </div>

        {/* Divider with AI badge */}
        {analysisComplete && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI Extracted
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Form Fields */}
        <div className={cn(
          "space-y-5 transition-all duration-500",
          analysisComplete ? "animate-slide-up" : ""
        )}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={data.essentials.fullName}
              onChange={(e) => updateEssentials({ fullName: e.target.value })}
              className={cn(
                "h-12 transition-all",
                analysisComplete && data.essentials.fullName && "border-accent/50 bg-accent/5"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Current Job Title
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Machine Learning Engineer"
              value={data.essentials.jobTitle}
              onChange={(e) => updateEssentials({ jobTitle: e.target.value })}
              className={cn(
                "h-12 transition-all",
                analysisComplete && data.essentials.jobTitle && "border-accent/50 bg-accent/5"
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="salary" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Current Salary
              </Label>
              <Input
                id="salary"
                type="number"
                placeholder="150000"
                value={data.essentials.salary || ''}
                onChange={(e) => updateEssentials({ salary: Number(e.target.value) })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={data.essentials.currency}
                onValueChange={(value) => updateEssentials({ currency: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Total Years of Experience
            </Label>
            <Input
              id="experience"
              type="number"
              placeholder="10"
              value={data.essentials.yearsExperience || ''}
              onChange={(e) => updateEssentials({ yearsExperience: Number(e.target.value) })}
              className={cn(
                "h-12 transition-all",
                analysisComplete && data.essentials.yearsExperience > 0 && "border-accent/50 bg-accent/5"
              )}
            />
          </div>
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={handleNext}
          disabled={!isValid}
        >
          Next: Evidence Check
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
