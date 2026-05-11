﻿const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

const verifyManagerRestaurant = async (user, restaurantId) => {
  if (user.role !== "Manager") return;

  if (
    !restaurantId ||
    restaurantId === "undefined" ||
    restaurantId === "null"
  ) {
    throw new Error(
      "رقم المطعم مش واصل للباك إند! اعمل تسجيل خروج وادخل تاني عشان يتحدث.",
    );
  }

  const restaurant = await Restaurant.findOne({ managerID: user._id }).select(
    "_id",
  );
  if (!restaurant) {
    throw new Error("مش لاقيين أي مطعم مربوط بحسابك كمدير في الداتابيز!");
  }
  if (restaurant._id.toString() !== restaurantId.toString()) {
    throw new Error(
      `مرفوض! بتحاول تضيف لمطعم (${restaurantId}) ومطعمك هو (${restaurant._id})`,
    );
  }
};

const createDish = async (data, user) => {
  if (user?.role === "Manager") {
    await verifyManagerRestaurant(user, data.restaurantID);
  }
  const dish = await Dish.create(data);
  return dish;
};

const getDishesByRestaurant = async (restaurantId) => {
  const dishes = await Dish.find({ restaurantID: restaurantId });
  return dishes;
};

const getDishById = async (id) => {
  const dish = await Dish.findById(id);
  return dish;
};

const updateDish = async (id, data, user) => {
  const dish = await Dish.findById(id);
  if (!dish) return null;

  if (user?.role === "Manager") {
    await verifyManagerRestaurant(user, dish.restaurantID);
  }

  const updatedDish = await Dish.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updatedDish;
};

const deleteDish = async (id, user) => {
  const dish = await Dish.findById(id);
  if (!dish) return null;

  if (user?.role === "Manager") {
    await verifyManagerRestaurant(user, dish.restaurantID);
  }

  await Dish.findByIdAndDelete(id);
};

module.exports = {
  createDish,
  getDishesByRestaurant,
  getDishById,
  updateDish,
  deleteDish,
};
