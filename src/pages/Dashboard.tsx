import React, { useState, useEffect } from 'react';
import DashboardWidgetGrid from '../components/Dashboard/DashboardWidgetGrid';
import DashboardWidget from '../components/Dashboard/DashboardWidget';
import '../components/Dashboard/styles/SaaSFinalPolish.css';

// Mock widgets for demonstration - these would be replaced with actual imports
const MockKpiWidget: React.FC<{
  title: string;
  value: number | string;
  previousValue?: number | string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
  formatValue?: (value: number | string) => string;
}> = ({ value, formatValue }) => (
  <div className="kpi-value">{formatValue ? formatValue(value) : value}</div>
);

const MockChartWidget: React.FC<{
  title: string;
  height?: number;
}> = ({ height = 250 }) => (
  <div style={{ height: `${height}px`, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Chart Preview
  </div>
);

const MockTableWidget: React.FC = () => (
  <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px' }}>
    Table Preview
  </div>
);

/**
 * Dashboard page component aggregating all analytics widgets
 * Provides a comprehensive overview with smooth animations
 */
const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (val: number | string): string => {
    const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.]/g, '')) : val;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (val: number | string): string => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (val: number | string): string => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return `${num.toFixed(2)}%`;
  };

  return (
    <main role="main" aria-label="Analytics Dashboard" className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 saas-padding-md">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 saas-spacing-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 saas-fade-in">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 saas-fade-in" style={{ animationDelay: '0.1s' }}>
            Comprehensive overview of your business performance metrics
          </p>
        </header>

        <DashboardWidgetGrid columns={3} gap="lg" animateEntrance={!isLoading}>
          {/* KPI Widgets */}
          <DashboardWidget
            title="Total Revenue"
            loading={isLoading}
          >
            <MockKpiWidget
              title=""
              value={2847392}
              formatValue={formatCurrency}
            />
          </DashboardWidget>

          <DashboardWidget
            title="Active Users"
            loading={isLoading}
          >
            <MockKpiWidget
              title=""
              value={47293}
              formatValue={formatNumber}
            />
          </DashboardWidget>

          <DashboardWidget
            title="Conversion Rate"
            loading={isLoading}
          >
            <MockKpiWidget
              title=""
              value={3.24}
              formatValue={formatPercentage}
            />
          </DashboardWidget>

          {/* Chart Widgets */}
          <DashboardWidget
            title="Revenue Trend"
            loading={isLoading}
            className="col-span-2"
          >
            <MockChartWidget
              title=""
              height={250}
            />
          </DashboardWidget>

          <DashboardWidget
            title="Traffic by Device"
            loading={isLoading}
          >
            <MockChartWidget
              title=""
              height={250}
            />
          </DashboardWidget>

          {/* Table Widget */}
          <DashboardWidget
            title="Product Performance"
            loading={isLoading}
            className="col-span-3"
          >
            <MockTableWidget />
          </DashboardWidget>
        </DashboardWidgetGrid>
      </div>
    </main>
  );
};

export default Dashboard;