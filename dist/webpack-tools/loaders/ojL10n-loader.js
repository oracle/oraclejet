/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

/**
 * This loader is a Webpack-specific build-time replacement for JET's ojL10n Require.js plugin
 * It assumes that the Webpack bundle is being generated for a particular locale (en-CA, fr-CA, fr-FR, etc.).
 * The locale has to be provided as loader 'locale' option in webpack.config.js. If none is provided, the loader will
 * generate a bundle for en-US.
 * Note that starting with Webpack 2.0, loader options are supposed to be specified when the loader rules are defined.
 * Unforunately, this does not work for JET where the loader ispecified explicitly with ojL10n! and not via the rules.
 * The workaround is to use Webpack's LoaderOptionsPlugin:
 *
 * plugins: [
 *  new webpack.LoaderOptionsPlugin({
 *   options: {
 *     ojL10nLoader: {
 *       locale: "fr-FR"
 *     }
 *   }
 * }
 * ),
 * ...
 * ],
 *
 * The loader will perform merging of all applicable bundles at build time. For example, for en-US it will start with the
 * "root" bundle, then overlay "en" and "en-US" bundles on top of it.
 */

const path = require("path");
const hash = require('crypto');
const vm = require('vm');

const {setBundlesForId} = require('../shared/mediator');
const {stringifyWithFunctions, isObject} = require('../shared/bundleUtils');


module.exports = function ojL10nLoader(source) {

  const opts = this.options||{};
  const loaderOpts = opts.ojL10nLoader||{};
  const locale = loaderOpts.locale ?? 'en-US';

  const baseName = path.basename(this.resourcePath);
  const dir = path.dirname(this.resourcePath);

  this.cacheable();
  // tell Webpack that this loader can be executed asynchronously. The results will be provided via the returned callback
  const callback = this.async();

  if (locale === 'multi') {
    // The bundle Id is constructed by concatenating the file name of the translation bundle with the hex hash computed from the bundle's path.
    // This appraoch allows us to preserve the identifiable bundle name while turning the unique path into an opaque hash.
    const id = `${baseName}_${hash.createHash('md5').update(dir).digest('hex')}`;

    const mergedBundles = _mergeBundles(this, dir, baseName, source).then((bundleMap) => {
      setBundlesForId(id, bundleMap);
      callback(null, `import {getTranslationBundle} from '@oracle/oraclejet/dist/webpack-tools/src-multi-locale/bootstrap.js';
      export default getTranslationBundle('${id}');`);
    });
    return;
  }


  // Otherwise execute old plugin code to merge and return the bundle for a particular locale.

  // Execute the root bundle as JavaScript

  let bundle = _executeBundle(source);

  const parts = _getLocaleParts(locale);

  let toLoad = [];
  let root = {};

  const rootVal = bundle['root'];
  // Check whether the 'root' translations are specified inline or in a separate file
  if (rootVal === 1 || rootVal === true) {
    toLoad.push('root');
  }
  else {
    root = rootVal;
  }

  let localeBlock = "";
  // Go through each locale part and check the corresponding flag in the root bundle
  parts.forEach(part=> {
    localeBlock += (localeBlock.length === 0 ? '' : '-');
    localeBlock += part;
    if (bundle[localeBlock]) {
      toLoad.push(localeBlock);
    }
  });


  // Store the private _ojLocale_ flag that is used by Config.getConfig()
  root._ojLocale_ = parts.join('-');

  if (toLoad.length === 0) {
    callback(null, _getModuleContent(root));
    return;
  }

  toMergePromises = toLoad.map((loc) => _loadLocaleBundle(this, dir, baseName, loc));

  Promise.all(toMergePromises).then((toMerge) =>
      callback(null, _getModuleContent(_mergeDeep(root, toMerge)))).catch((err) => callback(err));

}

/**
 * Fixes up locale to comply with BCP47 spec and returns parts that should be used for mathching the bundles
 */
function _getLocaleParts(locale) {
  var tokens = locale.toLowerCase().split(/-|_/), parts = [tokens[0]], phase = 1, i;// script
  for (i = 1;i < tokens.length;i++) {
    var t = tokens[i], len = t.length;

    if (len == 1)//extension
    {
      break;
    }

    switch (phase) {
      case 1:
      phase = 2;
      if (len == 4) {
        // this is a script tag
        // capitalize the first letter
        parts.push(t.charAt(0).toUpperCase() + t.slice(1));
        break;
      }
      // fall through to the next case
      case 2:
      //region
      phase = 3;
      parts.push(t.toUpperCase());
      break;
      default :
      //variant
      parts.push(t);
    }
  }

  _normalizeLocaleParts(parts);

  return parts;
}

/**
 * 'Normalizes' locale by inserting script tag according to the following rules:
 *  zh -> zh-Hans,
 *  zh-TW -> zh-Hant-TW,
 *  zh-MO -> zh-Hant-MO,
 *  zh-HK -> zh-Hant-HK,
 *  zh-XX (except above) -> zh-Hans-XX
 */
function _normalizeLocaleParts(parts) {
  // do nothing if the language is not 'zh' or a script tag is already
  // present
  if (parts[0] != 'zh' || (parts.length > 1 && parts[1].length == 4)) {
    return;
  }

  var scriptTag = "Hans";

  var region = parts.length > 1 ? parts[1] : null;

  if (region === "TW" || region === "MO" || region === "HK") {
    scriptTag = "Hant";
  }

  parts.splice(1, 0, scriptTag);
}



/**
 * @return CommonJS-style source of the resulting bundle
 * @param {*} obj
 */
function _getModuleContent(obj) {
  return 'module.exports=' + stringifyWithFunctions(obj);
}


/**
 * Evaluates bundle source as JavaScript
 * @param {string} src
 */
function _executeBundle(src) {
  const exports = {};
  const sandbox = {
    define: (arg0, arg1) => arg1? arg1(null, exports)||exports.default: arg0
  };

  const context = vm.createContext(sandbox);
  const script = new vm.Script(src);
  return script.runInContext(context);
}


function _mergeDeep(target, sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        _mergeDeep(target[key], [source[key]]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return _mergeDeep(target, sources);
}


function _getCompleteLocaleSet(rootBundle) {
  const keys = Object.keys(rootBundle);
  const locales = keys.filter((key) => {
    if (key.match(/^[a-z]{2,3}(-.+)?$/)) {
      const val = rootBundle[key];
      return val === 1 || val === true;
    }
    return false;
  });
  return new Set(locales);
}

/**
 * @returns Promise<Map<string, Map<string, object>>> - a Promise for a Map with the keys being unique bundle Ids, and the values being Maps whose keys are supported locales
 * (including 'root', and the values are objects representing the merged translation bundles
 */
async function _mergeBundles(loader/* ojL10n-loader instance*/, dir, baseName, source) {
  const localeBundles = new Map();

  const rootBundle = _executeBundle(source);
  const definedLocalesSet = _getCompleteLocaleSet(rootBundle);

  let rootTranslations = rootBundle['root'];
  if (rootTranslations === 1 || rootTranslations === true) {
    rootTranslations = _loadLocaleBundle(loader, dir, baseName, 'root');
  }

  const rootValue = await rootTranslations;
  localeBundles.set('root', rootValue);

  // BCP-47 locales may have up to 3 parts separated by '-'
  // we need to order the defined locales to have the locales with fewer parts
  // appear first.  Locales with more parts may depend on locales with fewer parts
  // (as 'pt-PT' depends 'pt'), so locales with fewer parts needed to be cached earlier.

  const definedLocaleParts = Array.from(definedLocalesSet).map(loc => loc.split('-'));
  const sortedDefinedLocales = definedLocaleParts.sort((parts0, parts1) => parts0.length-parts1.length);


  // Produce value objects for the sorted defined locales
  const valueObjects = await Promise.all(sortedDefinedLocales.map( async (parts) => {
    const locale = parts.join('-');
    const bundle = await _loadLocaleBundle(loader, dir, baseName, locale);
    return {locale, bundle, parts};
  }));

  valueObjects.forEach(({locale, bundle, parts}) => {
    const toMerge = [rootValue];
    for (let i = 0; i < parts.length-1; i++) {
      const loc = parts.slice(0, i + 1).join('-');
      const b = localeBundles.get(loc);
      if (b) {
        toMerge.push(b)
      }
    }
    toMerge.push(bundle);
    const merged = _mergeDeep({}, toMerge);
    localeBundles.set(locale, merged);
  });

  return localeBundles;
}


async function _loadLocaleBundle(loader, dir, basename, locale) {
  const fullPath = path.resolve(dir, locale, basename);
  loader.addDependency(fullPath);

  return new Promise((resolve, reject) => {
    loader.loadModule(fullPath, (err, source) =>
    {
      if(err) {
        reject(err);
      } else {
        resolve(_executeBundle(source));
      }
    });
  });
}
