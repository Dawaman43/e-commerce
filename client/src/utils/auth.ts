import { authClient } from "./authClient";
import { FRONTEND_API_URL } from "@/configs/api";

export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${FRONTEND_API_URL}`,
      errorCallbackURL: `${FRONTEND_API_URL}/error`,
      disableRedirect: false,
    });
  } catch (error) {
    console.error("Google signin failed", error);
  }
};

export const getSession = async () => {
  try {
    const session = await authClient.getSession();
    return session;
  } catch (error) {
    console.error("Failed to get session: ", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error("Sign-out failed: ", error);
  }
};
