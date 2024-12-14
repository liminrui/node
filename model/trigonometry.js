const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * "angle_a" : NumberDecimal("53.13010235415597870314438744090659"),
  "angle_b" : NumberDecimal("36.86989764584402129685561255909341"),
  "angle_c" : NumberDecimal("90")
 */
const TrigonometrySchema = new Schema({
  angle_a: Number,
  angle_b: Number,
  angle_c: Number,
});

const TrigonometryModel = mongoose.model("triangle", TrigonometrySchema);

module.exports = TrigonometryModel;
