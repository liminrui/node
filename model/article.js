const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { _id: 1, subject: "coffee", author: "xyz", views: 50 },
const ArticleSchema = new Schema({
  _id: Number,
  subject: String,
  author: String,
  views: Number,
});

ArticleSchema.index({ subject: "text" });

module.exports = mongoose.model("article", ArticleSchema);
