const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
});

const clientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  category: { type: String },
  descriptionDetails: { type: String },
  billingAddress: { type: addressSchema },
  shippingAddress: { type: addressSchema },
  appModules: [{ type: String }],
  moreInformation: { type: String },
});

module.exports = mongoose.model("Client", clientSchema);
