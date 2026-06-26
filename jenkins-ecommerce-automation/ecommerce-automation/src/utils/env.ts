import * as dotenv from 'dotenv';
import { EnvironmentConfig } from '../types';

dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

export const ENV: EnvironmentConfig = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://reqres.in/api',
  users: {
    standard: {
      type: 'standard',
      username: process.env.STANDARD_USER ?? 'standard_user',
      password: process.env.USER_PASSWORD ?? 'secret_sauce',
    },
    locked: {
      type: 'locked',
      username: process.env.LOCKED_USER ?? 'locked_out_user',
      password: process.env.USER_PASSWORD ?? 'secret_sauce',
    },
    problem: {
      type: 'problem',
      username: process.env.PROBLEM_USER ?? 'problem_user',
      password: process.env.USER_PASSWORD ?? 'secret_sauce',
    },
    performanceGlitch: {
      type: 'performance_glitch',
      username: process.env.PERF_GLITCH_USER ?? 'performance_glitch_user',
      password: process.env.USER_PASSWORD ?? 'secret_sauce',
    },
  },
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT ?? '30000'),
    navigation: parseInt(process.env.NAVIGATION_TIMEOUT ?? '30000'),
    expect: parseInt(process.env.EXPECT_TIMEOUT ?? '10000'),
  },
};

export const REQRES_API_KEY = process.env.REQRES_API_KEY ?? 'reqres-free-v1';
