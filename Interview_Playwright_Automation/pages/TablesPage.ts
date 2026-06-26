import { Page, Locator } from '@playwright/test';

/**
 * Covers Static Web Table, Dynamic Web Table, and Pagination Web Table.
 */
export class TablesPage {
  readonly page: Page;
  readonly staticTable: Locator;
  readonly dynamicTableRows: Locator;
  readonly paginationTable: Locator;
  readonly paginationNextBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.staticTable = page.locator('table.geeky.center').first();
    this.dynamicTableRows = page.locator('#productTable tbody tr');
    this.paginationTable = page.locator('#productTable1');
    this.paginationNextBtn = page.locator('#productTable1_next');
  }

  async goto() {
    await this.page.goto('/');
  }

  /** Returns all rows from the static Book/Author/Subject/Price table as text arrays */
  async getStaticTableRows(): Promise<string[][]> {
    const rows = this.staticTable.locator('tbody tr');
    const count = await rows.count();
    const result: string[][] = [];
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      for (let j = 0; j < cellCount; j++) {
        rowData.push((await cells.nth(j).innerText()).trim());
      }
      result.push(rowData);
    }
    return result;
  }

  /** Finds the price for a given book name in the static table */
  async getPriceForBook(bookName: string): Promise<string | null> {
    const row = this.staticTable.locator('tr', { hasText: bookName });
    if (await row.count()) {
      const cells = row.locator('td');
      return (await cells.last().innerText()).trim();
    }
    return null;
  }

  async getDynamicTableRowCount(): Promise<number> {
    return this.dynamicTableRows.count();
  }

  async goToNextPaginationPage() {
    await this.paginationNextBtn.click();
  }
}
