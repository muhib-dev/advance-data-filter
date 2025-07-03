
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValues,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return label;
    if (selectedValues.length === 1) return selectedValues[0];
    return `${selectedValues.length} selected`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 justify-between text-sm font-normal",
            selectedValues.length > 0 && "bg-blue-50 border-blue-200 text-blue-700"
          )}
        >
          <span className="truncate max-w-32">{getDisplayText()}</span>
          {selectedValues.length > 0 && (
            <X 
              className="w-3 h-3 ml-2 hover:bg-blue-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
            />
          )}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-medium text-sm mb-2">Filter by {label}</h4>
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleToggleOption(option)}
            >
              <Checkbox
                checked={selectedValues.includes(option)}
                onChange={() => handleToggleOption(option)}
              />
              <span className="text-sm flex-1">{option}</span>
            </div>
          ))}
          
          {filteredOptions.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-gray-500">
              No options found
            </div>
          )}
        </div>
        
        {selectedValues.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="w-full text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
