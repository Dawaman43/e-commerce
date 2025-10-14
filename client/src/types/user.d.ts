export interface User {
  _id?: string;
  authId: string;
  name: string;
  email: string;
  role?: "user" | "moderator" | "admin";
  isVerified?: boolean;

  avatarUrl?: string;
  phone?: string;
  location?: string;
  bio?: string;

  walletBalance?: number;
  rating?: number;
  totalPurchases?: number;
  totalSales?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
