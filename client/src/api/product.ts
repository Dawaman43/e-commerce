// Updated product.ts with logs in updateProduct
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
  data: UpdateProductPayload | FormData
): Promise<ProductResponse> => {
  let body: BodyInit;
  let headers: Record<string, string> | undefined;

  if (data instanceof FormData) {
    body = data;
    // ✅ Explicitly set headers WITHOUT Content-Type (let browser auto-set multipart/form-data)
    headers = {}; // Empty object to override default JSON header
    console.log("=== API UPDATE DEBUG: Using FormData ===");
    console.log("Body is FormData:", body instanceof FormData);
    console.log("Headers passed:", headers);
    console.log("FormData entries in API:");
    for (const [key, value] of (body as FormData).entries()) {
      console.log(`${key}:`, value);
      if (value instanceof File) {
        console.log(`  - File size: ${value.size} bytes, type: ${value.type}`);
      }
    }
  } else {
    // Fallback for non-FormData (though not used here)
    body = JSON.stringify(data);
    headers = { "Content-Type": "application/json" };
    console.log("=== API UPDATE DEBUG: Using JSON ===");
    console.log("Body (JSON):", body);
    console.log("Headers passed:", headers);
  }

  console.log("Full request options before fetchClient:");
  console.log("- Method: PUT");
  console.log("- URL:", `${BASE_URL}/${id}`);
  console.log("- Body type:", typeof body);
  console.log("- Headers:", headers);
  console.log("=========================================");

  const response = await fetchClient(`${BASE_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    body,
    headers, // This overrides defaultOptions' JSON header
  });

  console.log("=== API UPDATE RESPONSE DEBUG ===");
  console.log("Response status:", response.status); // Assuming fetchClient returns a response-like object
  console.log("Response ok:", response.ok);
  if (response.ok) {
    const json = await response.json(); // Assuming it has .json()
    console.log("Response body:", json);
  }
  console.log("=================================");

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
