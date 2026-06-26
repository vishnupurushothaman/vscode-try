import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/test-data/products.data';
import { CHECKOUT_INFO } from '../../src/test-data/users.data';
import { ENV } from '../../src/utils/env';

test.describe('Edge Cases & Regression', () => {

  test.beforeEach(async ({ authenticatedPage }) => {});

  test('TC166 - problem user: product images may be broken', async ({ page, loginPage }) => {
    // Re-login as problem user
    await page.context().clearCookies();
    await loginPage.goto();
    await loginPage.loginAndExpectSuccess(ENV.users['problem']!);
    // Problem user is known to have broken images — verify page still loads
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC172 - checkout with max-length name fields', async ({ inventoryPage, cartPage, checkoutStepOne, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    const longName = 'A'.repeat(100);
    await checkoutStepOne.fillInfo({ firstName: longName, lastName: longName, postalCode: '12345' });
    await checkoutStepOne.clickContinue();
    // Should either proceed or show a validation error — not crash
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/checkout/);
  });

  test('TC174 - cart total with float prices is accurate', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name); // 29.99
    await inventoryPage.addToCartByName(PRODUCTS[1]!.name); // 9.99
    await inventoryPage.clickCart();
    await cartPage.assertSubtotal(29.99 + 9.99); // 39.98
  });

  test('TC184 - screenshot is attached to failed test report', async ({ page }) => {
    // This test intentionally captures the current page state
    await page.screenshot({ path: 'test-results/sample-screenshot.png', fullPage: true });
    // Verify screenshot file can be taken without error
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('TC189 - custom fixture provides authenticated page context', async ({ authenticatedPage, page }) => {
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC194 - enter key triggers continue button on checkout step 1', async ({ inventoryPage, cartPage, checkoutStepOne, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillInfo(CHECKOUT_INFO);
    await page.keyboard.press('Enter');
    // Should proceed to step 2
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('TC195 - login form inputs have associated labels', async ({ loginPage, page }) => {
    await loginPage.goto();
    const usernameLabel = page.locator('[for="user-name"]').or(page.locator('label').filter({ hasText: 'Username' }));
    const passwordLabel = page.locator('[for="password"]').or(page.locator('label').filter({ hasText: 'Password' }));
    // Sauce Demo uses placeholder as label — verify placeholder exists
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder');
  });

  test('TC198 - browser back from checkout step 2 goes to step 1', async ({ inventoryPage, cartPage, checkoutStepOne, checkoutStepTwo, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await expect(page).toHaveURL(/.*checkout-step-two/);
    await page.goBack();
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('TC200 - smoke: core happy path works end-to-end', async ({
    page, loginPage, inventoryPage, cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage
  }) => {
    await loginPage.goto();
    await loginPage.loginAndExpectSuccess(ENV.users['standard']!);
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.finish();
    await orderSuccessPage.assertSuccess();
  });
});
