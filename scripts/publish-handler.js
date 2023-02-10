const fs = require("fs");
const path = require("path");

const packageJSONPath = path.join(__dirname, "../package.json");
const packageSource = fs.readFileSync(packageJSONPath, {
  encoding: "utf-8",
});
const package = JSON.parse(packageSource);

// handle version increase
let versions = package.version?.split(".");
const lastIndex = versions?.length - 1;
versions[lastIndex]++;
version = versions.join(".");
package.version = version;
console.log("[publish-handler] version: ", version);

fs.writeFileSync(packageJSONPath, JSON.stringify(package, null, 2));
