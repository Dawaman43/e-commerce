import type { AuthSession } from "./auth";

export interface AuthContextType {
  user: AuthSession | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<AuthSession>) => Promise<void>; // Added for avatar updates and other profile changes
}
