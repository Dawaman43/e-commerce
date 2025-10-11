import { auth } from "../libs/auth.js";
import { User } from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const { id, name, email, image } = req.user;

    let existingUser = await User.findOne({ authId: id });

    if (!existingUser) {
      existingUser = await User.create({
        authId: id,
        name,
        email,
        image,
      });
    }

    return res.json({ success: true, user: existingUser });
  } catch (error) {
    console.error("Error getting user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get user" });
  }
};

export const refreshGoogleUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const accounts = await auth.api.listUserAccounts({ userId });
    const googleAccount = accounts.find((a) => a.providerId === "google");

    if (!googleAccount) {
      return res.status(404).json({ error: "No linked Google account" });
    }

    const { accessToken, refreshToken, account } =
      await auth.api.getAccessToken({ accountId: googleAccount.id });

    if (!accessToken) {
      return res
        .status(400)
        .json({ error: "No Google access token available" });
    }

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch Google user info");
    const googleUser = await response.json();

    await auth.api.updateUser({
      userId,
      data: {
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
      },
    });

    const updatedUser = await User.findOneAndUpdate(
      { authId: userId },
      {
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
      },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      user: updatedUser,
      account,
      refreshToken: refreshToken || null,
    });
  } catch (error) {
    console.error("Error refreshing Google user:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    console.log("========================================");
    console.log("[BACKEND] updateUserProfile triggered");
    console.log("[BACKEND] userId:", userId);
    console.log("[BACKEND] Raw req.body:", req.body);

    // ✅ Extract only editable fields
    const { phone, location, bio, name, image } = req.body;
    const cleanData = {
      ...(name && { name }),
      ...(image && { image }),
      ...(phone && { phone }),
      ...(location && { location }),
      ...(bio && { bio }),
    };

    console.log("[BACKEND] Cleaned update data for MongoDB:", cleanData);

    // ✅ Update MongoDB user
    const updatedUser = await User.findOneAndUpdate(
      { authId: userId },
      cleanData,
      { new: true }
    );

    if (!updatedUser) {
      console.log("[BACKEND] No user found for:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("[BACKEND] MongoDB update successful:", updatedUser);

    // ✅ Transform name into firstName / lastName
    const [firstName, ...lastNameParts] = (updatedUser.name || "").split(" ");
    const lastName = lastNameParts.join(" ") || undefined;

    // ✅ Prepare payload for BetterAuth
    const betterAuthPayload = {
      userId: userId, // correct field
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(updatedUser.image && { avatar: updatedUser.image }), // rename image -> avatar
    };

    console.log("[BACKEND] Sending payload to BetterAuth:", betterAuthPayload);

    // ✅ Update user in BetterAuth
    let betterAuthResponse;
    try {
      betterAuthResponse = await auth.api.updateUser(betterAuthPayload);
      console.log("[BACKEND] BetterAuth API response:", betterAuthResponse);
    } catch (err) {
      console.error(
        "[BACKEND] BetterAuth API error:",
        err.response?.body || err
      );
      // Decide if you want to fail the request or continue
      // return res.status(400).json({ error: "Failed to update BetterAuth user" });
    }

    // ✅ Return final updated user
    return res.json({ success: true, user: updatedUser, betterAuthResponse });
  } catch (error) {
    console.error("[BACKEND] Error updating user info:", error);

    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};
