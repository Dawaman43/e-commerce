import { BACKEND_API_URL } from "@/configs/api";
import type {
  OrdersResponse,
  OrderResponse,
  CreateOrderPayload,
} from "@/types/order";
import { fetchClient } from "@/utils/fetchClient";

// Simple ObjectId validator (24-char hex string) – exported for reuse in components
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const BASE_URL = `${BACKEND_API_URL}/api/orders`;

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export const createOrder = async (
  data: CreateOrderPayload
): Promise<OrderResponse> => {
  const response = await fetchClient(`${BASE_URL}/`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const getOrders = async (
  query?: Record<string, any>
): Promise<OrdersResponse> => {
  let queryString = "";
  if (query) {
    const filteredQuery = Object.entries(query).reduce((acc, [key, value]) => {
      const valStr = String(value).trim();
      if (valStr && valStr !== "undefined") {
        acc[key] = valStr;
      }
      return acc;
    }, {} as Record<string, any>);
    if (Object.keys(filteredQuery).length > 0) {
      queryString =
        "?" +
        Object.entries(filteredQuery)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");
    }
  }
  const response = await fetchClient(`${BASE_URL}${queryString}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

export const getOrderById = async (id: string): Promise<OrderResponse> => {
  if (!id || !isValidObjectId(id)) {
    throw new Error("Invalid order ID");
  }
  const response = await fetchClient(`${BASE_URL}/${id}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

export const getOrdersByBuyer = async (
  buyerId: string
): Promise<OrdersResponse> => {
  if (!buyerId || buyerId === "current-buyer-id" || !isValidObjectId(buyerId)) {
    throw new Error("Invalid buyer ID");
  }
  const response = await fetchClient(`${BASE_URL}/buyer/${buyerId}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

export const getOrdersBySeller = async (
  sellerId: string
): Promise<OrdersResponse> => {
  if (
    !sellerId ||
    sellerId === "current-seller-id" ||
    !isValidObjectId(sellerId)
  ) {
    throw new Error("Invalid seller ID");
  }
  const response = await fetchClient(`${BASE_URL}/seller/${sellerId}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<OrderResponse> => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }
  const response = await fetchClient(`${BASE_URL}/${orderId}/status`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  return response;
};

export const confirmPayment = async (
  orderId: string
): Promise<OrderResponse> => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }
  const response = await fetchClient(`${BASE_URL}/${orderId}/confirm-payment`, {
    ...defaultOptions,
    method: "PUT",
  });
  return response;
};

export const uploadPaymentProof = async (
  orderId: string,
  file: File
): Promise<OrderResponse> => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }
  if (!file) {
    throw new Error("Payment proof file is required");
  }
  const formData = new FormData();
  formData.append("paymentProof", file);
  const response = await fetchClient(`${BASE_URL}/${orderId}/upload-proof`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return response;
};

export const updateDeliveryInfo = async (
  orderId: string,
  data: Record<string, any>
): Promise<OrderResponse> => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }
  const response = await fetchClient(`${BASE_URL}/${orderId}/delivery`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }
  const response = await fetchClient(`${BASE_URL}/${orderId}/cancel`, {
    ...defaultOptions,
    method: "PUT",
  });
  return response;
};

export const acceptOrder = async (orderId: string): Promise<OrderResponse> => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }
  const response = await fetchClient(`${BASE_URL}/${orderId}/accept`, {
    ...defaultOptions,
    method: "PUT",
  });
  return response;
};
