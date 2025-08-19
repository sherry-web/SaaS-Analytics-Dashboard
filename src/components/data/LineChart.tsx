import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
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

interface LineChartProps {
  data?: DataPoint[];
  title?: string;
  height?: number;
  primaryKey?: string;
  secondaryKey?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

// Default dummy data
const defaultData: DataPoint[] = [
  { name: 'Jan', value: 4000, secondary: 2400 },
  { name: 'Feb', value: 3000, secondary: 1398 },
  { name: 'Mar', value: 2000, secondary: 9800 },
  { name: 'Apr', value: 2780, secondary: 3908 },
  { name: 'May', value: 1890, secondary: 4800 },
  { name: 'Jun', value: 2390, secondary: 3800 },
  { name: 'Jul', value: 3490, secondary: 4300 }
];

const LineChart: React.FC<LineChartProps> = ({
  data = defaultData,
  title = 'Line Chart',
  height = 400,
  primaryKey = 'value',
  secondaryKey = 'secondary',
  primaryColor = '#3B82F6',
  secondaryColor = '#10B981',
  showGrid = true,
  showLegend = true,
  className = ''
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      role="img"
      aria-label={`${title} - Line chart showing data trends`}
    >
      {/* Chart Title */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tracking performance over time
        </p>
      </div>

      {/* Chart Container */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
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
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
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
            
            <Line
              type="monotone"
              dataKey={primaryKey}
              stroke={primaryColor}
              strokeWidth={3}
              dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: primaryColor }}
              name="Primary"
            />
            
            {data.some(item => item[secondaryKey] !== undefined) && (
              <Line
                type="monotone"
                dataKey={secondaryKey}
                stroke={secondaryColor}
                strokeWidth={3}
                dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: secondaryColor }}
                name="Secondary"
              />
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;