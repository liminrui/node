const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * custId: 456,
         start: ISODate("2010-01-01"),
         end: ISODate("2011-01-01")
 */
const SubscriptionSchema = new Schema({
  custId: Number,
  start: Date,
  end: Date,
});

const SubscriptionModel = mongoose.model("subscription", SubscriptionSchema);

module.exports = SubscriptionModel;
