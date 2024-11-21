const util = require("node:util");
const logger = util.debuglog("foo");

logger("hello from foo [%d]", 123);

