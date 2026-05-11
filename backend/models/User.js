const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
      minlength: [3, "الاسم لازم يكون 3 حروف على الأقل"],
      maxlength: [50, "الاسم لازم يكون أقل من 50 حرف"],
    },
    email: {
      type: String,
      required: [true, "الإيميل مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "الإيميل مش صحيح"],
    },
    password: {
      type: String,
      required: [true, "الباسورد مطلوب"],
      minlength: [6, "الباسورد لازم يكون 6 حروف على الأقل"],
      select: false,
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Manager", "Guest"],
      default: "Guest",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
