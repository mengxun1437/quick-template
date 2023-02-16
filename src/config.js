const { isExist, fs } = require("./utils");
const path = require("path");

const GLOBAL_CONFIG_PATH = path.join(__dirname, "../.quick-template");
const DEFAULT_CONFIG = {
  // 模版地址
  git: {
    type: "github",
    origin: "https://github.com",
    owner: "mengxun1437",
    name: "quick-template",
  },
  // 全局替换
  globalProps: ["projectName", "projectDescription", "projectAuthor"],
  // 模板选择
  templates: ["nodejs-cli"],
  // 需要全局替换的文件
  handleFiles: ["package.json", "README.md"],
  // 需要展示给用户的命令, template, projectName, projectDescription, projectAuthor是必展示
  extraCommands: {
    "nodejs-cli": ["repoAuthor"],
  },
};

const globalConfig = getGlobalConfig();

const KEYS_TYPE_MAP = {
  "git.type": "string",
  "git.origin": "string",
  "git.owner": "string",
  "git.name": "string",
  globalProps: "array",
  templates: "array",
  handleFiles: "array",
};

Object.keys(globalConfig?.extraCommands || {}).forEach((template) => {
  KEYS_TYPE_MAP["extraCommands." + template] = "array";
});

function getGlobalConfig() {
  try {
    if (!isExist(GLOBAL_CONFIG_PATH)) {
      fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG), {
        encoding: "utf-8",
      });
      return DEFAULT_CONFIG;
    } else {
      return JSON.parse(
        fs.readFileSync(GLOBAL_CONFIG_PATH, {
          encoding: "utf-8",
        })
      );
    }
  } catch (e) {
    // console.log(e);
    return DEFAULT_CONFIG;
  }
}

function setGlobalConfig(_globalConfig) {
  fs.writeFileSync(
    GLOBAL_CONFIG_PATH,
    JSON.stringify(_globalConfig, undefined, 2),
    {
      encoding: "utf-8",
    }
  );
}

function getGitUrl(git) {
  return `${git.origin}:${git.owner}/${git.name}`;
}

module.exports = {
  getGlobalConfig,
  setGlobalConfig,
  getGitUrl,
  KEYS_TYPE_MAP,
};
