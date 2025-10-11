import type { AuthSession } from "@/types/auth";
import type { AuthContextType } from "@/types/auth.context";
import { getSession, signOut, signInWithGoogle } from "@/utils/auth";
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

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      const sessionResult = await getSession();
      const u = sessionResult?.data?.user;
      if (u) {
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          picture: u.image || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  const refreshSession = async () => {
    const sessionResult = await getSession();
    const u = sessionResult?.data?.user;

    if (u) {
      setUser({
        id: u.id,
        name: u.name,
        email: u.email,
        picture: u.image || "",
      });
    } else {
      setUser(null);
    }
  };

  const signOutUser = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOutUser, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be with in an AuthProvider");
  return context;
};
