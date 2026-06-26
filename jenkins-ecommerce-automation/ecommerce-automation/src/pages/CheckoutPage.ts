import { Page, Locator, expect } from '@playwright/test';
import { CheckoutInfo } from '../types';

export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async fillAndContinue(info: CheckoutInfo): Promise<void> {
    await this.fillInfo(info);
    await this.clickContinue();
    await this.page.waitForURL(/.*checkout-step-two/);
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async assertError(expectedText?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }

  async submitEmpty(): Promise<void> {
    await this.clickContinue();
    await expect(this.errorMessage).toBeVisible();
  }
}

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly orderTotal: Locator;
  readonly cartItems: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.taxAmount = page.locator('.summary_tax_label');
    this.orderTotal = page.locator('.summary_total_label');
    this.cartItems = page.locator('.cart_item');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getSubtotal(): Promise<number> {
    const text = (await this.itemTotal.textContent()) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTax(): Promise<number> {
    const text = (await this.taxAmount.textContent()) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotal(): Promise<number> {
    const text = (await this.orderTotal.textContent()) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async assertTotalMatchesSubtotalPlusTax(): Promise<void> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  async assertItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL(/.*checkout-complete/);
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }
}

export class OrderSuccessPage {
  readonly page: Page;
  readonly successHeader: Locator;
  readonly successMessage: Locator;
  readonly backHomeButton: Locator;
  readonly checkmarkImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeader = page.locator('.complete-header');
    this.successMessage = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.checkmarkImage = page.locator('.pony_express');
  }

  async assertSuccess(): Promise<void> {
    await expect(this.successHeader).toHaveText('Thank you for your order!');
    await expect(this.checkmarkImage).toBeVisible();
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
    await this.page.waitForURL(/.*inventory/);
  }
}
