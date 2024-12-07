module.exports = {
  command: "configure <key> [value]",
  aliases: ["config", "cfg"],
  desc: "Set a config variable",
  builder: (yargs) => yargs.default("value", "true"),
  handler: (argv) => {
    console.log(`setting ${argv.key} to ${argv.value}`);
  },
};
