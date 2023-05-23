const mongoose = require("mongoose");

const knowledgebaseArticle = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Article", knowledgebaseArticle);
