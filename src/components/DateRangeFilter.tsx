
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    onChange({ from: null, to: null });
  };

  const getDisplayText = () => {
    if (!value.from && !value.to) return 'Date';
    if (value.from && !value.to) return `From ${format(value.from, 'MMM dd, yyyy')}`;
    if (!value.from && value.to) return `Until ${format(value.to, 'MMM dd, yyyy')}`;
    if (value.from && value.to) {
      return `${format(value.from, 'MMM dd')} - ${format(value.to, 'MMM dd, yyyy')}`;
    }
    return 'Date';
  };

  const hasValue = value.from || value.to;

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
      
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-medium text-sm mb-2">Select Date Range</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() })}
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })}
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), to: new Date() })}
            >
              Last 90 days
            </Button>
          </div>
        </div>
        
        <Calendar
          mode="range"
          selected={{ from: value.from || undefined, to: value.to || undefined }}
          onSelect={(range) => {
            if (range) {
              onChange({
                from: range.from || null,
                to: range.to || null
              });
            }
          }}
          className="pointer-events-auto"
          numberOfMonths={2}
        />
        
        {hasValue && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-full text-xs"
            >
              Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
