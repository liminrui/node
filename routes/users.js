const router = require("koa-router")();
const UserModel = require("../model/user");

router.post("/", async (ctx, next) => {
  // ctx.body = "this is a users response!";
  const username = ctx.request.body.username;
  console.log("username: ", username);
  const password = ctx.request.body.password;
  console.log("password: ", password);

  const user = new UserModel({
    username,
    password,
  });

  try {
    await user.save();
    ctx.body = {
      status: {
        code: 0,
        msg: "success",
      },
      data: {
        username,
        password,
      },
    };
  } catch (e) {
    console.log("e: ", e);
    ctx.body = {
      status: {
        code: 403,
        msg: e.msg,
      },
    };
  }
});

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response";
});

module.exports = router;
