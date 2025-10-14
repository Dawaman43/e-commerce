import { auth } from "../libs/auth.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const getCurrentUser = async (req, res) => {
  console.log("[getCurrentUser] Function called");
  try {
    const userData = req.user;
    console.log("[getCurrentUser] userData:", userData);
    if (!userData) {
      console.log("[getCurrentUser] No userData found, returning 401");
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    console.log(
      "[getCurrentUser] Searching for existing user by authId:",
      userData.id
    );
    let existingUser = await User.findOne({ authId: userData.id });
    console.log("[getCurrentUser] existingUser by authId:", existingUser);

    if (!existingUser) {
      console.log(
        "[getCurrentUser] No user by authId, trying by email:",
        userData.email
      );
      // Try to find by email to avoid duplicate key error
      existingUser = await User.findOne({ email: userData.email });
      console.log("[getCurrentUser] existingUser by email:", existingUser);
    }

    if (!existingUser) {
      console.log("[getCurrentUser] No existing user found, creating new user");
      console.log("[getCurrentUser] User data to create:", {
        authId: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role || "user",
      });
      existingUser = await User.create({
        authId: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role || "user",
      });
      console.log("[getCurrentUser] Created new user:", existingUser);
    } else if (!existingUser.authId) {
      console.log("[getCurrentUser] Existing user missing authId, updating");
      existingUser.authId = userData.id;
      await existingUser.save();
      console.log("[getCurrentUser] Updated authId, saved user:", existingUser);
    } else {
      console.log(
        "[getCurrentUser] Existing user found with authId, no changes needed"
      );
    }

    console.log("[getCurrentUser] Returning user:", existingUser);
    return res.json({ success: true, user: existingUser });
  } catch (err) {
    console.error("[getCurrentUser] Error getting user:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get user" });
  }
};

export const refreshGoogleUser = async (req, res) => {
  console.log("[refreshGoogleUser] Function called");
  try {
    const userId = req.user.id;
    console.log("[refreshGoogleUser] userId:", userId);

    console.log(
      "[refreshGoogleUser] Listing user accounts for userId:",
      userId
    );
    const accounts = await auth.api.listUserAccounts({ userId });
    console.log("[refreshGoogleUser] Accounts found:", accounts);

    const googleAccount = accounts.find((a) => a.providerId === "google");
    console.log("[refreshGoogleUser] Google account:", googleAccount);

    if (!googleAccount) {
      console.log("[refreshGoogleUser] No linked Google account found");
      return res.status(404).json({ error: "No linked Google account" });
    }

    console.log(
      "[refreshGoogleUser] Getting access token for accountId:",
      googleAccount.id
    );
    const { accessToken, refreshToken, account } =
      await auth.api.getAccessToken({ accountId: googleAccount.id });
    console.log("[refreshGoogleUser] Access token:", !!accessToken);
    console.log("[refreshGoogleUser] Refresh token:", !!refreshToken);
    console.log("[refreshGoogleUser] Account:", account);

    if (!accessToken) {
      console.log("[refreshGoogleUser] No Google access token available");
      return res
        .status(400)
        .json({ error: "No Google access token available" });
    }

    console.log(
      "[refreshGoogleUser] Fetching Google user info with accessToken"
    );
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("[refreshGoogleUser] Fetch response status:", response.status);

    if (!response.ok) {
      console.error(
        "[refreshGoogleUser] Failed to fetch Google user info, status:",
        response.status
      );
      throw new Error("Failed to fetch Google user info");
    }
    const googleUser = await response.json();
    console.log("[refreshGoogleUser] Google user info:", googleUser);

    console.log("[refreshGoogleUser] Updating auth.api with new data");
    await auth.api.updateUser({
      userId,
      data: {
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
      },
    });
    console.log("[refreshGoogleUser] auth.api updated successfully");

    console.log("[refreshGoogleUser] Updating User model");
    const updatedUser = await User.findOneAndUpdate(
      { authId: userId },
      {
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
      },
      { new: true, upsert: true }
    );
    console.log("[refreshGoogleUser] Updated User model:", updatedUser);

    console.log("[refreshGoogleUser] Returning response");
    return res.json({
      success: true,
      user: updatedUser,
      account,
      refreshToken: refreshToken || null,
    });
  } catch (error) {
    console.error("[refreshGoogleUser] Error refreshing Google user:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  console.log("[updateUserProfile] Function called");
  try {
    const userId = req.user?.id;
    console.log("[updateUserProfile] userId:", userId);

    const { phone, location, bio, name, image } = req.body;
    console.log("[updateUserProfile] Request body:", {
      phone,
      location,
      bio,
      name,
      image,
    });

    const cleanData = {
      ...(name && { name }),
      ...(image && { image }),
      ...(phone && { phone }),
      ...(location && { location }),
      ...(bio && { bio }),
    };
    console.log("[updateUserProfile] Clean data to update:", cleanData);

    console.log(
      "[updateUserProfile] Finding and updating User by authId:",
      userId
    );
    const updatedUser = await User.findOneAndUpdate(
      { authId: userId },
      cleanData,
      { new: true }
    );
    console.log("[updateUserProfile] Updated User:", updatedUser);

    if (!updatedUser) {
      console.log("[updateUserProfile] User not found after update");
      return res.status(404).json({ error: "User not found" });
    }

    const [firstName, ...lastNameParts] = (updatedUser.name || "").split(" ");
    const lastName = lastNameParts.join(" ") || undefined;
    console.log(
      "[updateUserProfile] Split name - firstName:",
      firstName,
      "lastName:",
      lastName
    );

    const betterAuthPayload = {
      userId,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(updatedUser.image && { avatar: updatedUser.image }), // must be `avatar`
    };
    console.log("[updateUserProfile] betterAuthPayload:", betterAuthPayload);

    let betterAuthResponse = null;
    try {
      console.log("[updateUserProfile] Calling auth.api.updateUser");
      betterAuthResponse = await auth.api.updateUser(betterAuthPayload);
      console.log(
        "[updateUserProfile] betterAuthResponse:",
        betterAuthResponse
      );
    } catch (err) {
      console.error(
        "[updateUserProfile] BetterAuth API error:",
        err.response?.body || err
      );
    }

    console.log("[updateUserProfile] Returning response");
    return res.json({ success: true, user: updatedUser, betterAuthResponse });
  } catch (error) {
    console.error("[updateUserProfile] Error updating user info:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};
