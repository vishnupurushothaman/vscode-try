import {test} from '@playwright/test'




test.describe('Automation Practice Suite', () => {


test('first page ',async ({page})=>{



    await page.goto('https://testautomationpractice.blogspot.com/')

       await  page.getByPlaceholder('Enter Name').fill('vishnu Purushothaman')
       await  page.locator('#email').fill('vishnu@gmail.com')
       await  page.getByRole('textbox', { name: 'Enter Phone' }).fill('1234567890')
       await  page.getByLabel('Address:').fill('am coming for the kill')
       await page.getByRole('radio', { name: 'Male', exact: true }).check();


       await page.locator('#datepicker').fill('05/15/2026');


       await page.locator('#start-date').click();
       await page.locator('.ui-datepicker-year').selectOption('2026');
       await page.locator('.ui-datepicker-month').selectOption('5');
       await page.getByRole('link', { name: '15' }).click();


})



test('Second page ',async ({page})=>{



    await page.goto('https://testautomationpractice.blogspot.com/p/playwrightpractice.html')

      //  await  page.getByPlaceholder('Enter Name').fill('vishnu Purushothaman')
      //  await  page.locator('#email').fill('vishnu@gmail.com')
      //  await  page.getByRole('textbox', { name: 'Enter Phone' }).fill('1234567890')
      //  await  page.getByLabel('Address:').fill('am coming for the kill')
      //  await page.getByRole('radio', { name: 'Male', exact: true }).check();


      //  await page.locator('#datepicker').fill('05/15/2026');


      //  await page.locator('#datepicker').click();
      //  await page.locator('.ui-datepicker-year').selectOption('2026');
      //  await page.locator('.ui-datepicker-month').selectOption('5');
      //  await page.getByRole('link', { name: '15' }).click();


})


});