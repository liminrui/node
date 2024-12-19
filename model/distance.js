const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { _id: 0, city: "San Jose", distance: 42 },
const DistanceSchema = new Schema({
  _id: Number,
  city: String,
  distance: Number,
});

const DistanceModel = mongoose.model("distance", DistanceSchema);

module.exports = DistanceModel;
