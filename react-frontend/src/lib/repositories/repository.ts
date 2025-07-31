import { ApiResponse } from "../types";

import { User, UserCreating, UserUpdating } from "../types/users.types";

import { apiClient } from "../utils/api-client";
import { v4 as uuidv4 } from "uuid";

import useAuthStore from "@lib/stores/auth-store";
import { Doc } from "@lib/types/doc.types";
import { DocPrivilege } from "@lib/types/doc.types";
import { Collaborator } from "@lib/types/doc.types";

export const getProfile = async (
  accessToken: string
): Promise<ApiResponse<User>> => apiClient<ApiResponse<User>>(`/users/me`);

// Users CRUD
export const updateUser = (id: string, user: UserUpdating) =>
  apiClient<ApiResponse<User>>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
export const deleteUser = (id: string) =>
  apiClient<ApiResponse<any>>(`/users/${id}`, { method: "DELETE" });

// editor logic

export const createDocument = () => {
  const newDoc = {
    title: "new doc",
    docId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  /**
   export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T | null;
  statusCode: number;
  pagination?: PaginationData;
}
   */
  const r = {
    message: "done",
    success: true,
    data: newDoc,
    statusCode: 200,
  };
  return r;
  // return apiClient<ApiResponse<Doc>>(`/document/create`, {
  //   method: "POST",
  // });
};

// Documents API functions
export const inviteUserToDoc = (
  docId: string,
  email: string,
  privilege: DocPrivilege
) =>
  apiClient<ApiResponse<any>>(`/document/${docId}/invite`, {
    method: "POST",
    body: JSON.stringify({ email, privilege }),
  });

export const fetchCollaborators = (
  docId: string
): Promise<ApiResponse<Collaborator[]>> =>
  apiClient<ApiResponse<Collaborator[]>>(`/document/${docId}/collaborators`);

export const saveDocument = (docId: string, content: any) =>
  apiClient<ApiResponse<any>>(`/document/${docId}/save`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

export const exportDocument = (docId: string, format: "pdf" | "docs" | "txt") =>
  apiClient<ApiResponse<any>>(`/document/${docId}/export`, {
    method: "GET",
    headers: {
      "Content-Type": `application/${format}`,
    },
  });

export const fetchExistingDocs = (): Promise<ApiResponse<Doc[]>> =>
  apiClient<ApiResponse<Doc[]>>(`/document/all`);

export const editDocument = (docId: string, title: string) =>
  apiClient<ApiResponse<Doc>>(`/document/${docId}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });

export const deleteDocument = (docId: string) =>
  apiClient<ApiResponse<any>>(`/document/${docId}`, {
    method: "DELETE",
  });

// Metrics API functions

export const getSystemAlerts = () =>
  apiClient<
    ApiResponse<
      {
        id: string;
        type: "error" | "warning" | "success" | "info";
        title: string;
        message: string;
        actionLink?: string;
        actionText?: string;
      }[]
    >
  >("/metrics/alerts");
