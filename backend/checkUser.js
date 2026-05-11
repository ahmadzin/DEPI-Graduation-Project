const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const checkUser = async () => {
  try {
    await connectDB();

    const user = await User.findOne({ email: "admin@digidish.com" }).select(
      "+password",
    );

    if (!user) {
      console.log("❌ User not found");
    } else {
      console.log("✅ User found:");
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔐 Hashed Password: ${user.password}`);
      console.log(`👤 Role: ${user.role}`);

      // Test password comparison
      const isCorrect = await user.comparePassword("admin123");
      console.log(`🔓 Password "admin123" matches: ${isCorrect}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

checkUser();
