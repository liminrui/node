const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//{ _id: 'A', sizes: [ 7, 11 ] },
const ShoeSchema = new Schema({
  _id: String,
  sizes: Array,
});

const ShoeModel = mongoose.model("shoe", ShoeSchema);

module.exports = ShoeModel;
