const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
  },
  proposalTitle: {
    type: String,
    required: true,
  },
  proposalDate: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  showProposal: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Proposal", proposalSchema);
