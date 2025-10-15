import { BACKEND_API_URL } from "@/configs/api";
import type { User } from "@/types/user";
import { fetchClient } from "@/utils/fetchClient";

const BASE_URL = `${BACKEND_API_URL}/api/user`;

// Default options with BetterAuth session
const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  try {
    console.log("Fetching current user with credentials...");
    const response = await fetchClient(`${BASE_URL}/me`, {
      credentials: "include",
    });
    console.log("Response from /me with credentials:", response);
    return response;
  } catch (err) {
    console.warn("Failed to fetch with credentials:", err);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      throw new Error("User is not authenticated");
    }

    console.log("Fetching current user with Bearer token...");
    const response = await fetchClient(`${BASE_URL}/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response from /me with token:", response);
    return response;
  }
};

export const updateUserProfile = async (
  data: Partial<User>
): Promise<{ user: User }> => {
  return await fetchClient(`${BASE_URL}/update`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const refreshGoogleUser = async (): Promise<{ user: User }> => {
  return await fetchClient(`${BASE_URL}/refresh`, defaultOptions);
};
