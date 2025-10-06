import React, { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  token: z.string().optional(),
});

type User = z.infer<typeof userSchema>;

type AuthContextType = {
  user: User | null;
  setUser: (data: unknown) => void;
};
const AuthProviderContext = createContext<AuthContextType | undefined>(
  undefined
);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        const parsed = userSchema.parse(JSON.parse(stored));
        setUserState(parsed);
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const setUser = (data: unknown) => {
    const parsed = userSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid user data:", parsed.error.flatten());
      return;
    }
    setUserState(parsed.data);
    localStorage.setItem("user", JSON.stringify(parsed.data));
  };
  return (
    <AuthProviderContext.Provider value={{ user, setUser }}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be within a AuthProvider");

  return context;
};
