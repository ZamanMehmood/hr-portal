const mongoose = require("mongoose");

const projectTemplateSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  category: { type: String, required: true },
  projectDescription: { type: String },
  assignedUsersPermissions: [{ type: String }],
  clientsProjectPermissions: [{ type: String }],
  projectBilling: {
    hourlyRate: { type: Number },
    estimatedHours: { type: Number },
    totalAmount: { type: Number },
  },
  moreInformation: { type: String },
});

module.exports = mongoose.model("projectTemplates", projectTemplateSchema);
