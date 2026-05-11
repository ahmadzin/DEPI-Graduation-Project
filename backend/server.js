const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const socket = require("./socket");


connectDB();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000, 
});
app.use("/api", limiter);

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "🍽️ digiDish API شغال تمام!",
  });
});

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use(
  "/api/v1/restaurants/:restaurantId/dishes",
  require("./routes/dishRoutes"),
);
app.use("/api/v1/dishes", require("./routes/dishRoutes"));
app.use("/api/v1/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/v1/orders", require("./routes/orderRoutes"));


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 digiDish Server شغال على port ${PORT}`);
});

const io = socket.init(server);
io.on("connection", (s) => {
  console.log("🔌 مستخدم جديد اتصل بالسوكيت:", s.id);
  s.on("joinRestaurant", (restaurantId) => {
    console.log(`🏠 مدير المطعم انضم لغرفة المطعم رقم: ${restaurantId}`);
    s.join(restaurantId);
  });
  s.on("disconnect", () => {
    console.log("❌ مستخدم قطع الاتصال بالسوكيت:", s.id);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(`💥 خطأ: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
