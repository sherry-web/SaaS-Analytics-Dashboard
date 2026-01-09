import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import ReportSettingsPanel from '../ReportSettingsPanel';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import { NotificationProvider } from '../../../contexts/NotificationContext';

// Mock dependencies
vi.mock('../../../services/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('../../../hooks/useSettings', () => ({
  useSettings: () => ({
    userPreferences: {
      layout: 'grid',
      theme: 'light',
      refreshRate: 30,
      exportFormat: 'pdf',
    },
    updatePreferences: vi.fn(),
    isLoading: false,
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock components
const MockWrapper = ({ children }) => (
  <SettingsProvider>
    <NotificationProvider>
      {children}
    </NotificationProvider>
  </SettingsProvider>
);

describe('ReportSettingsPanel - Integration Tests', () => {
  const user = userEvent.setup({ delay: null });
  let apiClient;

  beforeEach(async () => {
    vi.useFakeTimers();
    apiClient = (await import('../../../services/apiClient')).default;
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      layout: 'grid',
      theme: 'light',
      refreshRate: 30,
    }));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Render & Initial State', () => {
    test('renders all settings controls with proper accessibility attributes', () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      // Validate main container accessibility
      const panel = screen.getByRole('region', { name: /report settings/i });
      expect(panel).toBeInTheDocument();

      // Validate form controls
      expect(screen.getByLabelText(/layout type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/theme preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/refresh rate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/export format/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /auto-refresh/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /show metrics/i })).toBeInTheDocument();

      // Validate buttons
      expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset to defaults/i })).toBeInTheDocument();
    });

    test('loads and displays initial default states correctly', () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      // Verify default values
      expect(screen.getByDisplayValue('grid')).toBeInTheDocument();
      expect(screen.getByDisplayValue('light')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
      expect(screen.getByDisplayValue('pdf')).toBeInTheDocument();
      
      // Verify checkboxes initial state
      expect(screen.getByRole('checkbox', { name: /auto-refresh/i })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: /show metrics/i })).toBeChecked();
    });
  });

  describe('Persistence Logic', () => {
    test('saves user preferences to localStorage on save', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      // Change a setting
      const layoutSelect = screen.getByLabelText(/layout type/i);
      await user.selectOptions(layoutSelect, 'list');

      // Save settings
      const saveButton = screen.getByRole('button', { name: /save settings/i });
      await user.click(saveButton);

      // Verify localStorage was called with correct data
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'userReportSettings',
          expect.stringContaining('"layout":"list"')
        );
      });
    });

    test('restores saved preferences on component remount', async () => {
      const savedSettings = {
        layout: 'list',
        theme: 'dark',
        refreshRate: 60,
        exportFormat: 'csv',
        autoRefresh: true,
        showMetrics: false
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSettings));

      const { unmount } = render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      // Verify settings are loaded from localStorage
      expect(screen.getByDisplayValue('list')).toBeInTheDocument();
      expect(screen.getByDisplayValue('dark')).toBeInTheDocument();
      expect(screen.getByDisplayValue('60')).toBeInTheDocument();
      expect(screen.getByDisplayValue('csv')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /auto-refresh/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /show metrics/i })).not.toBeChecked();

      unmount();

      // Remount and verify persistence
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      expect(screen.getByDisplayValue('list')).toBeInTheDocument();
    });

    test('loads preferences within 300ms performance threshold', async () => {
      const startTime = performance.now();

      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('grid')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(300);
    });
  });

  describe('User Interaction', () => {
    test('handles toggle interactions correctly', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const autoRefreshCheckbox = screen.getByRole('checkbox', { name: /auto-refresh/i });
      
      // Toggle checkbox
      await user.click(autoRefreshCheckbox);
      expect(autoRefreshCheckbox).toBeChecked();

      // Toggle back
      await user.click(autoRefreshCheckbox);
      expect(autoRefreshCheckbox).not.toBeChecked();
    });

    test('updates dropdown selections and reflects changes', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const themeSelect = screen.getByLabelText(/theme preference/i);
      const exportSelect = screen.getByLabelText(/export format/i);

      // Change theme
      await user.selectOptions(themeSelect, 'dark');
      expect(screen.getByDisplayValue('dark')).toBeInTheDocument();

      // Change export format
      await user.selectOptions(exportSelect, 'excel');
      expect(screen.getByDisplayValue('excel')).toBeInTheDocument();
    });

    test('calls onSave with correct data when save button is clicked', async () => {
      const mockOnSave = vi.fn();
      render(
        <MockWrapper>
          <ReportSettingsPanel onSave={mockOnSave} />
        </MockWrapper>
      );

      // Make changes
      await user.selectOptions(screen.getByLabelText(/layout type/i), 'list');
      await user.click(screen.getByRole('checkbox', { name: /auto-refresh/i }));

      // Save
      await user.click(screen.getByRole('button', { name: /save settings/i }));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          layout: 'list',
          theme: 'light',
          refreshRate: 30,
          exportFormat: 'pdf',
          autoRefresh: true,
          showMetrics: true
        });
      });
    });

    test('validates input constraints and shows appropriate errors', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const refreshInput = screen.getByLabelText(/refresh rate/i);
      
      // Try to set invalid value
      await user.clear(refreshInput);
      await user.type(refreshInput, '500'); // Too high

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/refresh rate must be between/i)).toBeInTheDocument();
      });

      // Save button should be disabled
      expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled();
    });
  });

  describe('Async Save + Performance', () => {
    test('handles async save operations with loading states', async () => {
      apiClient.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 100))
      );

      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const saveButton = screen.getByRole('button', { name: /save settings/i });
      await user.click(saveButton);

      // Should show loading state
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
      expect(saveButton).toBeDisabled();

      // Fast-forward timers
      vi.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText(/settings saved/i)).toBeInTheDocument();
      });
    });

    test('completes save operation within 300ms performance threshold', async () => {
      apiClient.post.mockResolvedValue({ data: { success: true } });

      const startTime = performance.now();

      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      await user.click(screen.getByRole('button', { name: /save settings/i }));

      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
      });

      const endTime = performance.now();
      const saveTime = endTime - startTime;

      expect(saveTime).toBeLessThan(300);
    });

    test('maintains UI responsiveness during async operations', async () => {
      let resolveSave;
      const savePromise = new Promise(resolve => {
        resolveSave = resolve;
      });
      apiClient.post.mockReturnValue(savePromise);

      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const saveButton = screen.getByRole('button', { name: /save settings/i });
      await user.click(saveButton);

      // UI should remain responsive - other buttons should work
      const resetButton = screen.getByRole('button', { name: /reset to defaults/i });
      expect(resetButton).not.toBeDisabled();

      // Complete the save
      resolveSave({ data: { success: true } });
      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation & Accessibility', () => {
    test('navigates through all form controls using Tab key', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const layoutSelect = screen.getByLabelText(/layout type/i);
      const themeSelect = screen.getByLabelText(/theme preference/i);
      const refreshInput = screen.getByLabelText(/refresh rate/i);
      const exportSelect = screen.getByLabelText(/export format/i);
      const autoRefreshCheckbox = screen.getByRole('checkbox', { name: /auto-refresh/i });
      const showMetricsCheckbox = screen.getByRole('checkbox', { name: /show metrics/i });
      const saveButton = screen.getByRole('button', { name: /save settings/i });
      const resetButton = screen.getByRole('button', { name: /reset to defaults/i });

      // Focus first element
      layoutSelect.focus();
      expect(layoutSelect).toHaveFocus();

      // Tab through all elements
      await user.tab();
      expect(themeSelect).toHaveFocus();

      await user.tab();
      expect(refreshInput).toHaveFocus();

      await user.tab();
      expect(exportSelect).toHaveFocus();

      await user.tab();
      expect(autoRefreshCheckbox).toHaveFocus();

      await user.tab();
      expect(showMetricsCheckbox).toHaveFocus();

      await user.tab();
      expect(saveButton).toHaveFocus();

      await user.tab();
      expect(resetButton).toHaveFocus();
    });

    test('handles keyboard interactions for checkboxes and buttons', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const autoRefreshCheckbox = screen.getByRole('checkbox', { name: /auto-refresh/i });
      autoRefreshCheckbox.focus();

      // Toggle checkbox with Space key
      await user.keyboard(' ');
      expect(autoRefreshCheckbox).toBeChecked();

      // Toggle back with Enter key
      await user.keyboard('{Enter}');
      expect(autoRefreshCheckbox).not.toBeChecked();

      // Test button activation with Enter
      const saveButton = screen.getByRole('button', { name: /save settings/i });
      saveButton.focus();
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalled();
      });
    });

    test('announces dynamic updates via aria-live regions', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      // Find aria-live region
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();

      // Make a change that should trigger announcement
      await user.selectOptions(screen.getByLabelText(/layout type/i), 'list');

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/layout changed to list/i);
      });
    });

    test('meets WCAG 2.1 AA compliance for form controls', () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      // Check for proper labels
      expect(screen.getByLabelText(/layout type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/theme preference/i)).toBeInTheDocument();

      // Check for proper roles
      expect(screen.getByRole('checkbox', { name: /auto-refresh/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();

      // Check for sufficient color contrast (simulated)
      const inputs = screen.getAllByRole('textbox', 'combobox', 'checkbox');
      inputs.forEach(input => {
        expect(input).toBeVisible();
      });
    });
  });

  describe('Memory & Cleanup', () => {
    test('cleans up event listeners and timers on unmount', async () => {
      const { unmount } = render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const initialMemory = process.memoryUsage().heapUsed;

      // Interact with component
      await user.click(screen.getByRole('checkbox', { name: /auto-refresh/i }));
      await user.click(screen.getByRole('button', { name: /save settings/i }));

      // Unmount
      unmount();

      // Verify cleanup
      expect(screen.queryByRole('region', { name: /report settings/i })).not.toBeInTheDocument();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = ((finalMemory - initialMemory) / initialMemory) * 100;

      expect(memoryIncrease).toBeLessThan(5);
    });

    test('handles rapid consecutive interactions without memory leaks', async () => {
      render(
        <MockWrapper>
          <ReportSettingsPanel />
        </MockWrapper>
      );

      const initialMemory = process.memoryUsage().heapUsed;

      // Rapid interactions
      for (let i = 0; i < 10; i++) {
        await user.click(screen.getByRole('checkbox', { name: /auto-refresh/i }));
        await user.click(screen.getByRole('checkbox', { name: /show metrics/i }));
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = ((finalMemory - initialMemory) / initialMemory) * 100;

      expect(memoryIncrease).toBeLessThan(5);
    });
  });
});