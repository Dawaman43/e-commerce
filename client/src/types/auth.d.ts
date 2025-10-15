// types/auth.ts - Updated AuthSession interface to include all normalized fields
export interface AuthSession {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: "user" | "admin" | "moderator";
  avatarUrl: string;
  walletBalance: number;
  location: string;
  isVerified: boolean;
  totalPurchases: number;
  totalSales: number;
  authId: string;
  image: string;
}
