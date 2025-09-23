import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  BarChart3: () => <div data-testid="bar-chart-icon">BarChart3</div>,
  FileText: () => <div data-testid="file-text-icon">FileText</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  ChevronDown: () => <div data-testid="chevron-down">↓</div>,
  ChevronRight: () => <div data-testid="chevron-right">→</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  Warehouse: () => <div data-testid="warehouse-icon">Warehouse</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SidebarNavigation Integration', () => {
  test('renders all navigation sections with correct structure', () => {
    renderWithRouter(
      <SidebarNavigation isCollapsed={false} />
    );

    // Verify main navigation structure
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('menubar')).toBeInTheDocument();

    // Verify navigation sections
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Warehouses')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Verify child items are visible when not collapsed
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Key Metrics')).toBeInTheDocument();
    expect(screen.getByText('Weekly Reports')).toBeInTheDocument();
  });

  test('handles section expansion/collapse correctly', () => {
    renderWithRouter(
      <SidebarNavigation isCollapsed={false} />
    );

    // Dashboard section should be expanded by default
    expect(screen.getByText('Overview')).toBeVisible();
    expect(screen.getByText('Key Metrics')).toBeVisible();

    // Collapse Dashboard section
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    fireEvent.click(dashboardButton!);

    // Child items should be hidden
    expect(screen.queryByText('Overview')).not.toBeVisible();
    expect(screen.queryByText('Key Metrics')).not.toBeVisible();

    // Expand again
    fireEvent.click(dashboardButton!);
    expect(screen.getByText('Overview')).toBeVisible();
  });

  test('supports keyboard navigation', () => {
    renderWithRouter(
      <SidebarNavigation isCollapsed={false} />
    );

    const dashboardButton = screen.getByText('Dashboard').closest('button');
    dashboardButton?.focus();

    // Test Enter key to toggle section
    fireEvent.keyDown(dashboardButton!, { key: 'Enter' });
    expect(screen.queryByText('Overview')).not.toBeVisible();

    fireEvent.keyDown(dashboardButton!, { key: 'Enter' });
    expect(screen.getByText('Overview')).toBeVisible();

    // Test Space key to toggle section
    fireEvent.keyDown(dashboardButton!, { key: ' ' });
    expect(screen.queryByText('Overview')).not.toBeVisible();

    // Test ArrowDown navigation
    fireEvent.keyDown(dashboardButton!, { key: 'ArrowDown' });
    // Should focus next item
  });

  test('handles collapsed state correctly', () => {
    renderWithRouter(
      <SidebarNavigation isCollapsed={true} />
    );

    // Logo icon should still be visible
    expect(screen.getByText('DS')).toBeInTheDocument();

    // Text labels should be hidden in collapsed state
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('DataSight Pro')).not.toBeInTheDocument();

    // Icons should still be visible
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  test('maintains accessibility with ARIA attributes', () => {
    renderWithRouter(
      <SidebarNavigation isCollapsed={false} />
    );

    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveAttribute('aria-label', 'Main navigation');

    // Menu items should have proper roles
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);

    // Expandable items should have aria-expanded
    const dashboardItem = screen.getByText('Dashboard').closest('button');
    expect(dashboardItem).toHaveAttribute('aria-expanded', 'true');
  });

  test('handles mobile close callback', () => {
    const mockOnMobileClose = jest.fn();
    
    renderWithRouter(
      <SidebarNavigation 
        isCollapsed={false}
        onMobileClose={mockOnMobileClose}
      />
    );

    // Click on a navigation item should trigger mobile close
    const overviewItem = screen.getByText('Overview').closest('button');
    fireEvent.click(overviewItem!);

    expect(mockOnMobileClose).toHaveBeenCalledTimes(1);
  });

  test('highlights active item correctly', () => {
    renderWithRouter(
      <SidebarNavigation isCollapsed={false} />
    );

    // Initially no item should be active
    const overviewButton = screen.getByText('Overview').closest('button');
    expect(overviewButton).not.toHaveClass('sidebar-nav-button--active');

    // Click to activate
    fireEvent.click(overviewButton!);
    expect(overviewButton).toHaveClass('sidebar-nav-button--active');
  });

  test('matches snapshot in expanded state', () => {
    const { container } = renderWithRouter(
      <SidebarNavigation isCollapsed={false} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot in collapsed state', () => {
    const { container } = renderWithRouter(
      <SidebarNavigation isCollapsed={true} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});