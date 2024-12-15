const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * { "_id" : 1, "location" : "24th Street",
  "in_stock" : [ "apples", "oranges", "bananas" ] }
 */
const FruitSchema = new Schema({
  _id: Number,
  location: String,
  in_stock: Array,
});

const FruitModel = mongoose.model("fruit", FruitSchema);

module.exports = FruitModel;
