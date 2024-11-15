const app = require("../utils/opt");

module.exports = (key) => ({
  encode: (cb) => (ctx, next) => {
    const token = app.encode(key);
    ctx.otp_token = token;
    if (cb) {
      cb(ctx, next);
    } else {
      next();
    }
  },
  decode: (token, cb) => (ctx, next) => {
    ctx.otp_valid = app.decode(key, token);
    if (cb) {
      cb(ctx, next);
    } else {
      next();
    }
  },
});
