import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
    phone: String,
    location: String,

    walletBalance: { type: Number, default: 0 },
    authId: { type: String, unique: true, sparse: true },

    bio: String,
    rating: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
