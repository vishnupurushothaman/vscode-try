import { expect } from '@playwright/test';

/**
 * Assert that a response body contains all required fields
 */
export function assertRequiredFields(body: Record<string, unknown>, fields: string[]): void {
  for (const field of fields) {
    expect(body, `Missing field: ${field}`).toHaveProperty(field);
  }
}

/**
 * Assert that a value is a non-empty string
 */
export function assertNonEmptyString(value: unknown, label: string): void {
  expect(typeof value, `${label} should be a string`).toBe('string');
  expect((value as string).length, `${label} should not be empty`).toBeGreaterThan(0);
}

/**
 * Assert that a value is a positive integer
 */
export function assertPositiveInt(value: unknown, label: string): void {
  expect(typeof value, `${label} should be a number`).toBe('number');
  expect(value as number, `${label} should be positive`).toBeGreaterThan(0);
  expect(Number.isInteger(value), `${label} should be an integer`).toBe(true);
}

/**
 * Assert API response time is within threshold
 */
export function assertResponseTime(actualMs: number, maxMs: number): void {
  expect(actualMs, `Response time ${actualMs}ms exceeds ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert response body array has items
 */
export function assertNonEmptyArray(value: unknown, label: string): void {
  expect(Array.isArray(value), `${label} should be an array`).toBe(true);
  expect((value as unknown[]).length, `${label} should not be empty`).toBeGreaterThan(0);
}
