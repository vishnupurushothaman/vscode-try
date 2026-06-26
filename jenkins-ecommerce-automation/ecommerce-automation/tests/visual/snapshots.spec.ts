import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/test-data/products.data';
import { CHECKOUT_INFO } from '../../src/test-data/users.data';
import { ENV } from '../../src/utils/env';

test.describe('Visual Regression', () => {

  test.use({
    viewport: { width: 1280, height: 720 },
  });

  test('TC138 - login page snapshot baseline', async ({ loginPage, page }) => {
    await loginPage.goto();
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC141 - inventory page snapshot baseline', async ({ authenticatedPage, page }) => {
    await expect(page).toHaveScreenshot('inventory-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC142 - product detail page snapshot', async ({ authenticatedPage, inventoryPage, page }) => {
    await inventoryPage.clickProductByName(PRODUCTS[0]!.name);
    await expect(page).toHaveScreenshot('product-detail.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC143 - cart page snapshot with items', async ({ authenticatedPage, inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await expect(page).toHaveScreenshot('cart-with-items.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC144 - cart page snapshot when empty', async ({ authenticatedPage, inventoryPage, cartPage, page }) => {
    await inventoryPage.clickCart();
    await expect(page).toHaveScreenshot('cart-empty.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC145 - checkout step 1 snapshot', async ({ authenticatedPage, inventoryPage, cartPage, checkoutStepOne, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveScreenshot('checkout-step-one.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC146 - checkout step 2 snapshot', async ({ authenticatedPage, inventoryPage, cartPage, checkoutStepOne, checkoutStepTwo, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await expect(page).toHaveScreenshot('checkout-step-two.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC147 - order success page snapshot', async ({ authenticatedPage, inventoryPage, cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.finish();
    await expect(page).toHaveScreenshot('order-success.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC149 - login error message snapshot', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginAndExpectError({ username: '', password: '' });
    await expect(page).toHaveScreenshot('login-error.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('TC150 - inventory mobile viewport snapshot', async ({ authenticatedPage, page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page).toHaveScreenshot('inventory-mobile.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
