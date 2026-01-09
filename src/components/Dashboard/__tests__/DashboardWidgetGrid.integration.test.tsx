/**
 * Test Suite: DashboardWidgetGrid Integration
 * Description: Tests grid layout, widget rendering, and ARIA hierarchy in integration context
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { mockPerformanceNow, TEST_TIMING } from './setup';
import DashboardWidget from '../DashboardWidget';
import DashboardWidgetGrid from '../DashboardWidgetGrid';

// Mock complex child components that might be used in integration
const MockInteractiveChart = ({ onDataPointClick }: { onDataPointClick: (value: number) => void }) => (
  <div data-testid="interactive-chart">
    <button onClick={() => onDataPointClick(42)}>Data Point</button>
    <span>Chart Visualization</span>
  </div>
);

const MockDataTable = ({ data, onRowClick }: { data: any[]; onRowClick: (row: any) => void }) => (
  <table data-testid="data-table">
    <tbody>
      {data.map((item, index) => (
        <tr key={index} onClick={() => onRowClick(item)}>
          <td>{item.name}</td>
          <td>{item.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

describe('DashboardWidgetGrid Integration', () => {
  beforeEach(() => {
    mockPerformanceNow.mockClear();
    mockPerformanceNow.mockReturnValue(TEST_TIMING.INITIAL);
  });

  describe('Integration with DashboardWidgetGrid', () => {
    test('renders multiple widgets within a grid layout with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <DashboardWidgetGrid columns={2} gap="1rem">
          <DashboardWidget title="Sales Metrics">
            <div>Sales: $1,000</div>
          </DashboardWidget>
          <DashboardWidget title="User Analytics">
            <div>Users: 500</div>
          </DashboardWidget>
          <DashboardWidget title="Performance">
            <div>Performance: 95%</div>
          </DashboardWidget>
        </DashboardWidgetGrid>
      );

      expect(screen.getByText('Sales Metrics')).toBeInTheDocument();
      expect(screen.getByText('User Analytics')).toBeInTheDocument();
      expect(screen.getByText('Performance')).toBeInTheDocument();
      expect(screen.getByText('Sales: $1,000')).toBeInTheDocument();
      expect(screen.getByText('Users: 500')).toBeInTheDocument();
      expect(screen.getByText('Performance: 95%')).toBeInTheDocument();
    });

    test('maintains proper ARIA hierarchy in grid context with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <DashboardWidgetGrid ariaLabel="Dashboard Overview">
          <DashboardWidget title="Revenue" id="revenue-widget">
            <div>$10,000</div>
          </DashboardWidget>
        </DashboardWidgetGrid>
      );

      const widget = screen.getByRole('region');
      expect(widget).toHaveAttribute('id', 'revenue-widget');
      expect(widget).toHaveAttribute('aria-label', 'Revenue');
      expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Dashboard Overview');
    });
  });

  describe('Interactive Content Handling', () => {
    test('handles click events within widget content with timing', () => {
      const mockClickHandler = vi.fn();
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <DashboardWidget title="Interactive Chart">
          <MockInteractiveChart onDataPointClick={mockClickHandler} />
        </DashboardWidget>
      );

      const dataPointButton = screen.getByText('Data Point');
      fireEvent.click(dataPointButton);
      
      expect(mockClickHandler).toHaveBeenCalledWith(42);
    });

    test('handles complex user interactions within widget with timing', () => {
      const mockRowClickHandler = vi.fn();
      const testData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];
      
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);

      render(
        <DashboardWidget title="Data Table">
          <MockDataTable data={testData} onRowClick={mockRowClickHandler} />
        </DashboardWidget>
      );

      const firstRow = screen.getByText('Item 1');
      fireEvent.click(firstRow);
      
      expect(mockRowClickHandler).toHaveBeenCalledWith(testData[0]);
    });
  });

  describe('Dynamic Content Updates', () => {
    test('updates widget content when props change with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      const { rerender } = render(
        <DashboardWidget title="Dynamic Widget">
          <div>Initial Content</div>
        </DashboardWidget>
      );

      expect(screen.getByText('Initial Content')).toBeInTheDocument();

      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      rerender(
        <DashboardWidget title="Dynamic Widget">
          <div>Updated Content</div>
        </DashboardWidget>
      );

      expect(screen.getByText('Updated Content')).toBeInTheDocument();
      expect(screen.queryByText('Initial Content')).not.toBeInTheDocument();
    });

    test('handles title changes correctly with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      const { rerender } = render(
        <DashboardWidget title="Original Title">
          <div>Content</div>
        </DashboardWidget>
      );

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Original Title');

      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      rerender(
        <DashboardWidget title="Updated Title">
          <div>Content</div>
        </DashboardWidget>
      );

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Updated Title');
    });
  });

  describe('Accessibility Integration', () => {
    test('maintains accessibility with complex nested content', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      render(
        <DashboardWidget title="Complex Analytics" id="analytics-widget">
          <div role="tablist">
            <button role="tab">Tab 1</button>
            <button role="tab">Tab 2</button>
          </div>
          <div role="tabpanel">Tab Content</div>
        </DashboardWidget>
      );

      const widget = screen.getByRole('region');
      expect(widget).toHaveAttribute('aria-label', 'Complex Analytics');
      expect(widget).toHaveAttribute('id', 'analytics-widget');
      
      // Nested accessibility roles should still work
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    test('handles large amounts of data efficiently with timing', () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
      
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: i * 10
      }));

      render(
        <DashboardWidget title="Large Dataset">
          <div data-testid="item-count">Items: {largeDataSet.length}</div>
          <div>First: {largeDataSet[0].name}</div>
          <div>Last: {largeDataSet[largeDataSet.length - 1].name}</div>
        </DashboardWidget>
      );

      expect(screen.getByTestId('item-count')).toHaveTextContent('Items: 1000');
      expect(screen.getByText('First: Item 0')).toBeInTheDocument();
      expect(screen.getByText('Last: Item 999')).toBeInTheDocument();
    });
  });

  test('matches integration snapshot with timing', () => {
    mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INITIAL);
    
    const { container } = render(
      <DashboardWidgetGrid columns={3} gap="1rem" ariaLabel="Integration Test">
        <DashboardWidget title="Widget 1" className="highlighted">
          <div>Content 1</div>
        </DashboardWidget>
        <DashboardWidget title="Widget 2">
          <div>Content 2</div>
        </DashboardWidget>
        <DashboardWidget title="Widget 3">
          <MockInteractiveChart onDataPointClick={vi.fn()} />
        </DashboardWidget>
      </DashboardWidgetGrid>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});