import React from 'react';
import type { ReactNode } from 'react';
import TopNavigationBar from './TopNavigationBar';
import '../Dashboard/styles/Layout.css';

interface PublicLayoutProps {
  children: ReactNode;
  /** Whether to show the top navigation bar */
  showNavigation?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Content maximum width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Content alignment */
  align?: 'center' | 'start' | 'end';
}

/**
 * Public layout for unauthenticated pages (Login, Landing, Pricing, etc.)
 * Provides clean, focused content area with optional minimal navigation
 */
const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showNavigation = true,
  className = '',
  maxWidth = 'md',
  align = 'center'
}) => {
  return (
    <div 
      className={`public-layout ${className}`}
      role="main"
      aria-label="Public Content"
    >
      {showNavigation && (
        <header className="public-layout-header">
          <TopNavigationBar />
        </header>
      )}
      
      <div className={`public-content-wrapper max-width-${maxWidth} align-${align}`}>
        <div className="public-content-container">
          {children}
        </div>
      </div>

      {/* Optional footer can be added here */}
    </div>
  );
};

export default PublicLayout;