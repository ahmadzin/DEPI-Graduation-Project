const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createOrder,
  getOrdersByRestaurant,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

router.use(protect);
router.get("/my-orders", getMyOrders);
router.post("/", restrictTo("Guest"), createOrder);
router.get(
  "/my-restaurant",
  restrictTo("Manager"),
  (req, res, next) => {
    if (!req.user.restaurantID) {
      return res.status(400).json({ message: "حسابك مش مربوط بأي مطعم!" });
    }
    req.params.restaurantId = req.user.restaurantID.toString();
    next();
  },
  getOrdersByRestaurant,
);

router.get(
  "/restaurant/:restaurantId",
  restrictTo("Manager", "SuperAdmin"),
  getOrdersByRestaurant,
);

router.get("/:id", getOrderById);
router.patch(
  "/:id/status",
  restrictTo("Manager", "SuperAdmin"),
  updateOrderStatus,
);

module.exports = router;
