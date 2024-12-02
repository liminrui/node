const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//"_id" : 1, "name" : "Central Park Cafe", "borough" : "Manhattan"
const RestaurantSchema = new Schema({
  _id: Number,
  name: String,
  borough: String,
  food: Array,
  beverages: Array,
});

const RestaurantModel = mongoose.model("restaurant", RestaurantSchema);

module.exports = RestaurantModel;
