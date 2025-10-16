import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByBuyer,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getAllOrders);
router.get("/buyer/:buyerId", requireAuth, getOrdersByBuyer);

export default router;
