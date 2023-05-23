const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  estimateDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  additionalInfo: {
    tags: {
      type: [String],
    },
    notes: {
      type: String,
    },
    terms: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Estimate", estimateSchema);
