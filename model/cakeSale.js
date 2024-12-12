const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * _id: 0, type: "chocolate", orderDate: new Date("2020-05-18T14:10:30Z"),
     state: "CA", price: 13, quantity: 120
 */
const CakeSaleSchema = new Schema({
  _id: Number,
  type: String,
  orderDate: Date,
  state: String,
  price: Number,
  quantity: Number,
});

const CakeSaleModel = mongoose.model("cakeSale", CakeSaleSchema);

module.exports = CakeSaleModel;
