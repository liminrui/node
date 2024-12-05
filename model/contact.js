const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// _id: "", name: "", email: "", cell: "", home: ""
const ContactSchema = new Schema({
  _id: Number,
  name: String,
  email: String,
  cell: String,
  home: String,
});

const ContactModel = mongoose.model("contact", ContactSchema);

module.exports = ContactModel;
