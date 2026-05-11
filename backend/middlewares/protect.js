const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");


const protect = catchAsync(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("سجل دخولك الأول عشان تقدر تكمل", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("المستخدم ده مش موجود", 401));
  }

  req.user = currentUser;

  if (currentUser.role === "Manager") {
    const restaurant = await Restaurant.findOne({
      managerID: currentUser._id,
    }).select("_id");
    if (restaurant) {
      req.user.restaurantID = restaurant._id;
    }
  }

  next();
});

module.exports = protect;
