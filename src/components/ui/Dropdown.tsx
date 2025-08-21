import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onSelect: (option: DropdownOption) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  maxHeight?: string;
  className?: string;
  'aria-label'?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option...',
  onSelect,
  disabled = false,
  error,
  label,
  required = false,
  searchable = false,
  clearable = false,
  maxHeight = '200px',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    options.find(opt => opt.value === value) || null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update selected option when value prop changes
  useEffect(() => {
    const newSelected = options.find(opt => opt.value === value) || null;
    setSelectedOption(newSelected);
  }, [value, options]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
          if (searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          event.preventDefault();
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          if (searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
      
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(filteredOptions.length - 1);
        break;
      
      case 'Enter':
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          event.preventDefault();
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOption(null);
    onSelect({ value: '', label: '' });
  };

  const toggleDropdown = () => {
    if (disabled) return;
    
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[
        searchable ? highlightedIndex + 1 : highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, searchable]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            relative w-full px-3 py-2 text-left bg-white dark:bg-gray-700 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
            }
            ${disabled ? 'text-gray-400' : 'text-gray-900 dark:text-white'}
            transition-colors duration-150
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          aria-required={required}
          aria-invalid={!!error}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? '' : 'text-gray-400 dark:text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center space-x-1">
              {clearable && selectedOption && !disabled && (
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                  aria-label="Clear selection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div
            className={`
              absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
              rounded-md shadow-lg transform transition-all duration-200 ease-out
              ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            style={{ maxHeight }}
          >
            <div
              ref={optionsRef}
              className="overflow-auto"
              style={{ maxHeight: `calc(${maxHeight} - 2px)` }}
              role="listbox"
              aria-label={ariaLabel || label}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search options..."
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Options List */}
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center justify-between transition-colors duration-150
                      ${index === highlightedIndex 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                      }
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      ${selectedOption?.value === option.value 
                        ? 'bg-blue-100 dark:bg-blue-800/30' 
                        : ''
                      }
                    `}
                    role="option"
                    aria-selected={selectedOption?.value === option.value}
                    aria-disabled={option.disabled}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {option.icon && (
                        <div className="flex-shrink-0 text-gray-400">
                          {option.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedOption?.value === option.value && (
                      <div className="flex-shrink-0 ml-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};