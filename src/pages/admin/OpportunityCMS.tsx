import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, DataTableColumn, TypeBadge } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Crown, Columns } from 'lucide-react';
import { mockOpportunities } from '@/data/mockAdminData';
import { Opportunity } from '@/types/admin';
import { toast } from 'sonner';

const criteriaCategories = [
  'Authorship', 'Awards', 'Membership', 'Judging', 'Original Contribution',
  'Scholarly Articles', 'Critical Role', 'High Salary', 'Press', 'Commercial Success'
];

export default function OpportunityCMS() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formIsPremium, setFormIsPremium] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormCategory('');
    setFormIsPremium(false);
    setFormImageUrl('');
    setEditingOpp(null);
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      criteriaCategory: formCategory,
      isPremium: formIsPremium,
      imageUrl: formImageUrl || '/placeholder.svg',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setOpportunities([...opportunities, newOpp]);
    resetForm();
    setIsCreateOpen(false);
    toast.success('Opportunity created successfully');
  };

  const handleUpdate = () => {
    if (!editingOpp || !formTitle.trim() || !formCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    setOpportunities(opportunities.map(opp => {
      if (opp.id === editingOpp.id) {
        return {
          ...opp,
          title: formTitle,
          description: formDescription,
          criteriaCategory: formCategory,
          isPremium: formIsPremium,
          imageUrl: formImageUrl || '/placeholder.svg',
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return opp;
    }));

    resetForm();
    toast.success('Opportunity updated successfully');
  };

  const handleDelete = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
    toast.success('Opportunity deleted');
  };

  const openEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setFormTitle(opp.title);
    setFormDescription(opp.description);
    setFormCategory(opp.criteriaCategory);
    setFormIsPremium(opp.isPremium);
    setFormImageUrl(opp.imageUrl || '');
  };

  const columns: DataTableColumn<Opportunity>[] = [
    {
      key: 'title',
      header: 'Title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.imageUrl} 
            alt={row.title}
            className="h-10 w-10 rounded-lg object-cover bg-muted"
          />
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {row.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (row) => <TypeBadge type={row.criteriaCategory} />,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row) => (
        row.isPremium ? (
          <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
        ) : (
          <Badge variant="secondary" className="font-normal">Free</Badge>
        )
      ),
    },
    {
      key: 'updated',
      header: 'Updated',
      cell: (row) => <span className="text-muted-foreground">{row.updatedAt}</span>,
    },
  ];

  const actions = [
    { label: 'Edit', onClick: (row: Opportunity) => openEdit(row) },
    { label: 'View in Marketplace', onClick: (row: Opportunity) => toast.info(`Viewing ${row.title}`) },
    { label: 'Delete', onClick: (row: Opportunity) => handleDelete(row.id), variant: 'destructive' as const },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Opportunity CMS</h1>
            <p className="text-muted-foreground mt-1">
              Manage the opportunities shown in the client marketplace.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Columns className="h-4 w-4" />
              Customize Columns
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Opportunity</DialogTitle>
                  <DialogDescription>
                    Add a new opportunity to the client marketplace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="opp-title">Title *</Label>
                    <Input
                      id="opp-title"
                      placeholder="e.g., AI Summit 2025 Speaker"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opp-desc">Description</Label>
                    <Textarea
                      id="opp-desc"
                      placeholder="Describe this opportunity..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Criteria Category *</Label>
                    <Select value={formCategory} onValueChange={setFormCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {criteriaCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opp-image">Image URL</Label>
                    <Input
                      id="opp-image"
                      placeholder="https://..."
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Premium Opportunity</Label>
                      <p className="text-xs text-muted-foreground">
                        Premium opportunities require a paid upgrade
                      </p>
                    </div>
                    <Switch 
                      checked={formIsPremium} 
                      onCheckedChange={setFormIsPremium} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingOpp} onOpenChange={(open) => !open && resetForm()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Opportunity</DialogTitle>
              <DialogDescription>
                Update the opportunity details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Criteria Category *</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {criteriaCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Premium Opportunity</Label>
                  <p className="text-xs text-muted-foreground">
                    Premium opportunities require a paid upgrade
                  </p>
                </div>
                <Switch 
                  checked={formIsPremium} 
                  onCheckedChange={setFormIsPremium} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Opportunities Table */}
        <DataTable
          data={opportunities}
          columns={columns}
          actions={actions}
          onRowClick={(row) => openEdit(row)}
        />
      </div>
    </AdminLayout>
  );
}
