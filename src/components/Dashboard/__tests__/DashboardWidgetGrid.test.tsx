import { render, screen } from '@testing-library/react';
import DashboardWidgetGrid from '../DashboardWidgetGrid';
import DashboardWidget from '../DashboardWidget';

// Mock child components
const MockWidget = ({ title, value }: { title: string; value: number }) => (
  <DashboardWidget title={title}>
    <div data-testid={`widget-${title}`}>Value: {value}</div>
  </DashboardWidget>
);

describe('DashboardWidgetGrid - Enhanced Test Coverage', () => {
  describe('Default Configuration', () => {
    test('renders with default columns=3', () => {
      render(
        <DashboardWidgetGrid>
          <div>Test Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
      });
    });

    test('renders with default gap="1.5rem"', () => {
      render(
        <DashboardWidgetGrid>
          <div>Test Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gap: '1.5rem'
      });
    });

    test('applies both default values simultaneously', () => {
      render(
        <DashboardWidgetGrid>
          <div>Test Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1.5rem'
      });
    });
  });

  describe('Grid Layout Configuration', () => {
    test.each([1, 2, 3, 4, 6])('adjusts layout correctly for %i columns', (columns) => {
      render(
        <DashboardWidgetGrid columns={columns}>
          <div>Test Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      });
    });

    test('handles fractional column values', () => {
      render(
        <DashboardWidgetGrid columns={2.5}>
          <div>Test Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(2.5, minmax(0, 1fr))'
      });
    });

    test('applies custom gap values correctly', () => {
      const gapValues = ['0.5rem', '1rem', '2rem', '3rem', '1em', '20px'];
      
      gapValues.forEach(gap => {
        const { unmount } = render(
          <DashboardWidgetGrid gap={gap}>
            <div>Test Widget</div>
          </DashboardWidgetGrid>
        );

        const grid = screen.getByRole('group');
        expect(grid).toHaveStyle({ gap });
        unmount();
      });
    });

    test('combines custom columns and gap correctly', () => {
      render(
        <DashboardWidgetGrid columns={5} gap="2rem">
          <div>Test Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        gap: '2rem'
      });
    });
  });

  describe('Dynamic Children Support', () => {
    test('renders dynamic array of widgets', () => {
      const dynamicWidgets = [
        { id: 1, title: 'Dynamic 1', value: 100 },
        { id: 2, title: 'Dynamic 2', value: 200 },
        { id: 3, title: 'Dynamic 3', value: 300 }
      ];

      render(
        <DashboardWidgetGrid>
          {dynamicWidgets.map(widget => (
            <MockWidget key={widget.id} title={widget.title} value={widget.value} />
          ))}
        </DashboardWidgetGrid>
      );

      dynamicWidgets.forEach(widget => {
        expect(screen.getByText(widget.title)).toBeInTheDocument();
        expect(screen.getByTestId(`widget-${widget.title}`)).toHaveTextContent(`Value: ${widget.value}`);
      });
    });

    test('handles conditional rendering of children', () => {
      const showExtraWidget = true;
      
      render(
        <DashboardWidgetGrid>
          <MockWidget title="Always Visible" value={1} />
          {showExtraWidget && <MockWidget title="Conditional" value={2} />}
          <MockWidget title="Another Always" value={3} />
        </DashboardWidgetGrid>
      );

      expect(screen.getByText('Always Visible')).toBeInTheDocument();
      expect(screen.getByText('Conditional')).toBeInTheDocument();
      expect(screen.getByText('Another Always')).toBeInTheDocument();
    });

    test('updates layout when children change', () => {
      const initialWidgets = ['Widget A', 'Widget B'];
      const { rerender } = render(
        <DashboardWidgetGrid>
          {initialWidgets.map(title => (
            <div key={title}>{title}</div>
          ))}
        </DashboardWidgetGrid>
      );

      expect(screen.getByText('Widget A')).toBeInTheDocument();
      expect(screen.getByText('Widget B')).toBeInTheDocument();

      const updatedWidgets = ['Widget A', 'Widget B', 'Widget C', 'Widget D'];
      rerender(
        <DashboardWidgetGrid>
          {updatedWidgets.map(title => (
            <div key={title}>{title}</div>
          ))}
        </DashboardWidgetGrid>
      );

      expect(screen.getByText('Widget C')).toBeInTheDocument();
      expect(screen.getByText('Widget D')).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    test('applies custom aria-label correctly', () => {
      const customLabel = 'Business analytics dashboard grid';
      render(
        <DashboardWidgetGrid ariaLabel={customLabel}>
          <div>Widget</div>
        </DashboardWidgetGrid>
      );

      expect(screen.getByRole('group')).toHaveAttribute('aria-label', customLabel);
    });

    test('falls back to default aria-label when not provided', () => {
      render(
        <DashboardWidgetGrid>
          <div>Widget</div>
        </DashboardWidgetGrid>
      );

      expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Dashboard widgets');
    });

    test('maintains role="group" for accessibility', () => {
      render(
        <DashboardWidgetGrid>
          <div>Widget</div>
        </DashboardWidgetGrid>
      );

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    test('combines accessibility attributes with layout props', () => {
      render(
        <DashboardWidgetGrid 
          ariaLabel="Test Grid" 
          columns={2} 
          gap="1rem"
        >
          <div>Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveAttribute('aria-label', 'Test Grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '1rem'
      });
    });
  });

  describe('Edge Cases & Error Handling', () => {
    test('handles empty children array gracefully', () => {
      render(<DashboardWidgetGrid>{[]}</DashboardWidgetGrid>);

      const grid = screen.getByRole('group');
      expect(grid).toBeInTheDocument();
      expect(grid).toBeEmptyDOMElement();
    });

    test('handles mixed valid and invalid children', () => {
      render(
        <DashboardWidgetGrid>
          {null}
          <MockWidget title="Valid Widget" value={1} />
          {undefined}
          {false}
          <MockWidget title="Another Valid" value={2} />
          {0}
        </DashboardWidgetGrid>
      );

      expect(screen.getByText('Valid Widget')).toBeInTheDocument();
      expect(screen.getByText('Another Valid')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(2);
    });

    test('handles extreme column values', () => {
      render(
        <DashboardWidgetGrid columns={100}>
          <div>Widget</div>
        </DashboardWidgetGrid>
      );

      const grid = screen.getByRole('group');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(100, minmax(0, 1fr))'
      });
    });
  });

  describe('Snapshot Consistency', () => {
    test('matches snapshot with default configuration', () => {
      const { container } = render(
        <DashboardWidgetGrid>
          <div>Default Widget</div>
        </DashboardWidgetGrid>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot with custom layout', () => {
      const { container } = render(
        <DashboardWidgetGrid columns={4} gap="2rem">
          <MockWidget title="Snapshot Test" value={999} />
        </DashboardWidgetGrid>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot with multiple widgets', () => {
      const { container } = render(
        <DashboardWidgetGrid ariaLabel="Multi-widget Snapshot">
          <MockWidget title="First" value={1} />
          <MockWidget title="Second" value={2} />
          <MockWidget title="Third" value={3} />
        </DashboardWidgetGrid>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot with empty state', () => {
      const { container } = render(<DashboardWidgetGrid children={undefined} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Console Error Prevention', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('does not produce console errors with empty children', () => {
      render(<DashboardWidgetGrid children={undefined} />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('does not produce console errors with null children', () => {
      render(<DashboardWidgetGrid children={null} />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('does not produce console errors with mixed children', () => {
      render(
        <DashboardWidgetGrid>
          {null}
          <div>Valid</div>
          {undefined}
        </DashboardWidgetGrid>
      );
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});