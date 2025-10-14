export interface AuthSession {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: "user" | "admin" | "moderator";
  avatarUrl: string;
}
