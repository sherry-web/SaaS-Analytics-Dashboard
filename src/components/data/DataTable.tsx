import React, { useState, useMemo } from 'react';
import WidgetSettingsMenu from '../Dashboard/widgets/WidgetSettingsMenu';
import HelpPopover from '../ui/HelpPopover';
import type { WidgetSettings } from '../Dashboard/widgets/WidgetSettings';

/**
 * Column definition for data table
 */
interface TableColumn {
  key: string;
  label: string;
}

/**
 * Row data structure for data table
 */
interface TableRow {
  id: string | number;
  [key: string]: string | number;
}

/**
 * Props for the DataTable component
 */
interface DataTableProps {
  /** Title of the data table */
  title: string;
  /** Array of column definitions */
  columns: TableColumn[];
  /** Array of row data objects */
  rows: TableRow[];
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
 * Sort configuration state
 */
interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

/**
 * Data table component with sorting, pagination, and export functionality
 * Provides accessible tabular data presentation with user customization
 */
const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  rows,
  settings,
  onSettingsChange,
  onExport,
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleExport = (format: 'csv' | 'png'): void => {
    if (typeof onExport !== 'function') return;

    if (format === 'csv') {
      // Export data as CSV
      const headers = columns.map(col => `"${col.label}"`).join(',');
      const csvRows = rows.map(row => 
        columns.map(col => `"${String(row[col.key] || '')}"`).join(',')
      );
      const csvContent = [headers, ...csvRows].join('\n');
      
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

  const handleSort = (key: string): void => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue || '');
      const bString = String(bValue || '');

      return sortConfig.direction === 'ascending' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [rows, sortConfig]);

  const pageSize = settings.pageSize || 10;
  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getDensityClasses = (): string => {
    return settings.density === 'compact' 
      ? 'px-3 py-2' 
      : 'px-6 py-4';
  };

  const getContainerClasses = (): string => {
    return settings.density === 'compact' 
      ? 'p-4' 
      : 'p-6';
  };

  if (!rows || rows.length === 0) {
    return (
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getContainerClasses()} ${className}`}
        role="group"
        aria-labelledby={`data-table-title-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            id={`data-table-title-${title.replace(/\s+/g, '-')}`}
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <HelpPopover 
              title="About This Table"
              content="This table displays structured data with sorting and pagination capabilities. Click column headers to sort data, and use pagination controls to navigate through large datasets."
            />
            <WidgetSettingsMenu
              widgetType="table"
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
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getContainerClasses()} ${className}`}
      role="group"
      aria-labelledby={`data-table-title-${title.replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          id={`data-table-title-${title.replace(/\s+/g, '-')}`}
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <HelpPopover 
            title="About This Table"
            content="This table displays structured data with sorting and pagination capabilities. Click column headers to sort data, and use pagination controls to navigate through large datasets."
          />
          <WidgetSettingsMenu
            widgetType="table"
            currentSettings={settings}
            onSettingsChange={onSettingsChange}
            onExport={handleExport}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table 
          className="w-full border-collapse"
          aria-label={`Data table for ${title}`}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`${getDensityClasses()} text-left font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-sort={
                    sortConfig?.key === column.key 
                      ? sortConfig.direction 
                      : 'none'
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                >
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <span className="ml-1" aria-hidden="true">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.key}`}
                    className={`${getDensityClasses()} text-gray-900 dark:text-white`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedRows.length)} of {sortedRows.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;