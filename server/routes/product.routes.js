import express from "express";
import {
  addReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
  getProductsBySeller,
  getTopRatedProducts,
  searchProducts,
  updateProduct,
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

export default router;
