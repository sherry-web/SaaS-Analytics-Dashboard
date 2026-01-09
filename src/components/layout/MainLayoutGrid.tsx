import React, { useState, useEffect } from 'react';
import SidebarNavigation from './SidebarNavigation';
import TopNavigationBar from './TopNavigationBar';
import '../Dashboard/styles/MainLayout.css';

interface MainLayoutGridProps {
  children: React.ReactNode;
  className?: string;
  /** Optional contextual overlay component (right sidebar) */
  overlay?: React.ReactNode;
  /** Whether the overlay is currently visible */
  showOverlay?: boolean;
  /** Callback when overlay visibility changes */
  onOverlayToggle?: (visible: boolean) => void;
  /** Grid density for dashboard widgets */
  gridDensity?: 'compact' | 'comfortable' | 'spacious';
  /** Maximum grid columns (auto-adjusted by breakpoint) */
  maxColumns?: number;
}

/**
 * Main layout grid component that coordinates the overall application structure
 * Provides responsive 3-part grid with sidebar, main content, and optional overlay
 */
const MainLayoutGrid: React.FC<MainLayoutGridProps> = ({
  children,
  className = '',
  overlay,
  showOverlay = false,
  onOverlayToggle,
  gridDensity = 'comfortable',
  maxColumns = 4
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleOverlayToggle = () => {
    if (onOverlayToggle) {
      onOverlayToggle(!showOverlay);
    }
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
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

  // Create a custom hamburger menu button for mobile
  const MobileMenuButton = () => (
    <button
      className="mobile-menu-button"
      onClick={handleSidebarToggle}
      aria-label="Toggle sidebar menu"
      aria-expanded={isMobileSidebarOpen}
      aria-controls="main-sidebar"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {isMobileSidebarOpen ? (
          <path d="M18 6L6 18M6 6l12 12" />
        ) : (
          <path d="M3 12h18M3 6h18M3 18h18" />
        )}
      </svg>
    </button>
  );

  return (
    <div 
      className={`main-layout-grid ${className} ${getGridDensityClass()} ${
        isSidebarCollapsed ? 'sidebar-collapsed' : ''
      } ${showOverlay ? 'overlay-visible' : ''} ${
        isMobile ? 'viewport-mobile' : 
        isTablet ? 'viewport-tablet' :
        isDesktop ? 'viewport-desktop' : 'viewport-large'
      }`}
      role="application"
      aria-label="DataSight Pro Analytics Dashboard"
      data-grid-columns={maxColumns}
    >
      {/* Top Navigation Bar */}
      <header 
        className="main-layout-header"
        role="banner"
        aria-label="Main navigation"
      >
        <div className="header-content-wrapper">
          {isMobile && <MobileMenuButton />}
          <TopNavigationBar />
          {overlay && (
            <button
              className="overlay-header-toggle"
              onClick={handleOverlayToggle}
              aria-label={showOverlay ? 'Close overlay' : 'Open overlay'}
              aria-expanded={showOverlay}
              aria-controls="contextual-overlay"
            >
              {showOverlay ? (
                <span aria-hidden="true">×</span>
              ) : (
                <span aria-hidden="true">☰</span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`main-layout-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''} ${
          isSidebarCollapsed ? 'collapsed-state' : 'expanded-state'
        }`}
        role="complementary"
        id="main-sidebar"
        aria-label="Main navigation sidebar"
        aria-expanded={!isMobile || isMobileSidebarOpen}
      >
        <SidebarNavigation 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={isMobile ? undefined : handleSidebarToggle}
        />
        {isMobile && (
          <button
            className="sidebar-close-button"
            onClick={handleMobileSidebarClose}
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </aside>

      {/* Main Content Area */}
      <main 
        className="main-layout-content"
        role="main"
        aria-label="Dashboard content"
        data-testid="dashboard-content"
      >
        <div className="main-content-container">
          {/* Grid Container for Dashboard Widgets */}
          <div className="dashboard-widget-grid" role="grid" aria-label="Dashboard widgets">
            {React.Children.map(children, (child, index) => (
              <div 
                className="widget-slot"
                role="gridcell"
                aria-label={`Widget ${index + 1}`}
                data-widget-index={index}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Optional Contextual Overlay */}
      {overlay && (
        <aside 
          className={`main-layout-overlay ${showOverlay ? 'visible' : ''}`}
          role="complementary"
          id="contextual-overlay"
          aria-label="Contextual information"
          aria-hidden={!showOverlay}
          data-testid="contextual-overlay"
        >
          <div className="overlay-content">
            {overlay}
          </div>
          <button
            className="overlay-toggle-button"
            onClick={handleOverlayToggle}
            aria-label={showOverlay ? 'Close overlay' : 'Open overlay'}
            aria-expanded={showOverlay}
            aria-controls="contextual-overlay"
          >
            {showOverlay ? (
              <span aria-hidden="true">←</span>
            ) : (
              <span aria-hidden="true">→</span>
            )}
          </button>
        </aside>
      )}

      {/* Mobile Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop"
          onClick={handleMobileSidebarClose}
          onKeyDown={(e) => e.key === 'Escape' && handleMobileSidebarClose()}
          aria-hidden="true"
          role="presentation"
          tabIndex={-1}
          data-testid="mobile-backdrop"
        />
      )}

      {/* Screen Reader Status Updates */}
      <div className="sr-only" role="status" aria-live="polite">
        {isMobile ? 'Mobile viewport active' : 
         isTablet ? 'Tablet viewport active' : 
         isDesktop ? 'Desktop viewport active' : 'Large screen viewport active'}
        {isSidebarCollapsed && !isMobile && ', Sidebar collapsed'}
        {isMobileSidebarOpen && ', Mobile sidebar open'}
      </div>
    </div>
  );
};

export default MainLayoutGrid;