const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artWorkScheme = new Schema({
  _id: Number,
  title: String,
  artist: String,
  year: Number,
  price: Number,
  tags: Array,
});

const ArtWorkModel = mongoose.model("artwork", artWorkScheme);

module.exports = ArtWorkModel;
