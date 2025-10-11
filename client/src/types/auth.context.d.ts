import type { AuthSession } from "./auth";

export interface AuthContextType {
  user: AuthSession | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
