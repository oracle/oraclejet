#! /usr/bin/env node
const path = require("path");
const build = require("./Bundler");

// Extract arguments
const argsMap = {};
Array.from(process.argv)
  .slice(2)
  .forEach((arg) => {
    // Store --key=value as { key: value }
    const pair = arg.split(/^--/)[1]?.split(/=/);
    if (pair) {
      argsMap[pair[0]] = pair[1];
    }
    return true;
  });
if (Object.keys(argsMap).length >= 3) {
  build(
    argsMap.rootDir,
    argsMap.bundleName,
    argsMap.locale,
    argsMap.outDir,
    argsMap.module
  );
} else {
  console.warn(
    `Usage: ${path.basename(
      process.argv[1]
    )} [--module=amd|esm] --rootDir=</path/to/bundle-dir> --bundleName=<message-bundle-name.json> --locale=<bundle-locale> --outDir=<output-dir>

    Required:
      --rootDir\tThe root directory where the bundle files are contained
      --bundleName\tThe bundle's filename (basename, without the directory path)
      --locale\tThe bundle's locale (not required for override bundles)
      --outDir\tThe output directory where the built bundle will be written
    Optional:
      --module\tProduce bundles as 'amd' or 'esm' modules (defaults to 'esm')

    Example for root bundle:
    ${path.basename(process.argv[1])} --rootDir=resources/nls --bundleName=bundle-i18n.json --locale=en-US --outDir=dist --module=amd

    Example for override bundle:
    ${path.basename(process.argv[1])} --rootDir=resources/nls --bundleName=bundle-i18n-x.json --locale=en-US --outDir=dist --module=amd

    The rootDir should be the root directory where your root resource bundles and
    NLS directories reside. This directory would contain entries such as:

      - bundle-i18n.json
      - de
        - bundle-i18n.json
        - bundle-i18n-x.json
      - de-DE
        - bundle-i18n.json
        - bundle-i18n-x.json
      `
  );
}
