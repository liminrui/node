const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//"_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"]
const inventorySchema = new Schema({
  _id: Number,
  item: String,
  sizes: Array,
  price: Number,
  sku: String,
  instock: Number,
});

const InventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = InventoryModel;
