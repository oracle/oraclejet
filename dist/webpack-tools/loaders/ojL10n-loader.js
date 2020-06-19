/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
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
const fs = require("fs");
const vm = require('vm');


module.exports = function ojL10nLoader(source) {

  const opts = this.options||{};
  const loaderOpts = opts.ojL10nLoader||{};
  const locale = loaderOpts.locale||'en-US';


  this.cacheable();
  // tell Webpack that this loader can be executed asynchronously. The results will be provided via the returned callback
  const callback = this.async();

  // Execute the root bundle as JavaScript
  let bundle = _execBundle(source);

  const parts = _getLocaleParts(locale);

  let toMerge = [];
  let toLoad = [];
  let root;

  const rootVal = bundle['root'];
  // Check whether the 'root' translations are specified inline or in a separate file
  if (rootVal === 1 || rootVal === true) {
    toLoad.push('root');
  }
  else {
    root = rootVal;
  }

  root = root||{};

  let localeBlock = "";
  // Go through each locale part and check the corresponding flag in the root bundle
  parts.forEach(part=> {
    localeBlock += (localeBlock.length === 0 ? '' : '-');
    localeBlock += part;
    if (bundle[localeBlock]) {
      toLoad.push(localeBlock);
    }
  });

  let loadCount = toLoad.length;

  // Store the private _ojLocale_ flag since the current Date converter implementation (incorrectly) relies on it
  root._ojLocale_ = parts.join('-');

  if (loadCount === 0) {
    callback(null, _getModuleContent(root));
    return;
  }

  let hasErrors = false;

  const baseName = path.basename(this.resourcePath);
  const dir = path.dirname(this.resourcePath);

  let index = 0;
  toLoad.forEach(item=>{
    let name = path.resolve(dir, item + '/' + baseName);
    this.addDependency(name);

    fs.readFile(name, "utf8", ((i/*index provided by the .bind() call*/, err, content)=>{
      if (hasErrors) {
        return;
      }
      if (err) {
        hasErrors = true;
        callback(err);
        return;
      }
      toMerge[i] = _execBundle(content);
      loadCount--;
      // Once all bundles are read and executed as JavaScript, merge them together
      if (loadCount === 0) {
        callback(null, _getModuleContent(_mergeParts(root, toMerge)));
      }
    }).bind(null, index++) // current index will be provided as the first parameter to the callback
    );
  }
  );

}

/**
 * Evaluates bundle source as JavaScript
 * @param {string} src
 */
function _execBundle(src) {
  const sandbox = {
    define : ret => ret
  };

  const context = vm.createContext(sandbox);

  const script = new vm.Script(src);
  return script.runInContext(context);
}

/**
 * @return CommonJS-style source of the resulting bundle
 * @param {*} obj
 */
function _getModuleContent(obj) {
  return 'module.exports=' + _stringifyWithFunctions(obj);
}

/**
 * Allow functions in bundle values while delegating to JSON.stringify() for everything else
 * @param {*} obj
 */
function _stringifyWithFunctions(obj) {
  if (Array.isArray(obj)) {
    const vals = obj.map(val => {
      return _stringifyWithFunctions(val);
    });
    return `[${vals.join(',')}]`;
  } else if (_isObject(obj)) {
    const vals = Object.keys(obj).map(key => {
      return `${JSON.stringify(key)}:${_stringifyWithFunctions(obj[key])}`;
    });
    return `{${vals.join(',')}}`;
  } else if (typeof obj === 'function') {
    return String(obj);
  } else {
    return JSON.stringify(obj);
  }
}


function _mergeParts(target, toMerge) {
  const len  = toMerge.length;

  if (len === 0)
    return target;


   return _mergeDeep.apply(null, [target].concat(toMerge));

}

function _isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function _mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (_isObject(target) && _isObject(source)) {
    for (const key in source) {
      if (_isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        _mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return _mergeDeep(target, ...sources);
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
