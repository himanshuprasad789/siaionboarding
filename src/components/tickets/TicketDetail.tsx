import { useState } from 'react';
import { Check, Clock, AlertCircle, ChevronRight, Upload, Send, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRole } from '@/contexts/RoleContext';
import { WorkflowStep, Ticket } from '@/data/mockWorkflowData';
import { cn } from '@/lib/utils';

interface TicketDetailProps {
  ticket: Ticket;
  workflowSteps: WorkflowStep[];
  onStepComplete?: (stepId: string) => void;
}

export function TicketDetail({ ticket, workflowSteps, onStepComplete }: TicketDetailProps) {
  const { user } = useRole();
  const currentRole = user?.role || 'client';
  const [activeStep, setActiveStep] = useState(ticket.currentStep);

  const currentStepData = workflowSteps[activeStep];
  const canEdit = currentStepData?.role === currentRole || currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{ticket.title}</h2>
          <p className="text-muted-foreground mt-1">
            Client: {ticket.clientName} • Assigned to: {ticket.assignedTo}
          </p>
        </div>
        <Badge 
          variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}
        >
          {ticket.priority} priority
        </Badge>
      </div>

      {/* Horizontal Stepper */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => {
            const isCompleted = index < ticket.currentStep;
            const isCurrent = index === ticket.currentStep;
            const isActive = index === activeStep;

            return (
              <div 
                key={step.id} 
                className="flex-1 relative cursor-pointer"
                onClick={() => setActiveStep(index)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10',
                      isCompleted && 'bg-green-500 border-green-500 text-white',
                      isCurrent && !isCompleted && 'bg-primary border-primary text-primary-foreground',
                      !isCompleted && !isCurrent && 'bg-muted border-border text-muted-foreground',
                      isActive && 'ring-2 ring-primary ring-offset-2'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium',
                      (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {step.role === 'client' ? 'Client' : step.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className={cn(
                    'absolute top-5 left-1/2 w-full h-0.5',
                    index < ticket.currentStep ? 'bg-green-500' : 'bg-border'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Content */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStepData?.name}
                {!canEdit && (
                  <Badge variant="outline" className="ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {currentStepData?.role === 'client' ? 'Waiting for Client' : 'Waiting for Team'}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{currentStepData?.description}</CardDescription>
            </div>
            {canEdit && (
              <Badge variant="default" className="bg-green-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Action Required
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {canEdit ? (
            <StepActionContent 
              step={currentStepData} 
              onComplete={() => onStepComplete?.(currentStepData.id)} 
            />
          ) : (
            <StepReadOnlyContent step={currentStepData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepActionContent({ step, onComplete }: { step: WorkflowStep; onComplete: () => void }) {
  switch (step.type) {
    case 'form':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Review Notes</Label>
            <Textarea placeholder="Enter your review notes..." className="min-h-[100px]" />
          </div>
          <div className="flex gap-3">
            <Button onClick={onComplete}>
              Approve & Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline">Request More Info</Button>
          </div>
        </div>
      );

    case 'editor':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Draft Content</Label>
            <Textarea 
              placeholder="Write your content here..." 
              className="min-h-[200px] font-mono text-sm" 
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Use AI Assistant
            </Button>
            <Button onClick={onComplete}>
              <Send className="w-4 h-4 mr-2" />
              Share with Client
            </Button>
          </div>
        </div>
      );

    case 'approval':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Draft Preview</h4>
            <p className="text-sm text-muted-foreground">
              [Draft content would be displayed here for client review]
            </p>
          </div>
          <div className="space-y-2">
            <Label>Feedback (optional)</Label>
            <Textarea placeholder="Add any feedback or revision requests..." />
          </div>
          <div className="flex gap-3">
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button variant="destructive">Request Revisions</Button>
          </div>
        </div>
      );

    case 'upload':
      return (
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <Button variant="outline" size="sm">Browse Files</Button>
          </div>
          <Button onClick={onComplete}>
            Submit & Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );

    case 'vendor_setup':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Outlet</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select outlet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techcrunch">TechCrunch</SelectItem>
                  <SelectItem value="forbes">Forbes</SelectItem>
                  <SelectItem value="wired">Wired</SelectItem>
                  <SelectItem value="venturebeat">VentureBeat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budget ($)</Label>
              <Input type="number" placeholder="Enter budget" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vendor Notes</Label>
            <Textarea placeholder="Special instructions for vendor..." />
          </div>
          <Button onClick={onComplete}>
            Assign to Vendor
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );

    case 'monitoring':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Live URL</Label>
              <Input placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Publication Date</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              Mark as Published
            </Button>
            <Button variant="outline">Force Complete</Button>
          </div>
        </div>
      );

    case 'analysis':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Client Salary</h4>
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-2xl font-bold">$185,000</p>
                <p className="text-sm text-muted-foreground">Annual Base Salary</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">O*Net / FLC Data</h4>
              <div className="space-y-2">
                <Label>Prevailing Wage</Label>
                <Input type="number" placeholder="Enter prevailing wage" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
            <p className="text-lg font-medium text-green-700 dark:text-green-300">
              +47% above prevailing wage
            </p>
          </div>
          <Button onClick={onComplete}>
            Generate Evidence PDF
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );

    case 'checklist':
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {['Reviewer 1 Invited', 'Reviewer 2 Invited', 'Review Comments Received', 'Revisions Applied'].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <Checkbox id={item} />
                <Label htmlFor={item} className="cursor-pointer">{item}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Upload Review Comments</Label>
            <Input type="file" />
          </div>
          <Button onClick={onComplete}>
            Complete Peer Review
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );

    default:
      return <p className="text-muted-foreground">No action available for this step type.</p>;
  }
}

function StepReadOnlyContent({ step }: { step: WorkflowStep }) {
  return (
    <div className="rounded-lg bg-muted/50 p-6 text-center">
      <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
      <h4 className="font-medium text-foreground mb-1">
        {step.role === 'client' ? 'Waiting for Client Action' : 'Team Processing'}
      </h4>
      <p className="text-sm text-muted-foreground">
        This step requires action from the {step.role === 'client' ? 'client' : step.role.replace('_', ' ') + ' team'}.
        You will be notified when it's ready.
      </p>
    </div>
  );
}
