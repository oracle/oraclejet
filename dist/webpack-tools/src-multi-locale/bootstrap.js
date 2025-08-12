/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

/**
 * Provides a Promise that will be resolved when all needed translation bundles have been loaded.
 * The application should await on this function before loading any modules that depend on V1 translation bundles.
 * That includes JET modules, Spectra modules and potentially application modules.
 * @ignore
 * @param? preferredLocale - optional preferred locale
 * @return Promise<void>
 */
export function loadTranslationBundles(preferredLocale = navigator.languages[0]){

  const preferred = _getNormalizedLocale(preferredLocale);

  const bundleLocales = _getV1BundlesInfo();
  const promises = Object.keys(bundleLocales).map(
    (id) => {
      const supportedLocales = bundleLocales[id];
      const match = _matchTranslationBundle(preferred, supportedLocales);
      const toLoad = match ?? 'root';
      return import(/* webpackIgnore: true */`./resources_v1/${toLoad}/${id}.js`).
          then(({default: bundle}) => {_bundleMap.set(id, bundle);
            // _ojLocale_ is used by legacy JET's Config.getLocale(). Object.defineProperty() is used to make the prop non-enumerable
            Object.defineProperty(bundle, '_ojLocale_', {
              value: preferred,
              writable: false,
            });
            return bundle;})
  });
  return Promise.all(promises);
};

/**
 * This method is called by the ojL10-loader implementation when it is running with the "locale" option having been set to "multi"
 * @param {string} id - bundle id
 * @returns a fully-merged translation bundle instance
 */
export const getTranslationBundle = (id) => _bundleMap.get(id);

function _matchTranslationBundle(
  preferredLocale,
  supportedLocales
) {
  let match = null;
  const supportedLocaleSet = new Set(supportedLocales);

  if (supportedLocaleSet.has(preferredLocale)) {
    match = preferredLocale;
  } else {
    match = _findPartialMatch(preferredLocale, supportedLocaleSet);
  }
  return match;
}

function _findPartialMatch(locale, supportedLocales) {
  let match = null;
  const sep = '-';
  const parts = locale.split(sep);

  while (match === null && parts.length > 1) {
    parts.pop();
    const partial = parts.join(sep);
    if (supportedLocales.has(partial)) {
      match = partial;
    }
  }

  return match;
}

const _bundleMap = new Map();


/**
 * This function will be modified by the WebpackRequireFixupPlugin to report supported locales for each bundle Id
 * @ignore
 * @return a POJO with the keys being the bundle IDs, and the values being an array of supported locales - Reccord<string, Array<string>>
 *
 */
function _getV1BundlesInfo() {
  return {};
}


/**
 * Fixes up locale to comply with BCP47 spec
 */
function _getNormalizedLocale(locale) {
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

  return _normalizeLocaleParts(parts).join('-');
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
    return parts;
  }

  var scriptTag = "Hans";

  var region = parts.length > 1 ? parts[1] : null;

  if (region === "TW" || region === "MO" || region === "HK") {
    scriptTag = "Hant";
  }

  return ['zh', scriptTag, region];
}
