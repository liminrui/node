const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * 
{ _id: 1, price: 10, tax: 0.50, applyDiscount: true }
 */
const saleSchema = new Schema({
  _id: Number,
  year: Number,
  item: String,
  quantity: Object,
  date: Date,
  price: Number,
  tax: Number,
  applyDiscount: Boolean,
});

const SaleModel = new mongoose.model("sale", saleSchema);

module.exports = SaleModel;
