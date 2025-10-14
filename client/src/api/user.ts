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
    return await fetchClient(`${BASE_URL}/me`, { credentials: "include" });
  } catch (err) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated");

    return await fetchClient(`${BASE_URL}/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
