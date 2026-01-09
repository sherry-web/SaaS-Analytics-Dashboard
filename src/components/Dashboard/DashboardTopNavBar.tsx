import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: string;
}

export interface User {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

// ✅ Enhanced: Complete props interface with all required properties
export interface DashboardTopNavBarProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  user?: User | null;
  notifications?: NotificationItem[];
  onMenuToggle?: () => void;
  onThemeToggle?: () => void;
  onNotificationRead?: (id: string) => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

// ✅ Enhanced: Proper typing with React.FC and explicit props destructuring
const DashboardTopNavBar: React.FC<DashboardTopNavBarProps> = ({ 
  title = "DataSight Pro",
  breadcrumbs = [],
  user,
  notifications = [],
  onMenuToggle,
  onThemeToggle,
  onNotificationRead,
  onProfileClick,
  onLogoutClick,
  className = ""
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleNotificationClick = (id: string) => {
    onNotificationRead?.(id);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header 
      role="banner" 
      aria-label="Dashboard navigation"
      className={`dashboard-top-navbar ${className} ${
        isMobile ? 'mobile-layout' : 
        isTablet ? 'tablet-layout' : 
        'desktop-layout'
      }`}
    >
      <div className="nav-brand">
        <h1>{title}</h1>
      </div>

      {/* Breadcrumbs - Desktop only */}
      {isDesktop && breadcrumbs.length > 0 && (
        <nav role="navigation" aria-label="Breadcrumb" className="breadcrumb-nav">
          <ol>
            {breadcrumbs.map((crumb, index) => (
              <li key={index}>
                {index < breadcrumbs.length - 1 ? (
                  <a href={crumb.path}>{crumb.label}</a>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className="separator">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="nav-actions">
        {/* Search - Hidden on mobile */}
        {!isMobile && (
          <div className="search-container" role="search">
            <input 
              placeholder="Search..." 
              role="searchbox" 
              aria-label="Search dashboard"
              className="search-input"
            />
          </div>
        )}

        {/* Theme Toggle */}
        <button 
          aria-label="Switch to dark mode" 
          onClick={onThemeToggle}
          className="theme-toggle-btn"
          aria-pressed="false"
        >
          ☀️
        </button>

        {/* Notifications */}
        <button 
          aria-label={`Notifications ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} unread)` : ''}`}
          className="notifications-btn"
          aria-haspopup="dialog"
        >
          🔔
          {unreadNotificationsCount > 0 && (
            <span className="notification-badge" aria-live="polite">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <button 
          aria-label="User menu"
          className="user-menu-btn"
          aria-haspopup="menu"
          onClick={onProfileClick}
        >
          👤
          {user?.name && isDesktop && (
            <span className="user-name">{user.name}</span>
          )}
        </button>

        {/* Mobile Menu Toggle */}
        {(isMobile || isTablet) && (
          <button 
            aria-label="Open menu" 
            onClick={onMenuToggle}
            className="menu-toggle-btn"
          >
            ☰
          </button>
        )}
      </div>

      {/* Live region for screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {/* Dynamic announcements will go here */}
      </div>
    </header>
  );
};

export default DashboardTopNavBar;