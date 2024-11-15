const notp = require("notp");

const opt = {
  window: 0,
};

const app = {
  encode(key) {
    return notp.totp.gen(key, opt);
  },
  decode(key, token) {
    const login = notp.totp.verify(token, key, opt);
    if (!login) {
      console.log("token invalid");
      return false;
    }
    return true;
  },
};

module.exports = app;
