/**
 * Test Suite: FilterPanel Integration
 * Description: Tests filter selection, state persistence, keyboard navigation, and accessibility
 */

import React from 'react';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mockPerformanceNow, TEST_TIMING } from './setup';
import FilterPanel, { FilterCategory } from '../widgets/FilterPanel';

describe('FilterPanel - Integration Tests', () => {
  const user = userEvent.setup({ delay: null });
  const mockOnFilterChange = vi.fn();
  const mockOnReset = vi.fn();

  const sampleCategories: FilterCategory[] = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active', count: 5 },
        { id: 'inactive', label: 'Inactive', count: 3 },
        { id: 'pending', label: 'Pending', count: 2 }
      ]
    },
    {
      id: 'type',
      label: 'Type',
      options: [
        { id: 'premium', label: 'Premium', count: 8 },
        { id: 'basic', label: 'Basic', count: 12 }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformanceNow.mockClear();
    mockPerformanceNow.mockReturnValue(TEST_TIMING.INITIAL);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Filter Selection & State Persistence', () => {
    test('selects and deselects filter options with proper ARIA attributes and timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const statusCategory = screen.getByRole('group', { name: /status/i });
      const activeCheckbox = within(statusCategory).getByRole('checkbox', { name: /active/i });

      // Select filter
      await user.click(activeCheckbox);
      expect(mockOnFilterChange).toHaveBeenCalledWith({ status: ['active'] });
      expect(activeCheckbox).toHaveAttribute('aria-checked', 'true');

      // Deselect filter
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      await user.click(activeCheckbox);
      expect(mockOnFilterChange).toHaveBeenCalledWith({ status: [] });
    });

    test('handles multiple filter selections within category with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const statusCategory = screen.getByRole('group', { name: /status/i });
      const activeCheckbox = within(statusCategory).getByRole('checkbox', { name: /active/i });
      const pendingCheckbox = within(statusCategory).getByRole('checkbox', { name: /pending/i });

      await user.click(activeCheckbox);
      await user.click(pendingCheckbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith({ status: ['active', 'pending'] });
    });

    test('displays filter counts correctly with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByText('(5)')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    test('resets all filters when reset button is clicked with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{ status: ['active'], type: ['premium'] }}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset filters/i });
      await user.click(resetButton);

      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    test('reset button has proper accessibility attributes with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{ status: ['active'] }}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset filters/i });
      expect(resetButton).toHaveAttribute('aria-label', 'Reset all filters');
    });
  });

  describe('Keyboard Accessibility', () => {
    test('navigates through filters with keyboard and timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const firstCheckbox = screen.getByRole('checkbox', { name: /active/i });
      firstCheckbox.focus();

      expect(firstCheckbox).toHaveFocus();

      // Navigate with Tab
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      await user.tab();
      expect(screen.getByRole('checkbox', { name: /inactive/i })).toHaveFocus();

      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      await user.tab();
      expect(screen.getByRole('checkbox', { name: /pending/i })).toHaveFocus();
    });

    test('toggles filters with Space and Enter keys with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const activeCheckbox = screen.getByRole('checkbox', { name: /active/i });
      activeCheckbox.focus();

      // Toggle with Space
      await user.keyboard(' ');
      expect(mockOnFilterChange).toHaveBeenCalledWith({ status: ['active'] });

      // Toggle with Enter
      await user.keyboard('{Enter}');
      expect(mockOnFilterChange).toHaveBeenCalledWith({ status: [] });
    });
  });

  describe('Performance & Async Behavior', () => {
    test('handles rapid consecutive filter selections with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const activeCheckbox = screen.getByRole('checkbox', { name: /active/i });
      const inactiveCheckbox = screen.getByRole('checkbox', { name: /inactive/i });

      // Rapid interactions
      await user.click(activeCheckbox);
      await user.click(inactiveCheckbox);
      await user.click(activeCheckbox);

      expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('WCAG 2.1 AA Compliance', () => {
    test('has proper ARIA attributes for all interactive elements with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      // Checkbox groups have proper roles
      expect(screen.getByRole('group', { name: /status/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /type/i })).toBeInTheDocument();

      // Checkboxes have proper states
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
      });

      // Reset button is accessible
      expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
    });
  });

  describe('Error Boundary & Edge Cases', () => {
    test('handles empty categories gracefully with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <FilterPanel
          categories={[]}
          selectedFilters={{}}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByText(/no filters available/i)).toBeInTheDocument();
    });

    test('displays selected state correctly with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <FilterPanel
          categories={sampleCategories}
          selectedFilters={{ status: ['active', 'pending'], type: ['premium'] }}
          onFilterChange={mockOnFilterChange}
          onReset={mockOnReset}
        />
      );

      const activeCheckbox = screen.getByRole('checkbox', { name: /active/i });
      const pendingCheckbox = screen.getByRole('checkbox', { name: /pending/i });
      const premiumCheckbox = screen.getByRole('checkbox', { name: /premium/i });

      expect(activeCheckbox).toHaveAttribute('aria-checked', 'true');
      expect(pendingCheckbox).toHaveAttribute('aria-checked', 'true');
      expect(premiumCheckbox).toHaveAttribute('aria-checked', 'true');
    });
  });
});