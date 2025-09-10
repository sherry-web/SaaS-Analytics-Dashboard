import React, { useState, useEffect } from 'react';
import MainLayoutGrid from '../components/layout/MainLayoutGrid';
import BarChart from '../components/data/BarChart';
import LineChart from '../components/data/LineChart';
import DataTable from '../components/data/DataTable';
import KPICard from '../components/data/KPICard';
import type { WidgetSettings } from '../components/Dashboard/widgets/WidgetSettings';

/**
 * Dashboard page component aggregating all analytics widgets
 * Provides a comprehensive overview with per-widget settings persistence
 */
const Dashboard: React.FC = () => {
  const [widgetSettings, setWidgetSettings] = useState<Record<string, WidgetSettings>>({});

  /**
   * Load widget settings from localStorage on component mount
   */
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('datasight-dashboard-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setWidgetSettings(parsedSettings);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }, []);

  /**
   * Save widget settings to localStorage whenever they change
   */
  useEffect(() => {
    try {
      localStorage.setItem('datasight-dashboard-settings', JSON.stringify(widgetSettings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }, [widgetSettings]);

  /**
   * Handle settings change for a specific widget
   */
  const handleSettingsChange = (widgetId: string, newSettings: WidgetSettings) => {
    setWidgetSettings(prev => ({
      ...prev,
      [widgetId]: newSettings
    }));
  };

  /**
   * Handle export request for a specific widget
   */
  const handleExport = (widgetId: string, format: 'csv' | 'png') => {
    console.log(`Exporting ${widgetId} as ${format}`);
  };

  // Sample data for demonstration
  const barChartData = [
    { name: 'Desktop', value: 4500 },
    { name: 'Mobile', value: 2100 },
    { name: 'Tablet', value: 650 },
  ];

  const lineChartData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
  ];

  const tableColumns = [
    { key: 'product', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'growth', label: 'Growth' },
  ];

  const tableData = [
    { id: 1, product: 'Analytics Pro', category: 'Software', revenue: '$127,450', growth: '+23.5%' },
    { id: 2, product: 'Dashboard Suite', category: 'SaaS', revenue: '$98,320', growth: '+18.2%' },
    { id: 3, product: 'Data Insights', category: 'Analytics', revenue: '$76,890', growth: '-5.1%' },
  ];

  return (
    <main role="main" aria-label="Analytics Dashboard" className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive overview of your business performance metrics
          </p>
        </header>

        <MainLayoutGrid className="gap-6">
          {/* KPI Cards */}
          <section role="region" aria-label="Revenue KPI widget" className="lg:col-span-1">
            <KPICard
              title="Total Revenue"
              value={2847392}
              unit="USD"
              trend={{ direction: 'up', percentage: 12.5 }}
              settings={widgetSettings.revenueKpi || {}}
              onSettingsChange={(settings) => handleSettingsChange('revenueKpi', settings)}
              className="h-full"
            />
          </section>

          <section role="region" aria-label="Users KPI widget" className="lg:col-span-1">
            <KPICard
              title="Active Users"
              value={47293}
              trend={{ direction: 'up', percentage: 8.2 }}
              settings={widgetSettings.usersKpi || {}}
              onSettingsChange={(settings) => handleSettingsChange('usersKpi', settings)}
              className="h-full"
            />
          </section>

          <section role="region" aria-label="Conversion KPI widget" className="lg:col-span-1">
            <KPICard
              title="Conversion Rate"
              value={3.24}
              unit="%"
              trend={{ direction: 'down', percentage: 2.1 }}
              settings={widgetSettings.conversionKpi || {}}
              onSettingsChange={(settings) => handleSettingsChange('conversionKpi', settings)}
              className="h-full"
            />
          </section>

          {/* Charts */}
          <section role="region" aria-label="Revenue Trend widget" className="lg:col-span-2">
            <LineChart
              title="Revenue Trend"
              data={lineChartData}
              settings={widgetSettings.revenueChart || {}}
              onSettingsChange={(settings) => handleSettingsChange('revenueChart', settings)}
              onExport={(format) => handleExport('revenueChart', format)}
              className="h-full"
            />
          </section>

          <section role="region" aria-label="Traffic Sources widget" className="lg:col-span-1">
            <BarChart
              title="Traffic by Device"
              data={barChartData}
              settings={widgetSettings.trafficChart || {}}
              onSettingsChange={(settings) => handleSettingsChange('trafficChart', settings)}
              onExport={(format) => handleExport('trafficChart', format)}
              className="h-full"
            />
          </section>

          {/* Data Table */}
          <section role="region" aria-label="Product Performance widget" className="lg:col-span-3">
            <DataTable
              title="Product Performance"
              columns={tableColumns}
              rows={tableData}
              settings={widgetSettings.productTable || {}}
              onSettingsChange={(settings) => handleSettingsChange('productTable', settings)}
              onExport={(format) => handleExport('productTable', format)}
              className="h-full"
            />
          </section>
        </MainLayoutGrid>
      </div>
    </main>
  );
};

export default Dashboard;