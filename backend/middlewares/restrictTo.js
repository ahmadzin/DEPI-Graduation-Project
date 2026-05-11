const AppError = require("../utils/AppError");

const restrictTo = (...roles) => {
  return (req, res, next) => {
   
    const allowedRoles = roles.map((r) => r.toLowerCase());
    if (!allowedRoles.includes(req.user.role.toLowerCase())) {
      return next(
        new AppError(
          `مرفوض! دورك الحالي (${req.user.role}) والمسموح ليهم هم (${roles.join(" أو ")})`,
          403,
        ),
      );
    }
    next();
  };
};

module.exports = restrictTo;
