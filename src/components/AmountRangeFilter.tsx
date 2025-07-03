
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmountRange {
  min: number | null;
  max: number | null;
}

interface AmountRangeFilterProps {
  value: AmountRange;
  onChange: (range: AmountRange) => void;
}

export const AmountRangeFilter: React.FC<AmountRangeFilterProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState(value.min?.toString() || '');
  const [tempMax, setTempMax] = useState(value.max?.toString() || '');

  const handleApply = () => {
    onChange({
      min: tempMin ? parseFloat(tempMin) : null,
      max: tempMax ? parseFloat(tempMax) : null
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({ min: null, max: null });
    setTempMin('');
    setTempMax('');
  };

  const getDisplayText = () => {
    if (value.min === null && value.max === null) return 'Amount';
    if (value.min !== null && value.max === null) return `≥ $${value.min}`;
    if (value.min === null && value.max !== null) return `≤ $${value.max}`;
    if (value.min !== null && value.max !== null) {
      return `$${value.min} - $${value.max}`;
    }
    return 'Amount';
  };

  const hasValue = value.min !== null || value.max !== null;

  const presetRanges = [
    { label: 'Less than $10', min: null, max: 10 },
    { label: '$10 - $100', min: 10, max: 100 },
    { label: '$100 - $1,000', min: 100, max: 1000 },
    { label: 'More than $1,000', min: 1000, max: null }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 justify-between text-sm font-normal min-w-32",
            hasValue && "bg-blue-50 border-blue-200 text-blue-700"
          )}
        >
          <span className="truncate">{getDisplayText()}</span>
          {hasValue && (
            <X 
              className="w-3 h-3 ml-2 hover:bg-blue-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h4 className="font-medium text-sm mb-3">Filter by Amount</h4>
          
          <div className="space-y-3 mb-4">
            {presetRanges.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => {
                  onChange({ min: preset.min, max: preset.max });
                  setTempMin(preset.min?.toString() || '');
                  setTempMax(preset.max?.toString() || '');
                  setIsOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Custom Range</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="text-sm"
                />
              </div>
              <span className="text-gray-400">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
