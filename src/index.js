#! /usr/bin/env node
const { program } = require("commander");

/**
 * e.g.
program
  .command("init")
  .description("choose the project you want to create quickly")
  .action(handleCreate);

program
  .command("config <key>")
  .description("get/set global config")
  .option("-u, --update <value>", "update config options")
  .option("-a, --add <value>", "add config options")
  .option("-d, --delete <value>", "delete config options")
  .action(handleConfig);
 */

program.parse(process.argv);
