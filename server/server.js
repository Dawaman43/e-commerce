import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "./libs/auth.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { connectDB } from "./configs/db.js";

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to DB
connectDB();

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  // Skip JSON parsing for product uploads (multipart/form-data)
  if (
    req.path.startsWith("/api/products") &&
    (req.method === "POST" || req.method === "PUT")
  ) {
    return next();
  }
  express.json({ limit: "50mb" })(req, res, () => {
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });
});

// ✅ Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email-auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Better-auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// ✅ Server listen
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
