import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ error: "User already registered with the given email" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      age,
      passwordHash,
      role: "user",
    });

    const { passwordHash: _, ...newUserWithoutPassword } = newUser.toObject();
    return res.status(200).json({
      message: "User registered successfully",
      user: newUserWithoutPassword,
    });
  } catch (error) {
    console.error("[login] Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  console.log("[login] Function called");
  try {
    const { email, password } = req.body;
    console.log("[login] Request body:", {
      email: email ? email : "missing",
      password: password ? "provided" : "missing",
    });

    if (!email || !password) {
      console.log("[login] Missing email or password, returning 400");
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("[login] Searching for user by email:", email);
    const existingUser = await User.findOne({ email }).select("+passwordHash");
    console.log("[login] Existing user found:", !!existingUser);

    if (!existingUser) {
      console.log("[login] No user found with email:", email);
      return res
        .status(404)
        .json({ error: "No user found with the provided email" });
    }

    console.log("[login] Comparing password");
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    console.log("[login] Password match:", isMatch);

    if (!isMatch) {
      console.log("[login] Invalid password for user:", email);
      return res.status(403).json({ error: "Invalid password" });
    }

    const payload = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    console.log("[login] Payload for JWT:", payload);

    console.log("[login] Generating JWT token");
    const generateToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    console.log("[login] Token generated:", !!generateToken);

    console.log("[login] Returning success response");
    return res.status(201).json({
      message: "User logged successfully",
      user: payload,
      generateToken,
    });
  } catch (error) {
    console.error("[login] Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
