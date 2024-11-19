const util = require('node:util');
const debuglog = util.debuglog('foo');


console.log(process.env.NODE_DEBUG);
console.log(debuglog.enabled);
console.log('debuglog: ', debuglog);
debuglog('hello from foo [%d]', 123); 