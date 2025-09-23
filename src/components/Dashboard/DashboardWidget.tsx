import React from 'react';
import type { ReactNode } from "react";
import "./styles/Widgets.css";
import "./styles/SaaSFinalPolish.css";

interface DashboardWidgetProps {
  /** Widget title */
  title?: string;
  /** Widget content */
  children: ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Widget ID for accessibility */
  id?: string;
}

/**
 * Individual dashboard widget component
 * Container for various dashboard metrics and charts
 */
const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  children,
  className = "",
  id,
}) => {
  return (
    <article
      id={id}
      className={`dashboard-widget ${className}`}
      role="region"
      aria-label={title || "Dashboard widget"}
    >
      {title && <h3 className="widget-title">{title}</h3>}
      <div className="widget-content">
        {children}
      </div>
    </article>
  );
};

export default DashboardWidget;