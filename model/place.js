const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * name: "Central Park",
      location: { type: "Point", coordinates: [ -73.97, 40.77 ] },
      category: "Parks"
 * 
 */
const placeSchema = new Schema({
  name: String,
  location: Object,
  category: String,
});
//创建地理索引
placeSchema.index({ location: "2dsphere" });

const PlaceModel = mongoose.model("place", placeSchema);

module.exports = PlaceModel;
