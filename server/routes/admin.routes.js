import express from "express";
import {
  addUsers,
  banUser,
  deleteUser,
  registerAdmin,
} from "../controllers/admin.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/add-users", requireAuth, requireAdmin, addUsers);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);
router.patch("/ban/:id", requireAuth, requireAdmin, banUser);

export default router;
