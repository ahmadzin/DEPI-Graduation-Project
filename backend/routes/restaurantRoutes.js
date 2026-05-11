const express = require("express");
const router = express.Router();

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  assignManager,
  getContractReport,
} = require("../controllers/restaurantController");

const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");
const upload = require("../middlewares/upload");

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.use(protect, restrictTo("SuperAdmin"));

router.post("/", upload.single("image"), createRestaurant);
router.patch("/:id", upload.single("image"), updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.patch("/:id/assign-manager", assignManager);
router.get("/reports/contracts", getContractReport);

module.exports = router;
