/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojconfig'], function (exports, oj, Config) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  /**
   * @namespace oj.Translations
   * @classdesc Services for Retrieving Translated Resources
   * @export
   * @since 1.0
   * @ojtsmodule
   * @hideconstructor
   */
  const Translations = {};

  /**
   * Sets the translation bundle used by JET
   * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
   * translated strings for JET.
   * This method may also be used by an application that wants to completely replace the resource bundle that is automatically
   * fetched by an AMD loader.
   * @method setBundle
   * @memberof oj.Translations
   * @param {Object} bundle resource bundle that should be used by the framework
   * @return {void}
   * @export
   */
  Translations.setBundle = function (bundle) {
    Translations._bundle = bundle;
  };

  /**
   * Retrives a translated resource for a given key
   * @method getResource
   * @memberof oj.Translations
   * @param {string} key resource key The dot character (.) within the key string
   * is interpreted as a separator for the name of a sub-section within the bundle.
   * For example, 'components.chart', would be read as the 'chart' section within
   * 'components'. Thus the key name for an individual section should never contain a dot.
   * @return {Object|string|null} resource associated with the key or null if none was found
   * @export
   */
  Translations.getResource = function (key) {
    return Translations._getResourceString(key);
  };

  /**
   * Applies parameters to a format pattern
   * @method applyParameters
   * @memberof oj.Translations
   * @param {string} pattern pattern that may contain tokens like {0}, {1}, {name}. These tokens
   * will be used to define string keys for retrieving values from the parameters
   * object. Token strings should not contain comma (,)
   * or space characters, since they are reserved for future format type enhancements.
   * The reserved characters within a pattern are:
   * $ { } [ ]
   * These characters will not appear in the formatted output unless they are escaped
   * with a dollar character ('$').
   *
   * @param {Object|Array} parameters parameters to be inserted into the string. Both arrays and
   * Javascript objects with string keys are accepted.
   *
   * @return {string} The formatted message string, or an empty string if the pattern is either null or an empty string.
   * @export
   */
  Translations.applyParameters = function (pattern, parameters) {
    return pattern == null ? '' : Translations._format(pattern, parameters);
  };

  /**
   * Retrieves a translated string after inserting optional parameters.
   * The method uses a key to retrieve a format pattern from the resource bundle.
   * Tokens like {0}, {1}, {name} within the pattern will be used to define placement
   * for the optional parameters.  Token strings should not contain comma (,)
   * or space characters, since they are reserved for future format type enhancements.
   * The reserved characters within a pattern are:
   * $ { } [ ]
   * These characters will not appear in the formatted output unless they are escaped
   * with a dollar character ('$').
   * @method getTranslatedString
   * @memberof oj.Translations
   * @param {string} key  translations resource key. The dot character (.) within the key string
   * is interpreted as a separator for the name of a sub-section within the bundle.
   * For example, 'components.chart', would be read as the 'chart' section within
   * 'components'. Thus the key name for an individual section should never contain a dot.
   *
   * @param {...(string|Object|Array)} var_args  - optional parameters to be inserted into the
   * translated pattern.
   *
   * If more than one var_args arguments are passed, they will be treated as an array
   * for replacing positional tokens like {0}, {1}, etc.
   * If a single argument is passed, it will be treated as a Javascript Object whose
   * keys will be matched to tokens within the pattern. Note that an Array is just
   * a special kind of such an Object.
   *
   * For backward compatibility, a var_args argument whose type is neither
   * Object or Array will be used to replace {0} in the pattern.
   *
   * @return formatted translated string
   * @ojsignature {target: "Type", for:"returns", value: "string"}
   * @export
   */
  // eslint-disable-next-line camelcase, no-unused-vars
  Translations.getTranslatedString = function (key, var_args) {
    var val = Translations._getResourceString(key);

    if (val == null) {
      return key;
    }

    var params = {};

    if (arguments.length > 2) {
      params = Array.prototype.slice.call(arguments, 1);
    } else if (arguments.length === 2) {
      params = arguments[1];
      if (typeof params !== 'object' && !(params instanceof Array)) {
        params = [params];
      }
    }

    return Translations.applyParameters(val, params);
  };

  /**
   * Provides a key-to-value map of the translated resources for a given component name
   * @method getComponentTranslations
   * @memberof oj.Translations
   * @param {string} componentName name of the component
   * @return {Object} a map of translated resources
   * @export
   */
  Translations.getComponentTranslations = function (componentName) {
    var bundle = Translations._getBundle()[componentName];

    if (bundle == null) {
      return {};
    }

    // Assume that the set of keys remains constant regardless of the current locale
    var translations = {};
    var keys = Object.keys(bundle);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      translations[key] = bundle[key];
    }

    return translations;
  };

  /**
   * Retrives a translated resource for a given key, accounting for nested keys
   * @param {string} key
   * @return {string|null} resource associated with the key or null if none was found
   * @private
   */
  Translations._getResourceString = function (key) {
    // Account for dot separated nested keys
    var keys = key ? key.split('.') : [];
    var bundle = Translations._getBundle();
    oj.Assert.assertObject(bundle);

    // even though we start with a valid bundle it's possible that part or all of the key is invalid,
    // so check we have a valid bundle in the for loop
    // if we have a key like a.b.c
    for (var index = 0; index < keys.length && bundle != null; index++) {
      var subkey = keys[index];
      bundle = bundle[subkey];
    }

    return bundle != null ? bundle : null;
  };

  Translations._format = function (formatString, parameters) {
    var formatLength = formatString.length;

    // Use the javascript StringBuffer technique.
    var buffer = [];

    var token = null;

    var escaped = false;
    var isToken = false;
    var isGroup = false;
    var isExcluded = false;

    var tokenTerminated; // this will be set to true when a comma or space is
    // encountered in teh token
    var i;

    for (i = 0; i < formatLength; i++) {
      var ch = formatString.charAt(i);

      var accumulate = false;

      if (!escaped) {
        switch (ch) {
          case '$':
            escaped = true;
            break;

          case '{':
            if (!isExcluded) {
              if (!isToken) {
                tokenTerminated = false;
                token = [];
              }
              isToken = true;
            }
            break;

          case '}':
            if (isToken && token.length > 0) {
              var val = parameters[token.join('')];
              buffer.push(val === undefined ? 'null' : val);
            }
            isToken = false;
            break;

          case '[':
            if (!isToken) {
              if (isGroup) {
                isExcluded = true;
              } else {
                isGroup = true;
              }
            }
            break;

          case ']':
            if (isExcluded) {
              isExcluded = false;
            } else {
              isGroup = false;
            }
            break;

          default:
            accumulate = true;
        }
      } else {
        accumulate = true;
        escaped = false;
      }

      if (accumulate) {
        if (isToken) {
          if (ch === ',' || ch === ' ') {
            tokenTerminated = true;
          } else if (!tokenTerminated) {
            token.push(ch);
          }
        } else if (!isExcluded) {
          buffer.push(ch);
        }
      }
    }

    // Use the javascript StringBuffer technique for toString()
    return buffer.join('');
  };

  Translations._getBundle = function () {
    var b = Translations._bundle;
    if (b) {
      return b;
    }
    return Config.getConfigBundle();
  };

  const setBundle = Translations.setBundle;
  const getResource = Translations.getResource;
  const applyParameters = Translations.applyParameters;
  const getTranslatedString = Translations.getTranslatedString;
  const getComponentTranslations = Translations.getComponentTranslations;

  exports.applyParameters = applyParameters;
  exports.getComponentTranslations = getComponentTranslations;
  exports.getResource = getResource;
  exports.getTranslatedString = getTranslatedString;
  exports.setBundle = setBundle;

  Object.defineProperty(exports, '__esModule', { value: true });

});
