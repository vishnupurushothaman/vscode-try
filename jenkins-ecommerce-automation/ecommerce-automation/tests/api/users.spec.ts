import { test, expect } from '../../src/fixtures';
import {
  VALID_USER_ID,
  INVALID_USER_ID,
  PAGE_TWO,
  CREATE_USER_PAYLOAD,
  UPDATE_USER_PAYLOAD,
  PATCH_USER_PAYLOAD,
  EXPECTED_RESPONSE_SCHEMAS,
} from '../../src/test-data/api.data';
import {
  assertRequiredFields,
  assertNonEmptyString,
  assertPositiveInt,
  assertResponseTime,
  assertNonEmptyArray,
} from '../../src/api/SchemaValidator';

test.describe('User API — Reqres', () => {

  test('TC095 - GET /users returns 200 with paginated list', async ({ userApi }) => {
    const res = await userApi.getUsers(1);
    expect(res.status).toBe(200);
    assertRequiredFields(res.body as Record<string, unknown>, EXPECTED_RESPONSE_SCHEMAS.userList.requiredFields);
    assertNonEmptyArray(res.body.data, 'data');
  });

  test('TC096 - GET /users?page=2 returns second page', async ({ userApi }) => {
    const res = await userApi.getUsers(PAGE_TWO);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    assertNonEmptyArray(res.body.data, 'page 2 data');
  });

  test('TC097 - GET /users/:id returns single user', async ({ userApi }) => {
    const res = await userApi.getUserById(VALID_USER_ID);
    expect(res.status).toBe(200);
    assertRequiredFields(res.body.data as Record<string, unknown>, EXPECTED_RESPONSE_SCHEMAS.user.requiredFields);
    expect(res.body.data.id).toBe(VALID_USER_ID);
  });

  test('TC098 - GET /users/:id with invalid id returns 404', async ({ userApi }) => {
    const res = await userApi.getUserById(INVALID_USER_ID);
    expect(res.status).toBe(404);
  });

  test('TC099 - GET /users response body schema is valid', async ({ userApi }) => {
    const res = await userApi.getUsers(1);
    expect(res.status).toBe(200);
    const user = res.body.data[0]!;
    assertPositiveInt(user.id, 'user.id');
    assertNonEmptyString(user.email, 'user.email');
    assertNonEmptyString(user.first_name, 'user.first_name');
    assertNonEmptyString(user.last_name, 'user.last_name');
    assertNonEmptyString(user.avatar, 'user.avatar');
  });

  test('TC100 - POST /users creates user and returns 201', async ({ userApi }) => {
    const res = await userApi.createUser(CREATE_USER_PAYLOAD);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(CREATE_USER_PAYLOAD.name);
    expect(res.body.job).toBe(CREATE_USER_PAYLOAD.job);
  });

  test('TC101 - POST /users response contains id and createdAt', async ({ userApi }) => {
    const res = await userApi.createUser(CREATE_USER_PAYLOAD);
    expect(res.status).toBe(201);
    assertRequiredFields(res.body as Record<string, unknown>, EXPECTED_RESPONSE_SCHEMAS.createUser.requiredFields);
    assertNonEmptyString(res.body.id, 'id');
    assertNonEmptyString(res.body.createdAt, 'createdAt');
  });

  test('TC104 - PUT /users/:id updates all fields', async ({ userApi }) => {
    const res = await userApi.updateUser(VALID_USER_ID, UPDATE_USER_PAYLOAD);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(UPDATE_USER_PAYLOAD.name);
    expect(res.body.job).toBe(UPDATE_USER_PAYLOAD.job);
  });

  test('TC105 - PUT /users/:id response schema is valid', async ({ userApi }) => {
    const res = await userApi.updateUser(VALID_USER_ID, UPDATE_USER_PAYLOAD);
    expect(res.status).toBe(200);
    assertRequiredFields(res.body as Record<string, unknown>, EXPECTED_RESPONSE_SCHEMAS.updateUser.requiredFields);
    assertNonEmptyString(res.body.updatedAt, 'updatedAt');
  });

  test('TC106 - PATCH /users/:id partial update returns 200', async ({ userApi }) => {
    const res = await userApi.patchUser(VALID_USER_ID, PATCH_USER_PAYLOAD);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(PATCH_USER_PAYLOAD.name);
  });

  test('TC193 - PATCH response contains updatedAt field', async ({ userApi }) => {
    const res = await userApi.patchUser(VALID_USER_ID, PATCH_USER_PAYLOAD);
    expect(res.status).toBe(200);
    assertNonEmptyString(res.body.updatedAt, 'updatedAt');
  });

  test('TC107 - DELETE /users/:id returns 204', async ({ userApi }) => {
    const res = await userApi.deleteUser(VALID_USER_ID);
    expect(res.status).toBe(204);
  });

  test('TC108 - GET /users response time under 800ms', async ({ userApi }) => {
    const res = await userApi.getUsers(1);
    assertResponseTime(res.responseTimeMs, 800);
  });

  test('TC109 - POST /users response time under 1000ms', async ({ userApi }) => {
    const res = await userApi.createUser(CREATE_USER_PAYLOAD);
    assertResponseTime(res.responseTimeMs, 1000);
  });

  test('TC112 - GET /users total count matches per_page * total_pages roughly', async ({ userApi }) => {
    const res = await userApi.getUsers(1);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.total_pages).toBeGreaterThan(0);
  });
});
