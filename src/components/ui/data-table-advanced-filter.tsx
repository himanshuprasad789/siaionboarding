import { useState, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
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

// Custom filter function that handles advanced filter objects
export function advancedFilterFn(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: unknown
): boolean {
  const cellValue = row.getValue(columnId);
  
  // Handle advanced filter object format
  if (typeof filterValue === 'object' && filterValue !== null && 'operator' in filterValue && 'value' in filterValue) {
    const { operator, value } = filterValue as { operator: string; value: string };
    const strCellValue = String(cellValue ?? '').toLowerCase();
    const strFilterValue = String(value).toLowerCase();

    switch (operator) {
      case 'contains':
        return strCellValue.includes(strFilterValue);
      case 'equals':
        return strCellValue === strFilterValue;
      case 'startsWith':
        return strCellValue.startsWith(strFilterValue);
      case 'endsWith':
        return strCellValue.endsWith(strFilterValue);
      case 'gt':
        return Number(cellValue) > Number(value);
      case 'lt':
        return Number(cellValue) < Number(value);
      case 'gte':
        return Number(cellValue) >= Number(value);
      case 'lte':
        return Number(cellValue) <= Number(value);
      case 'before':
        return new Date(String(cellValue)) < new Date(value);
      case 'after':
        return new Date(String(cellValue)) > new Date(value);
      default:
        return strCellValue.includes(strFilterValue);
    }
  }

  // Handle array filter (faceted filter)
  if (Array.isArray(filterValue)) {
    return filterValue.includes(cellValue);
  }

  // Default string match
  return String(cellValue ?? '').toLowerCase().includes(String(filterValue).toLowerCase());
}

export function DataTableAdvancedFilter<TData>({ table }: DataTableAdvancedFilterProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilter, setPendingFilter] = useState<Partial<ActiveFilter>>({});

  // Get all columns that have filterType meta OR can filter
  const columns = table.getAllColumns().filter((col) => {
    const meta = col.columnDef.meta as ColumnFilterMeta | undefined;
    return col.getCanFilter() && (meta?.filterType || col.id !== 'actions');
  });

  const getOperators = (type: FilterType | undefined) => {
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

  const getColumnLabel = (columnId: string): string => {
    const meta = getColumnMeta(columnId);
    if (meta?.filterLabel) return meta.filterLabel;
    // Capitalize and format column id
    return columnId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
    // Reset all column filters first
    table.getAllColumns().forEach(col => {
      col.setFilterValue(undefined);
    });
    
    // Apply each filter
    activeFilters.forEach((filter) => {
      const column = table.getColumn(filter.columnId);
      if (column) {
        column.setFilterValue({ operator: filter.operator, value: filter.value });
      }
    });
  };

  // Sync filters from table state on mount
  useEffect(() => {
    const tableFilters = table.getState().columnFilters;
    const syncedFilters: ActiveFilter[] = [];
    
    tableFilters.forEach(cf => {
      const value = cf.value;
      if (typeof value === 'object' && value !== null && 'operator' in value && 'value' in value) {
        syncedFilters.push({
          columnId: cf.id,
          operator: (value as { operator: string; value: string }).operator,
          value: (value as { operator: string; value: string }).value,
        });
      }
    });
    
    if (syncedFilters.length > 0) {
      setFilters(syncedFilters);
    }
  }, []);

  const selectedColumn = pendingFilter.columnId ? columns.find(c => c.id === pendingFilter.columnId) : null;
  const selectedMeta = selectedColumn?.columnDef.meta as ColumnFilterMeta | undefined;
  const filterType = selectedMeta?.filterType || 'text';

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
            <h4 className="font-medium">Advanced Filters</h4>
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
                const label = getColumnLabel(filter.columnId);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5 text-sm"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{filter.operator}</span>
                    <span className="truncate max-w-[100px]">{Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}</span>
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
                {columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {getColumnLabel(col.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {pendingFilter.columnId && (
              <>
                <Select
                  value={pendingFilter.operator || ''}
                  onValueChange={(value) => setPendingFilter(prev => ({ ...prev, operator: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperators(filterType).map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {pendingFilter.operator && (
                  <>
                    {filterType === 'select' && selectedMeta?.filterOptions ? (
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
                    ) : filterType === 'boolean' ? (
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
                    ) : filterType === 'date' ? (
                      <Input
                        type="date"
                        value={String(pendingFilter.value || '')}
                        onChange={(e) => setPendingFilter(prev => ({ ...prev, value: e.target.value }))}
                      />
                    ) : filterType === 'number' ? (
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

          {columns.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No filterable columns available
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
