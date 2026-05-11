const notFound = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `المسار ${req.originalUrl} مش موجود`,
  });
};

module.exports = notFound;
