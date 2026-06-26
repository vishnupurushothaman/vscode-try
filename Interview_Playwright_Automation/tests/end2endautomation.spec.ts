import { test, expect, Page } from '@playwright/test';

test('@Webst Client App login', async ({ page }: { page: Page }) => {
   //js file- Login js, DashboardPage
   const email: string = "anshika@gmail.com";
   const productName: string = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Iamking@000");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles: string[] = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   const count: number = await products.count();
   for (let i: number = 0; i < count; ++i) {
      const textContent: string | null = await products.nth(i).locator("b").textContent();
      if (textContent === productName) {
         //add to cart
         await products.nth(i).locator("text= Add To Cart").click();
         break;
      }
   }
 
   await page.locator("[routerlink*='cart']").click();
   //await page.pause();
 
   await page.locator("div li").first().waitFor();
   const bool: boolean = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();
 
  await page.getByPlaceholder('Select Country').pressSequentially("ind", { delay: 150 });
   const dropdown: any = page.locator(".ta-results");
   await dropdown.waitFor();
   const optionsCount: number = await dropdown.locator("button").count();
   for (let i: number = 0; i < optionsCount; ++i) {
      const text: string | null = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }
 
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId: string | null = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);
 
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows: any = page.locator("tbody tr");

   for (let i: number = 0; i < await rows.count(); ++i) {
      const rowOrderId: string | null = await rows.nth(i).locator("th").textContent();
      if (orderId?.includes(rowOrderId ?? "")) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails: string | null = await page.locator(".col-text").textContent();
   expect(orderId?.includes(orderIdDetails ?? "")).toBeTruthy();
});
 