// Updated AuthProvider with more logs
import type { AuthSession } from "@/types/auth";
import type { AuthContextType } from "@/types/auth.context";
import {
  getSession,
  signOut,
  signInWithGoogle,
  getCurrentUser,
} from "@/utils/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

  const setUserFromData = (u: any) => {
    console.log(
      "🔍 [AuthProvider] setUserFromData called with:",
      u ? { id: u.id, role: u.role } : "null"
    );
    if (u) {
      const newUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        picture: u.image || "",
        role: u.role || "user",
        avatarUrl: u.avatarUrl || "",
      };
      setUser(newUser);
      console.log("🟢 [AuthProvider] User state set:", newUser);
    } else {
      setUser(null);
      console.log("🟢 [AuthProvider] User state cleared to null");
    }
  };

  const loadSession = async () => {
    console.log("🔍 [AuthProvider] loadSession called");
    setLoading(true);
    try {
      // 1️⃣ Try BetterAuth session first
      console.log("🔍 [AuthProvider] Step 1: Getting session");
      const sessionResult = await getSession();
      if (sessionResult?.data?.user) {
        console.log("🟢 [AuthProvider] Session from BetterAuth found");
        setUserFromData(sessionResult.data.user);
        setLoading(false);
        return;
      }

      // 2️⃣ Fallback to JWT token
      console.log("🔍 [AuthProvider] Step 2: Getting current user from token");
      const tokenUser = await getCurrentUser();
      if (tokenUser?.user) {
        console.log("🟢 [AuthProvider] User from token found");
        setUserFromData(tokenUser.user);
        setLoading(false);
        return;
      }

      // 3️⃣ No session or token
      console.log("🔍 [AuthProvider] No session or token found");
      setUser(null);
    } catch (err) {
      console.error("🔴 [AuthProvider] loadSession error:", err);
      setUser(null);
    } finally {
      setLoading(false);
      console.log("🟢 [AuthProvider] loadSession complete, loading=false");
    }
  };

  useEffect(() => {
    console.log("🔍 [AuthProvider] useEffect - loading initial session");
    loadSession();
  }, []);

  const refreshSession = async () => {
    console.log("🔍 [AuthProvider] refreshSession called");
    try {
      const sessionResult = await getSession();
      if (sessionResult?.data?.user) {
        console.log("🟢 [AuthProvider] Refresh: Session from BetterAuth found");
        setUserFromData(sessionResult.data.user);
        return;
      } else {
        console.log("🔍 [AuthProvider] Refresh: No BetterAuth, trying token");
        const tokenUser = await getCurrentUser();
        if (tokenUser?.user) {
          console.log("🟢 [AuthProvider] Refresh: User from token found");
          setUserFromData(tokenUser.user);
          return;
        } else {
          console.log("🔍 [AuthProvider] Refresh: No token user");
          setUser(null);
          return;
        }
      }
    } catch (err) {
      console.error("🔴 [AuthProvider] refreshSession error:", err);
      setUser(null);
    }
    console.log("🟢 [AuthProvider] refreshSession complete");
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

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, logout, refreshSession }}
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
