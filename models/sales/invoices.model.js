const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  additionalInformation: {
    tags: {
      type: [String],
    },
    note: {
      type: String,
    },
    termConditions: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
