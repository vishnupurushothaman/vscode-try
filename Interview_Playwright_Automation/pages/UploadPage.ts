import { Page, Locator } from '@playwright/test';

/**
 * Covers the Upload Files section (single + multiple file inputs).
 */
export class UploadPage {
  readonly page: Page;
  readonly singleFileInput: Locator;
  readonly multipleFileInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.singleFileInput = page.locator('#singleFileInput');
    this.multipleFileInput = page.locator('#multipleFileInput');
  }

  async goto() {
    await this.page.goto('/');
  }

  async uploadSingleFile(filePath: string) {
    await this.singleFileInput.setInputFiles(filePath);
  }

  async uploadMultipleFiles(filePaths: string[]) {
    await this.multipleFileInput.setInputFiles(filePaths);
  }

  async clearSingleFile() {
    await this.singleFileInput.setInputFiles([]);
  }
}
