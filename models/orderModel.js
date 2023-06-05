const mongoose = require("mongoose");
const ShippingAddressSchema = require("./shippingAddress");
const ShippingAddress = mongoose.model(
  "shippingadresses",
  ShippingAddressSchema
);
const Product = require("./productModel");

const orderSchema = new mongoose.Schema({
  shippingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ShippingAddress,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true
  },
  apartmentNumber: {
    type: String,
    default:""
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  recipientName: {
    type: String,
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  deliveryNumber:{
    type:Number,
    default: 20,
  }
});

module.exports = orderSchema;
