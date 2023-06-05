const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
    default: "",
  },
  img2: {
    type: String,
    default: "",
  },
  img3: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfRating: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  desc: {
    type: String,
    required: true,
    default: "",
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
