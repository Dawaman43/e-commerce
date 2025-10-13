import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },
    image: {
      type: String, // URL
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },

    authId: {
      type: String,
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },

    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalPurchases: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ name: "text", location: "text" });

userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

userSchema.virtual("isModerator").get(function () {
  return this.role === "moderator";
});

export const User = mongoose.model("User", userSchema);
