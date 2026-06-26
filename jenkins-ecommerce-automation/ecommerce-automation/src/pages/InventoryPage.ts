import { Page, Locator, expect } from '@playwright/test';
import { SortOption } from '../types';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly burgerMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems).toHaveCount(6);
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async addToCartByName(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    const addButton = item.locator('button');
    await addButton.click();
  }

  async removeFromCartByName(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    const removeButton = item.locator('button');
    await removeButton.click();
  }

  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0');
  }

  async clickProductByName(productName: string): Promise<void> {
    await this.page.locator('.inventory_item_name', { hasText: productName }).click();
  }

  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openSidebar(): Promise<void> {
    await this.burgerMenu.click();
    await this.page.locator('.bm-menu-wrap').waitFor({ state: 'visible' });
  }

  async assertSortedByNameAZ(): Promise<void> {
    const names = await this.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  }

  async assertSortedByNameZA(): Promise<void> {
    const names = await this.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  }

  async assertSortedByPriceLowToHigh(): Promise<void> {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  }

  async assertSortedByPriceHighToLow(): Promise<void> {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  }

  async addAllItemsToCart(): Promise<void> {
    const addButtons = this.page.locator('[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
    }
  }
}
