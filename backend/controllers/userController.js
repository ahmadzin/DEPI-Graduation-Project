const userService = require("../services/userService");

const getManagers = async (req, res) => {
  try {
    const managers = await userService.getManagers();
    res.status(200).json({
      status: "success",
      results: managers.length,
      data: { managers },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = {
  getManagers,
};
