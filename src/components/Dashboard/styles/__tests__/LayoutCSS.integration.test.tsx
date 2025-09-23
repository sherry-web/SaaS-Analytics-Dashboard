import { render, screen } from '@testing-library/react';
import MainLayoutGrid from '../../../layout/MainLayoutGrid';

describe('Layout CSS Integration', () => {
  test('applies correct CSS classes from Layout.css', () => {
    const { container } = render(
      <MainLayoutGrid className="test-layout">
        <div>Test content</div>
      </MainLayoutGrid>
    );

    const layout = container.querySelector('.main-layout-grid');
    expect(layout).toHaveClass('test-layout');

    // Verify CSS grid properties are applied
    expect(layout).toHaveStyle({
      display: 'grid',
      minHeight: '100vh'
    });

    // Verify CSS custom properties
    expect(layout).toHaveStyle({
      '--top-nav-height': '64px',
      '--content-padding-top': '1.5rem'
    });
  });

  test('maintains responsive CSS classes', () => {
    const { container } = render(
      <MainLayoutGrid>
        <div>Test content</div>
      </MainLayoutGrid>
    );

    const layout = container.querySelector('.main-layout-grid');
    
    // Test responsive grid template
    expect(layout).toHaveStyle({
      gridTemplateAreas: '"header header header" "sidebar main overlay"'
    });
  });

  test('applies dark theme classes correctly', () => {
    // Add dark class to document
    document.documentElement.classList.add('dark');
    
    const { container } = render(
      <MainLayoutGrid>
        <div>Test content</div>
      </MainLayoutGrid>
    );

    const layout = container.querySelector('.main-layout-grid');
    expect(layout).toHaveStyle({
      backgroundColor: 'rgb(17, 24, 39)' // #111827 in rgb
    });

    // Cleanup
    document.documentElement.classList.remove('dark');
  });
}); 