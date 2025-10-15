// auth-provider.tsx - Full updated version with type fixes
import type { AuthSession } from "@/types/auth";
import type { AuthContextType } from "@/types/auth.context";
import {
  getSession,
  signOut,
  signInWithGoogle,
  getCurrentUser,
  getToken,
  refreshBetterAuthSession,
} from "@/utils/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BACKEND_API_URL } from "@/configs/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(
    "🔍 [AuthProvider] Render - current user state:",
    user ? "logged in" : "null",
    "loading:",
    loading
  );

  // Unified setter: Full normalization
  const setUserFromData = (u: Partial<AuthSession> | null) => {
    console.log(
      "🔍 [AuthProvider] setUserFromData called with:",
      u ? { id: u.id, role: u.role } : "null"
    );
    if (!u) {
      setUser(null);
      console.log("🟢 [AuthProvider] User state cleared to null");
      return;
    }

    const normalizedUser: AuthSession = {
      id: u.id || u.authId || "",
      name: u.name || "",
      email: u.email || "",
      picture: u.picture || u.image || "",
      avatarUrl: u.avatarUrl || "",
      role: u.role || "user",
      walletBalance: u.walletBalance ?? 0,
      location: u.location || "",
      isVerified: u.isVerified ?? false,
      totalPurchases: u.totalPurchases ?? 0,
      totalSales: u.totalSales ?? 0,
    };
    setUser(normalizedUser);
    console.log("🟢 [AuthProvider] User state set:", normalizedUser);
  };

  const loadSession = async (opts?: { disableCookieCache?: boolean }) => {
    // Add opts
    console.log(
      "🔍 [AuthProvider] loadSession called",
      opts ? "(with cache invalidation)" : ""
    );
    setLoading(true);
    try {
      let combinedUser: Partial<AuthSession> & {
        authId?: string;
        image?: string;
      } = {}; // Temp for merge

      // 1️⃣ Get BetterAuth session with optional invalidation
      const sessionResult = await getSession(opts);
      if (sessionResult?.data?.user) {
        console.log("🟢 [AuthProvider] BetterAuth session found");
        combinedUser = { ...combinedUser, ...sessionResult.data.user };
      }

      // 2️⃣ Fetch backend /me (with token if avail, else cookies for session)
      let backendResult = null;
      const token = getToken();
      if (token) {
        backendResult = await getCurrentUser();
      } else {
        console.log(
          "🔍 [AuthProvider] No token, fetching /me with credentials"
        );
        const res = await fetch(`${BACKEND_API_URL}/api/user/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          backendResult = data; // { success: true, user: {...} }
        }
      }
      if (backendResult?.user) {
        console.log("🟢 [AuthProvider] Backend /me user found");
        combinedUser = { ...combinedUser, ...backendResult.user };
      }

      if (Object.keys(combinedUser).length > 0) {
        setUserFromData(combinedUser); // Use unified setter
      } else {
        setUserFromData(null);
      }
    } catch (err) {
      console.error("🔴 [AuthProvider] loadSession error:", err);
      setUserFromData(null);
    } finally {
      setLoading(false);
      console.log("🟢 [AuthProvider] loadSession complete, loading=false");
    }
  };

  useEffect(() => {
    console.log("🔍 [AuthProvider] useEffect - loading initial session");
    loadSession({ disableCookieCache: true }); // Enable invalidation on init
  }, []);

  const refreshSession = async (opts?: { disableCookieCache?: boolean }) => {
    // Add opts
    console.log(
      "🔍 [AuthProvider] refreshSession called",
      opts ? "(with cache invalidation)" : ""
    );
    try {
      // First, try BetterAuth refresh + invalidation
      const sessionResult = await refreshBetterAuthSession(); // Handles expiration
      if (sessionResult?.data?.user) {
        console.log("🟢 [AuthProvider] Refresh: Session from BetterAuth found");
        setUserFromData(sessionResult.data.user);
        return;
      }

      // Fallback: Fresh getSession + backend
      console.log(
        "🔍 [AuthProvider] Refresh: No BetterAuth, reloading full session"
      );
      await loadSession(opts); // Reuse loadSession for consistency
    } catch (err) {
      console.error("🔴 [AuthProvider] refreshSession error:", err);
      setUserFromData(null);
    } finally {
      console.log("🟢 [AuthProvider] refreshSession complete");
    }
  };

  const logout = async () => {
    console.log("🔍 [AuthProvider] signOutUser called");
    try {
      await signOut();
    } catch (err) {
      console.error("🔴 [AuthProvider] signOutUser error:", err);
    } finally {
      setUser(null);
      console.log("🟢 [AuthProvider] signOutUser complete, user=null");
    }
  };

  const updateUser = async (updates: Partial<AuthSession>) => {
    console.log("🔍 [AuthProvider] updateUser called with:", updates);
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${BACKEND_API_URL}/api/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const updatedUserData = await response.json();
      console.log("🟢 [AuthProvider] Update response:", updatedUserData);

      const updatedUser = updatedUserData.user || updatedUserData;
      setUserFromData({ ...user, ...updatedUser }); // Merge with existing for completeness

      // Sync BetterAuth with invalidation
      await refreshSession({ disableCookieCache: true });
    } catch (error) {
      console.error("🔴 [AuthProvider] updateUser error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        refreshSession,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
