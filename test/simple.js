require("../utils/db");

const User = require("../model/user");

const user = new User({
  username: "liminrui",
  password: "123456",
});

user.save().then(async () => {
  const res = await User.find();
  console.log("res: ", res);
});
