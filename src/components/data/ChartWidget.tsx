import React from 'react';
import '../styles/ContentWidgets.css';

interface ChartWidgetProps {
  /** Chart title */
  title: string;
  /** Chart description */
  description?: string;
  /** Chart type */
  chartType: 'line' | 'bar' | 'pie';
  /** Chart data */
  data: Array<{ [key: string]: any }>;
  /** Data keys to display */
  dataKeys: string[];
  /** X-axis data key */
  xAxisKey?: string;
  /** Whether chart is loading */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Chart height */
  height?: number;
  /** Callback when chart is interacted with */
  onChartInteraction?: (data: any) => void;
}

/**
 * Chart Widget for displaying various types of charts with consistent styling
 */
const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  description,
  data,
  dataKeys,
  loading = false,
  error,
  className = '',
  height = 300
}) => {
  const renderChartPlaceholder = () => {
    if (loading) {
      return (
        <div className="chart-placeholder chart-loading" aria-label="Loading chart">
          <div className="chart-skeleton"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="chart-placeholder chart-error" role="alert" aria-label="Chart error">
          <div className="chart-error-icon">⚠️</div>
          <p className="chart-error-message">{error}</p>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="chart-placeholder chart-empty" aria-label="No chart data">
          <div className="chart-empty-icon">📊</div>
          <p className="chart-empty-message">No data available</p>
        </div>
      );
    }

    return (
      <div className="chart-container" style={{ height: `${height}px` }}>
        {/* Chart implementation would go here */}
        <div className="chart-visualization" aria-label={`${title} chart`}>
          {/* Placeholder for actual chart library integration */}
          <div className="chart-mock">
            <div className="chart-mock-bars">
              {[60, 40, 80, 30, 90, 50].map((height, index) => (
                <div
                  key={index}
                  className="chart-mock-bar"
                  style={{ height: `${height}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`chart-widget ${className}`} role="region" aria-label={title}>
      <header className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {description && (
          <p className="chart-description" aria-hidden="true">
            {description}
          </p>
        )}
      </header>

      <div className="chart-content">
        {renderChartPlaceholder()}
      </div>

      <footer className="chart-footer">
        <div className="chart-legend" aria-label="Chart legend">
          {dataKeys.map((key, index) => (
            <div key={key} className="chart-legend-item">
              <span 
                className="chart-legend-color"
                style={{ 
                  backgroundColor: `var(--chart-color-${index + 1})` 
                }}
                aria-hidden="true"
              />
              <span className="chart-legend-label">{key}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default ChartWidget;