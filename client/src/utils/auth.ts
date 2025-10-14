import { authClient } from "./authClient";
import { BACKEND_API_URL, FRONTEND_API_URL } from "@/configs/api";

/* =========================================================
   🔹 Token Helpers
========================================================= */
export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("🔍 [auth.ts] getToken called, token exists:", !!token);
  return token;
};

/* =========================================================
   🔹 Google Sign-In (BetterAuth)
========================================================= */
export const signInWithGoogle = async () => {
  console.log("🔍 [auth.ts] signInWithGoogle called");

  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${BACKEND_API_URL}/api/auth/google/callback`,
      errorCallbackURL: `${FRONTEND_API_URL}/error`,
      disableRedirect: false,
    });

    console.log("🟢 [auth.ts] signInWithGoogle succeeded");
  } catch (error) {
    console.error("🔴 [auth.ts] Google signin failed:", error);
  }
};

/* =========================================================
   🔹 Get Session (BetterAuth or Token Fallback)
========================================================= */
export const getSession = async () => {
  console.log("🔍 [auth.ts] getSession called");

  try {
    // Try BetterAuth session
    console.log("🔍 [auth.ts] Attempting BetterAuth session...");
    const session = await authClient.getSession();

    console.log(
      "🔍 [auth.ts] BetterAuth session:",
      !!session?.data?.user ? "found" : "not found"
    );

    if (session?.data?.user) {
      console.log("🟢 [auth.ts] Returning BetterAuth session");
      return session;
    }

    // Token fallback
    const token = getToken();
    if (token) {
      console.log("🔍 [auth.ts] Verifying token via backend...");

      const res = await fetch(
        `${BACKEND_API_URL}/api/email-auth/verify-token`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🔍 [auth.ts] Verify token response status:", res.status);
      console.log(
        "🔍 [auth.ts] Verify token response headers:",
        Object.fromEntries(res.headers.entries())
      );

      const rawText = await res.text();
      console.log(
        "🔍 [auth.ts] Raw verify response (first 200 chars):",
        rawText.substring(0, 200)
      );

      if (!res.ok) {
        console.error("🔴 [auth.ts] Verify failed:", rawText);
        throw new Error(`HTTP ${res.status}: ${rawText}`);
      }

      let user;
      try {
        user = JSON.parse(rawText);
      } catch (parseErr) {
        console.error(
          "🔴 [auth.ts] Invalid JSON response from backend:",
          parseErr
        );
        throw new Error("Invalid JSON response from backend");
      }

      console.log("🟢 [auth.ts] Token verified successfully:", user);
      return { data: { user, type: "token" } };
    }

    console.log("🔍 [auth.ts] No session or token found");
    return null;
  } catch (error) {
    console.error("🔴 [auth.ts] getSession failed:", error);
    return null;
  }
};

/* =========================================================
   🔹 Sign Out (BetterAuth + Token)
========================================================= */
export const signOut = async () => {
  console.log("🔍 [auth.ts] signOut called");

  try {
    await authClient.signOut();
    console.log("🟢 [auth.ts] BetterAuth sign-out succeeded");
  } catch (error) {
    console.warn("⚠️ [auth.ts] BetterAuth sign-out failed:", error);
  }

  localStorage.removeItem("token");
  console.log("🟢 [auth.ts] Token removed from localStorage");
};

/* =========================================================
   🔹 Get Current User (Token-based)
========================================================= */
export const getCurrentUser = async () => {
  console.log("🔍 [auth.ts] getCurrentUser called");

  const token = getToken();
  if (!token) {
    console.log("🔍 [auth.ts] No token, returning null");
    return null;
  }

  try {
    console.log("🔍 [auth.ts] Fetching current user from backend...");
    const res = await fetch(`${BACKEND_API_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("🔍 [auth.ts] Current user response status:", res.status);
    console.log(
      "🔍 [auth.ts] Current user response headers:",
      Object.fromEntries(res.headers.entries())
    );

    const rawText = await res.text();
    console.log(
      "🔍 [auth.ts] Raw current user body (first 200 chars):",
      rawText.substring(0, 200)
    );

    if (!res.ok) {
      console.error("🔴 [auth.ts] Backend returned error:", rawText);
      return null;
    }

    let userData;
    try {
      userData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error(
        "🔴 [auth.ts] JSON parse failed on current user:",
        parseErr,
        "Raw:",
        rawText
      );
      return null;
    }

    console.log("🟢 [auth.ts] Current user fetched:", userData);
    return userData; // Expected shape: { success: true, user: {...} }
  } catch (err) {
    console.error("🔴 [auth.ts] Failed to get current user:", err);
    return null;
  }
};
