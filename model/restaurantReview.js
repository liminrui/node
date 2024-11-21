const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  score: Number,
  date: Date,
});

const RestaurantModel = mongoose.model("restaurant", RestaurantSchema);

module.exports = RestaurantModel;
