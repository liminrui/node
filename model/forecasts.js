const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForecastSchema = new Schema({
  _id: Number,
  subsections: Array,
  year: Number,
  title: String,
  tags: Array,
});

const ForecastModel = mongoose.model("forecast", ForecastSchema);

module.exports = ForecastModel;
