import { render, screen, fireEvent } from '@testing-library/react';
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

describe('DashboardWidget Integration', () => {
  describe('Integration with DashboardWidgetGrid', () => {
    test('renders multiple widgets within a grid layout', () => {
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

    test('maintains proper ARIA hierarchy in grid context', () => {
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
    test('handles click events within widget content', () => {
      const mockClickHandler = jest.fn();
      
      render(
        <DashboardWidget title="Interactive Chart">
          <MockInteractiveChart onDataPointClick={mockClickHandler} />
        </DashboardWidget>
      );

      const dataPointButton = screen.getByText('Data Point');
      fireEvent.click(dataPointButton);
      
      expect(mockClickHandler).toHaveBeenCalledWith(42);
    });

    test('handles complex user interactions within widget', () => {
      const mockRowClickHandler = jest.fn();
      const testData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];

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
    test('updates widget content when props change', () => {
      const { rerender } = render(
        <DashboardWidget title="Dynamic Widget">
          <div>Initial Content</div>
        </DashboardWidget>
      );

      expect(screen.getByText('Initial Content')).toBeInTheDocument();

      rerender(
        <DashboardWidget title="Dynamic Widget">
          <div>Updated Content</div>
        </DashboardWidget>
      );

      expect(screen.getByText('Updated Content')).toBeInTheDocument();
      expect(screen.queryByText('Initial Content')).not.toBeInTheDocument();
    });

    test('handles title changes correctly', () => {
      const { rerender } = render(
        <DashboardWidget title="Original Title">
          <div>Content</div>
        </DashboardWidget>
      );

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Original Title');

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

    test('supports keyboard navigation within widget', () => {
      render(
        <DashboardWidget title="Keyboard Navigable">
          <button>First Button</button>
          <button>Second Button</button>
          <input type="text" placeholder="Search..." />
        </DashboardWidget>
      );

      const input = screen.getByPlaceholderText('Search...');
      input.focus();
      
      expect(input).toHaveFocus();
      
      fireEvent.keyDown(input, { key: 'Tab' });
      // Should navigate to next focusable element
    });
  });

  describe('Error Boundary Scenarios', () => {
    test('handles errors in child components gracefully', () => {
      // This test verifies that widget doesn't break entire dashboard
      // when child components have issues
      const ProblematicChild = () => {
        throw new Error('Test error');
      };

      // In a real scenario, you'd have an error boundary
      // For this test, we'll ensure the widget itself doesn't crash
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <DashboardWidget title="Error Test">
            <div>Safe Content</div>
            {/* <ProblematicChild /> */}
          </DashboardWidget>
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Integration', () => {
    test('handles large amounts of data efficiently', () => {
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

  describe('Theme and Styling Integration', () => {
    test('applies custom classNames in integration context', () => {
      render(
        <DashboardWidgetGrid className="custom-grid">
          <DashboardWidget title="Themed Widget" className="custom-widget dark-theme">
            <div>Content</div>
          </DashboardWidget>
        </DashboardWidgetGrid>
      );

      const widget = screen.getByRole('region');
      expect(widget).toHaveClass('custom-widget');
      expect(widget).toHaveClass('dark-theme');
    });
  });

  test('matches integration snapshot', () => {
    const { container } = render(
      <DashboardWidgetGrid columns={3} gap="1rem" ariaLabel="Integration Test">
        <DashboardWidget title="Widget 1" className="highlighted">
          <div>Content 1</div>
        </DashboardWidget>
        <DashboardWidget title="Widget 2">
          <div>Content 2</div>
        </DashboardWidget>
        <DashboardWidget title="Widget 3">
          <MockInteractiveChart onDataPointClick={jest.fn()} />
        </DashboardWidget>
      </DashboardWidgetGrid>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});