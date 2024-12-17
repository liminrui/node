const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  price: Number,
  time: Date,
});

const StockModel = mongoose.model("stock", StockSchema);

module.exports = StockModel;
