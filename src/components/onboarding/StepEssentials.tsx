import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ArrowRight, Briefcase, DollarSign, Clock } from 'lucide-react';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'];

export function StepEssentials() {
  const { data, updateEssentials, setCurrentStep } = useOnboarding();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      updateEssentials({ resumeFile: file });
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const isValid = data.essentials.fullName && data.essentials.jobTitle && data.essentials.salary > 0;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">The Essentials</h2>
        <p className="text-muted-foreground">Let's start with some basic information about you</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={data.essentials.fullName}
            onChange={(e) => updateEssentials({ fullName: e.target.value })}
            className="h-12"
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
            className="h-12"
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
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label>Resume (PDF)</Label>
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            {fileName ? (
              <p className="text-sm font-medium text-accent">{fileName}</p>
            ) : (
              <>
                <p className="text-sm font-medium">Click to upload your resume</p>
                <p className="text-xs text-muted-foreground">PDF format, max 10MB</p>
              </>
            )}
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
