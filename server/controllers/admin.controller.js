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

export const addUsers = async (req, res) => {
  try {
    const { name, email, password, phone, location, age, role } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });

    const allowedRoles = ["user", "moderator"];
    const userRole = role && allowedRoles.includes(role) ? role : "user";

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exists with this email" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      phone: phone || "",
      location: location || "",
      age: age || null,
      role: userRole,
      isVerified: true,
    });

    const { passwordHash: _, ...userData } = newUser.toObject();

    return res.status(201).json({
      message: `${
        userRole.charAt(0).toUpperCase() + userRole.slice(1)
      } added successfully`,
      user: userData,
    });
  } catch (error) {
    console.log("User add error: ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ error: "User id must be provided to delete user" });
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ error: "User id must be provided to delete user" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("User delete error: ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
