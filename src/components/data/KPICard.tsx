import React from 'react';
import WidgetSettingsMenu from '../Dashboard/widgets/WidgetSettingsMenu';
import HelpPopover from '../ui/HelpPopover';
import type { WidgetSettings } from '../Dashboard/widgets/WidgetSettings';

/**
 * Trend information for KPI cards
 */
interface KPITrend {
  direction: 'up' | 'down';
  percentage: number;
}

/**
 * Props for the KPICard component
 */
interface KPICardProps {
  /** Title of the KPI */
  title: string;
  /** Current value of the KPI */
  value: number | string;
  /** Unit of measurement for the value */
  unit?: string;
  /** Trend information for the KPI */
  trend?: KPITrend;
  /** Current widget settings */
  settings: WidgetSettings;
  /** Callback when settings are changed */
  onSettingsChange: (settings: WidgetSettings) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * KPI card component displaying key performance indicators with trend information
 * Provides accessible metric visualization with user customization options
 */
const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  settings,
  onSettingsChange,
  className = ''
}) => {
  const getDensityClasses = (): string => {
    return settings.density === 'compact' 
      ? 'p-4' 
      : 'p-6';
  };

  const formatValue = (): string => {
    if (value === null || value === undefined || value === '') return '—';
    
    if (typeof value === 'number') {
      // Handle numeric formatting based on value magnitude
      if (Math.abs(value) >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (Math.abs(value) >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    
    return value.toString();
  };

  const showTrend = trend !== undefined;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getDensityClasses()} ${className}`}
      role="region"
      aria-label={`KPI card for ${title}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <HelpPopover 
            title="About This KPI"
            content="This KPI shows the current value and optional trend over time. Use the settings menu to customize display options and export the data."
          />
          <WidgetSettingsMenu
            widgetType="kpi"
            currentSettings={settings}
            onSettingsChange={onSettingsChange}
            onExport={(format) => {
              // Export functionality for KPI cards
              console.log(`Exporting KPI as ${format}`);
            }}
          />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatValue()}
          </div>
          {unit && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {unit}
            </div>
          )}
        </div>

        {showTrend && (
          <div 
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
              trend.direction === 'up' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
            aria-label={`${trend.direction === 'up' ? 'Up' : 'Down'} ${trend.percentage}%`}
          >
            <span aria-hidden="true">
              {trend.direction === 'up' ? '↑' : '↓'}
            </span>
            <span>
              {trend.percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;