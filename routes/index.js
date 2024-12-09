const router = require("koa-router")();
// const rateLimiter = require("../middleware/limit");

router.get("/", async (ctx, next) => {
  // ctx.body = {
  //   token: ctx.otp_token,
  // };
  ctx.body = "index page";
});

router.get("string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

module.exports = router;
