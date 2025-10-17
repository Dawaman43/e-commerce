import { Product } from "./product";
import { User } from "./user";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: User | string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CartResponse {
  message: string;
  cart?: Cart;
}

export interface ClearCartResponse {
  message: string;
}
