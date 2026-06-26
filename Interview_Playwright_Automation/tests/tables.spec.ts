import { test, expect } from '@playwright/test';
import { TablesPage } from '../pages/TablesPage';

test.describe('Web Tables', () => {
  let tablesPage: TablesPage;

  test.beforeEach(async ({ page }) => {
    tablesPage = new TablesPage(page);
    await tablesPage.goto();
  });

  test('reads all rows from the static table', async () => {
    const rows = await tablesPage.getStaticTableRows();
    expect(rows.length).toBeGreaterThan(0);
    // First data row should be "Learn Selenium"
    expect(rows[0][0]).toContain('Learn Selenium');
  });

  test('finds price for a specific book', async () => {
    const price = await tablesPage.getPriceForBook('Master In Java');
    expect(price).toBe('2000');
  });

  test('dynamic table has rows after load', async () => {
    const count = await tablesPage.getDynamicTableRowCount();
    expect(count).toBeGreaterThan(0);
  });
});
