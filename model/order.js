/**
 * name: "Pepperoni", size: "small", price: 19,
     quantity: 10, date: ISODate( "2021-03-13T08:14:30Z" )
 */

const Mongoose = require("mongoose");

const OrderSchema = new Mongoose.Schema({
  _id: Number,
  name: String,
  size: String,
  price: Number,
  quantity: Number,
  date: Date,
  item: Array,
});

const OrderModel = Mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
