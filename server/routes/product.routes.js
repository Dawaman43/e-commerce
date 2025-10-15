import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", requireAuth, upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
