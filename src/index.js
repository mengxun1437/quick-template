#! /usr/bin/env node
const { program } = require("commander");
const { handleCreate } = require("./handler");

program
  .command("create")
  .description("choose the project you want to create quickly")
  .action(handleCreate);

program.parse(process.argv);
