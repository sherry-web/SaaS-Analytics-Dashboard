import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import WidgetSettingsMenu from '../Dashboard/widgets/WidgetSettingsMenu';
import HelpPopover from '../ui/HelpPopover';
import type { WidgetSettings } from '../Dashboard/widgets/WidgetSettings';

/**
 * Data structure for line chart items
 */
interface LineChartData {
  name: string;
  value: number;
}

/**
 * Props for the LineChart component
 */
interface LineChartProps {
  /** Title of the line chart */
  title: string;
  /** Array of data points to display */
  data: LineChartData[];
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
 * Line chart component with configurable settings and export options
 * Provides accessible trend visualization with user customization
 */
const LineChart: React.FC<LineChartProps> = ({
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

  const isSmooth = settings.chartType === 'smooth';
  const showLegend = settings.showLegend ?? true;

  if (!data || data.length === 0) {
    return (
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getDensityClasses()} ${className}`}
        role="group"
        aria-labelledby={`line-chart-title-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            id={`line-chart-title-${title.replace(/\s+/g, '-')}`}
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <HelpPopover 
              title="How to Interpret Line Charts"
              content="Line charts display trends over time or ordered categories. The line connects data points to show progression and patterns. Look for upward or downward trends, peaks, and valleys to understand data behavior."
            />
            <WidgetSettingsMenu
              widgetType="linechart"
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
      aria-labelledby={`line-chart-title-${title.replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          id={`line-chart-title-${title.replace(/\s+/g, '-')}`}
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <HelpPopover 
            title="How to Interpret Line Charts"
            content="Line charts display trends over time or ordered categories. The line connects data points to show progression and patterns. Look for upward or downward trends, peaks, and valleys to understand data behavior."
          />
          <WidgetSettingsMenu
            widgetType="linechart"
            currentSettings={settings}
            onSettingsChange={onSettingsChange}
            onExport={handleExport}
          />
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            aria-label={`Line chart showing ${title}`}
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
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}
              />
            )}
            <Line 
              type={isSmooth ? "monotone" : "linear"}
              dataKey="value" 
              stroke={settings.colorScheme === 'blue' ? '#3b82f6' :
                      settings.colorScheme === 'green' ? '#10b981' :
                      settings.colorScheme === 'purple' ? '#8b5cf6' : '#3b82f6'}
              strokeWidth={2}
              dot={{ fill: settings.colorScheme === 'blue' ? '#3b82f6' :
                     settings.colorScheme === 'green' ? '#10b981' :
                     settings.colorScheme === 'purple' ? '#8b5cf6' : '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;