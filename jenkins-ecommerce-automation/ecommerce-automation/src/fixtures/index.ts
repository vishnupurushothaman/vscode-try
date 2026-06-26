import { test as base, expect, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage, CheckoutStepTwoPage, OrderSuccessPage } from '../pages/CheckoutPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SidebarPage } from '../pages/SidebarPage';
import { UserApi } from '../api/UserApi';
import { AuthApi } from '../api/AuthApi';
import { ENV } from '../utils/env';

// ---- Fixture Types ----

export type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOne: CheckoutStepOnePage;
  checkoutStepTwo: CheckoutStepTwoPage;
  orderSuccessPage: OrderSuccessPage;
  productDetailPage: ProductDetailPage;
  sidebarPage: SidebarPage;
};

export type AuthFixtures = {
  authenticatedPage: InventoryPage;
};

export type ApiFixtures = {
  userApi: UserApi;
  authApi: AuthApi;
};

export type AllFixtures = PageFixtures & AuthFixtures & ApiFixtures;

// ---- Extended Test ----

export const test = base.extend<AllFixtures>({

  // ---- Page Object Fixtures ----

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutStepOne: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },

  checkoutStepTwo: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },

  orderSuccessPage: async ({ page }, use) => {
    await use(new OrderSuccessPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  sidebarPage: async ({ page }, use) => {
    await use(new SidebarPage(page));
  },

  // ---- Authenticated Page Fixture ----
  // Provides an InventoryPage with user already logged in.
  // Uses storageState injection for speed — no re-login per test.

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndExpectSuccess({
      username: ENV.users['standard']!.username,
      password: ENV.users['standard']!.password,
    });
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.assertPageLoaded();
    await use(inventoryPage);
  },

  // ---- API Fixtures ----

  userApi: async ({ request }, use) => {
    await use(new UserApi(request));
  },

  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
});

export { expect };
