function createFile(name) {}

const mwFunc1 = (argv) => console.log("I'm a middleware function");
const mwFunc2 = (argv) => console.log("I'm another middleware function");

module.exports = {
  command: "file <key> [value]",
  aliases: ["fs"],
  desc: "文件相关操作",
  builder: (yargs) => {
    return (
      yargs
        .option("create", {
          alias: "cr",
          describe: "add file",
        })
        // .nargs("create", 2)
        .option("delete", {
          alias: "del",
          describe: "删除文件",
        })
        .option("input", {
          alias: "i",
        })
        .option("output", {
          alias: "o",
        })
        .middleware([mwFunc1, mwFunc2])
    );
  },
  handler: (argv) => {
    console.log("handler argv: ", argv);
    // console.log(`setting ${argv}`);
  },
};
