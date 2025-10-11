import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      dbName: "gebeya-go",
    });
    console.log("✅ MongoDB connected successfully (via Mongoose)");
    return mongoose.connection;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("🔁 Retrying in 5 seconds...");
    await new Promise((res) => setTimeout(res, 5000));
    return connectDB();
  }
};
