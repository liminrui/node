const Mongoose = require("mongoose");
const personSchema = Mongoose.Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Story" }],
});

const storySchema = Mongoose.Schema({
  author: { type: Mongoose.Schema.Types.ObjectId, ref: "Person" },
  title: String,
  fans: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

const Story = Mongoose.model("Story", storySchema);
const Person = Mongoose.model("Person", personSchema);

module.exports = {
  Story,
  Person,
};
