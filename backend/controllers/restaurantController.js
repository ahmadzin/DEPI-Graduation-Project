const restaurantService = require("../services/restaurantService");

const createRestaurant = async (req, res) => {
  try {
    const restaurantData = { ...req.body };
    delete restaurantData.image; 

    if (
      restaurantData.services &&
      typeof restaurantData.services === "string"
    ) {
      restaurantData.services = [restaurantData.services];
    }

    if (req.file) {
      restaurantData.image = `/uploads/${req.file.filename}`;
    }

    const restaurant = await restaurantService.createRestaurant(restaurantData);
    res.status(201).json({
      status: "success",
      data: { restaurant },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json({
      status: "success",
      results: restaurants.length,
      data: { restaurants },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        status: "fail",
        message: "المطعم ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurantData = { ...req.body };
    delete restaurantData.image;

    if (
      restaurantData.services &&
      typeof restaurantData.services === "string"
    ) {
      restaurantData.services = [restaurantData.services];
    }

    if (req.file) {
      restaurantData.image = `/uploads/${req.file.filename}`;
    }

    const restaurant = await restaurantService.updateRestaurant(
      req.params.id,
      restaurantData,
    );
    if (!restaurant) {
      return res.status(404).json({
        status: "fail",
        message: "المطعم ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    await restaurantService.deleteRestaurant(req.params.id);
    res.status(200).json({
      status: "success",
      message: "تم حذف المطعم بنجاح",
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const assignManager = async (req, res) => {
  try {
    const restaurant = await restaurantService.assignManager(
      req.params.id,
      req.body.managerId,
    );
    if (!restaurant) {
      return res.status(404).json({
        status: "fail",
        message: "المطعم ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getContractReport = async (req, res) => {
  try {
    const report = await restaurantService.getContractReport();
    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  assignManager,
  getContractReport,
};
