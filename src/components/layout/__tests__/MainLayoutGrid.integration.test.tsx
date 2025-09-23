import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainLayoutGrid from '../MainLayoutGrid';
import SidebarNavigation from '../SidebarNavigation';
import TopNavigationBar from '../TopNavigationBar';

// Mock child components
const MockDashboardContent = () => (
  <div data-testid="dashboard-content">
    <h1>Dashboard Overview</h1>
    <div>Key metrics and charts</div>
  </div>
);

const MockOverlayContent = () => (
  <div data-testid="overlay-content">
    <h2>Contextual Information</h2>
    <p>Additional details and actions</p>
  </div>
);

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

describe('MainLayoutGrid Integration', () => {
  beforeEach(() => {
    // Mock window innerWidth for responsive testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200, // Desktop size
    });
  });

  test('renders complete layout structure with all children', () => {
    render(
      <MainLayoutGrid>
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    // Verify main layout structure
    expect(screen.getByRole('application')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content

    // Verify child content is rendered
    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
  });

  test('applies correct grid template areas for desktop layout', () => {
    const { container } = render(
      <MainLayoutGrid>
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    const layoutGrid = container.querySelector('.main-layout-grid');
    expect(layoutGrid).toHaveStyle({
      display: 'grid',
      gridTemplateAreas: '"header header header" "sidebar main overlay"'
    });
  });

  test('handles overlay visibility toggle correctly', async () => {
    const mockOnOverlayToggle = jest.fn();
    
    render(
      <MainLayoutGrid 
        overlay={<MockOverlayContent />}
        showOverlay={false}
        onOverlayToggle={mockOnOverlayToggle}
      >
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    // Overlay should not be visible initially
    expect(screen.queryByTestId('overlay-content')).not.toBeInTheDocument();

    // Re-render with overlay visible
    const { rerender } = render(
      <MainLayoutGrid 
        overlay={<MockOverlayContent />}
        showOverlay={true}
        onOverlayToggle={mockOnOverlayToggle}
      >
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    expect(screen.getByTestId('overlay-content')).toBeInTheDocument();
    expect(screen.getByText('Contextual Information')).toBeInTheDocument();
  });

  test('maintains accessibility structure with ARIA landmarks', () => {
    render(
      <MainLayoutGrid>
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    // Verify ARIA landmarks and labels
    expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'DataSight Pro Analytics Dashboard');
    expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Main navigation');
    expect(screen.getByRole('complementary', { name: 'Main navigation sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Dashboard content');
  });

  test('handles minimal children content', () => {
    // Fixed: Always provide children as required by MainLayoutGridProps
    render(
      <MainLayoutGrid>
        <div>Minimal content</div>
      </MainLayoutGrid>
    );

    // Layout should render without errors
    expect(screen.getByRole('application')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Main content area should contain the minimal content
    expect(screen.getByText('Minimal content')).toBeInTheDocument();
  });

  test('responds to window resize events', async () => {
    const { container } = render(
      <MainLayoutGrid>
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    // Initial desktop layout
    expect(container.querySelector('.main-layout-grid')).toHaveStyle({
      gridTemplateAreas: '"header header header" "sidebar main overlay"'
    });

    // Simulate mobile resize
    Object.defineProperty(window, 'innerWidth', { value: 768 });
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      expect(container.querySelector('.main-layout-grid')).toHaveStyle({
        gridTemplateAreas: '"header header" "main main"'
      });
    });
  });

  test('matches snapshot with complete layout', () => {
    const { container } = render(
      <MainLayoutGrid 
        className="test-layout"
        overlay={<MockOverlayContent />}
        showOverlay={true}
      >
        <MockDashboardContent />
      </MainLayoutGrid>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot with minimal configuration', () => {
    const { container } = render(
      <MainLayoutGrid>
        <div>Minimal content</div>
      </MainLayoutGrid>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});