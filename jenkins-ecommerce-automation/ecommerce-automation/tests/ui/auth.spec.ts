import { test, expect } from '../../src/fixtures';
import { INVALID_USERS } from '../../src/test-data/users.data';
import { ENV } from '../../src/utils/env';

const STANDARD = ENV.users['standard']!;
const LOCKED = ENV.users['locked']!;

test.describe('Authentication', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC001 - valid login with standard user', async ({ loginPage }) => {
    await loginPage.loginAndExpectSuccess(STANDARD);
  });

  test('TC002 - locked out user sees error message', async ({ loginPage }) => {
    await loginPage.loginAndExpectError(LOCKED, 'Sorry, this user has been locked out');
  });

  test('TC005 - empty username shows field error', async ({ loginPage }) => {
    await loginPage.loginAndExpectError(INVALID_USERS.emptyUsername, 'Username is required');
  });

  test('TC006 - empty password shows field error', async ({ loginPage }) => {
    await loginPage.loginAndExpectError(INVALID_USERS.emptyPassword, 'Password is required');
  });

  test('TC007 - empty both fields shows error', async ({ loginPage }) => {
    await loginPage.loginAndExpectError(INVALID_USERS.emptyBoth, 'Username is required');
  });

  test('TC008 - SQL injection in username does not break app', async ({ loginPage }) => {
    await loginPage.loginAndExpectError(INVALID_USERS.sqlInjection);
    await expect(loginPage.page).toHaveURL('/');
  });

  test('TC009 - XSS in password field is handled safely', async ({ loginPage }) => {
    await loginPage.loginAndExpectError(INVALID_USERS.xss);
    const errorText = await loginPage.getErrorText();
    expect(errorText).not.toContain('<script>');
  });

  test('TC011 - login page loads within 2s', async ({ loginPage, page }) => {
    const start = Date.now();
    await loginPage.goto();
    await page.waitForLoadState('load');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  test('TC012 - logout clears session and redirects to login', async ({ authenticatedPage, page, sidebarPage }) => {
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('.bm-menu-wrap').waitFor({ state: 'visible' });
    await sidebarPage.logout();
    await expect(page).toHaveURL('/');
  });

  test('TC013 - back button after logout does not restore session', async ({ authenticatedPage, page, sidebarPage }) => {
    await page.locator('#react-burger-menu-btn').click();
    await sidebarPage.logout();
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('TC017 - tab key navigates between login form fields', async ({ page, loginPage }) => {
    await loginPage.usernameInput.focus();
    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
  });

  test('TC018 - enter key submits login form', async ({ loginPage, page }) => {
    await loginPage.fillUsername(STANDARD.username);
    await loginPage.fillPassword(STANDARD.password);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC019 - password field masks characters', async ({ loginPage }) => {
    const masked = await loginPage.isPasswordMasked();
    expect(masked).toBe(true);
  });
});
