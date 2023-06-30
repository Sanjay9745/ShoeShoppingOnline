const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./productModel");
const ShippingAddressSchema = require("./shippingAddress");
const orderSchema = require("./orderModel");

// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
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
  verification: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
    default: 0,
  },
  code: {
    type: String,
    default: "",
  },
  shippingAddresses: [ShippingAddressSchema],
  orders: [orderSchema],
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
      },
      quantity: Number,
      img: String,
      name: String,
      price: Number,
    },
  ],
  ratedProducts:[ {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
    },
    rating:Number
  },],

});

const User = mongoose.model("User", userSchema);
module.exports = User;
