const router = require("koa-router")();
const rateLimiter = require("../middleware/limit");

router.get("/", rateLimiter, async (ctx, next) => {
  console.log("ctx: ", ctx);
  console.log("ctx.otp_token: ", ctx.otp_token);
  ctx.body = {
    token: ctx.otp_token,
  };
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

module.exports = router;
