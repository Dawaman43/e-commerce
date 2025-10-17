import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    category: String,
    price: { type: Number, required: true },
    images: [String],
    stock: { type: String, required: true },

    rating: { type: Number, default: 0 },
    reviews: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: Number,
      },
    ],

    paymentOptions: {
      type: [String],
      enum: ["bank_transfer", "telebirr", "mepesa"],
      default: ["bank_transfer"],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
