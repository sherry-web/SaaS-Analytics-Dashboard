import React, { useState } from 'react';
import TopNavigationBar from '../components/layout/TopNavigationBar';
import SidebarNavigation from '../components/layout/SidebarNavigation';
import MainLayoutGrid from "../components/layout/MainLayoutGrid";
import KPICard from '../components/data/KPICard';
import LineChart from '../components/data/LineChart';
import BarChart from '../components/data/BarChart';
import DataTable from '../components/data/DataTable';
import HelpPopover from '../components/ui/HelpPopover';

const Dashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // KPI Card dummy data
  const kpiData = [
    { title: 'Total Revenue', value: '$2,847,392', change: 12.5 },
    { title: 'Active Users', value: '47,293', change: 8.2 },
    { title: 'Conversion Rate', value: '3.24%', change: -2.1 },
    { title: 'Avg. Session Duration', value: '4m 32s', change: 15.3 },
  ];

  // Line Chart dummy data
  const lineChartData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
    { name: 'Jul', value: 72000 },
    { name: 'Aug', value: 69000 },
    { name: 'Sep', value: 78000 },
    { name: 'Oct', value: 84000 },
    { name: 'Nov', value: 81000 },
    { name: 'Dec', value: 89000 },
  ];

  // Bar Chart dummy data
  const barChartData = [
    { name: 'Desktop', value: 4500 },
    { name: 'Mobile', value: 2100 },
    { name: 'Tablet', value: 650 },
  ];

  // Table columns and data
  const tableColumns = [
    { key: 'product', title: 'Product', sortable: true },
    { key: 'category', title: 'Category', sortable: true },
    { key: 'revenue', title: 'Revenue', sortable: true },
    { key: 'growth', title: 'Growth', sortable: true },
    { key: 'status', title: 'Status', sortable: false },
  ];

  const tableData = [
    { id: 1, product: 'Analytics Pro', category: 'Software', revenue: '$127,450', growth: '+23.5%', status: 'Active' },
    { id: 2, product: 'Dashboard Suite', category: 'SaaS', revenue: '$98,320', growth: '+18.2%', status: 'Active' },
    { id: 3, product: 'Data Insights', category: 'Analytics', revenue: '$76,890', growth: '-5.1%', status: 'Review' },
    { id: 4, product: 'Report Builder', category: 'Tools', revenue: '$54,210', growth: '+31.7%', status: 'Active' },
    { id: 5, product: 'API Gateway', category: 'Infrastructure', revenue: '$43,580', growth: '+12.4%', status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <TopNavigationBar />

      <div className="flex">
        {/* Sidebar Navigation */}
        <SidebarNavigation />

        {/* Main Content */}
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <MainLayoutGrid>
            <div className="p-6 space-y-6">

              {/* Dashboard Header */}
              <header className="mb-8" role="banner" aria-label="Dashboard header">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Analytics Dashboard
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300">
                        Welcome to DataSight Pro - Your comprehensive analytics solution
                      </p>
                    </div>
                    <HelpPopover 
                      title="Dashboard Overview"
                      content="This dashboard provides a comprehensive view of your key performance indicators, revenue trends, traffic sources, and product performance metrics."
                    />
                  </div>
                </div>
              </header>

              {/* KPI Cards */}
              <section aria-labelledby="kpi-heading" role="region">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="kpi-heading" className="text-xl font-semibold text-gray-900 dark:text-white">
                    Key Performance Indicators
                  </h2>
                  <HelpPopover 
                    title="Understanding KPIs"
                    content="Key Performance Indicators help track your business performance. Green indicates positive trends, red indicates areas needing attention."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {kpiData.map((kpi, index) => (
                    <KPICard key={index} title={kpi.title} value={kpi.value} change={kpi.change} />
                  ))}
                </div>
              </section>

              {/* Charts Section */}
              <section aria-labelledby="charts-heading" role="region">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="charts-heading" className="text-xl font-semibold text-gray-900 dark:text-white">
                    Performance Analytics
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                      aria-label="Select timeframe for analytics"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                    <HelpPopover 
                      title="Analytics Timeframe"
                      content="Select different time periods to analyze trends and patterns in your data. This affects both revenue and traffic charts."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Revenue Trend
                      </h3>
                      <HelpPopover 
                        title="Revenue Tracking"
                        content="Track your monthly revenue growth and identify seasonal patterns. Hover over data points for detailed values."
                      />
                    </div>
                    <LineChart data={lineChartData} title="" />
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Traffic by Device
                      </h3>
                      <HelpPopover 
                        title="Traffic Analysis"
                        content="Understand where your visitors are coming from to optimize marketing efforts across different device types."
                      />
                    </div>
                    <BarChart data={barChartData} title="" />
                  </div>
                </div>
              </section>

              {/* Data Table */}
              <section aria-labelledby="table-heading" role="region">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <h3 id="table-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                        Product Performance
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Track your product metrics and performance indicators
                      </p>
                    </div>
                    <HelpPopover 
                      title="Product Performance"
                      content="Monitor your product portfolio performance. Sort by different columns to identify top performers and areas for improvement."
                    />
                  </div>
                  <div className="p-6">
                    <DataTable columns={tableColumns} data={tableData} title="Product Performance Data" />
                  </div>
                </div>
              </section>

            </div>
          </MainLayoutGrid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
