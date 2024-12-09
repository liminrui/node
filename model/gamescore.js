const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//{ playerId: "PlayerA", gameId: "G1", score: 31 },
const GameScoreSchema = new Schema({
  playId: String,
  gameId: String,
  score: Number,
});

const GameScoreModel = mongoose.model("gamescore", GameScoreSchema);

module.exports = GameScoreModel;
