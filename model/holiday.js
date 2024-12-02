const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { "_id" : 1, year: 2018, name: "New Years", date: new Date("2018-01-01") },
const HolidaySchema = new Schema({
  _id: Number,
  year: Number,
  name: String,
  date: Date,
});

const HolidayModel = mongoose.model("holiday", HolidaySchema);

module.exports = HolidayModel;
