const Redis = require("ioredis");
// By default, it will connect to localhost:6379.
const client = new Redis();

module.exports = client;
