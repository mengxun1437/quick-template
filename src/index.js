#! /usr/bin/env node
const { program } = require("commander");
const { handleCreate, handleConfig, handleConfigEdit } = require("./handler");

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

program
  .command("edit config")
  .description("edit config in shell")
  .action(handleConfigEdit);

program.parse(process.argv);
