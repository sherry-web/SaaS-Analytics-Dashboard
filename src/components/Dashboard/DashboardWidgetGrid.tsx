import React from 'react';
import type { ReactNode } from "react";
import "./styles/Widgets.css";
import "./styles/SaaSFinalPolish.css";

interface DashboardWidgetGridProps {
  /** Number of columns in the grid */
  columns?: number;
  /** Gap between grid items */
  gap?: string;
  /** Children (widgets) */
  children: ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Grid label for accessibility */
  ariaLabel?: string;
}

/**
 * DashboardWidgetGrid component
 * Provides a responsive grid container for dashboard widgets
 * Uses CSS Grid with customizable columns and gap
 */
const DashboardWidgetGrid: React.FC<DashboardWidgetGridProps> = ({
  columns = 3,
  gap = "1.5rem",
  children,
  className = "",
  ariaLabel = "Dashboard widgets",
}) => {
  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap,
  };

  return (
    <section
      className={`dashboard-widget-grid ${className}`}
      style={style}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
};

export default DashboardWidgetGrid;