// client/src/api/product.ts
import { BACKEND_API_URL } from "@/configs/api";
import type {
  ProductResponse,
  ProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  AddReviewPayload,
  UpdateReviewPayload,
  ReviewResponse,
  ReviewsResponse,
  IncrementStockPayload,
  DecrementStockPayload,
} from "@/types/product";
import { fetchClient } from "@/utils/fetchClient";

const BASE_URL = `${BACKEND_API_URL}/api/products`;

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

/** Create a new product */
export const createProduct = async (
  data: CreateProductPayload
): Promise<ProductResponse> => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.category) formData.append("category", data.category);
  formData.append("price", data.price);
  if (data.stock) formData.append("stock", data.stock);
  if (data.images) {
    data.images.forEach((file) => formData.append("images", file));
  }

  const response = await fetchClient(`${BASE_URL}/`, {
    credentials: "include",
    method: "POST",
    body: formData,
  });
  return response;
};

/** Get all products with optional query params */
export const getProducts = async (
  query?: Record<string, any>
): Promise<ProductsResponse> => {
  let queryString = "";
  if (query) {
    queryString =
      "?" +
      Object.entries(query)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
  }
  const response = await fetchClient(`${BASE_URL}${queryString}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

/** Get a single product by ID */
export const getProductById = async (id: string): Promise<ProductResponse> => {
  const response = await fetchClient(`${BASE_URL}/${id}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

/** Update a product */
export const updateProduct = async (
  id: string,
  data: UpdateProductPayload
): Promise<ProductResponse> => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.category) formData.append("category", data.category);
  if (data.price !== undefined) formData.append("price", data.price);
  if (data.stock) formData.append("stock", data.stock);
  if (data.images) {
    data.images.forEach((file) => formData.append("images", file));
  }

  const response = await fetchClient(`${BASE_URL}/${id}`, {
    credentials: "include",
    method: "PUT",
    body: formData,
  });
  return response;
};

/** Delete a product */
export const deleteProduct = async (id: string): Promise<ProductResponse> => {
  const response = await fetchClient(`${BASE_URL}/${id}`, {
    ...defaultOptions,
    method: "DELETE",
  });
  return response;
};

/** Add a review to a product */
export const addReview = async (
  productId: string,
  data: AddReviewPayload
): Promise<ReviewResponse> => {
  const response = await fetchClient(`${BASE_URL}/${productId}/reviews`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

/** Update a review */
export const updateReview = async (
  productId: string,
  reviewId: string,
  data: UpdateReviewPayload
): Promise<ReviewResponse> => {
  const response = await fetchClient(
    `${BASE_URL}/${productId}/reviews/${reviewId}`,
    {
      ...defaultOptions,
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
  return response;
};

/** Delete a review */
export const deleteReview = async (
  productId: string,
  reviewId: string
): Promise<ReviewResponse> => {
  const response = await fetchClient(
    `${BASE_URL}/${productId}/reviews/${reviewId}`,
    {
      ...defaultOptions,
      method: "DELETE",
    }
  );
  return response;
};

/** Get reviews for a product */
export const getProductReviews = async (
  productId: string
): Promise<ReviewsResponse> => {
  const response = await fetchClient(`${BASE_URL}/${productId}/reviews`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

/** Increment product stock */
export const incrementProductStock = async (
  productId: string,
  data: IncrementStockPayload
): Promise<ProductResponse> => {
  const response = await fetchClient(`${BASE_URL}/${productId}/stock`, {
    ...defaultOptions,
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

/** Decrement product stock */
export const decrementProductStock = async (
  productId: string,
  data: DecrementStockPayload
): Promise<ProductResponse> => {
  const response = await fetchClient(
    `${BASE_URL}/${productId}/stock/decrement`,
    {
      ...defaultOptions,
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
  return response;
};

/** Get seller info by sellerId */
export const getSeller = async (sellerId: string): Promise<any> => {
  const response = await fetchClient(`${BASE_URL}/seller/info/${sellerId}`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};

/** Get products by a seller */
export const getProductsBySeller = async (
  sellerId: string
): Promise<ProductsResponse> => {
  const response = await fetchClient(
    `${BASE_URL}/seller/products/${sellerId}`,
    {
      ...defaultOptions,
      method: "GET",
    }
  );
  return response;
};

/** Get top sellers */
export const getTopSellers = async (): Promise<any> => {
  const response = await fetchClient(`${BASE_URL}/seller/top`, {
    ...defaultOptions,
    method: "GET",
  });
  return response;
};
