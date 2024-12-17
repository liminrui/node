const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { "_id" : 1, "item" : "napkins", price: "$2.50" },
const StockInventorySchema = new Schema({
  _id: Number,
  item: String,
  price: String,
});

const StockInventoryModel = mongoose.model(
  "stockInventory",
  StockInventorySchema
);

module.exports = StockInventoryModel;
