const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    methods: {
      toString() {
        console.log(`my name is :${this.name} and my pwd is ${this.password}`);
      },
    },
  },
  {
    statics: {
      findByName(name) {
        return this.find({ name: new RegExp(name, "i") });
      },
    },
  }
);

const UserModel = Mongoose.model("User", UserSchema);

module.exports = UserModel;
