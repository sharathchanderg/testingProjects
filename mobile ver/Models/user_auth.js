const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    created_date: {
      type: String,
    },
    status: {
      type: Boolean,
      enum: [0, 1],
      default: 1,
    },
    profile_image: {
      type: String,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userModel.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.SAN_SECRET,
    { expiresIn: "24h" }
  );
};
module.exports = mongoose.model("User", userModel);
