import { render, screen } from '@testing-library/react';
import DashboardWidget from '../DashboardWidget';

// Mock child components for comprehensive testing
const MockChart = () => <div data-testid="mock-chart">Chart Content</div>;
const MockMetric = ({ value }: { value: number }) => <div data-testid="mock-metric">Value: {value}</div>;
const MockInteractiveComponent = ({ onClick }: { onClick: () => void }) => (
  <button data-testid="interactive-element" onClick={onClick}>Click me</button>
);

describe('DashboardWidget - Enhanced Test Coverage', () => {
  describe('Child Content Rendering', () => {
    test('renders string children correctly', () => {
      render(
        <DashboardWidget>
          Simple text content
        </DashboardWidget>
      );
      
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    test('renders single div element children', () => {
      render(
        <DashboardWidget>
          <div data-testid="single-div">Single div content</div>
        </DashboardWidget>
      );
      
      expect(screen.getByTestId('single-div')).toBeInTheDocument();
      expect(screen.getByText('Single div content')).toBeInTheDocument();
    });

    test('renders multiple sibling elements', () => {
      render(
        <DashboardWidget>
          <div>First element</div>
          <span>Second element</span>
          <p>Third element</p>
        </DashboardWidget>
      );
      
      expect(screen.getByText('First element')).toBeInTheDocument();
      expect(screen.getByText('Second element')).toBeInTheDocument();
      expect(screen.getByText('Third element')).toBeInTheDocument();
    });

    test('renders complex nested component structures', () => {
      const NestedComponent = () => (
        <div data-testid="nested">
          <span>Nested content</span>
          <button>Nested button</button>
        </div>
      );

      render(
        <DashboardWidget>
          <NestedComponent />
          <div>Additional content</div>
        </DashboardWidget>
      );
      
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
      expect(screen.getByText('Nested button')).toBeInTheDocument();
      expect(screen.getByText('Additional content')).toBeInTheDocument();
    });
  });

  describe('Custom ClassName Application', () => {
    test('applies single custom className', () => {
      render(
        <DashboardWidget className="custom-widget">
          <div>Content</div>
        </DashboardWidget>
      );

      const widget = screen.getByRole('region');
      expect(widget).toHaveClass('dashboard-widget');
      expect(widget).toHaveClass('custom-widget');
    });

    test('applies multiple custom classNames', () => {
      render(
        <DashboardWidget className="large-widget dark-theme highlighted">
          <div>Content</div>
        </DashboardWidget>
      );

      const widget = screen.getByRole('region');
      expect(widget).toHaveClass('dashboard-widget');
      expect(widget).toHaveClass('large-widget');
      expect(widget).toHaveClass('dark-theme');
      expect(widget).toHaveClass('highlighted');
    });

    test('handles empty className string gracefully', () => {
      render(
        <DashboardWidget className="">
          <div>Content</div>
        </DashboardWidget>
      );

      const widget = screen.getByRole('region');
      expect(widget).toHaveClass('dashboard-widget');
    });

    test('combines default and custom classNames correctly', () => {
      const { container } = render(
        <DashboardWidget className="custom-class">
          <div>Content</div>
        </DashboardWidget>
      );

      const article = container.querySelector('article');
      expect(article).toHaveClass('dashboard-widget');
      expect(article).toHaveClass('custom-class');
    });
  });

  describe('Empty Children Handling', () => {
    test('renders gracefully with children={null}', () => {
      const { container } = render(<DashboardWidget children={null} />);

      const widget = screen.getByRole('region');
      expect(widget).toBeInTheDocument();
      
      // Widget content area should exist but be empty
      const contentDiv = container.querySelector('.widget-content');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toBeEmptyDOMElement();
    });

    test('renders gracefully with children={undefined}', () => {
      const { container } = render(<DashboardWidget children={undefined} />);

      const widget = screen.getByRole('region');
      expect(widget).toBeInTheDocument();
      
      // Widget content area should exist but be empty
      const contentDiv = container.querySelector('.widget-content');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toBeEmptyDOMElement();
    });

    test('maintains accessibility with empty children', () => {
      render(<DashboardWidget children={null} title="Empty Widget" />);

      const widget = screen.getByRole('region');
      expect(widget).toHaveAttribute('aria-label', 'Empty Widget');
      expect(widget).toHaveAttribute('role', 'region');
    });

    test('does not render title heading when children are empty but title is provided', () => {
      render(<DashboardWidget children={null} title="Test Title" />);

      // Title should not render as heading when there are no children content
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    test('has correct role="region" for widget content', () => {
      render(<DashboardWidget><div>Content</div></DashboardWidget>);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    test('uses title for aria-label when provided', () => {
      const title = 'Sales Metrics Widget';
      render(<DashboardWidget title={title}><div>Content</div></DashboardWidget>);
      
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', title);
    });

    test('uses default aria-label when title is not provided', () => {
      render(<DashboardWidget><div>Content</div></DashboardWidget>);
      
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Dashboard widget');
    });

    test('applies id attribute for unique identification', () => {
      const widgetId = 'unique-widget-123';
      render(<DashboardWidget id={widgetId}><div>Content</div></DashboardWidget>);
      
      expect(screen.getByRole('region')).toHaveAttribute('id', widgetId);
    });
  });

  describe('Snapshot Consistency', () => {
    test('matches snapshot with string children', () => {
      const { container } = render(
        <DashboardWidget title="String Widget">
          Simple text content
        </DashboardWidget>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot with multiple element children', () => {
      const { container } = render(
        <DashboardWidget title="Multi-element Widget" className="test-class">
          <div>First</div>
          <span>Second</span>
          <p>Third</p>
        </DashboardWidget>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot with null children', () => {
      const { container } = render(<DashboardWidget children={null} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot with undefined children', () => {
      const { container } = render(<DashboardWidget children={undefined} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Error Boundary & Console Safety', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('does not throw errors with null children', () => {
      expect(() => {
        render(<DashboardWidget children={null} />);
      }).not.toThrow();
    });

    test('does not throw errors with undefined children', () => {
      expect(() => {
        render(<DashboardWidget children={undefined} />);
      }).not.toThrow();
    });

    test('does not produce console errors with empty children', () => {
      render(<DashboardWidget children={null} />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});