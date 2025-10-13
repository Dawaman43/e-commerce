import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already registered with the given email" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
      isVerified: true,
    });

    const { passwordHash: _, ...adminData } = newAdmin.toObject();

    return res
      .status(200)
      .json({ message: "Admin registered successfully.", admin: adminData });
  } catch (error) {
    console.log("register admin error: ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
