import express from "express";
import { addUsers, registerAdmin } from "../controllers/admin.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/add-users", requireAuth, requireAdmin, addUsers);

export default router;
