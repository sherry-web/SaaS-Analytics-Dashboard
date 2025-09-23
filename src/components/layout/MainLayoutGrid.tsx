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
  onOverlayToggle
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  return (
    <div 
      className={`main-layout-grid ${className} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${showOverlay ? 'overlay-visible' : ''}`}
      role="application"
      aria-label="DataSight Pro Analytics Dashboard"
    >
      {/* Top Navigation Bar */}
      <header 
        className="main-layout-header"
        role="banner"
        aria-label="Main navigation"
      >
        <TopNavigationBar />
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`main-layout-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
        role="complementary"
        aria-label="Main navigation sidebar"
        aria-expanded={!isMobile || isMobileSidebarOpen}
      >
        <SidebarNavigation 
          onMobileClose={handleMobileSidebarClose}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
      </aside>

      {/* Main Content Area */}
      <main 
        className="main-layout-content"
        role="main"
        aria-label="Dashboard content"
      >
        <div className="main-content-container">
          {children}
        </div>
      </main>

      {/* Optional Contextual Overlay */}
      {overlay && (
        <aside 
          className={`main-layout-overlay ${showOverlay ? 'visible' : ''}`}
          role="complementary"
          aria-label="Contextual information"
          aria-hidden={!showOverlay}
        >
          <div className="overlay-content">
            {overlay}
          </div>
          <button
            className="overlay-toggle-button"
            onClick={handleOverlayToggle}
            aria-label={showOverlay ? 'Close overlay' : 'Open overlay'}
            aria-expanded={showOverlay}
          >
            {showOverlay ? '←' : '→'}
          </button>
        </aside>
      )}

      {/* Mobile Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop"
          onClick={handleMobileSidebarClose}
          aria-hidden="true"
          role="presentation"
        />
      )}
    </div>
  );
};

export default MainLayoutGrid;