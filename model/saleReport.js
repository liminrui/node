const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { _id: 1, quarter: "2019Q1", region: "A", qty: 400 },
const SaleReportSchema = new Schema({
  _id: Number,
  quarter: String,
  region: String,
  qty: Number,
});

const SaleReportModel = mongoose.model("saleReport", SaleReportSchema);

module.exports = SaleReportModel;
