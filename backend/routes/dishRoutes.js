const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createDish,
  getDishesByRestaurant,
  getDishById,
  updateDish,
  deleteDish,
} = require("../controllers/dishController");

const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");
const upload = require("../middlewares/upload");

router.get("/", getDishesByRestaurant);
router.get("/restaurant/:restaurantId", getDishesByRestaurant);
router.get("/:id", getDishById);

router.use(protect, restrictTo("Manager", "SuperAdmin"));

router.post("/", upload.single("image"), createDish);
router.patch("/:id", upload.single("image"), updateDish);
router.delete("/:id", deleteDish);

module.exports = router;
