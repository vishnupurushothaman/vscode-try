import { Page, Locator, expect } from '@playwright/test';
import { UserCredentials } from '../types';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.clickLogin();
  }

  async loginAndExpectSuccess(credentials: UserCredentials): Promise<void> {
    await this.login(credentials);
    await expect(this.page).toHaveURL(/.*inventory/);
  }

  async loginAndExpectError(credentials: UserCredentials, errorText?: string): Promise<void> {
    await this.login(credentials);
    await expect(this.errorMessage).toBeVisible();
    if (errorText) {
      await expect(this.errorMessage).toContainText(errorText);
    }
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
    await expect(this.errorMessage).not.toBeVisible();
  }

  async isPasswordMasked(): Promise<boolean> {
    return (await this.passwordInput.getAttribute('type')) === 'password';
  }
}
