const inquirer = require("inquirer");
const rimraf = require("rimraf");
const path = require("path");
const download = require("download-git-repo");
const { fs, isDir, isFile, isExist, log } = require("./utils");
const {
  getGlobalConfig,
  getGitUrl,
  KEYS_TYPE_MAP,
  setGlobalConfig,
} = require("./config");

const globalConfig = getGlobalConfig();

const getExtraOptions = (template) =>
  globalConfig.extraCommands?.[template]?.map((i) => ({
    type: "input",
    name: i,
    message: "Please input the extra command",
    default: `<${i}>`,
  })) || [];

const chooseTemplateOptions = [
  {
    type: "list",
    name: "template",
    message: "Which template you want to create?",
    choices: globalConfig.templates?.length
      ? globalConfig.templates
      : ["default"],
    default: globalConfig.templates?.[0] ?? 0,
  },
];

const createOptions = (template) => [
  {
    type: "input",
    name: "projectName",
    message: "Please input the name of your project",
    validate: (str) => {
      return Boolean(str?.length);
    },
    default: "<projectName>",
  },
  {
    type: "input",
    name: "projectDescription",
    message: "Please input the description of your project",
    default: "<projectDescription>",
  },
  {
    type: "input",
    name: "projectAuthor",
    message: "Please input the author of your project",
    default: "<projectAuthor>",
  },
  ...getExtraOptions(template),
  {
    type: "confirm",
    name: "createConfirm",
    message: "Are you sure to create this project?",
  },
];

async function handleCreate() {
  let dataChoose = await inquirer.prompt(chooseTemplateOptions);
  let dataInput = await inquirer.prompt(createOptions(dataChoose.template));
  const resp = { ...dataChoose, ...dataInput };

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

async function handleConfigEdit() {
  const options = [
    {
      type: "editor",
      message: "Please edit your config",
      name: "editor",
      default: JSON.stringify(globalConfig, undefined, 2),
    },
  ];
  const resp = await inquirer.prompt(options);
  try {
    const data = JSON.parse(resp.editor);
    setGlobalConfig(data);
    log("edit config success", "success");
  } catch (e) {
    log(`edit config error: ${e.message}`, "error");
  }
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

  // if (!isExist(path) || !isDir(path)) {
  //   log(`No such directory ${dir}`, "error");
  //   return;
  // }

  // 全局变量替换
  function handleFile(_path) {
    const file = path.join(dir, `./${_path}`);
    if (isExist(file) && isFile(file)) {
      // ignore_security_alert
      const source = fs.readFileSync(file, {
        encoding: "utf-8",
      });
      let replaced = source;
      globalConfig.globalProps?.forEach((name) => {
        const reg = new RegExp("\\${" + name + "}", "g");
        replaced = replaced.replace(reg, resp?.[name] || "");
      });
      fs.writeFileSync(file, replaced, "utf-8");
    }
  }

  globalConfig.handleFiles?.forEach((file) => {
    handleFile(file);
  });
}

module.exports = {
  handleCreate,
  handleConfig,
  handleConfigEdit,
};
