export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  role: "user" | "moderator" | "admin";
  isVerified: boolean;
  isBanned: boolean;
  walletBalance?: number;
  rating?: number;
  totalPurchases?: number;
  totalSales?: number;
  bio?: string;
  lastLogin?: string; // ISO date string
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin extends User {
  role: "admin";
}

export interface GetUsersResponse {
  message: string;
  page?: number;
  totalPages?: number;
  totalUsers?: number;
  users: User[];
}

export interface GetUserResponse {
  message: string;
  user: User;
}

export interface AddUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  age?: number;
  role?: "user" | "moderator";
}

export interface AddUserResponse {
  message: string;
  user: User;
}

export interface BanUserRequest {
  ban: boolean;
}

export interface BanUserResponse {
  message: string;
  user: Pick<User, "_id" | "name" | "email" | "isBanned">;
}

export interface DeleteUserResponse {
  message: string;
}
