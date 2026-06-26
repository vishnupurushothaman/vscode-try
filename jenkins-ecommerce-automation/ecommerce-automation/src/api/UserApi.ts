import { APIRequestContext } from '@playwright/test';
import { ApiClient, ApiResponse } from './ApiClient';
import {
  ReqresUser,
  ReqresListResponse,
  ReqresSingleResponse,
  CreateUserPayload,
  CreateUserResponse,
  UpdateUserPayload,
  UpdateUserResponse,
} from '../types';
import { ENV } from '../utils/env';

export class UserApi extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request, ENV.apiBaseUrl);
  }

  async getUsers(page = 1): Promise<ApiResponse<ReqresListResponse<ReqresUser>>> {
    return this.get<ReqresListResponse<ReqresUser>>('/users', { page });
  }

  async getUserById(id: number): Promise<ApiResponse<ReqresSingleResponse<ReqresUser>>> {
    return this.get<ReqresSingleResponse<ReqresUser>>(`/users/${id}`);
  }

  async createUser(payload: CreateUserPayload): Promise<ApiResponse<CreateUserResponse>> {
    return this.post<CreateUserResponse>('/users', payload);
  }

  async updateUser(id: number, payload: UpdateUserPayload): Promise<ApiResponse<UpdateUserResponse>> {
    return this.put<UpdateUserResponse>(`/users/${id}`, payload);
  }

  async patchUser(id: number, payload: UpdateUserPayload): Promise<ApiResponse<UpdateUserResponse>> {
    return this.patch<UpdateUserResponse>(`/users/${id}`, payload);
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return this.delete(`/users/${id}`);
  }
}
