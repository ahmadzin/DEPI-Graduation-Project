const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم المطعم مطلوب"],
      trim: true,
      minlength: [3, "الاسم لازم يكون 3 حروف على الأقل"],
      maxlength: [100, "الاسم لازم يكون أقل من 100 حرف"],
    },
    address: {
      type: String,
      required: [true, "عنوان المطعم مطلوب"],
      trim: true,
    },
    managerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Suspended"],
        message: "الحالة لازم تكون Active أو Suspended",
      },
      default: "Active",
    },
    contractStartDate: {
      type: Date,
      required: [true, "تاريخ بداية العقد مطلوب"],
    },
    contractEndDate: {
      type: Date,
      required: [true, "تاريخ نهاية العقد مطلوب"],
    },
    services: {
      type: [String],
      enum: ["Delivery", "Dine-in", "Pickup"],
      default: ["Delivery", "Dine-in", "Pickup"], 
    },
    image: {
      type: String, 
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  },
);

restaurantSchema.virtual("contractStatus").get(function () {
  const today = new Date();
  const endDate = new Date(this.contractEndDate);

  // كم يوم فاضل على انتهاء العقد؟
  const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return "Expired"; 
  if (daysLeft <= 7) return "ExpiringSoon"; 
  return "Active"; 
});

// ── Virtual Field — كم يوم فاضل ─────────────────────────
restaurantSchema.virtual("daysUntilExpiry").get(function () {
  const today = new Date();
  const endDate = new Date(this.contractEndDate);
  const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  return daysLeft;
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
