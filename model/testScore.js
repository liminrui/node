const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { studentId: "2345", test01: 62, test02: 81, test03: 80 }
const TestScoreSchema = new Schema({
  studentId: String,
  test01: Number,
  test02: Number,
  test03: Number,
});

const TestScoreModel = mongoose.model("testScore", TestScoreSchema);

module.exports = TestScoreModel;
