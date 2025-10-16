import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByBuyer,
  getOrdersBySeller,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getAllOrders);
router.get("/buyer/:buyerId", requireAuth, getOrdersByBuyer);
router.get("/seller/:sellerId", requireAuth, getOrdersBySeller);
router.get("/:orderId", requireAuth, getOrderById);
router.put("/:orderId/status", requireAuth, updateOrderStatus);

export default router;
