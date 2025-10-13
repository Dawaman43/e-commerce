import express from "express";
import { registerAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register", registerAdmin);

export default router;
