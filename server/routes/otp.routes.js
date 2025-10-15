import express from "express";
import { sendOtpToEmail, verifyOtp } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/send", sendOtpToEmail);
router.post("/verify", verifyOtp);

export default router;
