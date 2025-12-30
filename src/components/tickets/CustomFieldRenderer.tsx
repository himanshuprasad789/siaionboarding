import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { WorkflowField, TicketFieldValue, useUpdateTicketFieldValue } from '@/hooks/useWorkflowFields';
import { format } from 'date-fns';

interface CustomFieldRendererProps {
  field: WorkflowField;
  value: TicketFieldValue | undefined;
  ticketId: string;
  readOnly?: boolean;
}

export function CustomFieldRenderer({ field, value, ticketId, readOnly = false }: CustomFieldRendererProps) {
  const [localValue, setLocalValue] = useState<unknown>(value?.value ?? field.default_value ?? getDefaultForType(field.field_type));
  const updateValue = useUpdateTicketFieldValue();

  useEffect(() => {
    setLocalValue(value?.value ?? field.default_value ?? getDefaultForType(field.field_type));
  }, [value, field.default_value, field.field_type]);

  const handleChange = (newValue: unknown) => {
    setLocalValue(newValue);
    updateValue.mutate({ ticketId, fieldId: field.id, value: newValue });
  };

  if (readOnly) {
    return (
      <div className="space-y-1">
        <Label className="text-sm text-muted-foreground">{field.label}</Label>
        <div className="text-sm">{formatReadOnlyValue(field, localValue)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {field.label}
        {field.is_required && <span className="text-destructive">*</span>}
      </Label>
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
      {renderInput(field, localValue, handleChange)}
    </div>
  );
}

function getDefaultForType(type: WorkflowField['field_type']): unknown {
  switch (type) {
    case 'checkbox':
      return false;
    case 'multiselect':
      return [];
    case 'number':
      return null;
    default:
      return '';
  }
}

function formatReadOnlyValue(field: WorkflowField, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';

  switch (field.field_type) {
    case 'checkbox':
      return value ? 'Yes' : 'No';
    case 'date':
      try {
        return format(new Date(value as string), 'PPP');
      } catch {
        return String(value);
      }
    case 'select': {
      const opt = field.options.find(o => o.value === value);
      return opt?.label || String(value);
    }
    case 'multiselect': {
      const arr = Array.isArray(value) ? value : [];
      return arr.map(v => field.options.find(o => o.value === v)?.label || v).join(', ') || '—';
    }
    default:
      return String(value);
  }
}

function renderInput(
  field: WorkflowField,
  value: unknown,
  onChange: (value: unknown) => void
) {
  switch (field.field_type) {
    case 'text':
    case 'url':
    case 'email':
      return (
        <Input
          type={field.field_type === 'email' ? 'email' : field.field_type === 'url' ? 'url' : 'text'}
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          rows={3}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          value={value !== null && value !== undefined ? String(value) : ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder="0"
        />
      );

    case 'date':
      return (
        <Input
          type="date"
          value={value ? String(value) : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <span className="text-sm">{Boolean(value) ? 'Yes' : 'No'}</span>
        </div>
      );

    case 'select':
      return (
        <Select value={String(value || '')} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multiselect': {
      const selected = Array.isArray(value) ? value as string[] : [];
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((v) => {
              const opt = field.options.find(o => o.value === v);
              return (
                <Badge
                  key={v}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onChange(selected.filter(s => s !== v))}
                >
                  {opt?.label || v} ×
                </Badge>
              );
            })}
          </div>
          <Select
            value=""
            onValueChange={(v) => {
              if (!selected.includes(v)) {
                onChange([...selected, v]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options
                .filter((opt) => !selected.includes(opt.value))
                .map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    default:
      return null;
  }
}
