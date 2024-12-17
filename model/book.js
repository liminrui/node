const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
const BookSchema = new Schema({
  _id: Number,
  title: String,
  _author: String,
  copies: Number,
  isbn: String,
  lastModified: String,
  author: Object,
  editionNumber: Number,
});

const BookModel = mongoose.model("book", BookSchema);

module.exports = BookModel;
