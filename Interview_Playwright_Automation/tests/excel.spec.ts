import exceljs from 'exceljs';
import { test, expect } from '@playwright/test';

interface CellChange {
  rowChange: number;
  colChange: number;
}

interface CellLocation {
  row: number;
  column: number;
}

async function writeExcelTest(
  searchText: string,
  replaceText: string,
  change: CellChange,
  filePath: string
): Promise<void> {
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) {
    throw new Error(`Worksheet 'Sheet1' not found in ${filePath}`);
  }

  const output = readExcel(worksheet, searchText);
  if (output.row === -1 || output.column === -1) {
    throw new Error(`Search text "${searchText}" not found in worksheet`);
  }

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

function readExcel(worksheet: exceljs.Worksheet, searchText: string): CellLocation {
  let output: CellLocation = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output = { row: rowNumber, column: colNumber };
      }
    });
  });
  return output;
}

test('Upload download excel validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;

  const filePath = await download.path();
  if (!filePath) {
    throw new Error('Download failed — no file path returned');
  }

  await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);

  await page.locator('#fileinput').setInputFiles(filePath);

  const desiredRow = page.getByRole('row').filter({ has: page.getByText(textSearch) });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});