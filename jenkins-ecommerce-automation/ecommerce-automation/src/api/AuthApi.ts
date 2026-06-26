import { APIRequestContext } from '@playwright/test';
import { ApiClient, ApiResponse } from './ApiClient';
import { LoginPayload, LoginResponse, ApiError } from '../types';
import { ENV } from '../utils/env';

export class AuthApi extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request, ENV.apiBaseUrl);
  }

  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponse | ApiError>> {
    return this.post<LoginResponse | ApiError>('/login', payload);
  }

  async loginMissingPassword(payload: Partial<LoginPayload>): Promise<ApiResponse<ApiError>> {
    return this.post<ApiError>('/login', payload);
  }
}
