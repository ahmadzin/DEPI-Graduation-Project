const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "العميل مطلوب"],
    },
    restaurantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", 
      required: [true, "المطعم مطلوب"],
    },
    items: [
      {
        dishID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish", 
          required: [true, "الطبق مطلوب"],
        },
        name: {
          type: String,
          required: true, 
        },
        price: {
          type: Number,
          required: true, 
        },
        quantity: {
          type: Number,
          required: [true, "الكمية مطلوبة"],
          min: [1, "الكمية لازم تكون 1 على الأقل"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "الإجمالي مطلوب"],
      min: [0, "الإجمالي لازم يكون أكبر من 0"],
    },
    orderType: {
      type: String,
      required: [true, "نوع الطلب مطلوب"],
      enum: {
        values: ["Delivery", "Pickup", "Dine-in"],
        message: "نوع الطلب لازم يكون Delivery أو Pickup أو Dine-in",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Preparing", "Completed", "Cancelled"],
        message: "الحالة مش صحيحة",
      },
      default: "Pending", 
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
