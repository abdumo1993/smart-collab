import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApiErrorData } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export class ApiClientError extends Error {
  public status: number;
  public data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData = {}) {
    super(message);
    this.name = 'ApiClientError';

    this.status = status;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }
}
