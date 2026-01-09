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
}> = ({ title, value, formatValue, previousValue, trend, trendPercentage }) => (
  <div className="kpi-widget" role="region" aria-label={title}>
    <div className="kpi-header">
      <h3 className="kpi-title">{title}</h3>
      <div className="kpi-icon" aria-hidden="true">📊</div>
    </div>
    <div className="kpi-content">
      <div className="kpi-value">{formatValue ? formatValue(value) : value}</div>
      {(trend && trendPercentage !== undefined) && (
        <div className={`kpi-trend kpi-trend-${trend}`}>
          <span className="kpi-trend-icon" aria-hidden="true">
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
          <span className="sr-only">
            {trend === 'up' ? 'Increase of' : trend === 'down' ? 'Decrease of' : 'Change of'} {trendPercentage}%
          </span>
          <span aria-hidden="true">{trendPercentage}%</span>
        </div>
      )}
    </div>
  </div>
);

const MockChartWidget: React.FC<{
  title: string;
  height?: number;
}> = ({ title, height = 250 }) => (
  <div 
    className="chart-widget" 
    role="region" 
    aria-label={title}
    style={{ height: `${height}px` }}
  >
    <div className="chart-header">
      <h3 className="chart-title">{title}</h3>
      <p className="chart-description">Mock chart visualization</p>
    </div>
    <div className="chart-content">
      <div className="chart-container" aria-hidden="true">
        <div className="chart-visualization" style={{ 
          height: '100%', 
          background: 'linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          Chart Preview
        </div>
      </div>
    </div>
  </div>
);

const MockTableWidget: React.FC = () => (
  <div className="table-widget" role="region" aria-label="Product Performance Table">
    <div className="table-header">
      <h3 className="table-title">Product Performance</h3>
      <div className="table-row-count" aria-live="polite">5 items</div>
    </div>
    <div className="table-content">
      <div className="table" role="grid" aria-label="Product data">
        <div className="table-header-row" role="row">
          <div className="table-header-cell" role="columnheader">Product</div>
          <div className="table-header-cell" role="columnheader">Revenue</div>
          <div className="table-header-cell" role="columnheader">Growth</div>
        </div>
        {['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].map((product, index) => (
          <div key={product} className="table-row" role="row">
            <div className="table-cell" role="gridcell">{product}</div>
            <div className="table-cell" role="gridcell">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1000000 + index * 250000)}
            </div>
            <div className="table-cell" role="gridcell">
              <span className={`kpi-trend ${index % 3 === 0 ? 'kpi-trend-up' : index % 3 === 1 ? 'kpi-trend-down' : 'kpi-trend-neutral'}`}>
                {index % 3 === 0 ? '+' : index % 3 === 1 ? '-' : ''}{5 + index}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  // Mock data for trends and percentages
  const mockTrends = {
    revenue: { trend: 'up' as const, percentage: 12.5 },
    users: { trend: 'up' as const, percentage: 8.3 },
    conversion: { trend: 'down' as const, percentage: 1.2 }
  };

  return (
    <main 
      role="main" 
      aria-label="Analytics Dashboard" 
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 saas-padding-md"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 saas-spacing-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 saas-fade-in">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 saas-fade-in" style={{ animationDelay: '0.1s' }}>
            Comprehensive overview of your business performance metrics
          </p>
        </header>

        <div className="saas-fade-in" style={{ animationDelay: '0.2s' }}>
          <DashboardWidgetGrid 
            columns={3} 
            gap="lg" 
            animateEntrance={!isLoading}
            ariaLabel="Dashboard widgets grid"
            className="dashboard-content"
          >
            {/* KPI Widgets */}
            <DashboardWidget
              title="Total Revenue"
              loading={isLoading}
            >
              <MockKpiWidget
                title="Total Revenue"
                value={2847392}
                previousValue={2530000}
                trend={mockTrends.revenue.trend}
                trendPercentage={mockTrends.revenue.percentage}
                formatValue={formatCurrency}
              />
            </DashboardWidget>

            <DashboardWidget
              title="Active Users"
              loading={isLoading}
            >
              <MockKpiWidget
                title="Active Users"
                value={47293}
                previousValue={43680}
                trend={mockTrends.users.trend}
                trendPercentage={mockTrends.users.percentage}
                formatValue={formatNumber}
              />
            </DashboardWidget>

            <DashboardWidget
              title="Conversion Rate"
              loading={isLoading}
            >
              <MockKpiWidget
                title="Conversion Rate"
                value={3.24}
                previousValue={3.28}
                trend={mockTrends.conversion.trend}
                trendPercentage={mockTrends.conversion.percentage}
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
                title="Revenue Trend"
                height={250}
              />
            </DashboardWidget>

            <DashboardWidget
              title="Traffic by Device"
              loading={isLoading}
            >
              <MockChartWidget
                title="Traffic by Device"
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

        {/* Loading state screen reader announcement */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isLoading ? 'Dashboard content is loading...' : 'Dashboard content has loaded.'}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;