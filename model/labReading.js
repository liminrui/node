const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labSchema = new Schema({
  date: Date,
  temperature: Number,
});

const labModel = mongoose.model("labReading", labSchema);

module.exports = labModel;
