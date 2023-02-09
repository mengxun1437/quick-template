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

module.exports = {
  fs,
  isDir,
  isFile,
  isExist,
};
