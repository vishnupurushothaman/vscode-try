# E-Commerce Automation Suite

Production-grade Playwright + TypeScript automation framework targeting Sauce Demo (UI) and Reqres (API). Built for senior QA Engineer interviews at the 4+ year experience level.

## Tech Stack

- **Playwright** v1.44 — cross-browser automation
- **TypeScript** — strict mode, path aliases, full type safety
- **Allure** — rich HTML reports with steps, screenshots, and attachments
- **GitHub Actions** — matrix CI across Chromium, Firefox, WebKit
- **Jenkins** — declarative pipeline with parallel browser stages, nightly cron, Allure integration
- **dotenv** — environment-based configuration

## Project Structure

```
ecommerce-automation/
├── src/
│   ├── pages/          Page Object Model classes
│   ├── api/            API client layer (UserApi, AuthApi, SchemaValidator)
│   ├── fixtures/       Custom Playwright test fixtures
│   ├── utils/          env loader, helpers, logger
│   ├── test-data/      Typed test data (users, products, API payloads)
│   └── types/          Shared TypeScript interfaces
├── tests/
│   ├── ui/             UI spec files (auth, inventory, cart, checkout, navigation, edge-cases)
│   ├── api/            API spec files (users, auth)
│   ├── e2e/            Full end-to-end flows
│   └── visual/         Visual regression snapshots
├── .github/workflows/  GitHub Actions CI pipeline
├── jenkins/             Jenkinsfile (PR), Jenkinsfile.nightly, JENKINS_SETUP.md
├── playwright.config.ts
├── tsconfig.json
└── .env
```

## Getting Started

### 1. Install dependencies

```bash
npm install
npx playwright install --with-deps
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values (defaults work for Sauce Demo)
```

### 3. Run tests

```bash
# All tests
npm test

# By suite
npm run test:ui
npm run test:api
npm run test:e2e
npm run test:visual

# By browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug mode
npm run test:debug
```

### 4. Reports

```bash
# Generate and open Allure report
npm run allure:serve

# Or step-by-step
npm run allure:generate
npm run allure:open
```

### 5. Jenkins

See [`jenkins/JENKINS_SETUP.md`](jenkins/JENKINS_SETUP.md) for full setup instructions.

Two pipelines are provided:

- `jenkins/Jenkinsfile` — PR/push pipeline with parallel browser stages and parameterized suite selection
- `jenkins/Jenkinsfile.nightly` — full nightly regression across all browsers, triggered at 2 AM via cron

## Key Patterns

### Custom Fixtures

All page objects and API clients are injected via custom fixtures — no manual instantiation in specs:

```typescript
test('checkout flow', async ({ authenticatedPage, inventoryPage, cartPage }) => {
  // authenticatedPage = already logged in, on inventory
  await inventoryPage.addToCartByName('Sauce Labs Backpack');
  await inventoryPage.clickCart();
  ...
});
```

### API Testing

```typescript
test('create user returns 201', async ({ userApi }) => {
  const res = await userApi.createUser({ name: 'John', job: 'QA Engineer' });
  expect(res.status).toBe(201);
  assertNonEmptyString(res.body.id, 'id');
});
```

### Visual Regression

```typescript
await expect(page).toHaveScreenshot('inventory-page.png', { maxDiffPixelRatio: 0.02 });
```

## Test Coverage

| Module               | Count |
|----------------------|-------|
| Authentication       | 23    |
| Product Catalog      | 24    |
| Shopping Cart        | 20    |
| Checkout Flow        | 27    |
| User Management API  | 18    |
| Navigation & Routing | 15    |
| Performance & Load   | 10    |
| Visual Regression    | 15    |
| Cross-Browser        | 13    |
| Edge Cases           | 35    |
| **Total**            | **200** |

## CI Pipeline

The GitHub Actions workflow runs a matrix of browser × suite combinations on every push and PR, generating a combined Allure report deployed to GitHub Pages.
