const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/User");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const managers = await User.find({ role: "Manager" })
      .select("name email role")
      .lean();
    console.log(JSON.stringify(managers, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
