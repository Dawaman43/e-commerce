import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },

    paymentProof: { type: String },
    paymentConfirmedBySeller: { type: Boolean, default: false },

    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    deliveryInfo: {
      trackingNumber: String,
      courier: String,
      shippedAt: Date,
      deliveredAt: Date,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "payment_sent",
        "paid",
        "shipped",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
