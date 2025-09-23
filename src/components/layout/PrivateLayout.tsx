import React, { useState } from 'react';
import type { ReactNode } from 'react';
import MainLayoutGrid from './MainLayoutGrid';
import '../Dashboard/styles/Layout.css';

interface PrivateLayoutProps {
  children: ReactNode;
  /** Optional contextual overlay component (right sidebar) */
  overlay?: ReactNode;
  /** Whether the overlay is currently visible */
  showOverlay?: boolean;
  /** Callback when overlay visibility changes */
  onOverlayToggle?: (visible: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Private layout for authenticated pages (Dashboard, Analytics, etc.)
 * Provides full navigation structure with sidebar, top navigation, and main content area
 */
const PrivateLayout: React.FC<PrivateLayoutProps> = ({
  children,
  overlay,
  showOverlay = false,
  onOverlayToggle,
  className = ''
}) => {
  const [isOverlayVisible, setOverlayVisible] = useState(showOverlay);

  const handleOverlayToggle = (visible: boolean) => {
    setOverlayVisible(visible);
    onOverlayToggle?.(visible);
  };

  return (
    <div 
      className={`private-layout ${className}`}
      role="application"
      aria-label="DataSight Pro Application"
    >
      <MainLayoutGrid
        overlay={overlay}
        showOverlay={isOverlayVisible}
        onOverlayToggle={handleOverlayToggle}
      >
        <div className="private-content-wrapper">
          {children}
        </div>
      </MainLayoutGrid>
    </div>
  );
};

export default PrivateLayout;