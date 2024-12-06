const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { _id: 1, supplier: "Aardvark and Sons", state: "Texas" },
const SupplySchema = new Schema({
  _id: Number,
  supplier: String,
  state: String,
});

const SupplyModel = mongoose.model("supply", SupplySchema);

module.exports = SupplyModel;
