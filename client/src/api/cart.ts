import { BACKEND_API_URL } from "@/configs/api";
import type {
  Cart,
  CartResponse,
  ClearCartResponse,
  AddCartItemPayload,
  UpdateCartItemPayload,
} from "@/types/cart";
import { fetchClient } from "@/utils/fetchClient";

const BASE_URL = `${BACKEND_API_URL}/api/cart`;

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export const addCartItem = async (
  data: AddCartItemPayload
): Promise<CartResponse> => {
  const response = await fetchClient(`${BASE_URL}/add`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const getCart = async (): Promise<CartResponse> => {
  const response = await fetchClient(`${BASE_URL}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

export const updateCartItem = async (
  productId: string,
  data: UpdateCartItemPayload
): Promise<CartResponse> => {
  const response = await fetchClient(`${BASE_URL}/update/${productId}`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

export const removeCartItem = async (
  productId: string
): Promise<CartResponse> => {
  const response = await fetchClient(`${BASE_URL}/remove/${productId}`, {
    ...defaultOptions,
    method: "DELETE",
  });
  return response;
};

export const clearCart = async (): Promise<ClearCartResponse> => {
  const response = await fetchClient(`${BASE_URL}/clear`, {
    ...defaultOptions,
    method: "DELETE",
  });
  return response;
};
