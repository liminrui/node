#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { readFile } = require("node:fs/promises");

async function main() {
  const obj = await yargs(hideBin(process.argv))
    .array("foo")
    .alias("foo", "f")
    .check((argv) => {
      //
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
      array: true,
    })
    .options("file", {
      alias: "f",
      describe: "读取文件",
    })
    .coerce("file", async (argv) => {
      //
      const content = await readFile(argv, "utf8");
      return JSON.parse(content);
    })
    .parseAsync();
}

// main();

const cli = require("./command/index");

function command() {
  const _yargs = require("yargs");
  const argv = _yargs
    .command(cli.file)
    .command(cli.http)
    .epilogue("for more information, find our manual at http://example.com")
    .help()
    .parse();
  console.log("argv: ", argv);
}

command();
const fs = require("fs");

function config() {
  var argv = require("yargs/yargs")(process.argv.slice(2))
    .config("settings", function (configPath) {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    })
    .parse();
}

// config();
