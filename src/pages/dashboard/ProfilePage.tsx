import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { MOCK_FIELDS } from '@/types/onboarding';
import { Pencil, Upload, DollarSign, Briefcase, GraduationCap, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { data } = useOnboarding();

  const selectedFieldNames = data.selectedFields
    .map(id => MOCK_FIELDS.find(f => f.id === id)?.name)
    .filter(Boolean);

  const initials = data.essentials.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your information and preferences</p>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{data.essentials.fullName || 'Your Name'}</h2>
                <p className="text-muted-foreground">{data.essentials.jobTitle || 'Your Job Title'}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedFieldNames.map((field) => (
                    <Badge key={field} variant="secondary">{field}</Badge>
                  ))}
                </div>
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Update Resume
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={data.essentials.fullName || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" value={data.essentials.jobTitle || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Niche Definition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Niche Definition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fields of Endeavor</Label>
              <div className="flex flex-wrap gap-2">
                {selectedFieldNames.map((field) => (
                  <Badge key={field} variant="outline" className="text-sm py-1 px-3">
                    {field}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="text-primary">
                  + Edit Fields
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nicheStatement">Niche Statement</Label>
              <Textarea 
                id="nicheStatement" 
                placeholder="Describe your specific niche within your field..."
                defaultValue=""
                readOnly
                className="min-h-[100px]"
              />
            </div>
            <Button>Update Niche</Button>
          </CardContent>
        </Card>

        {/* Salary Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Salary Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentSalary">Current Annual Salary (USD)</Label>
                <Input 
                  id="currentSalary" 
                  type="number" 
                  placeholder="150000" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input 
                  id="experience" 
                  type="number" 
                  value={data.essentials.yearsExperience || ''} 
                  readOnly 
                />
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Salary Percentile</p>
                  <p className="text-sm text-muted-foreground">Based on your field and experience</p>
                </div>
                <Badge className="text-lg py-1 px-4 bg-success/10 text-success border-success/20">
                  Top 15%
                </Badge>
              </div>
            </div>
            <Button>Recalculate</Button>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location & Work Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Current Country</Label>
                <Input id="country" placeholder="United States" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa">Current Visa Status</Label>
                <Input id="visa" placeholder="H1-B, L1, etc." />
              </div>
            </div>
            <Button>Save Location</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
