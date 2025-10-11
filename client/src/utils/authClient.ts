import { BACKEND_API_URL } from "@/configs/api";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: BACKEND_API_URL,
});
