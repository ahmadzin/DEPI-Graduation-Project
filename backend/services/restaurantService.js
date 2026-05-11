const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

const createRestaurant = async (data) => {
  const restaurantData = { ...data };

  if (restaurantData.managerId && restaurantData.managerId.trim() !== "") {
    const manager = await User.findById(restaurantData.managerId);
    if (!manager)
      throw new Error("المدير ده مش موجود. تأكد من أنك اخترت مديراً موجوداً.");
    if (manager.role !== "Manager") {
      await User.findByIdAndUpdate(manager._id, { role: "Manager" });
    }

    restaurantData.managerID = manager._id;
  } else if (
    restaurantData.managerEmail &&
    restaurantData.managerEmail.trim() !== ""
  ) {
    const manager = await User.findOne({
      email: restaurantData.managerEmail.toLowerCase().trim(),
    });

    if (!manager)
      throw new Error("مفيش حساب مسجل بالإيميل ده! خليه يعمل حساب جديد الأول.");
    if (manager.role !== "Manager") {
      await User.findByIdAndUpdate(manager._id, { role: "Manager" });
    }

    restaurantData.managerID = manager._id;
  }

  delete restaurantData.managerId;
  delete restaurantData.managerEmail;

  const restaurant = await Restaurant.create(restaurantData);
  return restaurant.populate("managerID", "name email");
};

const getAllRestaurants = async () => {
  const restaurants = await Restaurant.find().populate(
    "managerID",
    "name email",
  ); // جيب بيانات المدير
  return restaurants;
};

const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id).populate(
    "managerID",
    "name email",
  );
  return restaurant;
};

const updateRestaurant = async (id, data) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return restaurant;
};

const deleteRestaurant = async (id) => {
  await Restaurant.findByIdAndDelete(id);
};

const assignManager = async (restaurantId, managerId) => {
  const manager = await User.findById(managerId);
  if (!manager) throw new Error("المدير ده مش موجود");
  if (manager.role !== "Manager") {
    await User.findByIdAndUpdate(manager._id, { role: "Manager" });
  }

  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { managerID: managerId },
    { new: true },
  ).populate("managerID", "name email");

  return restaurant;
};

const getContractReport = async () => {
  const restaurants = await Restaurant.find().populate(
    "managerID",
    "name email",
  );

  const report = {
    total: restaurants.length,
    active: 0,
    expiringSoon: 0,
    expired: 0,
    restaurants: [],
  };

  restaurants.forEach((r) => {
    const status = r.contractStatus;
    if (status === "Active") report.active++;
    if (status === "ExpiringSoon") report.expiringSoon++;
    if (status === "Expired") report.expired++;

    report.restaurants.push({
      id: r._id,
      name: r.name,
      contractStatus: status,
      daysUntilExpiry: r.daysUntilExpiry,
      contractEndDate: r.contractEndDate,
      manager: r.managerID,
    });
  });

  return report;
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
