
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilterDropdown } from './FilterDropdown';
import { DateRangeFilter } from './DateRangeFilter';
import { AmountRangeFilter } from './AmountRangeFilter';
import { SavedFiltersManager } from './SavedFiltersManager';
import { PaymentsTable } from './PaymentsTable';
import { X } from 'lucide-react';

export interface FilterState {
  dateRange: { from: Date | null; to: Date | null };
  amountRange: { min: number | null; max: number | null };
  status: string[];
  paymentMethod: string[];
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: Date;
}

const statusOptions = [
  'Succeeded',
  'Failed', 
  'Pending',
  'Canceled',
  'Refunded',
  'Disputed',
  'Blocked',
  'Incomplete',
  'Partially refunded',
  'Refund pending',
  'Uncaptured',
  'Early fraud warning'
];

const paymentMethodOptions = [
  'Card',
  'Bank transfer',
  'PayPal',
  'Apple Pay',
  'Google Pay',
  'SEPA',
  'ACH'
];

export const DataFilterUI = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null },
    amountRange: { min: null, max: null },
    status: [],
    paymentMethod: []
  });

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      amountRange: { min: null, max: null },
      status: [],
      paymentMethod: []
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.dateRange.from || 
      filters.dateRange.to || 
      filters.amountRange.min !== null || 
      filters.amountRange.max !== null ||
      filters.status.length > 0 ||
      filters.paymentMethod.length > 0
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.amountRange.min !== null || filters.amountRange.max !== null) count++;
    if (filters.status.length > 0) count++;
    if (filters.paymentMethod.length > 0) count++;
    return count;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and filter your payment transactions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">
            Create payment
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['All', 'Succeeded', 'Refunded', 'Uncaptured', 'Failed'].map((tab, index) => (
            <button
              key={tab}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                index === 0
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3">
        <DateRangeFilter 
          value={filters.dateRange}
          onChange={(range) => updateFilter('dateRange', range)}
        />
        
        <AmountRangeFilter
          value={filters.amountRange}
          onChange={(range) => updateFilter('amountRange', range)}
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          selectedValues={filters.status}
          onChange={(values) => updateFilter('status', values)}
        />

        <FilterDropdown
          label="Payment method"
          options={paymentMethodOptions}
          selectedValues={filters.paymentMethod}
          onChange={(values) => updateFilter('paymentMethod', values)}
        />

        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters ({getActiveFilterCount()})
          </Button>
        )}
      </div>

      {/* Saved Filters Manager */}
      <SavedFiltersManager
        currentFilters={filters}
        savedFilters={savedFilters}
        onSaveFilter={(filter) => setSavedFilters(prev => [...prev, filter])}
        onLoadFilter={(filter) => setFilters(filter.filters)}
        onDeleteFilter={(id) => setSavedFilters(prev => prev.filter(f => f.id !== id))}
      />

      {/* Data Table */}
      <PaymentsTable filters={filters} />
    </div>
  );
};
