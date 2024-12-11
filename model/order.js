const Mongoose = require("mongoose");
// { _id: 5, item: "bananas", qty: 5000000000, price: Decimal128("1.25") }
const OrderSchema = new Mongoose.Schema({
  _id: Number,
  name: String,
  size: String,
  price: Number,
  quantity: Number,
  date: Date,
  item: String,
  ordered: Number,
  type: String,
  qty: Number,
});

OrderSchema.index({ item: 1, type: 1 });

const OrderModel = Mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
