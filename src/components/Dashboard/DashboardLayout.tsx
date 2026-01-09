import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  /** Grid density for dashboard widgets */
  gridDensity?: 'compact' | 'comfortable' | 'spacious';
  /** Maximum grid columns (auto-adjusted by breakpoint) */
  maxColumns?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  gridDensity = 'comfortable',
  maxColumns = 4 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileSidebarBackdropRef = useRef<HTMLDivElement>(null);

  // Detect responsive breakpoints
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1025);
      setIsDesktop(width >= 1025 && width < 1440);
      setIsLargeScreen(width >= 1440);
      
      if (width >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    if (isMobileSidebarOpen && sidebarRef.current) {
      // When mobile sidebar opens, focus first navigation item
      const firstNavItem = sidebarRef.current.querySelector('a.nav-item');
      if (firstNavItem instanceof HTMLElement) {
        firstNavItem.focus();
      }
    }
  }, [isMobileSidebarOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
    // Return focus to sidebar toggle button
    const sidebarToggle = document.querySelector('.sidebar-toggle') as HTMLElement;
    if (sidebarToggle) {
      sidebarToggle.focus();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isMobileSidebarOpen) {
        handleMobileSidebarClose();
      }
    }
  };

  // Determine grid class based on density
  const getGridDensityClass = () => {
    switch (gridDensity) {
      case 'compact':
        return 'grid-density-compact';
      case 'spacious':
        return 'grid-density-spacious';
      default:
        return 'grid-density-comfortable';
    }
  };

  // Get viewport class for responsive grid
  const getViewportClass = () => {
    if (isMobile) return 'viewport-mobile';
    if (isTablet) return 'viewport-tablet';
    if (isDesktop) return 'viewport-desktop';
    return 'viewport-large';
  };

  return (
    <div 
      className="dashboard-layout" 
      role="application" 
      aria-label="DataSight Pro Dashboard"
      onKeyDown={handleEscapeKey}
    >
      <header className="dashboard-header" role="banner" aria-label="Dashboard navigation">
        <div className="header-content">
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed || isMobileSidebarOpen ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed && !isMobileSidebarOpen}
            aria-controls="main-sidebar"
            aria-haspopup={isMobile}
            data-testid="sidebar-toggle"
          >
            {sidebarCollapsed || isMobileSidebarOpen ? '☰' : '✕'}
          </button>
          <h1 className="dashboard-title">DataSight Pro Dashboard</h1>
          <div className="user-profile" role="button" aria-label="User profile menu" tabIndex={0}>
            User Profile
          </div>
        </div>
      </header>
      
      <div className="dashboard-body">
        <aside 
          ref={sidebarRef}
          className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`} 
          id="main-sidebar"
          role="navigation" // Changed from complementary to navigation for better semantics
          aria-label="Main navigation"
          aria-hidden={isMobile && !isMobileSidebarOpen}
          data-testid="main-sidebar"
        >
          <nav className="sidebar-nav" aria-label="Primary navigation">
            <ul role="menu">
              <li role="none"><a href="#overview" className="nav-item active" role="menuitem" tabIndex={0}>Overview</a></li>
              <li role="none"><a href="#analytics" className="nav-item" role="menuitem" tabIndex={0}>Analytics</a></li>
              <li role="none"><a href="#reports" className="nav-item" role="menuitem" tabIndex={0}>Reports</a></li>
              <li role="none"><a href="#settings" className="nav-item" role="menuitem" tabIndex={0}>Settings</a></li>
              <li role="none"><a href="#help" className="nav-item" role="menuitem" tabIndex={0}>Help & Support</a></li>
            </ul>
          </nav>
        </aside>
        
        <main 
          className="dashboard-main" 
          role="main" 
          aria-label="Dashboard content"
          id="main-content"
          tabIndex={-1}
        >
          <div className={`main-content ${getGridDensityClass()} ${getViewportClass()}`}>
            {/* Widget Grid Container */}
            <div 
              className="dashboard-widget-grid" 
              role="grid" 
              aria-label="Dashboard widgets"
              aria-describedby="widget-grid-description"
            >
              <div id="widget-grid-description" className="sr-only">
                Interactive dashboard widgets showing key metrics and analytics. Use arrow keys to navigate between widgets.
              </div>
              {React.Children.map(children, (child, index) => (
                <div 
                  className="widget-slot"
                  role="gridcell"
                  aria-label={`Widget ${index + 1}`}
                  data-widget-index={index}
                  tabIndex={0}
                  aria-roledescription="widget"
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          ref={mobileSidebarBackdropRef}
          className="mobile-sidebar-backdrop"
          onClick={handleMobileSidebarClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              handleMobileSidebarClose();
            }
          }}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
          data-testid="sidebar-backdrop"
        />
      )}

      {/* Screen Reader Status Updates */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isMobile ? 'Mobile viewport active' : 
         isTablet ? 'Tablet viewport active' : 
         isDesktop ? 'Desktop viewport active' : 'Large screen viewport active'}
        {sidebarCollapsed && !isMobile && ', Sidebar collapsed'}
        {isMobileSidebarOpen && ', Mobile sidebar open'}
      </div>

      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
    </div>
  );
};

export default DashboardLayout;