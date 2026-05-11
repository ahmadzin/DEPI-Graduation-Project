const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم الطبق مطلوب"],
      trim: true,
      minlength: [2, "الاسم لازم يكون حرفين على الأقل"],
      maxlength: [100, "الاسم لازم يكون أقل من 100 حرف"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "الوصف لازم يكون أقل من 500 حرف"],
    },
    price: {
      type: Number,
      required: [true, "السعر مطلوب"],
      min: [0, "السعر لازم يكون أكبر من 0"],
    },
    category: {
      type: String,
      required: [true, "الفئة مطلوبة"],
      trim: true,
      enum: {
        values: [
          "Starters", 
          "Main Course", 
          "Desserts", 
          "Drinks", 
          "Sides", 
        ],
        message: "الفئة دي مش موجودة",
      },
    },
    restaurantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // ربط بموديل المطعم
      required: [true, "المطعم مطلوب"],
    },
    isAvailable: {
      type: Boolean,
      default: true, 
    },
    image: {
      type: String, 
    },
  },
  {
    timestamps: true,
  },
);

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
