const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");

const attachRestaurantInfo = async (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  if (userObj.role === "Manager") {
    const restaurant = await Restaurant.findOne({ managerID: user._id }).select(
      "_id",
    );
    if (restaurant) userObj.restaurantID = restaurant._id;
  }
  return userObj;
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "الإيميل ده مسجل قبل كده",
      });
    }

    if (role === "SuperAdmin") {
      return res.status(403).json({
        status: "fail",
        message: "مش مسموح تسجل كـ SuperAdmin",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "Guest",
    });

    const token = generateToken(user._id);
    const userPayload = await attachRestaurantInfo(user);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: userPayload._id,
          name: userPayload.name,
          email: userPayload.email,
          role: userPayload.role,
          restaurantID: userPayload.restaurantID || null,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "ابعت الإيميل والباسورد",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "الإيميل أو الباسورد غلط",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "الإيميل أو الباسورد غلط",
      });
    }

    const token = generateToken(user._id);
    const userPayload = await attachRestaurantInfo(user);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: userPayload._id,
          name: userPayload.name,
          email: userPayload.email,
          role: userPayload.role,
          restaurantID: userPayload.restaurantID || null,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const userPayload = await attachRestaurantInfo(req.user);
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: userPayload._id,
          name: userPayload.name,
          email: userPayload.email,
          role: userPayload.role,
          restaurantID: userPayload.restaurantID || null,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = { register, login, getMe };
