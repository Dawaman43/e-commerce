import { BACKEND_API_URL } from "@/configs/api";
import type {
  GetUsersResponse,
  GetUserResponse,
  AddUserRequest,
  AddUserResponse,
  BanUserRequest,
  BanUserResponse,
  DeleteUserResponse,
} from "@/types/admin";
import { fetchClient } from "@/utils/fetchClient";

const BASE_URL = `${BACKEND_API_URL}/api/admin`;

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

/** Add a new user or moderator */
export const addUsers = async (
  data: AddUserRequest
): Promise<AddUserResponse> => {
  console.log("[admin.ts] addUsers called with data:", data);
  const response = await fetchClient(`${BASE_URL}/add-users`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("[admin.ts] addUsers response:", response);
  return response;
};

/** Get all users with optional query params */
export const getUsers = async (
  query?: Record<string, any>
): Promise<GetUsersResponse> => {
  let queryString = "";
  if (query) {
    queryString =
      "?" +
      Object.entries(query)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
  }
  console.log("[admin.ts] getUsers called with query:", queryString);
  const response = await fetchClient(`${BASE_URL}/${queryString}`, {
    ...defaultOptions,
    method: "GET",
  });
  console.log("[admin.ts] getUsers response:", response);
  return response;
};

/** Get a single user by ID */
export const getUser = async (id: string): Promise<GetUserResponse> => {
  console.log("[admin.ts] getUser called with id:", id);
  const response = await fetchClient(`${BASE_URL}/${id}`, {
    ...defaultOptions,
    method: "GET",
  });
  console.log("[admin.ts] getUser response:", response);
  return response;
};

/** Delete a user by ID */
export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  console.log("[admin.ts] deleteUser called with id:", id);
  const response = await fetchClient(`${BASE_URL}/${id}`, {
    ...defaultOptions,
    method: "DELETE",
  });
  console.log("[admin.ts] deleteUser response:", response);
  return response;
};

/** Ban or unban a user */
export const banUser = async (
  id: string,
  data: BanUserRequest
): Promise<BanUserResponse> => {
  console.log("[admin.ts] banUser called with id:", id, "data:", data);
  const response = await fetchClient(`${BASE_URL}/ban/${id}`, {
    ...defaultOptions,
    method: "PATCH",
    body: JSON.stringify(data),
  });
  console.log("[admin.ts] banUser response:", response);
  return response;
};
