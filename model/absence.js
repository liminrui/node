const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { "_id" : 1, "student" : "Ann Aardvark", sickdays: [ new Date ("2018-05-01"),new Date ("2018-08-23") ] }
const AbsenceSchema = new Schema({
  _id: Number,
  student: String,
  sickdays: Array,
});

const AbsenceModel = mongoose.model("absence", AbsenceSchema);

module.exports = AbsenceModel;
