import React, { useState, useMemo } from 'react';
import '../styles/ContentWidgets.css';

interface TableColumn {
  /** Column key */
  key: string;
  /** Column label */
  label: string;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: string;
  /** Cell formatter function */
  format?: (value: any, row: any) => React.ReactNode;
}

interface TableWidgetProps {
  /** Table title */
  title: string;
  /** Table columns */
  columns: TableColumn[];
  /** Table rows */
  rows: any[];
  /** Whether table is loading */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when row is clicked */
  onRowClick?: (row: any) => void;
  /** Callback when column is sorted */
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  /** Default sort column */
  defaultSortColumn?: string;
  /** Default sort direction */
  defaultSortDirection?: 'asc' | 'desc';
}

/**
 * Table Widget for displaying tabular data with sorting and interactive features
 */
const TableWidget: React.FC<TableWidgetProps> = ({
  title,
  columns,
  rows,
  loading = false,
  error,
  className = '',
  onRowClick,
  onSort,
  defaultSortColumn,
  defaultSortDirection = 'asc'
}) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  const sortedRows = useMemo(() => {
    if (!sortColumn || !onSort) return rows;
    
    return [...rows].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue || '');
      const bString = String(bValue || '');
      
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [rows, sortColumn, sortDirection, onSort]);

  const handleSort = (columnKey: string) => {
    if (!columns.find(col => col.key === columnKey)?.sortable) return;
    
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const handleRowClick = (row: any) => {
    onRowClick?.(row);
  };

  const handleKeyDown = (event: React.KeyboardEvent, row: any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRowClick(row);
    }
  };

  if (loading) {
    return (
      <div className={`table-widget ${className}`} role="region" aria-label={`Loading ${title}`}>
        <header className="table-header">
          <h3 className="table-title">{title}</h3>
        </header>
        
        <div className="table-content">
          <div className="table-skeleton">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="table-row-skeleton">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className="table-cell-skeleton"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`table-widget ${className}`} role="region" aria-label={`${title} error`}>
        <header className="table-header">
          <h3 className="table-title">{title}</h3>
        </header>
        
        <div className="table-content">
          <div className="table-error" role="alert">
            <div className="table-error-icon">⚠️</div>
            <p className="table-error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-widget ${className}`} role="region" aria-label={title}>
      <header className="table-header">
        <h3 className="table-title">{title}</h3>
        <span className="table-row-count" aria-live="polite">
          {rows.length} {rows.length === 1 ? 'item' : 'items'}
        </span>
      </header>

      <div className="table-content">
        <table className="table" aria-label={title}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`table-header-cell ${column.sortable ? 'sortable' : ''} ${sortColumn === column.key ? 'sorted' : ''}`}
                  style={{ width: column.width }}
                  aria-sort={
                    sortColumn === column.key
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  tabIndex={column.sortable ? 0 : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}
                  onKeyDown={(e) => column.sortable && (e.key === 'Enter' || e.key === ' ') && handleSort(column.key)}
                >
                  {column.label}
                  {column.sortable && (
                    <span className="sort-indicator" aria-hidden="true">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : '↕'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <tr
                key={index}
                className={onRowClick ? 'clickable-row' : ''}
                onClick={() => onRowClick && handleRowClick(row)}
                onKeyDown={(e) => onRowClick && handleKeyDown(e, row)}
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.format ? column.format(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="table-empty" aria-label="No data available">
            <div className="table-empty-icon">📋</div>
            <p className="table-empty-message">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableWidget;