import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/test-data/products.data';

test.describe('Product Catalog', () => {

  test.beforeEach(async ({ authenticatedPage }) => {
    // authenticatedPage fixture handles login + lands on inventory
  });

  test('TC024 - all 6 products visible on inventory page', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC025 - each product has name, price and description', async ({ page }) => {
    const names = await page.locator('.inventory_item_name').allTextContents();
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const descs = await page.locator('.inventory_item_desc').allTextContents();
    expect(names.length).toBe(6);
    expect(prices.length).toBe(6);
    expect(descs.length).toBe(6);
    names.forEach(n => expect(n.trim()).not.toBe(''));
    prices.forEach(p => expect(p.trim()).toMatch(/\$\d+\.\d{2}/));
  });

  test('TC026 - sort by name A-Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    await inventoryPage.assertSortedByNameAZ();
  });

  test('TC027 - sort by name Z-A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    await inventoryPage.assertSortedByNameZA();
  });

  test('TC028 - sort by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    await inventoryPage.assertSortedByPriceLowToHigh();
  });

  test('TC029 - sort by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    await inventoryPage.assertSortedByPriceHighToLow();
  });

  test('TC030 - product images load without error', async ({ page }) => {
    const images = page.locator('.inventory_item_img img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toContain('undefined');
    }
  });

  test('TC031 - clicking product name opens detail page', async ({ inventoryPage, page }) => {
    await inventoryPage.clickProductByName(PRODUCTS[0]!.name);
    await expect(page).toHaveURL(/.*inventory-item/);
    await expect(page.locator('.inventory_details_name')).toHaveText(PRODUCTS[0]!.name);
  });

  test('TC032 - clicking product image opens detail page', async ({ page }) => {
    await page.locator('.inventory_item_img').first().click();
    await expect(page).toHaveURL(/.*inventory-item/);
  });

  test('TC033 - back button from detail returns to catalog', async ({ inventoryPage, productDetailPage, page }) => {
    await inventoryPage.clickProductByName(PRODUCTS[0]!.name);
    await productDetailPage.goBack();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC036 - add to cart from product card updates badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('TC037 - add to cart from detail page', async ({ inventoryPage, productDetailPage }) => {
    await inventoryPage.clickProductByName(PRODUCTS[0]!.name);
    await productDetailPage.addToCart();
    const count = await productDetailPage.page.locator('.shopping_cart_badge');
    await expect(count).toHaveText('1');
  });

  test('TC038 - cart badge increments with each added item', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[1]!.name);
    await inventoryPage.addToCartByName(PRODUCTS[2]!.name);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(3);
  });

  test('TC040 - remove item from catalog card decrements badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS[0]!.name);
    await inventoryPage.removeFromCartByName(PRODUCTS[0]!.name);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(0);
  });

  test('TC047 - inventory page loads within 2s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/inventory.html');
    await page.waitForLoadState('load');
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
