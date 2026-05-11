const dishService = require("../services/dishService");

const createDish = async (req, res) => {
  try {
    const dishData = {
      ...req.body,
      restaurantID: req.params.restaurantId || req.body.restaurantID,
    };

    delete dishData.image;

    if (req.file) {
      dishData.image = `/uploads/${req.file.filename}`;
    }
    const dish = await dishService.createDish(dishData, req.user);

    res.status(201).json({
      status: "success",
      data: { dish },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getDishesByRestaurant = async (req, res) => {
  try {
    const dishes = await dishService.getDishesByRestaurant(
      req.params.restaurantId,
    );
    res.status(200).json({
      status: "success",
      results: dishes.length,
      data: { dishes },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await dishService.getDishById(req.params.id);
    if (!dish) {
      return res.status(404).json({
        status: "fail",
        message: "الطبق ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { dish },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const updateDish = async (req, res) => {
  try {
    const dishData = { ...req.body };

   
    delete dishData.image;

    if (req.file) {
      dishData.image = `/uploads/${req.file.filename}`;
    }

    const dish = await dishService.updateDish(
      req.params.id,
      dishData,
      req.user,
    );

    if (!dish) {
      return res.status(404).json({
        status: "fail",
        message: "الطبق ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { dish },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const result = await dishService.deleteDish(req.params.id, req.user);
    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "الطبق ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      message: "تم حذف الطبق بنجاح",
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = {
  createDish,
  getDishesByRestaurant,
  getDishById,
  updateDish,
  deleteDish,
};
