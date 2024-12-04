const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// "_id": 4, "firstname": "Ole-Johan", "lastname" : "Dahl"
const CollectionSchema = new Schema({
  _id: Number,
  firstname: String,
  lastname: String,
  name: Object,
});

const CollectionModel = mongoose.model("collection", CollectionSchema);

module.exports = CollectionModel;
