import { test, expect } from '@playwright/test';
import { InteractionsPage } from '../pages/InteractionsPage';

test.describe('Mouse & Interaction Elements', () => {
  let interactionsPage: InteractionsPage;

  test.beforeEach(async ({ page }) => {
    interactionsPage = new InteractionsPage(page);
    await interactionsPage.goto();
  });

  test('mouse hover reveals dropdown and clicks Laptops', async ({ page }) => {
    await interactionsPage.hoverAndClickMenuItem('Laptops');
    // Site jumps to/highlights a "Laptop Links" section; just assert no crash + element visible
    await expect(page.locator('text=Laptop Links')).toBeVisible();
  });

  test('double click copies text from field1 to field2', async () => {
    await interactionsPage.doubleClickToCopy('Hello Playwright');
    const value = await interactionsPage.getField2Value();
    expect(value).toBe('Hello Playwright');
  });

  test('drag and drop moves element into target', async () => {
    await interactionsPage.dragAndDrop();
    // After a successful drop, the draggable element is appended inside #droppable
    await expect(interactionsPage.dropTarget.locator('#draggable')).toBeVisible();
  });

  test('slider can be dragged to change value', async () => {
    const before = await interactionsPage.sliderRangeValue.textContent();
    await interactionsPage.dragSliderByOffset(80);
    const after = await interactionsPage.sliderRangeValue.textContent();
    expect(after).not.toBe(before);
  });
});
