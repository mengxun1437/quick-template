const inquirer = require("inquirer");
const { TEMPLATE_NAMES, TEMPLATE_GIT_URL } = require("./constant");
const rimraf = require("rimraf");
const path = require("path");
const download = require("download-git-repo");
const fs = require("fs");

const LogPrefix = {
  common: "",
  success: "[SUCCESS] ",
  warning: "[WARNING] ",
  error: "[ERROR] ",
  info: "[INFO] ",
};

const createOptions = [
  {
    type: "list",
    name: "template",
    message: "Which template you want to create?",
    choices: TEMPLATE_NAMES,
    default: TEMPLATE_NAMES?.[0] ?? 0,
  },
  {
    type: "input",
    name: "projectName",
    message: "Please input the name of your project",
    validate: (str) => {
      return Boolean(str?.length);
    },
  },
  {
    type: "confirm",
    name: "createConfirm",
    message: "Are you sure to create this project?",
  },
];

const createValidKeys = createOptions.map((i) => i.name);

async function handleCreate() {
  const resp = await inquirer.prompt(createOptions);

  if (!resp.createConfirm) {
    log("Sorry, you have canceled your choice!", "warning");
    return;
  }

  // get template from repo
  getTemplateFromRepo(resp);
}

// type = common | success | warning | error | info
function log(msg, type = "common") {
  console.log(`${LogPrefix[type]}${msg}`);
}

function getTemplateFromRepo(resp) {
  down(resp);
}

function down(resp) {
  const dir = path.join(process.cwd(), resp.projectName);
  console.log(dir);

  rimraf.sync(dir, {});

  download(
    `${TEMPLATE_GIT_URL}#${resp.template}`,
    dir,
    { clone: true },
    function (err) {
      if (err) {
        log(err, "error");
      }
    }
  );
}

function isDir(path) {
  return fs.lstatSync(path).isDirectory();
}

function isDirExist(path) {
  return fs.existsSync(path);
}

module.exports = {
  handleCreate,
};
