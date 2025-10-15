import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "./libs/auth.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import { connectDB } from "./configs/db.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email-auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
