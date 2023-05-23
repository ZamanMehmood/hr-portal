const mongoose = require("mongoose");

const teamMembers = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phone: { type: String },
  jobTitle: { type: String },
  role: { type: String, required: true },
});

module.exports = mongoose.model("Team", teamMembers);
