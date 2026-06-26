import path from 'path';
import { test, expect } from '@playwright/test';
import { UploadPage } from '../pages/UploadPage';

test.describe('File Upload', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ page }) => {
    uploadPage = new UploadPage(page);
    await uploadPage.goto();
  });

  test('uploads a single file', async () => {
    const filePath = path.join(__dirname, '..', 'test-data', 'sample1.txt');
    await uploadPage.uploadSingleFile(filePath);

    const fileName = await uploadPage.singleFileInput.evaluate(
      (input: HTMLInputElement) => input.files?.[0]?.name
    );
    expect(fileName).toBe('sample1.txt');
  });

  test('uploads multiple files', async () => {
    const filePaths = ['sample2.txt', 'sample3.txt'].map((f) =>
      path.join(__dirname, '..', 'test-data', f)
    );
    await uploadPage.uploadMultipleFiles(filePaths);

    const fileCount = await uploadPage.multipleFileInput.evaluate(
      (input: HTMLInputElement) => input.files?.length
    );
    expect(fileCount).toBe(2);
  });
});
