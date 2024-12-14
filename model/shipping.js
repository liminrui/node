const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { custId: 456, purchaseDate: ISODate("2020-12-31") }
const shipSchema = new Schema({
  custId: Number,
  purchaseDate: Date,
  expectedDeliveryDate: Date,
});

shipSchema.index("custId");

const ShipModel = mongoose.model("ship", shipSchema);

module.exports = ShipModel;
