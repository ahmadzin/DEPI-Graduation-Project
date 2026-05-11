const Order = require("../models/Order");
const Dish = require("../models/Dish");
const socket = require("../socket");

const createOrder = async (data) => {
  const { restaurantID, items, orderType, deliveryAddress, customerID } = data;

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const dish = await Dish.findById(item.dishID);
    if (!dish) throw new Error(`الطبق ${item.dishID} مش موجود`);
    if (!dish.isAvailable) throw new Error(`الطبق ${dish.name} مش متاح دلوقتي`);

    orderItems.push({
      dishID: dish._id,
      name: dish.name, 
      price: dish.price, 
      quantity: item.quantity,
    });

    totalAmount += dish.price * item.quantity;
  }

  const order = await Order.create({
    customerID,
    restaurantID,
    items: orderItems,
    totalAmount,
    orderType,
    deliveryAddress,
  });

  try {
    console.log(
      `🚀 جاري إرسال إشعار الطلب لغرفة المطعم: ${restaurantID.toString()}`,
    );
    socket.getIO().to(restaurantID.toString()).emit("newOrder", order);
    console.log("✅ تم إطلاق الإشعار بنجاح من الباك إند!");
  } catch (error) {
    console.error("Socket error - could not emit new order:", error.message);
  }

  return order;
};

const getOrdersByRestaurant = async (restaurantId) => {
  const orders = await Order.find({ restaurantID: restaurantId })
    .populate("customerID", "name email")
    .sort({ createdAt: -1 }); // الأحدث الأول
  return orders;
};

const getMyOrders = async (customerId) => {
  const orders = await Order.find({ customerID: customerId })
    .populate("restaurantID", "name address")
    .sort({ createdAt: -1 });
  return orders;
};

const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("customerID", "name email")
    .populate("restaurantID", "name address");
  return order;
};

const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: 'after', runValidators: true },
  );

  if (order) {
    const statusLabels = {
      Pending: "قيد الانتظار",
      Preparing: "جاري تحضيره الآن",
      Completed: "جاهز للتسليم",
      Cancelled: "تم إلغاؤه",
    };

    try {
      socket.getIO().to(order.customerID.toString()).emit("orderStatusUpdate", {
        orderId: order._id,
        status: order.status,
        message: `تحديث لطلبك: طلبك رقم ${order._id.toString().slice(-6).toUpperCase()} أصبح ${statusLabels[status] || status}`
      });
    } catch (error) {
      console.error("Socket error - could not emit status update:", error.message);
    }
  }

  return order;
};

module.exports = {
  createOrder,
  getOrdersByRestaurant,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
