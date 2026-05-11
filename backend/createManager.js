const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const createManagerUser = async () => {
  try {
    await connectDB();

    const managerUser = await User.create({
      name: "Manager",
      email: "manager@digidish.com",
      password: "manager123",
      role: "Manager",
    });

    console.log("✅ Manager user created successfully:");
    console.log(`📧 Email: ${managerUser.email}`);
    console.log(`🔐 Password: manager123`);
    console.log(`👤 Role: ${managerUser.role}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createManagerUser();
