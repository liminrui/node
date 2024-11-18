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
    toJSON: {
      virtuals: true,
    },
    virtuals: {
      peronInfo: {
        get() {
          return this.toString();
        },
      },
    },
    methods: {
      toString() {
        return `my name is :${this.username} and my pwd is ${this.password}`;
      },
    },
    statics: {
      findByName(name) {
        return this.findOne({ username: name });
      },
    },
  }
);

const UserModel = Mongoose.model("User", UserSchema);

module.exports = UserModel;
