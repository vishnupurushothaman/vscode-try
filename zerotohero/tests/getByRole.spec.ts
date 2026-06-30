import {test , expect } from 'playwright/test';
test.describe('Get By Role', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://testautomationpractice.blogspot.com/p/playwrightpractice.html') });    

    test('Get By Role - Button', async ({ page }) => {
        const button = page.getByRole('button', { name: 'Primary Action' });

        await expect(button).toBeVisible();

    //     await button .highlight();

    //     // This changes the actual CSS of the button on the page
    // await button.evaluate((node) => node.style.border = '4px solid red');
    // await button.evaluate((node) => node.style.backgroundColor = 'yellow');

    // await page.waitForTimeout(2000); // Wait for 2 seconds to see the changes
        
       
        await button.click();
          await page.screenshot({ path: 'screenshot.png' });
    
    })


    
// test('example test', async ({ page, browser }) => {
//   test.info().annotations.push({
//     type: 'browser version',
//     description: browser.version(),
//   });

//   // ...
// });

test('Get By Role - button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Div with button role' }); 
     await expect(button).toBeVisible();    
    await button.click();


})

test('Get By Role - form element', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Form Elements' }); 
     await expect(heading).toBeVisible();    


})

test('Get By Role - textbox', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Username' }); 
    await textbox.fill('John Doe');
     await expect(textbox).toHaveValue('John Doe');    


})
test('Get By Role - checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Accept Terms' }); 
    await checkbox.check();
     await expect(checkbox).toBeChecked();    


})

test('Get By Role - checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Accept Terms' }); 
    await checkbox.check();
     await expect(checkbox).toBeChecked();    


})
    









})