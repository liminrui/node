const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { "_id" : 1, "item" : "sweatshirt", "$price": 45.99, qty: 300 }
const inventorySchema = new Schema({
  _id: Number,
  item: String,
  quarter: String,
  description: String,
  sizes: Array,
  price: Number,
  $price: Number,
  sku: String,
  instock: Object,
  dimensions: Array,
  qty: Number,
  quantity: Object,
  items: Array,
  amount: Number,
});

const InventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = InventoryModel;
