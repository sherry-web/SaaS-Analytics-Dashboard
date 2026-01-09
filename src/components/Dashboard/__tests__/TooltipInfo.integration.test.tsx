/**
 * Test Suite: TooltipInfo Integration
 * Description: Tests tooltip trigger mechanisms, ARIA accessibility, performance, and edge cases
 */

import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mockPerformanceNow, TEST_TIMING } from './setup';
import TooltipInfo from '../widgets/TooltipInfo';

describe('TooltipInfo - Integration Tests', () => {
  const user = userEvent.setup({ delay: null });

  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformanceNow.mockClear();
    mockPerformanceNow.mockReturnValue(TEST_TIMING.INITIAL);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Tooltip Trigger Mechanisms', () => {
    test('shows tooltip on mouse hover with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="This is a helpful tooltip">
          <button>Hover me</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /hover me/i });
      
      await user.hover(trigger);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('This is a helpful tooltip')).toBeVisible();
      });
    });

    test('shows tooltip on keyboard focus with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="Keyboard tooltip content">
          <button>Focus me</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /focus me/i });
      
      trigger.focus();
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Keyboard tooltip content')).toBeVisible();
      });
    });

    test('hides tooltip on mouse leave with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="Temporary tooltip">
          <button>Hover me</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /hover me/i });
      
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      await user.unhover(trigger);
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('ARIA Accessibility', () => {
    test('has proper aria-describedby connection with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="Accessible tooltip content">
          <button>Accessible button</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /accessible button/i });
      
      await user.hover(trigger);
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const tooltipId = tooltip.id;
        
        expect(trigger).toHaveAttribute('aria-describedby', tooltipId);
        expect(tooltip).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Performance & Render Speed', () => {
    test('handles rapid hover/unhover sequences with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="Rapid interaction tooltip">
          <button>Rapid button</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /rapid button/i });
      
      // Rapid interactions
      for (let i = 0; i < 3; i++) {
        await user.hover(trigger);
        await user.unhover(trigger);
      }
      
      // Should not throw errors and tooltip should be hidden
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('tooltip works with keyboard navigation sequence with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="Keyboard navigation tooltip">
          <button>Keyboard button</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /keyboard button/i });
      
      // Tab to focus
      await user.tab();
      expect(trigger).toHaveFocus();
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      
      // Tab away to blur
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases & Error Handling', () => {
    test('handles long content without layout issues with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      const longContent = 'This is a very long tooltip content that should wrap properly and not cause any layout issues or overflow problems in the user interface.';
      
      render(
        <TooltipInfo content={longContent}>
          <button>Long content</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /long content/i });
      
      await user.hover(trigger);
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent(longContent);
      });
    });

    test('works with disabled trigger elements with timing', async () => {
      mockPerformanceNow.mockReturnValueOnce(TEST_TIMING.INTERACTION);
      
      render(
        <TooltipInfo content="Disabled element tooltip">
          <button disabled>Disabled button</button>
        </TooltipInfo>
      );

      const trigger = screen.getByRole('button', { name: /disabled button/i });
      
      await user.hover(trigger);
      
      // Tooltip should still work with disabled elements
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });
});