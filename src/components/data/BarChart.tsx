import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import WidgetSettingsMenu from '../Dashboard/widgets/WidgetSettingsMenu';
import HelpPopover from '../ui/HelpPopover';
import type { WidgetSettings } from '../Dashboard/widgets/WidgetSettings';

/**
 * Data structure for bar chart items
 */
interface BarChartData {
  name: string;
  value: number;
}

/**
 * Props for the BarChart component
 */
interface BarChartProps {
  /** Title of the bar chart */
  title: string;
  /** Array of data points to display */
  data: BarChartData[];
  /** Current widget settings */
  settings: WidgetSettings;
  /** Callback when settings are changed */
  onSettingsChange: (settings: WidgetSettings) => void;
  /** Callback when export is requested */
  onExport: (format: 'csv' | 'png') => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Bar chart component with configurable settings and export options
 * Provides accessible data visualization with user customization
 */
const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  settings,
  onSettingsChange,
  onExport,
  className = ''
}) => {
  const handleExport = (format: 'csv' | 'png'): void => {
    if (typeof onExport !== 'function') return;

    if (format === 'csv') {
      // Export data as CSV
      const csvContent = [
        'Name,Value',
        ...data.map(item => `"${item.name}",${item.value}`)
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // TODO: Implement PNG export using html2canvas or similar library
      console.log('PNG export functionality not yet implemented');
    }

    onExport(format);
  };

  const getDensityClasses = (): string => {
    return settings.density === 'compact' 
      ? 'p-4' 
      : 'p-6';
  };

  const isStacked = settings.chartType === 'stacked';
  const isSmooth = settings.chartType === 'smooth';

  if (!data || data.length === 0) {
    return (
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getDensityClasses()} ${className}`}
        role="group"
        aria-labelledby={`bar-chart-title-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            id={`bar-chart-title-${title.replace(/\s+/g, '-')}`}
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <HelpPopover 
              title="How to Read Bar Charts"
              content="Bar charts display categorical data with rectangular bars. The height of each bar represents the value for that category. Compare bars to understand relative magnitudes across different categories."
            />
            <WidgetSettingsMenu
              widgetType="barchart"
              currentSettings={settings}
              onSettingsChange={onSettingsChange}
              onExport={handleExport}
            />
          </div>
        </div>
        <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getDensityClasses()} ${className}`}
      role="group"
      aria-labelledby={`bar-chart-title-${title.replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          id={`bar-chart-title-${title.replace(/\s+/g, '-')}`}
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <HelpPopover 
            title="How to Read Bar Charts"
            content="Bar charts display categorical data with rectangular bars. The height of each bar represents the value for that category. Compare bars to understand relative magnitudes across different categories."
          />
          <WidgetSettingsMenu
            widgetType="barchart"
            currentSettings={settings}
            onSettingsChange={onSettingsChange}
            onExport={handleExport}
          />
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            aria-label={`Bar chart showing ${title}`}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-600" 
            />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                borderRadius: '0.375rem',
                color: '#374151'
              }}
              itemStyle={{ color: '#374151' }}
            />
            <Bar 
              dataKey="value" 
              fill={settings.colorScheme === 'blue' ? '#3b82f6' :
                    settings.colorScheme === 'green' ? '#10b981' :
                    settings.colorScheme === 'purple' ? '#8b5cf6' : '#3b82f6'}
              radius={isSmooth ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              stackId={isStacked ? 'stack' : undefined}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;