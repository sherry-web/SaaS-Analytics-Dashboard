import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const isPositive = change >= 0;
  const formattedChange = Math.abs(change);

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      role="article"
      aria-labelledby={`kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Title */}
      <h3 
        id={`kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
      >
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
      </div>

      {/* Change Indicator & Trend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" aria-hidden="true" />
          )}
          <span 
            className={`text-sm font-medium ${
              isPositive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? '+' : '-'}{formattedChange}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {changeLabel}
          </span>
        </div>

        {/* Placeholder Sparkline */}
        <div 
          className="w-20 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center"
          aria-label="Trend sparkline chart"
          role="img"
        >
          <svg width="60" height="20" className="text-blue-500">
            <polyline
              points="2,18 12,12 22,8 32,14 42,6 52,10 58,4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default KPICard;