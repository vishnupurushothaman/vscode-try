import { test, expect } from '../../src/fixtures';

test.describe('Navigation & Routing', () => {

  test.beforeEach(async ({ authenticatedPage }) => {});

  test('TC113 - header logo navigates to inventory', async ({ page }) => {
    await page.locator('.app_logo').click();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC114 - burger menu opens sidebar', async ({ page, sidebarPage }) => {
    await page.locator('#react-burger-menu-btn').click();
    await sidebarPage.assertOpen();
  });

  test('TC115 - sidebar closes on X click', async ({ page, sidebarPage }) => {
    await page.locator('#react-burger-menu-btn').click();
    await sidebarPage.assertOpen();
    await sidebarPage.close();
  });

  test('TC116 - all items link navigates to inventory', async ({ page, sidebarPage }) => {
    await page.locator('#react-burger-menu-btn').click();
    await sidebarPage.clickAllItems();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC118 - logout via sidebar logs user out', async ({ page, sidebarPage }) => {
    await page.locator('#react-burger-menu-btn').click();
    await sidebarPage.logout();
    await expect(page).toHaveURL('/');
  });

  test('TC119 - reset app state clears cart', async ({ inventoryPage, page, sidebarPage }) => {
    await inventoryPage.addAllItemsToCart();
    await page.locator('#react-burger-menu-btn').click();
    await sidebarPage.resetAppState();
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).not.toBeVisible();
  });

  test('TC124 - cart icon in header navigates to cart', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('TC120 - direct URL to inventory without auth redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
  });

  test('TC121 - direct URL to cart without auth redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/cart.html');
    await expect(page).toHaveURL('/');
  });

  test('TC122 - direct URL to checkout without auth redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/checkout-step-one.html');
    await expect(page).toHaveURL('/');
  });

  test('TC126 - navigation works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  });
});
