import { test, expect, request } from '@playwright/test';
import { APiUtils } from '../utils/APiUtils';


interface LoginPayLoad {
  userEmail: string;
  userPassword: string;
}

interface OrderPayLoad {
  orders: Array<{ country: string; productOrderedId: string }>;
}

interface ApiResponse {
  token: string;
  orderId: string;
}

const loginPayLoad: LoginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad: OrderPayLoad = { orders: [{ country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8" }] };
const fakePayLoadOrders: any = { data: [], message: "No Orders" };

let response: ApiResponse;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});
test('@SP Place the order', async ({ page }) => {
  page.addInitScript((value: string) => {
    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");
 
 
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill(
        {
          response,
          body, 
 
        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });
 
  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
 
  console.log(await page.locator(".mt-4").textContent());

});