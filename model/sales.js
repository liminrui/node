const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * "_id" : 1,
   "item" : "abc",
   "price" : 20,
   "quantity" : 5,
   "date" : ISODate("2017-05-20T10:24:51.303Z")
 */
const saleSchema = new Schema({
  _id: Number,
  year: Number,
  item: String,
  quantity: Object,
  date: Date,
  price: Number,
});

const SaleModel = new mongoose.model("sale", saleSchema);

module.exports = SaleModel;
