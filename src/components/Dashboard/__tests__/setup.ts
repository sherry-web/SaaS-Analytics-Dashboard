// src/components/Dashboard/__tests__/setup.ts
import { vi } from 'vitest';

export const mockPerformanceNow = vi.fn();

Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true,
});

// Global test configuration
export const TEST_TIMING = {
  INITIAL: 100,
  INTERACTION: 200,
  ANIMATION: 300
};