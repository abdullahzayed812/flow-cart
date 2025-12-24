import ApiService from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return ApiService.post("/auth/login", credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return ApiService.post("/auth/register", data);
  }

  async getProfile() {
    return ApiService.get("/auth/me");
  }

  async applyMerchant(data: any) {
    return ApiService.post("/auth/merchant/apply", data);
  }
}

export default new AuthService();
