const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoiceId: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  additionalInformation: {
    notes: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
