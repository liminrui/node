const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
  quizzes: Array,
});

const GradeModel = mongoose.model("grade", GradeSchema);

module.exports = GradeModel;
