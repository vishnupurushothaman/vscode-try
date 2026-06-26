import { APIRequestContext } from '@playwright/test';

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
  responseTimeMs: number;
}

export class ApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  protected buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  async get<T>(path: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    const start = Date.now();
    const url = new URL(this.buildUrl(path));
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }
    const response = await this.request.get(url.toString());
    const body = await response.json().catch(() => null) as T;
    return {
      status: response.status(),
      body,
      headers: response.headers(),
      responseTimeMs: Date.now() - start,
    };
  }

  async post<T>(path: string, payload: unknown): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.post(this.buildUrl(path), { data: payload });
    const body = await response.json().catch(() => null) as T;
    return {
      status: response.status(),
      body,
      headers: response.headers(),
      responseTimeMs: Date.now() - start,
    };
  }

  async put<T>(path: string, payload: unknown): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.put(this.buildUrl(path), { data: payload });
    const body = await response.json().catch(() => null) as T;
    return {
      status: response.status(),
      body,
      headers: response.headers(),
      responseTimeMs: Date.now() - start,
    };
  }

  async patch<T>(path: string, payload: unknown): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.patch(this.buildUrl(path), { data: payload });
    const body = await response.json().catch(() => null) as T;
    return {
      status: response.status(),
      body,
      headers: response.headers(),
      responseTimeMs: Date.now() - start,
    };
  }

  async delete(path: string): Promise<ApiResponse<null>> {
    const start = Date.now();
    const response = await this.request.delete(this.buildUrl(path));
    return {
      status: response.status(),
      body: null,
      headers: response.headers(),
      responseTimeMs: Date.now() - start,
    };
  }
}
