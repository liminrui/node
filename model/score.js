const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//{ _id: 1, student: "Maya", homework: [ 10, 5, 10 ], quiz: [ 10, 8 ], extraCredit: 0 },
const ScoreSchema = new Schema({
  _id: Number,
  subject: String,
  score: Number,
  student: String,
  homework: Array,
  quiz: Array,
  extraCredit: Number,
});

const ScoreModel = mongoose.model("score", ScoreSchema);

module.exports = ScoreModel;
