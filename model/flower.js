const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// "_id" : 1, "flowerFieldA" : [ "rose", "orchid" ], "flowerFieldB" : [ "rose", "orchid" ]
const FlowerSchema = new Schema({
  _id: Number,
  flowerFieldA: Array,
  flowerFieldB: Array,
});

const FlowerModel = mongoose.model("flower", FlowerSchema);

module.exports = FlowerModel;
