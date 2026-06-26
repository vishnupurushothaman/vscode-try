import { test, expect } from '../../src/fixtures';
import {
  REQRES_LOGIN_VALID,
  REQRES_LOGIN_INVALID,
  REQRES_LOGIN_MISSING_PASSWORD,
  EXPECTED_RESPONSE_SCHEMAS,
} from '../../src/test-data/api.data';
import {
  assertRequiredFields,
  assertNonEmptyString,
  assertResponseTime,
} from '../../src/api/SchemaValidator';
import { LoginResponse, ApiError } from '../../src/types';

test.describe('Auth API — Reqres', () => {

  test('TC020 - POST /login returns 200 with valid credentials', async ({ authApi }) => {
    const res = await authApi.login(REQRES_LOGIN_VALID);
    expect(res.status).toBe(200);
  });

  test('TC021 - POST /login returns 400 for invalid credentials', async ({ authApi }) => {
    const res = await authApi.login(REQRES_LOGIN_INVALID);
    expect(res.status).toBe(400);
  });

  test('TC022 - POST /login response schema has token', async ({ authApi }) => {
    const res = await authApi.login(REQRES_LOGIN_VALID);
    expect(res.status).toBe(200);
    assertRequiredFields(res.body as Record<string, unknown>, EXPECTED_RESPONSE_SCHEMAS.login.requiredFields);
    const body = res.body as LoginResponse;
    assertNonEmptyString(body.token, 'token');
  });

  test('TC023 - POST /login response time under 1000ms', async ({ authApi }) => {
    const res = await authApi.login(REQRES_LOGIN_VALID);
    assertResponseTime(res.responseTimeMs, 1000);
  });

  test('TC177 - POST /login with missing password returns 400 with error', async ({ authApi }) => {
    const res = await authApi.loginMissingPassword(REQRES_LOGIN_MISSING_PASSWORD);
    expect(res.status).toBe(400);
    const body = res.body as ApiError;
    assertNonEmptyString(body.error, 'error message');
  });

  test('TC190 - authApi custom fixture provides working API context', async ({ authApi }) => {
    const res = await authApi.login(REQRES_LOGIN_VALID);
    expect(res.status).toBe(200);
    expect((res.body as LoginResponse).token).toBeTruthy();
  });
});
