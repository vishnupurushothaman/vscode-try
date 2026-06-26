import { CreateUserPayload, UpdateUserPayload, LoginPayload } from '../types';

export const VALID_USER_ID = 2;
export const INVALID_USER_ID = 9999;
export const PAGE_ONE = 1;
export const PAGE_TWO = 2;

export const CREATE_USER_PAYLOAD: CreateUserPayload = {
  name: 'John Automation',
  job: 'QA Engineer',
};

export const CREATE_USER_EMPTY_NAME: Partial<CreateUserPayload> = {
  job: 'QA Engineer',
};

export const CREATE_USER_EMPTY_JOB: Partial<CreateUserPayload> = {
  name: 'John Automation',
};

export const UPDATE_USER_PAYLOAD: UpdateUserPayload = {
  name: 'Jane Automation',
  job: 'Senior QA Engineer',
};

export const PATCH_USER_PAYLOAD: UpdateUserPayload = {
  name: 'Patched User',
};

export const REQRES_LOGIN_VALID: LoginPayload = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

export const REQRES_LOGIN_INVALID: LoginPayload = {
  email: 'invalid@reqres.in',
  password: 'wrongpassword',
};

export const REQRES_LOGIN_MISSING_PASSWORD = {
  email: 'eve.holt@reqres.in',
};

export const EXPECTED_RESPONSE_SCHEMAS = {
  user: {
    requiredFields: ['id', 'email', 'first_name', 'last_name', 'avatar'],
  },
  userList: {
    requiredFields: ['page', 'per_page', 'total', 'total_pages', 'data'],
  },
  createUser: {
    requiredFields: ['name', 'job', 'id', 'createdAt'],
  },
  updateUser: {
    requiredFields: ['name', 'job', 'updatedAt'],
  },
  login: {
    requiredFields: ['token'],
  },
};
