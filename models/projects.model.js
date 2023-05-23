const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  assigned: { type: [String], required: true },
  manager: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  client: { type: String, required: true },
  template: { type: String, required: true },
  projectTitle: { type: String, required: true },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  description: { type: String },
  categoryAndUsers: { type: categorySchema },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  additionalSettings: {
    type: Map,
    of: String,
  },
  moreInformation: { type: String },
});

module.exports = mongoose.model("Project", projectSchema);
