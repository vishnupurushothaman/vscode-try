import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/test-data/products.data';
import { CHECKOUT_INFO, CHECKOUT_INFO_UNICODE } from '../../src/test-data/users.data';
import { calculateTotal, calculateTax } from '../../src/utils/helpers';

test.describe('Checkout Flow', () => {

  test.beforeEach(async ({ authenticatedPage, inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
  });

  test('TC068 - checkout step 1 form renders', async ({ cartPage, checkoutStepOne, page }) => {
    await cartPage.proceedToCheckout();
    await expect(checkoutStepOne.firstNameInput).toBeVisible();
    await expect(checkoutStepOne.lastNameInput).toBeVisible();
    await expect(checkoutStepOne.postalCodeInput).toBeVisible();
    await expect(checkoutStepOne.continueButton).toBeVisible();
  });

  test('TC069 - first name required validation', async ({ cartPage, checkoutStepOne }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillInfo({ firstName: '', lastName: 'Doe', postalCode: '12345' });
    await checkoutStepOne.clickContinue();
    await checkoutStepOne.assertError('First Name is required');
  });

  test('TC070 - last name required validation', async ({ cartPage, checkoutStepOne }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillInfo({ firstName: 'John', lastName: '', postalCode: '12345' });
    await checkoutStepOne.clickContinue();
    await checkoutStepOne.assertError('Last Name is required');
  });

  test('TC071 - postal code required validation', async ({ cartPage, checkoutStepOne }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillInfo({ firstName: 'John', lastName: 'Doe', postalCode: '' });
    await checkoutStepOne.clickContinue();
    await checkoutStepOne.assertError('Postal Code is required');
  });

  test('TC072 - all fields empty shows error', async ({ cartPage, checkoutStepOne }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.submitEmpty();
  });

  test('TC073 - valid info moves to step 2', async ({ cartPage, checkoutStepOne, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('TC074 - step 2 shows order summary', async ({ cartPage, checkoutStepOne, checkoutStepTwo }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await expect(checkoutStepTwo.itemTotal).toBeVisible();
    await expect(checkoutStepTwo.orderTotal).toBeVisible();
  });

  test('TC075 - item total on step 2 matches cart total', async ({ cartPage, checkoutStepOne, checkoutStepTwo }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    const subtotal = await checkoutStepTwo.getSubtotal();
    expect(subtotal).toBeCloseTo(PRODUCTS[0]!.price, 2);
  });

  test('TC076 - tax amount is shown on step 2', async ({ cartPage, checkoutStepOne, checkoutStepTwo }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await expect(checkoutStepTwo.taxAmount).toBeVisible();
    const tax = await checkoutStepTwo.getTax();
    expect(tax).toBeGreaterThan(0);
  });

  test('TC077 - grand total equals subtotal plus tax', async ({ cartPage, checkoutStepOne, checkoutStepTwo }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.assertTotalMatchesSubtotalPlusTax();
  });

  test('TC078 - finish button completes the order', async ({ cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.finish();
    await orderSuccessPage.assertSuccess();
  });

  test('TC079 - success page shows thank you message', async ({ cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.finish();
    await expect(orderSuccessPage.successHeader).toHaveText('Thank you for your order!');
  });

  test('TC080 - back home after success navigates to inventory', async ({ cartPage, checkoutStepOne, checkoutStepTwo, orderSuccessPage, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    await checkoutStepTwo.finish();
    await orderSuccessPage.backHome();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC081 - cancel from step 1 returns to cart', async ({ cartPage, checkoutStepOne, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.clickCancel();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('TC092 - checkout with unicode characters in name fields', async ({ cartPage, checkoutStepOne, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO_UNICODE);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('TC094 - checkout response completes within 3s', async ({ cartPage, checkoutStepOne, checkoutStepTwo, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillAndContinue(CHECKOUT_INFO);
    const start = Date.now();
    await checkoutStepTwo.finish();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });
});
