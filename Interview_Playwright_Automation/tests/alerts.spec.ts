import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/AlertsPage';

test.describe('Alerts & Popups', () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    await alertsPage.goto();
  });

  test('handles simple alert', async () => {
    const message = await alertsPage.handleSimpleAlert();
    expect(message).toBeTruthy();
  });

  test('accepts confirmation alert', async () => {
    const message = await alertsPage.handleConfirmAlert(true);
    expect(message).toBeTruthy();
  });

  test('dismisses confirmation alert', async () => {
    const message = await alertsPage.handleConfirmAlert(false);
    expect(message).toBeTruthy();
  });

  test('handles prompt alert with input text', async () => {
    const message = await alertsPage.handlePromptAlert('Zxz Kumar');
    expect(message).toBeTruthy();
  });

  test('opens a new tab', async ({ context }) => {
    const newPage = await alertsPage.openNewTab();
    expect(context.pages().length).toBeGreaterThan(1);
    await newPage.close();
  });

  test('opens a popup window', async () => {
    const popup = await alertsPage.openPopupWindow();
    expect(popup.url()).toBeTruthy();
    await popup.close();
  });
});
