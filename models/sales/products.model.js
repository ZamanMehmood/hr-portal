const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
