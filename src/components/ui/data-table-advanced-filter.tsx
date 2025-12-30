import { useState } from 'react';
import { Table, Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export type FilterType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export interface ColumnFilterMeta {
  filterType?: FilterType;
  filterOptions?: { label: string; value: string }[];
  filterLabel?: string;
}

interface ActiveFilter {
  columnId: string;
  operator: string;
  value: string | string[];
}

interface DataTableAdvancedFilterProps<TData> {
  table: Table<TData>;
}

const TEXT_OPERATORS = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
];

const NUMBER_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'gte', label: 'Greater or equal' },
  { value: 'lte', label: 'Less or equal' },
];

const DATE_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'before', label: 'Before' },
  { value: 'after', label: 'After' },
];

export function DataTableAdvancedFilter<TData>({ table }: DataTableAdvancedFilterProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilter, setPendingFilter] = useState<Partial<ActiveFilter>>({});

  const columns = table.getAllColumns().filter((col) => {
    const meta = col.columnDef.meta as ColumnFilterMeta | undefined;
    return meta?.filterType && col.getCanFilter();
  });

  const getOperators = (type: FilterType) => {
    switch (type) {
      case 'number': return NUMBER_OPERATORS;
      case 'date': return DATE_OPERATORS;
      case 'select':
      case 'boolean':
        return [{ value: 'equals', label: 'Equals' }];
      default: return TEXT_OPERATORS;
    }
  };

  const getColumnMeta = (columnId: string): ColumnFilterMeta | undefined => {
    const col = columns.find((c) => c.id === columnId);
    return col?.columnDef.meta as ColumnFilterMeta | undefined;
  };

  const applyFilter = () => {
    if (!pendingFilter.columnId || !pendingFilter.operator || !pendingFilter.value) return;

    const newFilter: ActiveFilter = {
      columnId: pendingFilter.columnId,
      operator: pendingFilter.operator,
      value: pendingFilter.value,
    };

    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    applyFiltersToTable(newFilters);
    setPendingFilter({});
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    applyFiltersToTable(newFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    table.resetColumnFilters();
  };

  const applyFiltersToTable = (activeFilters: ActiveFilter[]) => {
    table.resetColumnFilters();
    
    activeFilters.forEach((filter) => {
      const column = table.getColumn(filter.columnId);
      if (column) {
        column.setFilterValue({ operator: filter.operator, value: filter.value });
      }
    });
  };

  const selectedColumn = pendingFilter.columnId ? columns.find(c => c.id === pendingFilter.columnId) : null;
  const selectedMeta = selectedColumn?.columnDef.meta as ColumnFilterMeta | undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {filters.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {filters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>

          {/* Active filters */}
          {filters.length > 0 && (
            <div className="space-y-2">
              {filters.map((filter, index) => {
                const meta = getColumnMeta(filter.columnId);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5 text-sm"
                  >
                    <span className="font-medium">{meta?.filterLabel || filter.columnId}</span>
                    <span className="text-muted-foreground">{filter.operator}</span>
                    <span>{Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-auto"
                      onClick={() => removeFilter(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <Separator />

          {/* Add new filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add filter</Label>

            <Select
              value={pendingFilter.columnId || ''}
              onValueChange={(value) => setPendingFilter({ columnId: value, operator: '', value: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select column..." />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => {
                  const meta = col.columnDef.meta as ColumnFilterMeta | undefined;
                  return (
                    <SelectItem key={col.id} value={col.id}>
                      {meta?.filterLabel || col.id}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {pendingFilter.columnId && selectedMeta && (
              <>
                <Select
                  value={pendingFilter.operator || ''}
                  onValueChange={(value) => setPendingFilter(prev => ({ ...prev, operator: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperators(selectedMeta.filterType || 'text').map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {pendingFilter.operator && (
                  <>
                    {selectedMeta.filterType === 'select' && selectedMeta.filterOptions ? (
                      <Select
                        value={String(pendingFilter.value || '')}
                        onValueChange={(value) => setPendingFilter(prev => ({ ...prev, value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select value..." />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedMeta.filterOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : selectedMeta.filterType === 'boolean' ? (
                      <Select
                        value={String(pendingFilter.value || '')}
                        onValueChange={(value) => setPendingFilter(prev => ({ ...prev, value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select value..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : selectedMeta.filterType === 'date' ? (
                      <Input
                        type="date"
                        value={String(pendingFilter.value || '')}
                        onChange={(e) => setPendingFilter(prev => ({ ...prev, value: e.target.value }))}
                      />
                    ) : selectedMeta.filterType === 'number' ? (
                      <Input
                        type="number"
                        placeholder="Enter value..."
                        value={String(pendingFilter.value || '')}
                        onChange={(e) => setPendingFilter(prev => ({ ...prev, value: e.target.value }))}
                      />
                    ) : (
                      <Input
                        placeholder="Enter value..."
                        value={String(pendingFilter.value || '')}
                        onChange={(e) => setPendingFilter(prev => ({ ...prev, value: e.target.value }))}
                      />
                    )}

                    <Button onClick={applyFilter} size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Filter
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
