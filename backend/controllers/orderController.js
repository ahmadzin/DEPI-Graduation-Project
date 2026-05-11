const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder({
      ...req.body,
      customerID: req.user._id,
    });
    res.status(201).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByRestaurant(
      req.params.restaurantId,
    );
    res.status(200).json({
      status: "success",
      results: orders.length,
      data: { orders },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getMyOrders(req.user._id);
    res.status(200).json({
      status: "success",
      results: orders.length,
      data: { orders },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "الأوردر ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "الأوردر ده مش موجود",
      });
    }
    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByRestaurant,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
