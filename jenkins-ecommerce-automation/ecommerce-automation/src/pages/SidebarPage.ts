import { Page, Locator, expect } from '@playwright/test';

export class SidebarPage {
  readonly page: Page;
  readonly menuWrap: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuWrap = page.locator('.bm-menu-wrap');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async assertOpen(): Promise<void> {
    await expect(this.menuWrap).toHaveAttribute('aria-hidden', 'false');
  }

  async assertClosed(): Promise<void> {
    await expect(this.menuWrap).toHaveAttribute('aria-hidden', 'true');
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.assertClosed();
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
    await this.page.waitForURL(/.*inventory/);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForURL('/');
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }
}
