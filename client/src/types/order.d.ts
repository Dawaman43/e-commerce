import { User } from "./user";
import { Product } from "./product";

export type OrderStatus =
  | "pending"
  | "payment_sent"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export type DeliveryStatus = "pending" | "shipped" | "delivered";

export interface DeliveryInfo {
  trackingNumber?: string;
  courier?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface Order {
  _id: string;
  buyer: User | string;
  seller: User | string;
  product: Product | string;
  quantity: number;
  totalAmount: number;
  paymentProof?: string;
  paymentConfirmedBySeller: boolean;
  deliveryStatus: DeliveryStatus;
  deliveryInfo: DeliveryInfo;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  seller: string;
  product: string;
  quantity: number;
}

export interface OrderResponse {
  message: string;
  order: Order;
}

export interface OrdersResponse {
  message: string;
  orders: Order[];
  page?: number;
  totalPages?: number;
  totalOrders?: number;
}
