import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/test-data/products.data';
import { CHECKOUT_INFO } from '../../src/test-data/users.data';
import { ENV } from '../../src/utils/env';

test.describe('End-to-End Purchase Flows', () => {

  test('TC083 - full E2E: login → add item → checkout → success', async ({
    page, loginPage, inventoryPage, cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage
  }) => {
    await loginPage.goto();
    await loginPage.loginAndExpectSuccess(ENV.users['standard']!);

    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.clickCart();
    await cartPage.assertItemPresent(PRODUCTS[0]!.name);
    await cartPage.proceedToCheckout();

    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.assertTotalMatchesSubtotalPlusTax();
    await checkoutStepTwo.finish();

    await orderSuccessPage.assertSuccess();
  });

  test('TC084 - full E2E: 3 items → checkout → verify total accuracy', async ({
    page, loginPage, inventoryPage, cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage
  }) => {
    await loginPage.goto();
    await loginPage.loginAndExpectSuccess(ENV.users['standard']!);

    const selectedProducts = [PRODUCTS[0]!, PRODUCTS[1]!, PRODUCTS[2]!];
    const expectedSubtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    for (const product of selectedProducts) {
      await inventoryPage.addToCartByName(product.name);
    }

    await inventoryPage.clickCart();
    await cartPage.assertItemCount(3);
    await cartPage.proceedToCheckout();

    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);

    const actualSubtotal = await checkoutStepTwo.getSubtotal();
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

    await checkoutStepTwo.assertTotalMatchesSubtotalPlusTax();
    await checkoutStepTwo.finish();
    await orderSuccessPage.assertSuccess();
  });

  test('TC091 - checkout without login redirects to login page', async ({ page }) => {
    await page.goto('/checkout-step-one.html');
    await expect(page).toHaveURL('/');
  });

  test('TC179 - network intercept: mock API error on checkout step', async ({
    page, loginPage, inventoryPage, cartPage, checkoutStepOne
  }) => {
    await loginPage.goto();
    await loginPage.loginAndExpectSuccess(ENV.users['standard']!);

    await page.route('**/checkout*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
        contentType: 'application/json',
      });
    });

    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.proceedToCheckout();
    // App handles gracefully — step 1 form still renders from HTML
    await expect(checkoutStepOne.firstNameInput).toBeVisible();
  });

  test('TC181 - network intercept: verify login request is made on form submit', async ({
    page, loginPage
  }) => {
    let loginRequestCaptured = false;
    await loginPage.goto();

    await page.route('**', route => {
      if (route.request().url().includes('saucedemo.com')) {
        loginRequestCaptured = true;
      }
      route.continue();
    });

    await loginPage.loginAndExpectSuccess(ENV.users['standard']!);
    expect(loginRequestCaptured).toBe(true);
  });

  test('TC189 - custom authenticated fixture provides logged-in page', async ({
    authenticatedPage, page
  }) => {
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC191 - parallel workers do not share state between tests', async ({
    authenticatedPage, inventoryPage, cartPage
  }) => {
    // Each test gets its own browser context — cart starts empty
    await inventoryPage.clickCart();
    await cartPage.assertEmpty();
  });
});
