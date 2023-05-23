const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  project: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  assignUsers: [{ type: String }],
  //   assignClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  assignClient: { type: String, required: true },
  description: { type: String },
  moreInfo: { type: String },
  options: {
    targetDate: { type: Date },
    tags: [{ type: String }],
    visibleToClient: { type: Boolean },
    billable: { type: Boolean },
  },
});

module.exports = mongoose.model("Task", taskSchema);
