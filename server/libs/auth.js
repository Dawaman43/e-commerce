import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["openid", "email", "profile"],
      accessType: "offline",
      refreshAccessTokens: true,
      prompt: "consent",
      storeTokens: true,
    },
  },
  trustedOrigins: ["http://localhost:5000", "http://localhost:5173"],
});
