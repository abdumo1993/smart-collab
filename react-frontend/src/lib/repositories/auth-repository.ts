import { LoginResult, ApiResponse, TokensDto } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class AuthRepository {
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData: ApiResponse<TokensDto> = await response.json();
      if (!response.ok || !responseData.success || !responseData.data) {
        return {
          success: false,
          accessToken: null,
          refreshToken: null,
          error: responseData.message || "Login failed",
        };
      }

      const success = responseData.success;
      const { accessToken, refreshToken } = responseData.data!;
      return { success, accessToken, refreshToken, error: "" };
    } catch (error: any) {
      console.error("Login request failed:", error);
      return {
        success: false,
        accessToken: null,
        refreshToken: null,
        error: error.message || "Network error",
      };
    }
  }

  // this was commented, not working?
  async register(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData: ApiResponse<TokensDto> = await response.json();

      if (!response.ok || !responseData.success) {
        return {
          success: false,
          accessToken: null,
          refreshToken: null,
          error: responseData.message || "Registration failed",
        };
      }

      const { accessToken, refreshToken } = responseData.data!;
      return { success: true, accessToken, refreshToken, error: "" };
    } catch (error: any) {
      console.error("Register request failed:", error);
      return {
        success: false,
        accessToken: null,
        refreshToken: null,

        error: error.message || "Network error",
      };
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Server-side logout failed:", error);
    }
  }
}

export const authRepository = new AuthRepository();
