const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB اتصل بنجاح: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ فشل الاتصال بـ MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
