const mongoose = require("mongoose");
const schema = mongoose.Schema;

const artistSchema = new schema({
  _id: Number,
  last_name: String,
  first_name: String,
  year_born: Number,
  year_died: Number,
  nationality: String,
});

const ArtistModel = mongoose.model("artist", artistSchema);

module.exports = ArtistModel;
