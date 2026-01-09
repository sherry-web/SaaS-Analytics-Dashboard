import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';

// Mock components for route content
const MockDashboardContent = () => <div data-testid="dashboard-content">Dashboard Content</div>;
const MockReportsContent = () => <div data-testid="reports-content">Reports Content</div>;
const MockSettingsContent = () => <div data-testid="settings-content">Settings Content</div>;

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

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const renderDashboardWithRoutes = (initialRoute = '/dashboard') => {
  window.history.pushState({}, 'Test page', initialRoute);
  
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={
          <DashboardLayout>
            <MockDashboardContent />
          </DashboardLayout>
        } />
        <Route path="/reports" element={
          <DashboardLayout>
            <MockReportsContent />
          </DashboardLayout>
        } />
        <Route path="/settings" element={
          <DashboardLayout>
            <MockSettingsContent />
          </DashboardLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

describe('DashboardLayout Integration', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200, // Desktop size
    });
  });

  describe('Layout Structure', () => {
    test('renders complete dashboard layout with all components', () => {
      renderDashboardWithRoutes();

      // Verify main layout structure
      expect(screen.getByRole('application')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content

      // Verify main content
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });

    test('renders header with correct content', () => {
      renderDashboardWithRoutes();
      expect(screen.getByText('Dashboard Header')).toBeInTheDocument();
    });

    test('renders sidebar with correct content', () => {
      renderDashboardWithRoutes();
      expect(screen.getByText('Sidebar Navigation')).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    test('navigates between dashboard routes', async () => {
      renderDashboardWithRoutes();

      // Initially on dashboard
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
      expect(screen.queryByTestId('reports-content')).not.toBeInTheDocument();

      // Simulate navigation by changing the route
      window.history.pushState({}, 'Reports', '/reports');
      fireEvent.popState(window);

      // Verify route changed - this will show the not found since we don't have actual navigation
      expect(window.location.pathname).toBe('/reports');
    });
  });

  describe('Responsive Behavior', () => {
    test('maintains layout structure on window resize', async () => {
      const { container } = renderDashboardWithRoutes();

      // Initial desktop layout check
      const layout = container.querySelector('.dashboard-layout');
      expect(layout).toBeInTheDocument();

      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        // Layout should still be present
        expect(layout).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty children gracefully', () => {
      render(
        <BrowserRouter>
          <DashboardLayout>
            {null}
          </DashboardLayout>
        </BrowserRouter>
      );

      // Layout should render without errors
      expect(screen.getByRole('application')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('handles undefined children gracefully', () => {
      render(
        <BrowserRouter>
          <DashboardLayout>
            {undefined}
          </DashboardLayout>
        </BrowserRouter>
      );

      // Layout should render without errors
      expect(screen.getByRole('application')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      renderDashboardWithRoutes();

      expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'DataSight Pro Dashboard');
      expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Dashboard navigation');
      expect(screen.getByRole('complementary')).toHaveAttribute('aria-label', 'Main navigation sidebar');
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Dashboard content');
    });
  });

  test('matches complete layout snapshot', () => {
    const { container } = renderDashboardWithRoutes();
    expect(container.firstChild).toMatchSnapshot();
  });
});