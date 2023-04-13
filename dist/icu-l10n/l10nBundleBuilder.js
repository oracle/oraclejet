#! /usr/bin/env node
const path = require('path');

// Extract arguments
const argsMap = Array.from(process.argv)
  .slice(2)
  .reduce((acc, arg) => {
    // Store --key=value as { key: value }
    const pair = (arg.split(/^--/)[1] || '').split(/=/);
    return {
      ...acc,
      [pair && pair[0]]: pair && pair[1]
    };
  }, {});
if ('rootDir' in argsMap && 'bundleName' in argsMap && 'locale' in argsMap && 'outDir' in argsMap) {
  require('./Bundler').build({
    ...argsMap,
    additionalLocales: argsMap.supportedLocales && argsMap.supportedLocales.split(',')
  });
} else {
  const procName = path.basename(process.argv[1]);
  console.warn(
    `Usage: ${procName} --rootDir=</path/to/bundle-dir> --bundleName=<message-bundle-name.json> --locale=<bundle-locale> --outDir=<output-dir> [--module=amd|esm|ts] [--hooks=<path-to-hooks-file>]

    Required:
      --rootDir\tThe root directory where the bundle files are contained
      --bundleName\tThe bundle's filename (basename, without the directory path)
      --locale\tThe bundle's locale (not required for override bundles)
      --outDir\tThe output directory where the built bundle will be written
    Optional:
      --module\tProduce bundles as 'amd' or 'esm' modules
      --hooks\tThe hooks file to use (see example)
      --supportedLocales\tA list of comma-separated additional locales to build. If
      \ta locale is specified but doesn't have a directory and translation file
      \tin the rootDir, it will be built using the root translations.
      \tThis list will be added onto the full list of supportedLocales exported
      \tfrom the root bundle TS file, which contains locales found in the rootDir.

    Example for root bundle:
    ${procName} --rootDir=resources/nls --bundleName=bundle-i18n.json --locale=en-US --outDir=dist --module=amd

    Example for override bundle:
    ${procName} --rootDir=resources/nls --bundleName=bundle-i18n-x.json --locale=en-US --outDir=dist --module=amd

    The rootDir should be the root directory where your root resource bundles and
    NLS directories reside. This directory would contain entries such as:

      - bundle-i18n.json
      - de
        - bundle-i18n.json
        - bundle-i18n-x.json
      - de-DE
        - bundle-i18n.json
        - bundle-i18n-x.json

    Example for hooks:
    ${procName} --hooks=./custom-hooks.js

    custom-hooks.js:
    module.exports = {
      typeImport: { CustomMessageType: './types/custom-message-type' },
      convertor: \`({ bundleId, id, params, translation }) => ({
        bundleId,
        id,
        params,
        translation
      })\`
    };

    Produces:
      import { CustomMessageType } from "./types/custom-message-type";

      const bundle = {
        "greeting": (params: ParamsType): CustomMessageType => ({
          "bundleId": "my-bundle",
          "key": "greeting",
          "params": [],
          "translation": "Hello!"
        })
      };
      `
  );
  process.exit(1);
}
