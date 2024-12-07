const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const conditional = require("koa-conditional-get");
const etag = require("koa-etag");
// const otp = require("./middleware/koa-otp")("fndsjkfnsdj");
const mount = require("mount-koa-routes");
require("./utils/db"); // 引用mongoDB

// const index = require("./routes/index");
// const users = require("./routes/users");

// error handler
onerror(app);

// 资源缓存
app.use(conditional());
app.use(etag());

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

// app.use(otp.encode());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("ms: ", ms);
});

mount(app, __dirname + "/routes", process.env.NODE_ENV === "development");

// error-handling
app.on("error", (err, ctx) => {});

module.exports = app;
