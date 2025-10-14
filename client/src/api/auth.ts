// client/src/api/auth.ts
import { BACKEND_API_URL } from "@/configs/api";
import { fetchClient } from "@/utils/fetchClient";

const BASE_URL = `${BACKEND_API_URL}/api/email-auth`;

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export const login = async (email: string, password: string) => {
  console.log("🔍 [auth.ts] login function called");
  const endpoint = `${BASE_URL}/login`;
  console.log("🔍 [auth.ts] Endpoint:", endpoint);

  const requestBody = { email, password: password ? "provided" : "missing" }; // Mask password for logs
  console.log("🔍 [auth.ts] Request body:", requestBody);

  try {
    console.log("🔍 [auth.ts] Calling fetchClient with POST options");
    const response = await fetchClient(endpoint, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    console.log("🟢 [auth.ts] fetchClient response received:", response);

    // ✅ Because fetchClient returns parsed data already:
    if (!response || response.error) {
      console.error(
        "🔴 [auth.ts] Login failed - response has error:",
        response?.error
      );
      throw new Error(response?.error || "Login failed");
    }

    console.log("🟢 [auth.ts] Login successful - full response:", response);
    return response; // already JSON
  } catch (err) {
    console.error("🔴 [auth.ts] Exception during login:", err);
    throw err;
  }
};
