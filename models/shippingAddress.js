const mongoose = require('mongoose');

const ShippingAddressSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  apartmentNumber: {
    type: String
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
  }
});

module.exports = ShippingAddressSchema;
