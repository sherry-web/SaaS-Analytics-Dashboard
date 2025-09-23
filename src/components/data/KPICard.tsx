import React from 'react';
import '../styles/ContentWidgets.css';

interface KpiWidgetProps {
  /** KPI title */
  title: string;
  /** Current value */
  value: number | string;
  /** Previous value for comparison */
  previousValue?: number | string;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend percentage */
  trendPercentage?: number;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Value formatter function */
  formatValue?: (value: number | string) => string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show as loading */
  loading?: boolean;
}

/**
 * KPI Widget for displaying key performance indicators with trend analysis
 */
const KpiWidget: React.FC<KpiWidgetProps> = ({
  title,
  value,
  previousValue,
  trend = 'neutral',
  trendPercentage,
  icon,
  formatValue,
  className = '',
  loading = false
}) => {
  const formatNumber = (val: number | string): string => {
    if (formatValue) return formatValue(val);
    
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toString();
    }
    return val;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'kpi-trend-up';
      case 'down':
        return 'kpi-trend-down';
      default:
        return 'kpi-trend-neutral';
    }
  };

  if (loading) {
    return (
      <div className={`kpi-widget ${className} kpi-loading`} role="region" aria-label={`Loading ${title}`}>
        <div className="kpi-header">
          <h3 className="kpi-title">{title}</h3>
        </div>
        <div className="kpi-content">
          <div className="kpi-value-skeleton"></div>
          <div className="kpi-trend-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`kpi-widget ${className}`} role="region" aria-label={`${title}: ${formatNumber(value)}`}>
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        {icon && <span className="kpi-icon" aria-hidden="true">{icon}</span>}
      </div>
      
      <div className="kpi-content">
        <div className="kpi-value" aria-live="polite">
          {formatNumber(value)}
        </div>
        
        {(trend !== 'neutral' || previousValue) && (
          <div className={`kpi-trend ${getTrendClass()}`}>
            <span className="kpi-trend-icon" aria-hidden="true">{getTrendIcon()}</span>
            {trendPercentage && (
              <span className="kpi-trend-percentage">
                {Math.abs(trendPercentage)}%
              </span>
            )}
            {previousValue && !trendPercentage && (
              <span className="kpi-trend-comparison">
                from {formatNumber(previousValue)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiWidget;