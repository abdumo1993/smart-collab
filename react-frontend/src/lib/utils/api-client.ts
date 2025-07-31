import useAuthStore from "@lib/stores/auth-store";
import { Mutex } from "async-mutex";

import { ApiErrorData } from "../types";
import { ApiClientError } from "../utils/utils";

const API_BASE_URL =
  import.meta.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";

const mutex = new Mutex();

export const apiClient = async <T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const authStore = useAuthStore.getState();

  const originalRequest = { endpoint, options };

  if (mutex.isLocked() && endpoint !== "/auth/refresh") {
    return mutex.runExclusive(async () => {
      return apiClient(originalRequest.endpoint, originalRequest.options);
    });
  }

  let headers: HeadersInit = {
    ...options?.headers,
  };

  if (
    authStore.accessToken &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/register")
  ) {
    headers = {
      Authorization: `Bearer ${authStore.accessToken}`,
      ...headers,
    };
  }

  if (
    !new Headers(headers).get("content-type") &&
    !(options?.body instanceof FormData)
  ) {
    headers = {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
      return mutex.runExclusive(async () => {
        const newAuthStore = useAuthStore.getState();
        if (newAuthStore.accessToken !== authStore.accessToken) {
          return apiClient(originalRequest.endpoint, originalRequest.options);
        }

        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authStore.refreshToken}`,
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newTokens = refreshData.data;

            useAuthStore
              .getState()
              .setTokens(newTokens.accessToken, newTokens.refreshToken);

            return apiClient(originalRequest.endpoint, originalRequest.options);
          } else {
            let refreshErrorData: ApiErrorData = {};
            try {
              refreshErrorData = await refreshResponse.json();
            } catch (parseError) {
              refreshErrorData.message = `Refresh API returned non-JSON or unparseable error.`;
            }
            throw new ApiClientError(
              refreshErrorData.message ||
                "Your session has expired. Please log in again.",
              refreshResponse.status,
              refreshErrorData
            );
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          throw refreshError;
        }
      });
    }

    if (!response.ok) {
      let errorData: ApiErrorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData.message = `Server responded with status ${response.status}: ${
          response.statusText || "Unknown Error"
        }`;
      }

      throw new ApiClientError(
        errorData.message || `API Error: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    // Check if the response is CSV
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("text/csv")) {
      return response.blob() as unknown as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    } else if (error instanceof Error) {
      throw new ApiClientError(
        `Network or client-side error: ${error.message}`,
        0,
        { message: error.message }
      );
    } else {
      throw new ApiClientError(
        `An unexpected error occurred: ${String(error)}`,
        0,
        { message: String(error) }
      );
    }
  }
};
