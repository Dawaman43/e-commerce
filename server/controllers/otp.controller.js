import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
import { generateOTP, sendOTPEmail } from "../utils/otp.js";

export const sendOtpToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OTP.create({ userId: user._id, otp, expiresAt });
    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendOtpToEmail Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const record = await OTP.findOne({ userId: user._id, otp });
    if (!record) return res.status(400).json({ error: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    // OTP verified, delete it
    await OTP.deleteMany({ userId: user._id });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("verifyOtp Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
