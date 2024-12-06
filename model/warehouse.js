const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// "_id" : 1, "stock_item" : "almonds", warehouse: "A", "instock" : 120
const warehhouseSchema = new Schema({
  _id: Number,
  stock_item: String,
  warehouse: String,
  instock: String,
  region: String,
  state: String,
});

const WarehouseModel = mongoose.model("warehouse", warehhouseSchema);

module.exports = WarehouseModel;
