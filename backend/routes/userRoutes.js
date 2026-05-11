const express = require("express");
const router = express.Router();

const { getManagers } = require("../controllers/userController");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

router.use(protect, restrictTo("SuperAdmin"));
router.get("/managers", getManagers);

module.exports = router;
