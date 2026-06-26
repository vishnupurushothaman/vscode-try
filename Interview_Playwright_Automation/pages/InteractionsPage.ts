import { Page, Locator } from '@playwright/test';

/**
 * Covers Mouse Hover dropdown, Double Click copy-text, Drag and Drop, and the Slider.
 */
export class InteractionsPage {
  readonly page: Page;

  readonly mouseHoverTrigger: Locator;
  readonly mobilesMenuItem: Locator;
  readonly laptopsMenuItem: Locator;

  readonly field1: Locator;
  readonly field2: Locator;
  readonly copyTextBtn: Locator;

  readonly dragSource: Locator;
  readonly dropTarget: Locator;

  readonly sliderHandle: Locator;
  readonly sliderRangeValue: Locator;

  constructor(page: Page) {
    this.page = page;

    this.mouseHoverTrigger = page.locator('p:has-text("Point Me")');
    this.mobilesMenuItem = page.locator('a:has-text("Mobiles")');
    this.laptopsMenuItem = page.locator('a:has-text("Laptops")');

    this.field1 = page.locator('#field1');
    this.field2 = page.locator('#field2');
    this.copyTextBtn = page.locator('#copyText');

    this.dragSource = page.locator('#draggable');
    this.dropTarget = page.locator('#droppable');

    this.sliderHandle = page.locator('#slider span'); // jQuery UI handle
    this.sliderRangeValue = page.locator('#sliderValue');
  }

  async goto() {
    await this.page.goto('/');
  }

  async hoverAndClickMenuItem(item: 'Mobiles' | 'Laptops') {
    await this.mouseHoverTrigger.hover();
    if (item === 'Mobiles') {
      await this.mobilesMenuItem.click();
    } else {
      await this.laptopsMenuItem.click();
    }
  }

  async doubleClickToCopy(text: string) {
    await this.field1.fill(text);
    await this.copyTextBtn.dblclick();
  }

  async getField2Value(): Promise<string> {
    return this.field2.inputValue();
  }

  async dragAndDrop() {
    await this.dragSource.dragTo(this.dropTarget);
  }

  /** Drags the jQuery UI slider handle by a pixel offset (positive = right) */
  async dragSliderByOffset(offsetX: number) {
    const box = await this.sliderHandle.boundingBox();
    if (!box) throw new Error('Slider handle not found');
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + offsetX, startY, { steps: 10 });
    await this.page.mouse.up();
  }
}
