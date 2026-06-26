import { Page, Locator } from '@playwright/test';

/**
 * Covers the "Data Entry Form" section of the home page:
 * Name / Email / Phone / Address, Gender radios, Days checkboxes,
 * Country / Colors / Sorted-list selects, and the jQuery UI datepickers.
 */
export class DataEntryFormPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressTextarea: Locator;

  readonly maleRadio: Locator;
  readonly femaleRadio: Locator;

  readonly daysCheckboxGroup: Locator;

  readonly countryDropdown: Locator;
  readonly colorsMultiSelect: Locator;
  readonly sortedListMultiSelect: Locator;

  readonly datePicker1: Locator;
  readonly datePicker2: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressTextarea = page.locator('textarea[name="Address"]');

    this.maleRadio = page.locator('#sex-0');
    this.femaleRadio = page.locator('#sex-1');

    // Day checkboxes share name="weekday[]" — index/label needed to pick one
    this.daysCheckboxGroup = page.locator('input[name="weekday[]"]');

    this.countryDropdown = page.locator('select[name="country"]');
    this.colorsMultiSelect = page.locator('select[name="colors"]');
    this.sortedListMultiSelect = page.locator('select[name="animals"]');

    this.datePicker1 = page.locator('#datepicker');
    this.datePicker2 = page.locator('#datepicker2');
    this.submitButton = page.locator('button:has-text("Submit")').first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillBasicDetails(name: string, email: string, phone: string, address: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.addressTextarea.fill(address);
  }

  async selectGender(gender: 'male' | 'female') {
    if (gender === 'male') {
      await this.maleRadio.check();
    } else {
      await this.femaleRadio.check();
    }
  }

  /** Check one or more days by visible label text, e.g. ['Sunday', 'Wednesday'] */
  async selectDays(days: string[]) {
    for (const day of days) {
      // Each checkbox is followed by a text label node; match the parent block by text
      const checkbox = this.page
        .locator('label', { hasText: day })
        .locator('input[name="weekday[]"]');
      const fallback = this.page.locator(`input[name="weekday[]"][value="${day}"]`);

      if (await checkbox.count()) {
        await checkbox.check();
      } else {
        await fallback.check();
      }
    }
  }

  async selectCountry(country: string) {
    await this.countryDropdown.selectOption({ label: country });
  }

  async selectColors(colors: string[]) {
    await this.colorsMultiSelect.selectOption(colors);
  }

  async selectAnimals(animals: string[]) {
    await this.sortedListMultiSelect.selectOption(animals);
  }

  async setDatePicker1(date: string) {
    await this.datePicker1.fill(date);
    // jQuery UI datepicker opens a calendar overlay on focus/fill; dismiss it
    await this.page.keyboard.press('Escape');
  }

  async setDatePicker2(date: string) {
    await this.datePicker2.fill(date);
    await this.page.keyboard.press('Escape');
  }

  async submit() {
    await this.submitButton.click();
  }
}
