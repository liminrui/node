const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//"_id" : 1, "item" : "abc", description: "product 1", "instock" : 120
const ItemSchema = new Schema({
  _id: Number,
  item: String,
  description: String,
  instock: Number,
  restaurant_name: String,
  drink: String,
});

const ItemModel = mongoose.model("item", ItemSchema);

module.exports = ItemModel;
