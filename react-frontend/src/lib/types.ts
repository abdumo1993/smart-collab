export type Alert = {
  id: string;
  type: "error" | "warning" | "success" | "info";
  title: string;
  message: string;
  actionLink?: string;
  actionText?: string;
};


export type PaginationData = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

export type LoginResult =
  | { success: boolean; accessToken: string; refreshToken: string; error: "" }
  | { success: false; accessToken: null; refreshToken: null; error: string };

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T | null;
  statusCode: number;
  pagination?: PaginationData;
}
export interface ApiErrorData {
  message?: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

