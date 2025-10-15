import express from "express";
import {
  addReview,
  createProduct,
  decrementProductStock,
  deleteProduct,
  deleteReview,
  getProductById,
  getProductReviews,
  getProducts,
  getProductsByCategory,
  getProductsBySeller,
  getTopRatedProducts,
  incrementProductStock,
  searchProducts,
  updateProduct,
  updateReview,
} from "../controllers/product.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", requireAuth, upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/top-rated", getTopRatedProducts);
router.get("/search", searchProducts);

router.get("/:id", getProductById);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);
router.get("/seller/:sellerId", getProductsBySeller);
router.get("/category/:category", getProductsByCategory);
router.post("/:productId/reviews", requireAuth, addReview);
router.put("/:productId/reviews/:reviewId", requireAuth, updateReview);
router.delete("/:productId/reviews/:reviewId", requireAuth, deleteReview);
router.get("/:productId/reviews", getProductReviews);
router.patch("/:productId/stock", requireAuth, incrementProductStock);
router.patch("/:productId/stock/decrement", requireAuth, decrementProductStock);

export default router;
