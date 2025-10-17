// product.d.ts

export interface Review {
  _id: string;
  user: {
    name: string;
    // email is not populated in reviews, but can add if needed
  };
  comment: string;
  rating: number;
}

export interface PaymentOption {
  method: "bank_transfer" | "telebirr" | "mepesa";
  accountNumber: string; // seller's account/phone number
}

export interface Product {
  _id: string;
  images: string[]; // Array of image URLs
  name: string; // Backend field; can alias to 'title' if preferred
  price: string;
  category: string;
  description?: string;
  stock?: string;
  rating?: number;
  reviews?: Review[];
  seller: {
    _id: string;
    name: string;
    email?: string; // Populated in some endpoints
  };
  paymentOptions?: PaymentOption[]; // NEW
  createdAt?: string;
  updatedAt?: string;
  type?: "sell" | "trade"; // Optional, as backend doesn't have it
  location?: string; // Optional, as backend doesn't have it
  favorites?: number; // Optional, as backend doesn't have it
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  category?: string;
  price: string;
  stock?: string;
  images?: File[];
  paymentOptions?: PaymentOption[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
  images?: File[];
  existingImages?: string[];
  paymentOptions?: PaymentOption[];
}

export interface AddReviewPayload {
  comment?: string;
  rating: number;
}

export interface UpdateReviewPayload {
  comment?: string;
  rating?: number;
}

export interface IncrementStockPayload {
  amount: number;
}

export interface DecrementStockPayload {
  amount: number;
}

export interface ProductResponse {
  message: string;
  product: Product;
}

export interface ProductsResponse {
  message: string;
  page: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
}

export interface ReviewResponse {
  message: string;
  review: Review;
  productRating: number;
}

export interface ReviewsResponse {
  message: string;
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
}
