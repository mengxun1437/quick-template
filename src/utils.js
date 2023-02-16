const fs = require("fs");

function isDir(path) {
  return fs.lstatSync(path).isDirectory();
}

function isFile(path) {
  return fs.lstatSync(path).isFile();
}

function isExist(path) {
  return fs.existsSync(path);
}

const LogPrefix = {
  common: "",
  success: "[SUCCESS] ",
  warning: "[WARNING] ",
  error: "[ERROR] ",
  info: "[INFO] ",
};

// type = common | success | warning | error | info
function log(msg, type = "common") {
  console.log(`${LogPrefix[type]}${msg}`);
}

module.exports = {
  fs,
  isDir,
  isFile,
  isExist,
  log,
};
