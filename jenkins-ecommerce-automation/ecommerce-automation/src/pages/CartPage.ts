import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.emptyCartMessage = page.locator('.cart_list');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.cartItemPrices.allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    const removeBtn = item.locator('button');
    await removeBtn.click();
  }

  async assertItemPresent(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
  }

  async assertItemNotPresent(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).not.toBeVisible();
  }

  async assertEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async assertItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async assertSubtotal(expectedSubtotal: number): Promise<void> {
    const prices = await this.getItemPrices();
    const actual = prices.reduce((sum, p) => sum + p, 0);
    expect(parseFloat(actual.toFixed(2))).toBeCloseTo(expectedSubtotal, 2);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL(/.*checkout-step-one/);
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.page.waitForURL(/.*inventory/);
  }
}
