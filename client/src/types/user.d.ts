export interface User {
  _id?: string;
  authId: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  location?: string;
  bio?: string;
  walletBalance?: number;
  rating?: number;
  totalPurchases?: number;
  totalSales?: number;
  createdAt?: string;
  updatedAt?: string;
}
