import express from "express";
import {
  addCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", requireAuth, addCart);
router.get("/", requireAuth, getCart);
router.put("/update/:productId", requireAuth, updateCartItem);
router.delete("/remove/:productId", requireAuth, removeCartItem);
router.delete("/clear", requireAuth, clearCart);

export default router;
