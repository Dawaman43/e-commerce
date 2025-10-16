import express from "express";
import multer from "multer";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByBuyer,
  getOrdersBySeller,
  updateOrderStatus,
  confirmPayment,
  uploadPaymentProof,
  updateDeliveryInfo,
  cancelOrder,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use((req, res, next) => {
  console.log(`Order route called: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getAllOrders);
router.get("/buyer/:buyerId", requireAuth, getOrdersByBuyer);
router.get("/seller/:sellerId", requireAuth, getOrdersBySeller);
router.get("/:orderId", requireAuth, getOrderById);

router.put("/:orderId/status", requireAuth, updateOrderStatus);
router.put("/:orderId/confirm-payment", requireAuth, confirmPayment);
router.put(
  "/:orderId/upload-proof",
  requireAuth,
  upload.single("paymentProof"),
  uploadPaymentProof
);
router.put("/:orderId/delivery", requireAuth, updateDeliveryInfo);
router.put("/:orderId/cancel", requireAuth, cancelOrder);

export default router;
