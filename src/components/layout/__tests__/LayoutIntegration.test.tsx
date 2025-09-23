import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayoutGrid from '../MainLayoutGrid';
import SidebarNavigation from '../SidebarNavigation';
import TopNavigationBar from '../TopNavigationBar';

// Mock child components
const MockDashboard = () => <div data-testid="dashboard-page">Dashboard Page</div>;
const MockReports = () => <div data-testid="reports-page">Reports Page</div>;

// Mock icons
jest.mock('lucide-react', () => ({
  BarChart3: () => <div>BarChart3</div>,
  FileText: () => <div>FileText</div>,
  Settings: () => <div>Settings</div>,
  ChevronDown: () => <div>↓</div>,
  ChevronRight: () => <div>→</div>,
  Home: () => <div>Home</div>,
  TrendingUp: () => <div>TrendingUp</div>,
  Warehouse: () => <div>Warehouse</div>,
  Search: () => <div>🔍</div>,
  Bell: () => <div>🔔</div>,
  User: () => <div>👤</div>,
  Menu: () => <div>☰</div>,
  Sun: () => <div>☀️</div>,
  Moon: () => <div>🌙</div>,
  X: () => <div>✕</div>,
}));

const renderIntegratedLayout = (initialRoute = '/dashboard') => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={
          <MainLayoutGrid>
            <MockDashboard />
          </MainLayoutGrid>
        } />
        <Route path="/reports" element={
          <MainLayoutGrid>
            <MockReports />
          </MainLayoutGrid>
        } />
      </Routes>
    </BrowserRouter>
  );
};

describe('Layout Integration - Complete Dashboard Flow', () => {
  test('renders complete dashboard layout with all components', () => {
    renderIntegratedLayout();

    // Verify all layout components are present
    expect(screen.getByRole('application')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content

    // Verify navigation components
    expect(screen.getByText('DataSight Pro')).toBeInTheDocument(); // TopNav logo
    expect(screen.getByText('Dashboard')).toBeInTheDocument(); // Sidebar nav
    expect(screen.getByText('Reports')).toBeInTheDocument();

    // Verify main content
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  test('navigates between routes using sidebar', async () => {
    renderIntegratedLayout();

    // Initially on dashboard
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.queryByTestId('reports-page')).not.toBeInTheDocument();

    // Click on Reports in sidebar
    const reportsLink = screen.getByText('Weekly Reports'); // Child of Reports section
    fireEvent.click(reportsLink);

    // Should navigate to reports page
    await waitFor(() => {
      expect(screen.getByTestId('reports-page')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });
  });

  test('maintains responsive layout on window resize', async () => {
    const { container } = renderIntegratedLayout();

    // Initial desktop layout
    expect(container.querySelector('.main-layout-grid')).toHaveStyle({
      gridTemplateAreas: '"header header header" "sidebar main overlay"'
    });

    // Resize to mobile
    Object.defineProperty(window, 'innerWidth', { value: 768 });
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      expect(container.querySelector('.main-layout-grid')).toHaveStyle({
        gridTemplateAreas: '"header header" "main main"'
      });
    });
  });

  test('handles theme toggle across all components', async () => {
    renderIntegratedLayout();

    const themeButton = screen.getByLabelText(/switch to dark mode/i);
    
    // Toggle theme
    fireEvent.click(themeButton);

    await waitFor(() => {
      // Layout should have dark class
      expect(document.documentElement).toHaveClass('dark');
    });

    // Toggle back
    fireEvent.click(themeButton);
    
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark');
    });
  });

  test('maintains accessibility throughout user interactions', () => {
    renderIntegratedLayout();

    // Verify initial ARIA attributes
    expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'DataSight Pro Analytics Dashboard');
    expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Main navigation');
    
    // Test keyboard navigation in sidebar
    const dashboardSection = screen.getByText('Dashboard').closest('button');
    dashboardSection?.focus();
    
    fireEvent.keyDown(dashboardSection!, { key: 'Enter' });
    expect(dashboardSection).toHaveAttribute('aria-expanded', 'false'); // Should collapse
  });

  test('handles mobile menu interactions correctly', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768 }); // Mobile size
    renderIntegratedLayout();

    // Mobile menu button should be visible
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();

    // Open mobile menu
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    // Sidebar should be accessible via mobile menu
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('produces no console errors during navigation', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderIntegratedLayout();

    // Perform various interactions
    const reportsLink = screen.getByText('Weekly Reports');
    fireEvent.click(reportsLink);

    const themeButton = screen.getByLabelText(/switch to dark mode/i);
    fireEvent.click(themeButton);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('matches complete layout snapshot', () => {
    const { container } = renderIntegratedLayout();
    expect(container.firstChild).toMatchSnapshot();
  });
});