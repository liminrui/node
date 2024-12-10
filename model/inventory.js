const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//"_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"]
// { _id : 1, item : "ABC1", quarter: "13Q1", description : "product 1" },
const inventorySchema = new Schema({
  _id: Number,
  item: String,
  quarter: String,
  description: String,
  sizes: Array,
  price: Number,
  sku: String,
  instock: Object,
  dimensions: Array,
  qty: Number,
});

const InventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = InventoryModel;
