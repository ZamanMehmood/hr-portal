const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  source: { type: String },
  category: { type: String },
  tags: { type: [String] },
  lastContacted: { type: Date },
});

const addressandOrgDetails = new mongoose.Schema({
  companyName: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  country: { type: String },
  website: { type: String },
});

const leadsSchema = new mongoose.Schema({
  leadTitle: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  telephone: { type: String, required: true },
  emailAddress: { type: String, required: true },
  leadValue: { type: Number, required: true },
  assigned: { type: [String], required: true }, //
  status: { type: String, required: true },
  details: { type: detailsSchema },
  moreInformation: { type: String },
  addressandOrgDetails: { type: addressandOrgDetails },
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model("Leads", leadsSchema);

module.exports = Lead;
