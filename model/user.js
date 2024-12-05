const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const lastMod = require("../plugins/lastMode");

const UserSchema = new Mongoose.Schema(
  {
    name: String,
    q1: Boolean,
    q2: Boolean,
    _id: Number,
    username: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
  },
  {
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
      async login({ username, password }) {
        const user = await this.findOne({ username });

        if (!user) return "不存在该用户";
        const res = await bcrypt.compare(password, user.password);

        return res ? "校验正确" : "密码错误";
      },
    },
  }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(saltRounds);

  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;

  next();
});

UserSchema.plugin(lastMod, { index: true });

const UserModel = Mongoose.model("User", UserSchema);

module.exports = UserModel;
