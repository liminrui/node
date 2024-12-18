const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * 
{ "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") }
 */
const saleSchema = new Schema({
  _id: Number,
  year: Number,
  item: String,
  quantity: Number,
  date: Date,
  price: Number,
  tax: Number,
  applyDiscount: Boolean,
});

const SaleModel = new mongoose.model("sale", saleSchema);

module.exports = SaleModel;
