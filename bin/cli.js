#!/usr/bin/env
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const obj = yargs(hideBin(process.argv))
  .array("foo")
  .alias("foo", "f")
  .check((argv) => {
    console.log("argv._.length: ", argv._, argv._.length);
    if (argv._.length > 1) {
      throw new Error("参数格式不对");
    }
    return true;
  })
  .parse();
console.log("obj: ", obj);
