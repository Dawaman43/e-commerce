import express from "express";
import {
  confirmPayment,
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
router.put("/:orderId/status", requireAuth, updateOrderStatus);
router.put("/:orderId/confirm-payment", requireAuth, confirmPayment);
router.get("/:orderId", requireAuth, getOrderById);

export default router;
