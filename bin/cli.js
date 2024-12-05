#!/usr/bin/env
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { readFile } = require("node:fs/promises");
const path = require("path");

async function main() {
  const obj = await yargs(hideBin(process.argv))
    .array("foo")
    .alias("foo", "f")
    .check((argv) => {
      // console.log("argv._.length: ", argv._, argv._.length);
      if (argv._.length > 1) {
        throw new Error("参数格式不对");
      }
      return true;
    })
    .alias("i", "ingredient")
    .describe("i", "choose your sandwich ingredients")
    .choices("i", ["peanut-butter", "jelly", "banana", "pickles"])
    // .help("help")
    .option("size", {
      alias: "s",
      describe: "choose a size",
      choices: ["xs", "s", "m", "l", "xl"],
    })
    .coerce("file", async (argv) => {
      // console.log("argv: ", argv, __dirname, path.join(__dirname, argv));
      const content = await readFile(argv, "utf8");
      return JSON.parse(content);
    })
    .parseAsync();
  console.log("obj: ", obj);
}

main();
