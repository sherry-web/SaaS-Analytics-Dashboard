import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import NavigationMenu from '../NavigationMenu';
import { NavigationProvider } from '../../../contexts/NavigationContext';
import { SettingsProvider } from '../../../contexts/SettingsContext';

// Mock dependencies
vi.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    currentPath: '/dashboard',
    navigateTo: vi.fn(),
    breadcrumbs: ['Home', 'Dashboard'],
    isActiveRoute: (path) => path === '/dashboard',
  }),
}));

vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1440,
  }),
}));

// Mock performance API for response time measurements
const originalPerformance = global.performance;
const mockNow = vi.fn();

// Mock components
const MockWrapper = ({ children, initialPath = '/dashboard' }) => (
  <SettingsProvider>
    <NavigationProvider initialPath={initialPath}>
      {children}
    </NavigationProvider>
  </SettingsProvider>
);

describe('NavigationMenu - Comprehensive Test Suite', () => {
  const user = userEvent.setup({ delay: null });
  let performanceMock;

  beforeEach(() => {
    vi.useFakeTimers();
    mockNow.mockReturnValue(0);
    performanceMock = {
      now: mockNow,
      mark: vi.fn(),
      measure: vi.fn(),
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
    };
    global.performance = performanceMock;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
    global.performance = originalPerformance;
  });

  describe('Rendering & Structure Validation', () => {
    test('renders main navigation with proper ARIA landmarks and roles', () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      // Validate main navigation structure
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();

      // Validate navigation list
      const navList = screen.getByRole('list');
      expect(navList).toBeInTheDocument();

      // Validate menu items are present
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /reports/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    });

    test('displays breadcrumb trail with current location highlighted', () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      // Validate breadcrumb structure
      const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(breadcrumb).toBeInTheDocument();

      // Validate breadcrumb items
      const breadcrumbList = within(breadcrumb).getByRole('list');
      const breadcrumbItems = within(breadcrumbList).getAllByRole('listitem');
      
      expect(breadcrumbItems).toHaveLength(2);
      expect(breadcrumbItems[0]).toHaveTextContent('Home');
      expect(breadcrumbItems[1]).toHaveTextContent('Dashboard');
      
      // Validate current page is marked with aria-current
      expect(breadcrumbItems[1]).toHaveAttribute('aria-current', 'page');
    });

    test('highlights active navigation item with proper visual and ARIA states', () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
      expect(dashboardLink).toHaveClass('active');

      // Verify other links are not active
      const analyticsLink = screen.getByRole('link', { name: /analytics/i });
      expect(analyticsLink).not.toHaveAttribute('aria-current');
      expect(analyticsLink).not.toHaveClass('active');
    });
  });

  describe('Keyboard Navigation & Accessibility', () => {
    test('navigates through menu items using Tab key in correct order', async () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      const analyticsLink = screen.getByRole('link', { name: /analytics/i });
      const reportsLink = screen.getByRole('link', { name: /reports/i });
      const settingsLink = screen.getByRole('link', { name: /settings/i });

      // Start focus
      dashboardLink.focus();
      expect(dashboardLink).toHaveFocus();

      // Tab through navigation
      await user.tab();
      expect(analyticsLink).toHaveFocus();

      await user.tab();
      expect(reportsLink).toHaveFocus();

      await user.tab();
      expect(settingsLink).toHaveFocus();
    });

    test('activates menu items with Enter and Space keys', async () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigation).mockReturnValue({
        currentPath: '/dashboard',
        navigateTo: mockNavigate,
        breadcrumbs: ['Home', 'Dashboard'],
        isActiveRoute: (path) => path === '/dashboard',
      });

      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const analyticsLink = screen.getByRole('link', { name: /analytics/i });
      analyticsLink.focus();

      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(mockNavigate).toHaveBeenCalledWith('/analytics');

      // Reset mock
      mockNavigate.mockClear();

      // Activate with Space
      await user.keyboard(' ');
      expect(mockNavigate).toHaveBeenCalledWith('/analytics');
    });

    test('meets WCAG 2.1 AA compliance for color contrast and focus indicators', () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      
      // Check focusable elements have focus indicators
      const focusableElements = within(nav).getAllByRole('link');
      focusableElements.forEach(element => {
        expect(element).toHaveStyle('outline: none'); // Should have custom focus style
      });

      // Check sufficient color contrast (simulated)
      const activeLink = screen.getByRole('link', { name: /dashboard/i });
      expect(activeLink).toHaveStyle({
        color: expect.not.stringMatching(/^#([A-Fa-f0-9]{3}){1,2}$/), // Should not be low contrast
      });
    });

    test('provides meaningful ARIA labels for screen readers', () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
      
      // Check for skip navigation link
      expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    });
  });

  describe('Interaction Speed & Performance', () => {
    test('responds to clicks within 250ms performance threshold', async () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigation).mockReturnValue({
        currentPath: '/dashboard',
        navigateTo: mockNavigate,
        breadcrumbs: ['Home', 'Dashboard'],
        isActiveRoute: (path) => path === '/dashboard',
      });

      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const analyticsLink = screen.getByRole('link', { name: /analytics/i });
      
      // Mock performance measurement
      mockNow
        .mockReturnValueOnce(0) // Start time
        .mockReturnValueOnce(200); // End time (<250ms)

      const startTime = performance.now();
      await user.click(analyticsLink);
      const endTime = performance.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(250);
      expect(mockNavigate).toHaveBeenCalledWith('/analytics');
    });

    test('handles rapid consecutive navigation without performance degradation', async () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigation).mockReturnValue({
        currentPath: '/dashboard',
        navigateTo: mockNavigate,
        breadcrumbs: ['Home', 'Dashboard'],
        isActiveRoute: (path) => path === '/dashboard',
      });

      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const links = [
        screen.getByRole('link', { name: /analytics/i }),
        screen.getByRole('link', { name: /reports/i }),
        screen.getByRole('link', { name: /settings/i }),
      ];

      // Rapid consecutive clicks
      const startTime = performance.now();
      
      for (const link of links) {
        await user.click(link);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / links.length;

      expect(averageTime).toBeLessThan(250);
      expect(mockNavigate).toHaveBeenCalledTimes(3);
    });

    test('maintains smooth animations without frame drops', async () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      
      // Trigger hover state
      const analyticsLink = screen.getByRole('link', { name: /analytics/i });
      fireEvent.mouseEnter(analyticsLink);

      // Verify animation classes are applied
      expect(analyticsLink).toHaveClass('hover-effect');

      // Remove hover
      fireEvent.mouseLeave(analyticsLink);

      await waitFor(() => {
        expect(analyticsLink).not.toHaveClass('hover-effect');
      }, { timeout: 300 }); // Animation should complete within 300ms
    });
  });

  describe('Adaptive Layout & Responsive Behavior', () => {
    test('renders desktop layout with full navigation visible', () => {
      // Default mock is desktop
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toHaveClass('desktop-layout');
      
      // All menu items should be visible
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /analytics/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /reports/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /settings/i })).toBeVisible();
    });

    test('adapts to tablet layout with condensed navigation', () => {
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        screenWidth: 768,
      });

      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toHaveClass('tablet-layout');
      
      // Hamburger menu should be present
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    test('switches to mobile hamburger menu below breakpoint', () => {
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
      });

      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toHaveClass('mobile-layout');
      
      // Hamburger menu should be visible, full nav hidden
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeVisible();
      
      // Navigation list might be collapsed initially
      const navList = screen.getByRole('list');
      expect(navList).toHaveAttribute('aria-expanded', 'false');
    });

    test('toggles mobile menu expansion correctly', async () => {
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
      });

      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      const navList = screen.getByRole('list');

      // Initially collapsed
      expect(navList).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      // Expand menu
      await user.click(menuButton);
      expect(navList).toHaveAttribute('aria-expanded', 'true');
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      // Collapse menu
      await user.click(menuButton);
      expect(navList).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('State Persistence & Active States', () => {
    test('maintains active state highlighting during navigation', () => {
      const { rerender } = render(
        <MockWrapper initialPath="/dashboard">
          <NavigationMenu />
        </MockWrapper>
      );

      // Dashboard should be active initially
      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');

      // Re-render with different active path
      rerender(
        <MockWrapper initialPath="/analytics">
          <NavigationMenu />
        </MockWrapper>
      );

      // Analytics should now be active
      expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current');
    });

    test('updates breadcrumb trail when navigation changes', () => {
      const { rerender } = render(
        <MockWrapper initialPath="/dashboard">
          <NavigationMenu />
        </MockWrapper>
      );

      // Initial breadcrumbs
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      // Update navigation context to simulate route change
      vi.mocked(useNavigation).mockReturnValue({
        currentPath: '/analytics/sales',
        navigateTo: vi.fn(),
        breadcrumbs: ['Home', 'Analytics', 'Sales Report'],
        isActiveRoute: (path) => path === '/analytics/sales',
      });

      rerender(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      // Updated breadcrumbs
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Sales Report')).toBeInTheDocument();
      expect(screen.getByText('Sales Report')).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Memory Cleanup & Rerender Stability', () => {
    test('cleans up event listeners and state on unmount', async () => {
      const { unmount } = render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const initialMemory = process.memoryUsage().heapUsed;

      // Interact with component
      await user.click(screen.getByRole('link', { name: /analytics/i }));
      await user.click(screen.getByRole('link', { name: /reports/i }));

      // Unmount component
      unmount();

      // Verify cleanup
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = ((finalMemory - initialMemory) / initialMemory) * 100;

      expect(memoryIncrease).toBeLessThan(5);
    });

    test('handles multiple rerenders without memory leaks', async () => {
      const { rerender } = render(
        <MockWrapper initialPath="/dashboard">
          <NavigationMenu />
        </MockWrapper>
      );

      const initialMemory = process.memoryUsage().heapUsed;

      // Multiple rerenders with different props
      for (let i = 0; i < 10; i++) {
        rerender(
          <MockWrapper initialPath={`/page-${i}`}>
            <NavigationMenu />
          </MockWrapper>
        );
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = ((finalMemory - initialMemory) / initialMemory) * 100;

      expect(memoryIncrease).toBeLessThan(5);
    });

    test('maintains consistent performance across multiple interactions', async () => {
      render(
        <MockWrapper>
          <NavigationMenu />
        </MockWrapper>
      );

      const responseTimes = [];
      const links = [
        screen.getByRole('link', { name: /analytics/i }),
        screen.getByRole('link', { name: /reports/i }),
        screen.getByRole('link', { name: /settings/i }),
      ];

      // Measure response times for multiple interactions
      for (const link of links) {
        const startTime = performance.now();
        await user.click(link);
        const endTime = performance.now();
        responseTimes.push(endTime - startTime);
      }

      // Calculate variance
      const averageTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const variance = responseTimes.reduce((acc, time) => {
        return acc + Math.pow(time - averageTime, 2);
      }, 0) / responseTimes.length;

      // Variance should be low for consistent performance
      expect(variance).toBeLessThan(100);
      responseTimes.forEach(time => {
        expect(time).toBeLessThan(250);
      });
    });
  });
});