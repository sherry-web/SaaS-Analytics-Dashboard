import React, { useState, useEffect } from "react";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterPanelProps {
  categories: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onReset?: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedFilters,
  onFilterChange,
  onReset,
  className = ""
}) => {
  const [localSelected, setLocalSelected] = useState<Record<string, string[]>>(selectedFilters);

  useEffect(() => {
    setLocalSelected(selectedFilters);
  }, [selectedFilters]);

  const handleFilterToggle = (categoryId: string, optionId: string) => {
    const currentSelected = localSelected[categoryId] || [];
    const isSelected = currentSelected.includes(optionId);
    
    const updatedSelected = isSelected
      ? currentSelected.filter(id => id !== optionId)
      : [...currentSelected, optionId];

    const newFilters = {
      ...localSelected,
      [categoryId]: updatedSelected
    };

    setLocalSelected(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: Record<string, string[]> = {};
    setLocalSelected(resetFilters);
    onReset?.();
  };

  const hasActiveFilters = Object.values(localSelected).some(filters => filters.length > 0);

  return (
    <div className={`filter-panel ${className}`} role="search" aria-label="Data filters">
      <div className="filter-panel-header">
        <h2 className="filter-panel-title">Filters</h2>
        {hasActiveFilters && (
          <button 
            className="filter-reset-btn"
            onClick={handleReset}
            aria-label="Reset all filters"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="filter-categories">
        {categories.map(category => (
          <fieldset key={category.id} className="filter-category" role="group" aria-label={category.label}>
            <legend className="filter-category-title">{category.label}</legend>
            <div className="filter-options">
              {category.options.map(option => (
                <label key={option.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={(localSelected[category.id] || []).includes(option.id)}
                    onChange={() => handleFilterToggle(category.id, option.id)}
                    aria-checked={(localSelected[category.id] || []).includes(option.id)}
                    className="filter-checkbox"
                  />
                  <span className="filter-option-label">
                    {option.label}
                    {option.count !== undefined && (
                      <span className="filter-option-count">({option.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="filter-panel-empty" role="status" aria-live="polite">
          No filters available
        </div>
      )}
    </div>
  );
};

export default FilterPanel;