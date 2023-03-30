import { it, expect, describe, beforeEach, vi } from 'vitest'

expect.extend({
  toBeFunc: (received) => {
    if (typeof received === 'function') {
      return {
        pass: true,
      }
    }

    return {
      message: () => `expected ${received} to be a function`,
      pass: false,
    }
  },
  toBe: (received, expected) => {
    if (received === expected) {
      return {
        pass: true,
      }
    }

    return {
      message: () => `expected ${received} to be ${expected}`,
      pass: false,
    }
  },
})
