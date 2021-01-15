#! /usr/bin/env node
const path = require("path");
const parse = require("./Parser");

// Extract arguments and module type
let moduleOut = "esm";
const args = Array.from(process.argv)
  .slice(2)
  .filter((arg) => {
    if (arg === "--amd") {
      moduleOut = "amd";
      return false;
    }
    return true;
  });
if (args.length === 3) {
  parse.apply(undefined, args.concat(moduleOut));
} else {
  console.warn(
    `Usage: ${path.basename(
      process.argv[1]
    )} [--amd] <message-bundle.json> <bundle-locale> <output-dir>`
  );
}
