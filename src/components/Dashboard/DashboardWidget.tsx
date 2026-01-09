import React from "react";
import type { ReactNode } from "react";
import "./styles/Widgets.css";
import "./styles/SaaSFinalPolish.css";

export interface DashboardWidgetProps {
  /** Widget title */
  title: string;
  /** Widget subtitle or description */
  subtitle?: string;
  /** Widget content */
  children: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Widget loading state */
  loading?: boolean;
  /** Widget error state */
  error?: string;
  /** Widget empty state */
  empty?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Help content for this widget */
  helpContent?: string;
  /** Help title for popover */
  helpTitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Widget ID for accessibility */
  id?: string;
  /** Callback when widget is focused */
  onFocus?: () => void;
  /** Callback when widget is clicked */
  onClick?: () => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  subtitle,
  children,
  footer,
  loading = false,
  error,
  empty = false,
  emptyMessage = "No data available",
  className = "",
  id,
  onFocus,
  onClick,
}) => {
  const widgetId = id || `widget-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const contentId = `${widgetId}-content`;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      id={widgetId}
      className={`dashboard-widget saas-hover-lift widget-entrance ${className} ${loading ? "widget-loading" : ""} ${error ? "widget-error" : ""} ${empty ? "widget-empty" : ""}`}
      role="region"
      aria-labelledby={`${widgetId}-title`}
      aria-describedby={subtitle ? `${widgetId}-subtitle` : undefined}
      tabIndex={onClick ? 0 : undefined}
      onFocus={onFocus}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <header className="widget-header">
        <div className="widget-header-content">
          <h3 id={`${widgetId}-title`} className="widget-title">
            {title}
          </h3>
          {subtitle && (
            <p id={`${widgetId}-subtitle`} className="widget-subtitle">
              {subtitle}
            </p>
          )}
        </div>
      </header>

      <div id={contentId} className="widget-content" aria-busy={loading}>
        {loading ? (
          <div className="widget-loading-state" aria-label={`Loading ${title}`}>
            <div className="widget-loading-spinner" aria-hidden="true" />
            <span className="sr-only">Loading {title} data</span>
          </div>
        ) : error ? (
          <div className="widget-error-state" role="alert" aria-live="polite">
            <div className="widget-error-icon">⚠️</div>
            <p className="widget-error-message">{error}</p>
          </div>
        ) : empty ? (
          <div className="widget-empty-state">
            <div className="widget-empty-icon">📊</div>
            <p className="widget-empty-message">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>

      {footer && <footer className="widget-footer">{footer}</footer>}
    </article>
  );
};

export default DashboardWidget;