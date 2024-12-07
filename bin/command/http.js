module.exports = {
  command: "get",
  aliases: ["g"],
  desc: "获取网络请求",
  builder: (yargs) => {
    return yargs.option("url", {
      alias: "u",
      default: "http://yargs.js.org/",
    });
  },
  handler: (argv) => {
    console.log("argv: ", argv);
    // console.log(`setting ${argv.key} to ${argv.value}`);
  },
};
