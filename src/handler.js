const inquirer = require("inquirer");
const rimraf = require("rimraf");
const path = require("path");
const download = require("download-git-repo");
const { fs, isDir, isFile, isExist } = require("./utils");
const {
  getGlobalConfig,
  getGitUrl,
  KEYS_TYPE_MAP,
  setGlobalConfig,
} = require("./config");

const globalConfig = getGlobalConfig();

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
    choices: globalConfig.templates?.length
      ? globalConfig.templates
      : ["default"],
    default: globalConfig.templates?.[0] ?? 0,
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
  await getTemplateFromRepo(resp);

  handleFiles(resp);
}

function handleConfig(str, option) {
  if (!Object.keys(KEYS_TYPE_MAP).includes(str)) {
    log("key is not exist", "error");
    return;
  }
  const hasOption = Boolean(Object.keys(option).length);
  const shouldGet = !hasOption;
  let tempConfig = globalConfig;
  const keys = str.split(".");
  for (let key of keys) {
    tempConfig = tempConfig?.[key];
  }
  if (shouldGet) {
    log(tempConfig, "info");
  } else {
    if (KEYS_TYPE_MAP[str] === "array" && tempConfig instanceof Array) {
      // 增加
      if (option.add !== undefined) {
        !tempConfig.includes(option.add) && tempConfig.push(option.add);
      } else if (option.delete !== undefined) {
        const index = tempConfig.indexOf(option.delete);
        if (index >= 0) {
          tempConfig.splice(index, 1);
        }
      }
    } else if (KEYS_TYPE_MAP[str] !== "array") {
      if (option.update !== undefined) {
        // 获取上一层，修改当前层
        const lastKey = keys.pop();
        let tmp = globalConfig;
        keys.forEach((key) => {
          tmp = globalConfig[key];
        });
        tmp[lastKey] = option.update;
      }
    }
    setGlobalConfig(globalConfig);
  }
}

// type = common | success | warning | error | info
function log(msg, type = "common") {
  console.log(`${LogPrefix[type]}${msg}`);
}

async function getTemplateFromRepo(resp) {
  await down(resp);
}

async function down(resp) {
  const dir = path.join(process.cwd(), resp.projectName);

  rimraf.sync(dir, {});

  const promise = new Promise((resolve) => {
    download(
      `${getGitUrl(globalConfig.git)}#${resp.template}`,
      dir,
      { clone: true },
      function (err) {
        if (err) {
          log(err, "error");
        } else {
          resolve();
        }
      }
    );
  });
  await promise;
}

function handleFiles(resp) {
  const dir = path.join(process.cwd(), resp.projectName);
  if (!isExist(path) || !isDir(path)) {
    log(`No such directory ${dir}`, "error");
    return;
  }

  // 全局变量替换
  function handleFile(_path) {
    const file = path.join(dir, `./${_path}`);
    if (isExist(pathPackageJSON) && isFile(pathPackageJSON)) {
      // ignore_security_alert
      const source = fs.readFileSync(pathPackageJSON, {
        encoding: "utf-8",
      });
      let replaced = sourcePackageJSON.replaceAll(
        "${projectName}",
        resp.projectName
      );
      replaced = replaced.replaceAll("${projectDescription}", "");
      fs.writeFileSync(file, source, "utf-8");
    }
  }

  globalConfig.handleFiles?.forEach((file) => {
    handleFile(file);
  });
}

module.exports = {
  handleCreate,
  handleConfig,
};
