import { Page } from '@playwright/test';

/**
 * Wait for the page network to be idle (no requests for 500ms)
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Format a number as a USD price string (e.g. 29.99 → "$29.99")
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Parse a price string like "$29.99" or "29.99" into a float
 */
export function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
}

/**
 * Generate a random string of given length (for test data)
 */
export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sleep for given milliseconds (use sparingly — prefer Playwright auto-waits)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry an async function up to `attempts` times
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 500
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(delayMs);
    }
  }
  throw new Error('retry exhausted');
}

/**
 * Calculate expected tax (SauceDemo uses 8% tax)
 */
export function calculateTax(subtotal: number): number {
  return parseFloat((subtotal * 0.08).toFixed(2));
}

/**
 * Calculate expected total from subtotal + tax
 */
export function calculateTotal(subtotal: number): number {
  return parseFloat((subtotal + calculateTax(subtotal)).toFixed(2));
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Strip currency symbol and parse to number
 */
export function stripCurrencyAndParse(value: string): number {
  return parseFloat(value.replace(/[$,\s]/g, ''));
}
