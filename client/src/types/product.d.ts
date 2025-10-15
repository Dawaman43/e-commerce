export interface Review {
  _id: string;
  user: {
    name: string;
    // email is not populated in reviews, but can add if needed
  };
  comment: string;
  rating: number;
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
  createdAt?: string;
  updatedAt?: string;
  // Missing fields from frontend: type, location, favorites - add defaults or extend backend if needed
  type?: "sell" | "trade"; // Optional, as backend doesn't have it
  location?: string; // Optional, as backend doesn't have it
  favorites?: number; // Optional, as backend doesn't have it
}

// For frontend usage, you can create a mapped type if needed:
// export type FrontendProduct = {
//   id: Product['_id'];
//   image: Product['images'][0] | string; // First image or default
//   title: Product['name'];
//   seller: Product['seller']['name'];
//   // ... etc.
// };

export interface CreateProductPayload {
  name: string; // Backend expects 'name', not 'title'
  description?: string;
  category?: string;
  price: string;
  stock?: string;
  images?: File[]; // Backend expects 'images' (plural)
  // No 'type' or 'location' in backend create
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
  images?: File[];
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
  product: Product; // Backend uses 'product', not 'data'
}

export interface ProductsResponse {
  message: string;
  page: number;
  totalPages: number;
  totalProducts: number;
  products: Product[]; // Backend uses 'products', not 'data'
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
