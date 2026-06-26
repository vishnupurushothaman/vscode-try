import { UserCredentials, CheckoutInfo } from '../types';
import { ENV } from '../utils/env';

export const USERS = {
  standard: ENV.users['standard'] as UserCredentials & { username: string; password: string },
  locked: ENV.users['locked'] as UserCredentials & { username: string; password: string },
  problem: ENV.users['problem'] as UserCredentials & { username: string; password: string },
  performanceGlitch: ENV.users['performanceGlitch'] as UserCredentials & { username: string; password: string },
};

export const CHECKOUT_INFO: CheckoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

export const CHECKOUT_INFO_UNICODE: CheckoutInfo = {
  firstName: 'Ångström',
  lastName: 'Müller',
  postalCode: '10115',
};

export const INVALID_USERS = {
  wrongPassword: { username: 'standard_user', password: 'wrong_pass' },
  wrongUsername: { username: 'no_such_user', password: 'secret_sauce' },
  emptyBoth: { username: '', password: '' },
  emptyUsername: { username: '', password: 'secret_sauce' },
  emptyPassword: { username: 'standard_user', password: '' },
  sqlInjection: { username: "' OR '1'='1", password: "' OR '1'='1" },
  xss: { username: '<script>alert(1)</script>', password: 'secret_sauce' },
  whitespace: { username: ' standard_user ', password: 'secret_sauce' },
};
