import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Pencil, X } from 'lucide-react';
import { WorkflowField, useCreateWorkflowField, useUpdateWorkflowField, useDeleteWorkflowField, useWorkflowFields } from '@/hooks/useWorkflowFields';

interface WorkflowFieldEditorProps {
  workflowId: string;
  workflowName: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
] as const;

type FieldType = typeof FIELD_TYPES[number]['value'];

interface FieldFormState {
  name: string;
  label: string;
  field_type: FieldType;
  options: { label: string; value: string }[];
  is_required: boolean;
  description: string;
}

const initialFormState: FieldFormState = {
  name: '',
  label: '',
  field_type: 'text',
  options: [],
  is_required: false,
  description: '',
};

export function WorkflowFieldEditor({ workflowId, workflowName }: WorkflowFieldEditorProps) {
  const { data: fields = [], isLoading } = useWorkflowFields(workflowId);
  const createField = useCreateWorkflowField();
  const updateField = useUpdateWorkflowField();
  const deleteField = useDeleteWorkflowField();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<WorkflowField | null>(null);
  const [form, setForm] = useState<FieldFormState>(initialFormState);
  const [newOption, setNewOption] = useState('');

  const resetForm = () => {
    setForm(initialFormState);
    setEditingField(null);
    setNewOption('');
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (field: WorkflowField) => {
    setEditingField(field);
    setForm({
      name: field.name,
      label: field.label,
      field_type: field.field_type,
      options: field.options || [],
      is_required: field.is_required,
      description: field.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.label.trim()) return;

    const fieldData = {
      workflow_id: workflowId,
      name: form.name.toLowerCase().replace(/\s+/g, '_'),
      label: form.label,
      field_type: form.field_type,
      options: form.options,
      is_required: form.is_required,
      description: form.description || null,
      default_value: null,
      order_index: editingField ? editingField.order_index : fields.length,
    };

    if (editingField) {
      await updateField.mutateAsync({ id: editingField.id, ...fieldData });
    } else {
      await createField.mutateAsync(fieldData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      await deleteField.mutateAsync(fieldId);
    }
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    const value = newOption.toLowerCase().replace(/\s+/g, '_');
    setForm(prev => ({
      ...prev,
      options: [...prev.options, { label: newOption, value }],
    }));
    setNewOption('');
  };

  const removeOption = (index: number) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const showOptionsEditor = form.field_type === 'select' || form.field_type === 'multiselect';

  if (isLoading) {
    return <div className="text-muted-foreground">Loading fields...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{workflowName} - Custom Fields</h3>
        <Button onClick={openCreateDialog} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">No custom fields defined for this workflow.</p>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <Card key={field.id} className="bg-muted/50">
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{field.label}</span>
                      <Badge variant="outline" className="text-xs">{field.field_type}</Badge>
                      {field.is_required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{field.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(field)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(field.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Field' : 'Add Custom Field'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Field Label"
              />
            </div>

            <div className="space-y-2">
              <Label>Name (internal key)</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="field_name"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.field_type}
                onValueChange={(value: FieldType) => setForm(prev => ({ ...prev, field_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showOptionsEditor && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Option label"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                  />
                  <Button type="button" onClick={addOption} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.options.map((opt, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {opt.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeOption(idx)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Help text for this field"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_required}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_required: checked }))}
              />
              <Label>Required field</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.name.trim() || !form.label.trim()}>
              {editingField ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
