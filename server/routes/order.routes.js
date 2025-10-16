import express from "express";
import {
  confirmPayment,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByBuyer,
  getOrdersBySeller,
  updateDeliveryInfo,
  updateOrderStatus,
  uploadPaymentProof,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getAllOrders);
router.get("/buyer/:buyerId", requireAuth, getOrdersByBuyer);
router.get("/seller/:sellerId", requireAuth, getOrdersBySeller);
router.put(
  "/:orderId/upload-proof",
  requireAuth,
  upload.single("paymentProof"),
  uploadPaymentProof
);
router.put("/:orderId/status", requireAuth, updateOrderStatus);
router.put("/:orderId/confirm-payment", requireAuth, confirmPayment);
router.put("/:orderId/delivery", requireAuth, updateDeliveryInfo);

router.get("/:orderId", requireAuth, getOrderById);

export default router;
