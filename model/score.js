const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//"_id" : 1, "subject" : "History", "score" : 88
const ScoreSchema = new Schema({
  _id: Number,
  subject: String,
  score: Number,
});

const ScoreModel = mongoose.model("score", ScoreSchema);

module.exports = ScoreModel;
