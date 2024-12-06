const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926, "tags" : [ "painting", "satire", "Expressionism", "caricature" ] }
const ExhibitSchema = new Schema({
  _id: Number,
  title: String,
  artist: String,
  year: Number,
  tags: Array,
});

const ExhibitModel = mongoose.model("exhibit", ExhibitSchema);

module.exports = ExhibitModel;
