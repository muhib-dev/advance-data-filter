
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilterState, SavedFilter } from './DataFilterUI';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface SavedFiltersManagerProps {
  currentFilters: FilterState;
  savedFilters: SavedFilter[];
  onSaveFilter: (filter: SavedFilter) => void;
  onLoadFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (id: string) => void;
}

export const SavedFiltersManager: React.FC<SavedFiltersManagerProps> = ({
  currentFilters,
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const hasActiveFilters = () => {
    return (
      currentFilters.dateRange.from || 
      currentFilters.dateRange.to || 
      currentFilters.amountRange.min !== null || 
      currentFilters.amountRange.max !== null ||
      currentFilters.status.length > 0 ||
      currentFilters.paymentMethod.length > 0
    );
  };

  const handleSaveFilter = () => {
    if (!filterName.trim() || !hasActiveFilters()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: { ...currentFilters },
      createdAt: new Date()
    };

    onSaveFilter(newFilter);
    setFilterName('');
    setIsDialogOpen(false);
  };

  const getFilterSummary = (filter: SavedFilter) => {
    const parts = [];
    
    if (filter.filters.dateRange.from || filter.filters.dateRange.to) {
      if (filter.filters.dateRange.from && filter.filters.dateRange.to) {
        parts.push(`${format(filter.filters.dateRange.from, 'MMM dd')} - ${format(filter.filters.dateRange.to, 'MMM dd')}`);
      } else if (filter.filters.dateRange.from) {
        parts.push(`From ${format(filter.filters.dateRange.from, 'MMM dd')}`);
      } else if (filter.filters.dateRange.to) {
        parts.push(`Until ${format(filter.filters.dateRange.to, 'MMM dd')}`);
      }
    }
    
    if (filter.filters.amountRange.min !== null || filter.filters.amountRange.max !== null) {
      if (filter.filters.amountRange.min !== null && filter.filters.amountRange.max !== null) {
        parts.push(`$${filter.filters.amountRange.min}-${filter.filters.amountRange.max}`);
      } else if (filter.filters.amountRange.min !== null) {
        parts.push(`≥$${filter.filters.amountRange.min}`);
      } else if (filter.filters.amountRange.max !== null) {
        parts.push(`≤$${filter.filters.amountRange.max}`);
      }
    }
    
    if (filter.filters.status.length > 0) {
      parts.push(`${filter.filters.status.length} status${filter.filters.status.length > 1 ? 'es' : ''}`);
    }
    
    if (filter.filters.paymentMethod.length > 0) {
      parts.push(`${filter.filters.paymentMethod.length} method${filter.filters.paymentMethod.length > 1 ? 's' : ''}`);
    }
    
    return parts.join(' • ');
  };

  return (
    <div className="flex items-center gap-3">
      {/* Save Current Filter */}
      {hasActiveFilters() && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Save Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Current Filter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Name</label>
                <Input
                  placeholder="Enter filter name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveFilter();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveFilter}
                  disabled={!filterName.trim()}
                >
                  Save Filter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Saved Filters Dropdown */}
      {savedFilters.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Saved Filters ({savedFilters.length})
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            <div className="p-2">
              <h4 className="font-medium text-sm mb-2 px-2">Saved Filters</h4>
              <div className="space-y-1">
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="group flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLoadFilter(filter)}
                    >
                      <div className="font-medium text-sm">{filter.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {getFilterSummary(filter)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(filter.createdAt, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFilter(filter.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
