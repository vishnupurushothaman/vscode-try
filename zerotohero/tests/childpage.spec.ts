import {test, expect} from '@playwright/test';

test.describe('Popup Handling', () => {




     test.beforeEach(async ({ page }) => {
     await page.goto('https://testautomationpractice.blogspot.com/p/playwrightpractice.html') });

     test('child window handling - new tab @reg ',async ({page})=>{

        const [newPage] = await Promise.all([

            page.context().waitForEvent('page'),
            page.getByRole('button', { name: 'New Tab' }).click()])

            await newPage.waitForLoadState();


            console.log(newPage.url());
             await newPage.close();


    });

         test('popup window @reg ',async ({page})=>{

        const [newPage] = await Promise.all([

            page.context().waitForEvent('page'),
            page.getByRole('button', { name: 'Popup Windows' }).click()])

            await newPage.waitForLoadState();


            console.log(newPage.url());
             await newPage.close();


    });


    });