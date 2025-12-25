import { useState } from 'react';
import { CommandCenterLayout } from '@/components/command/CommandCenterLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Compass, Star, Image } from 'lucide-react';
import { mockOpportunities } from '@/data/mockAdminData';

const criteriaCategories = [
  'Awards', 'Membership', 'Press', 'Judging', 'Original Contribution',
  'Authorship', 'Critical Role', 'High Salary', 'Exhibitions', 'Commercial Success'
];

export default function ResearchOpportunityCMS() {
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<typeof mockOpportunities[0] | null>(null);

  const handleDelete = (id: string) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
  };

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Opportunity CMS</h1>
            <p className="text-muted-foreground mt-1">
              Curate opportunities that clients see in their marketplace
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Opportunity</DialogTitle>
                <DialogDescription>
                  Create a new opportunity for clients to explore
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g., AI Summit 2025 Speaker" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of the opportunity..." />
                </div>
                <div className="space-y-2">
                  <Label>Criteria Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {criteriaCategories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Premium Opportunity</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input placeholder="https://..." />
                </div>
                <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                  Create Opportunity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Opportunity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="overflow-hidden">
              <div className="h-32 bg-muted flex items-center justify-center">
                {opportunity.imageUrl ? (
                  <img 
                    src={opportunity.imageUrl} 
                    alt={opportunity.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{opportunity.criteriaCategory}</Badge>
                      {opportunity.isPremium && (
                        <Badge variant="default" className="bg-amber-500">
                          <Star className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {opportunity.description}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingOpportunity(opportunity)}>
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(opportunity.id)}>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunities by Category</CardTitle>
            <CardDescription>Distribution across EB1 criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {criteriaCategories.slice(0, 5).map((category) => {
                const count = opportunities.filter(o => o.criteriaCategory === category).length;
                return (
                  <div key={category} className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{category}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </CommandCenterLayout>
  );
}
