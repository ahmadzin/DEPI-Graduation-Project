const User = require("../models/User");

const getManagers = async () => {
  const managers = await User.find({ role: "Manager" }).select("name email");
  return managers;
};

module.exports = {
  getManagers,
};
