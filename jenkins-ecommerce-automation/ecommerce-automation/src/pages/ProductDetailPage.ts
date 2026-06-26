import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.productImage = page.locator('.inventory_details_img');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async assertProductName(expectedName: string): Promise<void> {
    await expect(this.productName).toHaveText(expectedName);
  }

  async assertProductPrice(expectedPrice: string): Promise<void> {
    await expect(this.productPrice).toHaveText(expectedPrice);
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await expect(this.removeButton).toBeVisible();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
    await expect(this.addToCartButton).toBeVisible();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  async assertImageLoaded(): Promise<void> {
    await expect(this.productImage).toBeVisible();
    const src = await this.productImage.getAttribute('src');
    expect(src).toBeTruthy();
  }
}
