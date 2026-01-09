import React from "react";
import type { ReactNode } from "react";
import "./styles/Widgets.css";
import "./styles/SaaSFinalPolish.css";

export interface DashboardWidgetGridProps {
  /** Number of columns in the grid */
  columns?: number;
  /** Gap between grid items (string like '1rem' or tokens 'sm'|'md'|'lg') */
  gap?: string;
  /** Children (widgets) */
  children: ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Grid label for accessibility */
  ariaLabel?: string;
  /** Optional entrance animation flag */
  animateEntrance?: boolean;
}

/** Token -> actual gap mapping (supporting pages that pass 'lg', 'md', 'sm') */
const gapMap: Record<string, string> = {
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
};

const DashboardWidgetGrid: React.FC<DashboardWidgetGridProps> = ({
  columns = 3,
  gap = "1.5rem",
  children,
  className = "",
  ariaLabel = "Dashboard widgets",
  animateEntrance = false,
}) => {
  const resolvedGap = gapMap[gap] ?? gap;

  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: resolvedGap,
  };

  const containerClass = [
    "dashboard-widget-grid",
    animateEntrance ? "animate-entrance" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={containerClass}
      style={style}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
};

export default DashboardWidgetGrid;