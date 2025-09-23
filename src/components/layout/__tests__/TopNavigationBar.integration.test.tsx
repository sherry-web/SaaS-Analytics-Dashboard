import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TopNavigationBar from '../TopNavigationBar';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">🔍</div>,
  Bell: () => <div data-testid="bell-icon">🔔</div>,
  User: () => <div data-testid="user-icon">👤</div>,
  Menu: () => <div data-testid="menu-icon">☰</div>,
  Sun: () => <div data-testid="sun-icon">☀️</div>,
  Moon: () => <div data-testid="moon-icon">🌙</div>,
  X: () => <div data-testid="close-icon">✕</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TopNavigationBar Integration', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('renders all navigation elements correctly', () => {
    render(<TopNavigationBar />);

    // Logo and brand
    expect(screen.getByText('DataSight Pro')).toBeInTheDocument();
    expect(screen.getByText('DS')).toBeInTheDocument();

    // Search functionality
    expect(screen.getByPlaceholderText('Search analytics, reports...')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();

    // Action buttons
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Notification badge
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('toggles theme mode correctly', async () => {
    render(<TopNavigationBar />);

    const themeButton = screen.getByLabelText(/switch to (dark|light) mode/i);
    
    // Initial state (light mode)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    // Toggle to dark mode
    fireEvent.click(themeButton);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('datasight-theme', 'dark');
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    // Toggle back to light mode
    fireEvent.click(themeButton);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('datasight-theme', 'light');
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });
  });

  test('handles user menu toggle correctly', () => {
    render(<TopNavigationBar />);

    const userButton = screen.getByLabelText('User menu');
    
    // Menu should be closed initially
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(userButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();

    // Close menu by clicking outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('supports keyboard navigation in user menu', () => {
    render(<TopNavigationBar />);

    const userButton = screen.getByLabelText('User menu');
    userButton.focus();

    // Open menu with Enter key
    fireEvent.keyDown(userButton, { key: 'Enter' });
    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Close menu with Escape key
    fireEvent.keyDown(userButton, { key: 'Escape' });
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();

    // Test ArrowDown navigation when menu is open
    fireEvent.keyDown(userButton, { key: 'Enter' }); // Reopen
    fireEvent.keyDown(userButton, { key: 'ArrowDown' });
    // First menu item should receive focus
  });

  test('handles search functionality', () => {
    render(<TopNavigationBar />);

    const searchInput = screen.getByPlaceholderText('Search analytics, reports...');
    
    // Type search query
    fireEvent.change(searchInput, { target: { value: 'revenue' } });
    expect(searchInput).toHaveValue('revenue');

    // Submit search form
    const searchForm = searchInput.closest('form');
    const submitEvent = new Event('submit', { bubbles: true });
    fireEvent(searchForm!, submitEvent);

    // Should prevent default and handle search
    expect(submitEvent.defaultPrevented).toBe(true);
  });

  test('toggles mobile menu correctly', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768 }); // Mobile size
    
    render(<TopNavigationBar />);

    const menuButton = screen.getByLabelText('Open menu');
    
    // Mobile menu should be closed initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Open mobile menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    // Close mobile menu
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('maintains accessibility standards', () => {
    render(<TopNavigationBar />);

    // Verify ARIA attributes
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();

    // User menu button should have proper attributes
    const userButton = screen.getByLabelText('User menu');
    expect(userButton).toHaveAttribute('aria-haspopup', 'true');
    expect(userButton).toHaveAttribute('aria-expanded', 'false');

    // Search input should be accessible
    const searchInput = screen.getByLabelText('Search dashboard');
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  test('handles click outside to close menus', () => {
    render(<TopNavigationBar />);

    // Open user menu
    const userButton = screen.getByLabelText('User menu');
    fireEvent.click(userButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Click outside should close menu
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('matches snapshot in desktop view', () => {
    const { container } = render(<TopNavigationBar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot with open user menu', () => {
    const { container } = render(<TopNavigationBar />);
    
    // Open menu before snapshot
    const userButton = screen.getByLabelText('User menu');
    fireEvent.click(userButton);

    expect(container.firstChild).toMatchSnapshot();
  });
});