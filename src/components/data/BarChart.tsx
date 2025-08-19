import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  secondary?: number;
  [key: string]: any;
}

interface BarChartProps {
  data?: DataPoint[];
  title?: string;
  height?: number;
  primaryKey?: string;
  secondaryKey?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

// Default dummy data
const defaultData: DataPoint[] = [
  { name: 'Product A', value: 4000, secondary: 2400 },
  { name: 'Product B', value: 3000, secondary: 1398 },
  { name: 'Product C', value: 2000, secondary: 9800 },
  { name: 'Product D', value: 2780, secondary: 3908 },
  { name: 'Product E', value: 1890, secondary: 4800 },
  { name: 'Product F', value: 2390, secondary: 3800 }
];

const BarChart: React.FC<BarChartProps> = ({
  data = defaultData,
  title = 'Bar Chart',
  height = 400,
  primaryKey = 'value',
  secondaryKey = 'secondary',
  primaryColor = '#3B82F6',
  secondaryColor = '#10B981',
  showGrid = true,
  showLegend = true,
  orientation = 'vertical',
  className = ''
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      role="img"
      aria-label={`${title} - Bar chart showing comparative data`}
    >
      {/* Chart Title */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comparing values across categories
        </p>
      </div>

      {/* Chart Container */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
            margin={{
              top: 5,
              right: 30,
              left: orientation === 'horizontal' ? 50 : 20,
              bottom: 5,
            }}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30"
                stroke="currentColor"
              />
            )}
            
            <XAxis 
              type={orientation === 'horizontal' ? 'number' : 'category'}
              dataKey={orientation === 'horizontal' ? undefined : 'name'}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            <YAxis
              type={orientation === 'horizontal' ? 'category' : 'number'}
              dataKey={orientation === 'horizontal' ? 'name' : undefined}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
              width={orientation === 'horizontal' ? 80 : undefined}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#374151' }}
            />
            
            {showLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
              />
            )}
            
            <Bar
              dataKey={primaryKey}
              fill={primaryColor}
              name="Primary"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            
            {data.some(item => item[secondaryKey] !== undefined) && (
              <Bar
                dataKey={secondaryKey}
                fill={secondaryColor}
                name="Secondary"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;