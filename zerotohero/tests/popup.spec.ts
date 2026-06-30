import {test, expect} from '@playwright/test';

test.describe('Popup Handling', () => {




     test.beforeEach(async ({ page }) => {
     await page.goto('https://testautomationpractice.blogspot.com/p/playwrightpractice.html') });

       test('Popup Handling 1',async ({page})=>{

       

        page.on('dialog', async dialog => {
            // Verify that the dialog is actually an alert
            expect(dialog.type()).toBe('alert'); 
            
            // Verify the text inside the alert
            expect(dialog.message()).toBe('I am an alert box!'); 
            
            // Accept the alert (Clicks "OK")
            await dialog.accept(); 
        });

        
        await page.getByRole('button', { name: 'Simple Alert' }).click();
      //successfully handled the alert 


})

       test('Popup Handling 2',async ({page})=>{

       

        page.on('dialog', async dialog => {
            // Verify that the dialog is actually an alert
            expect(dialog.type()).toBe('confirm'); 
            
            // Verify the text inside the alert
            expect(dialog.message()).toBe('Press a button!'); 
            
            // Accept the alert (Clicks "OK")
            await dialog.dismiss(); 
        });

        
        await page.getByRole('button', { name: 'Confirmation Alert' }).click();
      //successfully handled the alert 


})
      test('Popup Handling 3',async ({page})=>{

       

        page.on('dialog', async dialog => {
            // Verify that the dialog is actually an alert
            expect(dialog.type()).toBe('prompt');
            // Verify the text inside the prompt
            expect(dialog.message()).toBe('Please enter your name:');
            // Provide a value for the prompt
            await dialog.accept('John Doe');
        });

        await page.getByRole('button', { name: 'Prompt' }).click();

        //  await expect(page.locator('text=Hello Harry Potter!')).toBeVisible();
        await expect(page.locator('text=Hello John Doe!')).toBeVisible();
       

        //successfully handled the prompt
    })


})
   
