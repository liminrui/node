const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TemperatureChangeSchema = new Schema({
  _id: Number,
  startTemp: Number,
  endTemp: Number,
});

const TemperatureChangeModel = mongoose.model(
  "temperature",
  TemperatureChangeSchema
);

module.exports = TemperatureChangeModel;
