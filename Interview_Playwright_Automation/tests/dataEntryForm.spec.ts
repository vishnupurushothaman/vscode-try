import { test, expect } from '@playwright/test';
import { DataEntryFormPage } from '../pages/DataEntryFormPage';

test.describe('Data Entry Form', () => {
  let formPage: DataEntryFormPage;

  test.beforeEach(async ({ page }) => {
    formPage = new DataEntryFormPage(page);
    await formPage.goto();
  });

  test('fills basic text fields correctly', async () => {
    await formPage.fillBasicDetails(
      'Zxz Kumar',
      'zxz.kumar@example.com',
      '9876543210',
      'Payyanur, Kerala, India'
    );

    await expect(formPage.nameInput).toHaveValue('Zxz Kumar');
    await expect(formPage.emailInput).toHaveValue('zxz.kumar@example.com');
    await expect(formPage.phoneInput).toHaveValue('9876543210');
    await expect(formPage.addressTextarea).toHaveValue('Payyanur, Kerala, India');
  });

  test('selects gender radio button', async () => {
    await formPage.selectGender('female');
    await expect(formPage.femaleRadio).toBeChecked();
    await expect(formPage.maleRadio).not.toBeChecked();
  });

  test('selects multiple day checkboxes', async () => {
    await formPage.selectDays(['Monday', 'Wednesday', 'Friday']);

    const monday = formPage.page.locator('input[name="weekday[]"][value="Monday"]');
    const wednesday = formPage.page.locator('input[name="weekday[]"][value="Wednesday"]');
    const friday = formPage.page.locator('input[name="weekday[]"][value="Friday"]');

    await expect(monday).toBeChecked();
    await expect(wednesday).toBeChecked();
    await expect(friday).toBeChecked();
  });

  test('selects a country from dropdown', async () => {
    await formPage.selectCountry('India');
    await expect(formPage.countryDropdown).toHaveValue(/India/i);
  });

  test('selects multiple colors from multi-select', async () => {
    await formPage.selectColors(['Red', 'Green']);
    const selected = await formPage.colorsMultiSelect.locator('option:checked').allTextContents();
    expect(selected.map((s) => s.trim())).toEqual(expect.arrayContaining(['Red', 'Green']));
  });

  test('sets date in Date Picker 1', async () => {
    await formPage.setDatePicker1('06/22/2026');
    await expect(formPage.datePicker1).toHaveValue('06/22/2026');
  });

  test('end-to-end: fills entire form and submits', async ({ page }) => {
    await formPage.fillBasicDetails(
      'Zxz Kumar',
      'zxz.kumar@example.com',
      '9876543210',
      'Payyanur, Kerala, India'
    );
    await formPage.selectGender('male');
    await formPage.selectDays(['Saturday', 'Sunday']);
    await formPage.selectCountry('India');
    await formPage.selectColors(['Blue']);
    await formPage.setDatePicker1('06/22/2026');

    await formPage.submit();
    // The page reloads on submit (GET form); confirm we're still on the same page
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });
});
