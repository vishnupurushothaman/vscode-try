import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/test-data/products.data';

test.describe('Shopping Cart', () => {

  test.beforeEach(async ({ authenticatedPage }) => {
    // authenticatedPage fixture handles login + lands on inventory
  });

  test('TC048 - empty cart shows no items', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.clickCart();
    await cartPage.assertEmpty();
  });

  test('TC049 - cart badge shows 1 after adding one item', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('TC050 - cart badge shows correct count for multiple items', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[1]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[2]!.name);
    expect(await inventoryPage.getCartCount()).toBe(3);
  });

  test('TC051 - all added products appear in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[1]!.name);
    await inventoryPage.clickCart();
    await cartPage.assertItemPresent(PRODUCTS[0]!.name);
    await cartPage.assertItemPresent(PRODUCTS[1]!.name);
  });

  test('TC052 - product name in cart matches catalog', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS[0]!.name);
  });

  test('TC053 - product price in cart matches catalog', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    const prices = await cartPage.getItemPrices();
    expect(prices[0]).toBeCloseTo(PRODUCTS[0]!.price, 2);
  });

  test('TC054 - removing item from cart reduces count', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[1]!.name);
    await inventoryPage.clickCart();
    await cartPage.removeItemByName(PRODUCTS[0]!.name);
    await cartPage.assertItemCount(1);
  });

  test('TC055 - removing all items empties cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.removeItemByName(PRODUCTS[0]!.name);
    await cartPage.assertEmpty();
  });

  test('TC056 - continue shopping returns to catalog', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.clickCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC057 - cart persists after page refresh', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await page.reload();
    await inventoryPage.clickCart();
    await cartPage.assertItemPresent(PRODUCTS[0]!.name);
  });

  test('TC058 - cart persists after navigating to catalog and back', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.clickCart();
    await cartPage.continueShopping();
    await inventoryPage.clickCart();
    await cartPage.assertItemPresent(PRODUCTS[0]!.name);
  });

  test('TC059 - add all 6 items, all appear in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addAllItemsToCart();
    await inventoryPage.clickCart();
    await cartPage.assertItemCount(6);
  });

  test('TC067 - cart subtotal is correctly calculated', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[1]!.name);
    await inventoryPage.clickCart();
    const expectedSubtotal = PRODUCTS[0]!.price + PRODUCTS[1]!.price;
    await cartPage.assertSubtotal(expectedSubtotal);
  });
});
