const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  teamMember: {
    type: String,
    required: true,
  },
  billable: {
    type: Boolean,
    required: true,
  },
  receiptFile: {
    type: String, // Assuming you'll store the image path or URL
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
