import { APIRequestContext } from '@playwright/test';

interface LoginPayLoad {
  userEmail: string;
  userPassword: string;
}

interface OrderPayLoad {
  orders: Array<{ country: string; productOrderedId: string }>;
}

interface ApiResponse {
  token: string;
  orderId: string;
}

interface LoginResponse {
  token: string;
}

interface OrderResponse {
  orders: string[];
}

export class APiUtils {
  private apiContext: APIRequestContext;
  private loginPayLoad: LoginPayLoad;

  constructor(apiContext: APIRequestContext, loginPayLoad: LoginPayLoad) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.loginPayLoad,
      }
    );
    const loginResponseJson: LoginResponse = await loginResponse.json();
    const token: string = loginResponseJson.token;
    console.log(token);
    return token;
  }

  async createOrder(orderPayLoad: OrderPayLoad): Promise<ApiResponse> {
    const response: ApiResponse = { token: "", orderId: "" };
    response.token = await this.getToken();

    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayLoad,
        headers: {
          Authorization: response.token,
          "Content-Type": "application/json",
        },
      }
    );

    const orderResponseJson: OrderResponse = await orderResponse.json();
    console.log(orderResponseJson);
    const orderId: string = orderResponseJson.orders[0];
    response.orderId = orderId;

    return response;
  }
}
