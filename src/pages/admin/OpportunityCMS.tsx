import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EnhancedDataTable } from '@/components/ui/enhanced-data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableRowActions, DataTableAction } from '@/components/ui/data-table-row-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Plus } from 'lucide-react';
import { useOpportunities, useCreateOpportunity, useUpdateOpportunity, useDeleteOpportunity } from '@/hooks/useOpportunities';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

type OpportunityRow = Database["public"]["Tables"]["opportunities"]["Row"];
type OpportunityStatus = Database["public"]["Enums"]["opportunity_status"];

const criteriaCategories = [
  'Authorship', 'Awards', 'Membership', 'Judging', 'Original Contribution',
  'Scholarly Articles', 'Critical Role', 'High Salary', 'Press', 'Commercial Success'
];

export default function OpportunityCMS() {
  const { data: opportunities = [], isLoading } = useOpportunities();
  const createOpportunity = useCreateOpportunity();
  const updateOpportunity = useUpdateOpportunity();
  const deleteOpportunity = useDeleteOpportunity();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityRow | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStatus, setFormStatus] = useState<OpportunityStatus>('draft');
  const [formDifficulty, setFormDifficulty] = useState(1);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormCategory('');
    setFormStatus('draft');
    setFormDifficulty(1);
    setEditingOpp(null);
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    createOpportunity.mutate({
      title: formTitle,
      description: formDescription,
      category: formCategory,
      status: formStatus,
      difficulty_level: formDifficulty,
    }, {
      onSuccess: () => {
        resetForm();
        setIsCreateOpen(false);
        toast.success('Opportunity created successfully');
      },
      onError: (error) => {
        console.error('Error creating opportunity:', error);
        toast.error('Failed to create opportunity');
      },
    });
  };

  const handleUpdate = () => {
    if (!editingOpp || !formTitle.trim() || !formCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateOpportunity.mutate({
      id: editingOpp.id,
      updates: {
        title: formTitle,
        description: formDescription,
        category: formCategory,
        status: formStatus,
        difficulty_level: formDifficulty,
      },
    }, {
      onSuccess: () => {
        resetForm();
        toast.success('Opportunity updated successfully');
      },
      onError: (error) => {
        console.error('Error updating opportunity:', error);
        toast.error('Failed to update opportunity');
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteOpportunity.mutate(id, {
      onSuccess: () => {
        toast.success('Opportunity deleted');
      },
      onError: (error) => {
        console.error('Error deleting opportunity:', error);
        toast.error('Failed to delete opportunity');
      },
    });
  };

  const openEdit = (opp: OpportunityRow) => {
    setEditingOpp(opp);
    setFormTitle(opp.title);
    setFormDescription(opp.description || '');
    setFormCategory(opp.category);
    setFormStatus(opp.status);
    setFormDifficulty(opp.difficulty_level || 1);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return 'Invalid date';
    }
  };

  const columns: ColumnDef<OpportunityRow>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <span className="text-xs font-medium">{row.original.category.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {row.original.description || 'No description'}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const statusColors: Record<OpportunityStatus, string> = {
          draft: 'bg-muted text-muted-foreground',
          published: 'bg-green-100 text-green-700',
          archived: 'bg-red-100 text-red-700',
          review: 'bg-yellow-100 text-yellow-700',
        };
        return (
          <Badge className={`font-normal ${statusColors[row.original.status]}`}>
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'difficulty_level',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Difficulty" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          Level {row.original.difficulty_level || 1}
        </Badge>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.original.updated_at)}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={actions}
        />
      ),
    },
  ];

  const actions: DataTableAction<OpportunityRow>[] = [
    { label: 'Edit', onClick: (row) => openEdit(row) },
    { label: 'View in Marketplace', onClick: (row) => toast.info(`Viewing ${row.title}`) },
    { label: 'Delete', onClick: (row) => handleDelete(row.id), variant: 'destructive', separator: true },
  ];

  const categoryFilterOptions = criteriaCategories.map(cat => ({
    label: cat,
    value: cat,
  }));

  const statusFilterOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
    { label: 'Review', value: 'review' },
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
                  <Label>Category *</Label>
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
                  <Label>Status</Label>
                  <Select value={formStatus} onValueChange={(value: OpportunityStatus) => setFormStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={formDifficulty.toString()} onValueChange={(value) => setFormDifficulty(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createOpportunity.isPending}>
                  {createOpportunity.isPending ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <Label>Category *</Label>
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
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={(value: OpportunityStatus) => setFormStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={formDifficulty.toString()} onValueChange={(value) => setFormDifficulty(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateOpportunity.isPending}>
                {updateOpportunity.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Opportunities Table */}
        <EnhancedDataTable
          data={opportunities}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Search opportunities..."
          filterableColumns={[
            { id: 'category', title: 'Category', options: categoryFilterOptions },
            { id: 'status', title: 'Status', options: statusFilterOptions },
          ]}
          onRowClick={(row) => openEdit(row)}
          emptyMessage="No opportunities found. Create your first opportunity to get started."
        />
      </div>
    </AdminLayout>
  );
}
