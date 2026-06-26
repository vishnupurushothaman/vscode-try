import { Page, Locator } from '@playwright/test';

/**
 * Covers Alerts & Popups (Simple/Confirm/Prompt), New Tab link, and Popup Window button.
 */
export class AlertsPage {
  readonly page: Page;
  readonly simpleAlertBtn: Locator;
  readonly confirmAlertBtn: Locator;
  readonly promptAlertBtn: Locator;
  readonly newTabLink: Locator;
  readonly popupWindowBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.simpleAlertBtn = page.locator('#alertBtn');
    this.confirmAlertBtn = page.locator('#confirmBtn');
    this.promptAlertBtn = page.locator('#promtBtn'); // site's actual (misspelled) id
    this.newTabLink = page.locator('a:has-text("Open New Tab")');
    this.popupWindowBtn = page.locator('#openwindow');
  }

  async goto() {
    await this.page.goto('/');
  }

  /** Clicks the simple alert button and accepts the alert, returning its message */
  async handleSimpleAlert(): Promise<string> {
    let message = '';
    this.page.once('dialog', async (dialog) => {
      message = dialog.message();
      await dialog.accept();
    });
    await this.simpleAlertBtn.click();
    return message;
  }

  /** Clicks the confirm alert and either accepts or dismisses it */
  async handleConfirmAlert(accept: boolean): Promise<string> {
    let message = '';
    this.page.once('dialog', async (dialog) => {
      message = dialog.message();
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
    await this.confirmAlertBtn.click();
    return message;
  }

  /** Clicks the prompt alert, types text, and accepts it */
  async handlePromptAlert(inputText: string): Promise<string> {
    let message = '';
    this.page.once('dialog', async (dialog) => {
      message = dialog.message();
      await dialog.accept(inputText);
    });
    await this.promptAlertBtn.click();
    return message;
  }

  /** Clicks the "Open New Tab" link and returns the new page/tab */
  async openNewTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.newTabLink.click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  /** Clicks the popup window button and returns the popup */
  async openPopupWindow(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.popupWindowBtn.click(),
    ]);
    await popup.waitForLoadState();
    return popup;
  }
}
