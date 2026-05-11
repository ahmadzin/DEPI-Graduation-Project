const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const seedDatabase = async () => {
  try {
    await connectDB();

    // Delete old admin user if exists
    await User.deleteOne({ email: "admin@digidish.com" });

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@digidish.com",
      password: "admin123",
      role: "SuperAdmin",
    });

    console.log("✅ تم إنشاء المستخدم الأساسي بنجاح:");
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔐 Password: admin123`);
    console.log(`👤 Role: ${adminUser.role}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ خطأ في إنشاء البيانات:", err.message);
    process.exit(1);
  }
};

seedDatabase();
