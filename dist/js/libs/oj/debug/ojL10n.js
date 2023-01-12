/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 *
 * This is a fork of the i18n Require.js plugin.
 * It makes minor chnages to the way the default locale is determined and to the way bundles are merged
 *
 * @license RequireJS i18n 2.0.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/i18n for details
 */
/* jslint regexp: true */
/* jslint browser: true*/
/* global define: false */

/**
 * This plugin handles i18n! prefixed modules. It does the following:
 *
 * 1) A regular module can have a dependency on an i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "i18n!nls/colors".
 *
 * This plugin will load the i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * i18n!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */
(function () {
  'use strict';

  // regexp for reconstructing the master bundle name from parts of the regexp match
  // nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
  // ["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
  // nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
  // ["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
  // so, if match[5] is blank, it means this is the top bundle definition.
  var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^/]*)\/?([^/]*)/;

  // Helper function to avoid repeating code. Lots of arguments in the
  // desire to stay functional and support RequireJS contexts without having
  // to know about the RequireJS contexts.
  function _addPart(locale, master, needed, toLoad, prefix, suffix, localePrefix) {
    if (!master[locale]) {
      // Try the same language/region without script for zh
      // We are removing a Hans or Hant between the two dashes
      // eslint-disable-next-line no-param-reassign
      locale = locale.replace(/^zh-(Hans|Hant)-([^-]+)$/, 'zh-$2');
    }

    if (master[locale]) {
      needed.push(locale);
      if (master[locale] === true || master[locale] === 1) {
        var loc = localePrefix ? localePrefix + locale : locale;
        toLoad.push(prefix + loc + '/' + suffix);
      }
      return true;
    }
    return false;
  }

  function _isObject(val) {
    return typeof val === 'object';
  }

  /**
   * Fixes up locale to comply with BCP47 spec and returns parts that should be used for mathching the bundles
   */
  function _getLocaleParts(locale) {
    var tokens = locale.toLowerCase().split(/-|_/);
    var parts = [tokens[0]];
    var phase = 1;
    var i; // script

    for (i = 1; i < tokens.length; i++) {
      var t = tokens[i];
      var len = t.length;

      if (len === 1) {
        // extension
        break;
      }

      switch (phase) {
        case 1:
          phase = 2;
          if (len === 4) {
            // this is a script tag
            // capitalize the first letter
            parts.push(t.charAt(0).toUpperCase() + t.slice(1));
            break;
          }
        // fall through to the next case
        case 2: // region
          phase = 3;
          parts.push(t.toUpperCase());
          break;
        default: // variant
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
    if (parts[0] !== 'zh' || (parts.length > 1 && parts[1].length === 4)) {
      return;
    }

    var scriptTag = 'Hans';

    var region = parts.length > 1 ? parts[1] : null;

    if (region === 'TW' || region === 'MO' || region === 'HK') {
      scriptTag = 'Hant';
    }

    parts.splice(1, 0, scriptTag);
  }

  /**
   * Simple function to mix in properties from source into target,
   * but only if target does not already have a property of the same name.
   * This is not robust in IE for transferring methods that match
   * Object.prototype names, but the uses of mixin here seem unlikely to
   * trigger a problem related to that.
   */
  function _mixin(target, source) {
    var props = Object.keys(source);
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (target[prop] == null) {
        // eslint-disable-next-line no-param-reassign
        target[prop] = source[prop];
      } else if (_isObject(source[prop]) && _isObject(target[prop])) {
        _mixin(target[prop], source[prop]);
      }
    }
  }

  define(['module'], function (module) {
    var masterConfig = module.config ? module.config() : {};

    return {
      version: '2.0.1+',
      /**
       * Called when a dependency needs to be loaded.
       * @private
       */
      load: function (name, req, onLoad, config) {
        // eslint-disable-next-line no-param-reassign
        config = config || {};

        if (config.locale) {
          masterConfig.locale = config.locale;
        }

        var masterName;
        var match = nlsRegExp.exec(name);
        var prefix = match[1];
        var locale;
        var suffix = match[5];
        var parts;
        var toLoad = [];
        var value = {};
        var i;
        var part;
        var current = '';
        var noOverlay;
        var backup;
        var extraBundle;
        var ebPrefix;
        var ebSuffix;
        var merge;
        var locales;
        var roots;

        // If match[5] is blank, it means this is the top bundle definition,
        // so it does not have to be handled. Locale-specific requests
        // will have a match[4] value but no match[5]
        if (match[5]) {
          // locale-specific bundle
          prefix = match[1];
          masterName = prefix + suffix;
          locale = match[4];
        } else {
          // Top-level bundle.
          masterName = name;
          suffix = match[4];
          locale = masterConfig.locale;

          //  - check if the document object is available
          // Note that the 'typeof' check  is required
          if (typeof document !== 'undefined') {
            if (!locale) {
              locale = config.isBuild ? 'root' : document.documentElement.lang;
              if (!locale) {
                // navigator may be undefined in web workers
                locale =
                  navigator === undefined
                    ? 'root'
                    : // E11 reports incorrect navigator.language, so we are checking OS language first
                      // as a lame susbstitute for the server-side inspection of accept-language headers.
                      // This should not affect other browsers because that navigator.systemLanguage
                      // should be present in IE11 only
                      navigator.systemLanguage ||
                      navigator.language ||
                      navigator.userLanguage ||
                      'root';
              }
            }
            masterConfig.locale = locale;
          } else {
            locale = 'root';
          }
        }

        parts = _getLocaleParts(locale);

        noOverlay = masterConfig.noOverlay;
        backup = masterConfig.defaultNoOverlayLocale;

        var localePrefix = masterConfig.localePrefix;

        // Optional name of the bundle that should be merged with the requested bundle

        merge = masterConfig.merge;
        if (merge) {
          extraBundle = merge[prefix + suffix];
          if (extraBundle) {
            match = nlsRegExp.exec(extraBundle);
            // assume top-level bundle for the merged extra bundle
            ebPrefix = match[1];
            ebSuffix = match[4];
          }
        }

        locales = [];

        for (i = 0; i < parts.length; i++) {
          part = parts[i];
          current += (current ? '-' : '') + part;
          locales.push(current);
        }

        if (config.isBuild) {
          // Assume that  only the root bundle should be added at build time, as the user locale
          // normally cannot be predicted

          toLoad.push(masterName);

          if (extraBundle) {
            toLoad.push(extraBundle);
          }

          req(toLoad, function () {
            onLoad();
          });
        } else {
          if (masterConfig.includeLocale === 'query') {
            masterName = req.toUrl(masterName + '.js');
            masterName += (masterName.indexOf('?') === -1 ? '?' : '&') + 'loc=' + locale;
          }

          roots = [masterName];
          if (extraBundle) {
            roots.push(extraBundle);
          }

          // First, fetch the master bundle, it knows what locales are available.
          req(roots, function (master, extra) {
            var needed = [];

            var _addParts = function (masterBundle, pref, suff) {
              var noMerge = noOverlay || masterBundle.__noOverlay === true;
              var backupBundle = backup || masterBundle.__defaultNoOverlayLocale;

              var matched = false;

              for (var lo = locales.length - 1; lo >= 0 && !(matched && noMerge); lo--) {
                matched = _addPart(
                  locales[lo],
                  masterBundle,
                  needed,
                  toLoad,
                  pref,
                  suff,
                  localePrefix
                );
              }

              var rootOnly = locales.length === 1 && locales[0] === 'root';

              if (noMerge && (rootOnly || !matched) && backupBundle) {
                _addPart(backupBundle, masterBundle, needed, toLoad, pref, suff, localePrefix);
              }

              if (!rootOnly) {
                _addPart('root', masterBundle, needed, toLoad, pref, suff, localePrefix);
              }
            };

            _addParts(master, prefix, suffix);

            var mainBundleCount = needed.length;

            if (extra) {
              _addParts(extra, ebPrefix, ebSuffix);
            }

            // Load all the parts missing.
            req(toLoad, function () {
              var _mixinBundle = function (bundle, start, end /* exclusive*/, pref, suff) {
                for (var j = start; j < end && needed[j]; j++) {
                  var _part = needed[j];
                  var prefixedLoc = localePrefix ? localePrefix + _part : _part;
                  var partBundle = bundle[_part];
                  if (partBundle === true || partBundle === 1) {
                    partBundle = req(pref + prefixedLoc + '/' + suff);
                  }
                  _mixin(value, partBundle || {});
                }
              };

              // Start with the 'extra', as it is supposed to be overriding the entire main bundle
              _mixinBundle(extra, mainBundleCount, needed.length, ebPrefix, ebSuffix);

              _mixinBundle(master, 0, mainBundleCount, prefix, suffix);

              // Stash away the locale on the bundle itself to make the framework aware of the locale used
              // by Require.js

              value._ojLocale_ = parts.join('-');

              // All done, notify the loader.
              onLoad(value);
            });
          });
        }
      }
    };
  });
})();
