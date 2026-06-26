import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : parseInt(process.env.WORKERS ?? '4'),
  timeout: parseInt(process.env.DEFAULT_TIMEOUT ?? '30000'),

  expect: {
    timeout: parseInt(process.env.EXPECT_TIMEOUT ?? '10000'),
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
    },
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: process.env.ALLURE_RESULTS_DIR ?? 'allure-results',
      suiteTitle: false,
    }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT ?? '30000'),
    actionTimeout: 15000,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    //   testMatch: '**/mobile/**/*.spec.ts',
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 13'] },
    //   testMatch: '**/mobile/**/*.spec.ts',
    // },
    {
      name: 'api-tests',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://reqres.in/api',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REQRES_API_KEY ?? '',
        },
      },
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});
