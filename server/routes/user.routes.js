import express from "express";
import {
  refreshGoogleUser,
  getCurrentUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, getCurrentUser);
router.get("/refresh", requireAuth, refreshGoogleUser);
router.put("/update", requireAuth, updateUserProfile);

export default router;
