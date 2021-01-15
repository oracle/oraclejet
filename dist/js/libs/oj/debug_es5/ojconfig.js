(function() {
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['require', 'exports', 'ojs/ojcore-base', 'ojL10n!ojtranslations/nls/ojtranslations'], function (require, exports, oj, ojt) {
  'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) {
      return e;
    } else {
      var n = {};

      if (e) {
        Object.keys(e).forEach(function (k) {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function get() {
              return e[k];
            }
          });
        });
      }

      n['default'] = e;
      return n;
    }
  }

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  ojt = ojt && Object.prototype.hasOwnProperty.call(ojt, 'default') ? ojt['default'] : ojt;
  /**
   * @license
   * Copyright (c) 2008 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @namespace oj.Config
   * @hideconstructor
   * @classdesc Services for setting and retrieving configuration options
   * @since 1.0
   * @ojtsmodule
   * @export
   * @ojtsimport {module: "ojcspexpressionevaluator", type: "AMD", importName: "CspExpressionEvaluator"}
   */

  var Config = {};
  var trans = ojt;
  /**
   * Retrieves the render mode the application should use.  This allows the application to render content
   * differently based on the type of device.
   * <p>By default, this function returns the value from getDeviceType.</p>
   * <p>An application can override it by adding a "data-oj-device-render-mode" attribute with the desired value
   * to the document body.  This may be useful in simulating the look of one device type on a different device type,
   * such as simulating the look of "phone" on a destop computer.</p>
   *
   * @memberof oj.Config
   * @method getDeviceRenderMode
   * @return {"phone" | "tablet" | "others"} The render mode
   * @export
   */

  Config.getDeviceRenderMode = function () {
    return document.body.getAttribute('data-oj-device-render-mode') || Config.getDeviceType();
  };
  /**
   * Retrieves the type of device the application is running on.  This allows the application to behave
   * differently based on the type of device.
   * <p>This function always return the actual device type.  Use getDeviceRenderMode if the application wants
   * to render content differently based on the device type, including simulated device type.</p>
   *
   * @memberof oj.Config
   * @method getDeviceType
   * @return {"phone" | "tablet" | "others"} The device type
   * @export
   */


  Config.getDeviceType = function () {
    return oj.AgentUtils.getAgentInfo().deviceType;
  };
  /**
   * Retrieves the current locale
   * @memberof oj.Config
   * @method getLocale
   * @return {string} current locale
   * @export
   */


  Config.getLocale = function () {
    if (oj.__isAmdLoaderPresent()) {
      oj.Assert.assert(typeof trans !== 'undefined', 'ojtranslations module must be defined');
      var rl = trans._ojLocale_; // If Require.js internationalziation plugin resolved the locale to "root" (presumably because "lang" attribute was not
      // set, and neither navigator.language or navigator.userLanguage were not available), return "en"

      return rl === 'root' ? 'en' : rl;
    }

    var loc = Config._locale;

    if (loc == null) {
      loc = document.documentElement.lang;

      if (!loc) {
        loc = navigator === undefined ? 'en' : (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      }

      loc = loc.toLowerCase();
      Config._locale = loc;
    }

    return loc;
  };
  /**
   * Changes the current locale
   * @method setLocale
   * @param {string} locale (language code and subtags separated by dash)
   * @param {function(): void} [callback] - for applications running with an AMD Loader (such as Require.js), this optional callback
   * will be invoked when the framework is done loading its translated resources and Locale Elements for the newly specified locale.
   * For applications running without an AMD loader, this optional callback will be invoked immediately
   * @return {undefined}
   * @export
   * @memberof oj.Config
   */


  Config.setLocale = function (locale, callback) {
    if (oj.__isAmdLoaderPresent()) {
      var prefix = 'ojL10n!ojtranslations/nls/';
      var translationBundle = prefix + locale + '/ojtranslations';
      /* ojWebpackError: 'Config.setLocale() is not supported when the ojs/ojcore module has been bundled by Webpack' */

      var translationPromise = new Promise(function (resolve, reject) {
        require([translationBundle], function (m) {
          resolve(_interopNamespace(m));
        }, reject);
      }).then(function (translations) {
        trans = translations;
      });
      var promises = [translationPromise]; // Request LocaleElements only if the ojs/ojlocaledata module is loaded;
      // oj.LocaleData will exist in that case.
      // Validators/Converters that need locale data import ojs/ojlocaledata
      // themselves.
      // If you're just using Config.setLocale to change your
      // translation bundle, this code will do that without
      // incurring the download hit of the ojs/ojlocaledata module.

      if (oj.LocaleData) {
        var localeBundle = prefix + locale + '/localeElements';
        var localePromise = new Promise(function (resolve, reject) {
          require([localeBundle], function (m) {
            resolve(_interopNamespace(m));
          }, reject);
        }).then(function (localeElements) {
          if (localeElements) {
            oj.LocaleData.__updateBundle(localeElements);
          }
        });
        promises.push(localePromise);

        if (oj.TimezoneData) {
          var tzBundlesPromises = oj.TimezoneData.__getBundleNames().map(function (bundleName) {
            return new Promise(function (resolve, reject) {
              require(["".concat(prefix).concat(locale).concat(bundleName)], function (m) {
                resolve(_interopNamespace(m));
              }, reject);
            });
          });

          promises.push(Promise.all(tzBundlesPromises).then(function (timezoneBundles) {
            oj.TimezoneData.__mergeIntoLocaleElements(timezoneBundles);
          }));
        }
      }

      Promise.all(promises).then(function () {
        if (callback) {
          callback();
        }
      });
    } else {
      Config._locale = locale;

      if (callback) {
        callback();
      }
    }
  };
  /**
   * Retrieves a URL for loading a component-specific resource.
   * The URL is resolved as follows:
   * 1. If the application has specified a base URL with setResourceBaseUrl(), the return values will be
   * a relative path appended to the base URL.
   * 2. Otherwise, if the application running with an AMD Loader (such as Require.js), the parent folder of a
   * module with ojs/ mapping will be used as a base URL.
   * 3. Otherwise, the original relative path will be returned.
   * @method getResourceUrl
   * @param {string} relativePath resource path
   * @return {string} resource URL
   * @see oj.Config.setResourceBaseUrl
   * @export
   * @memberof oj.Config
   */


  Config.getResourceUrl = function (relativePath) {
    // Returning null and full URLs (containing protocol or a leading slash) as is
    var fullUrlExp = /^\/|:/;

    if (relativePath == null || fullUrlExp.test(relativePath)) {
      return relativePath;
    }

    var base = Config._resourceBaseUrl;

    if (base == null) {
      base = Config._getOjBaseUrl() || '';
    }

    var len = base.length;
    return base + (len === 0 || base.charAt(len - 1) === '/' ? '' : '/') + relativePath;
  };
  /**
   * Sets the base URL for retrieving component-specific resources
   * @method setResourceBaseUrl
   * @param {string} baseUrl base URL
   * @return {undefined}
   * @see oj.Config.getResourceUrl
   * @export
   * @memberof oj.Config
   */


  Config.setResourceBaseUrl = function (baseUrl) {
    Config._resourceBaseUrl = baseUrl;
  };
  /**
   * Sets the automation mode.
   * @method setAutomationMode
   * @param {string} mode "enabled" for running in automation mode
   * @return {undefined}
   * @see oj.Config.getAutomationMode
   * @export
   * @memberof oj.Config
   */


  Config.setAutomationMode = function (mode) {
    Config._automationMode = mode;
  };
  /**
   * Gets the automation mode.
   * @method getAutomationMode
   * @return {string} automation mode
   * @see oj.Config.setAutomationMode
   * @export
   * @memberof oj.Config
   */


  Config.getAutomationMode = function () {
    return Config._automationMode;
  };
  /**
   * Return a string containing important version information about JET and the libraries
   * it has loaded
   * @method getVersionInfo
   * @return {string}
   * @export
   * @memberof oj.Config
   */


  Config.getVersionInfo = function () {
    // JET information
    var info = 'Oracle JET Version: ' + oj.version + '\n';
    info += 'Oracle JET Revision: ' + oj.revision + '\n';
    var windowDefined = typeof window !== 'undefined'; // Browser information

    if (windowDefined && window.navigator) {
      info += 'Browser: ' + window.navigator.userAgent + '\n';
      info += 'Browser Platform: ' + window.navigator.platform + '\n';
    } // 3rd party libraries


    if ($) {
      if ($.fn) {
        info += 'jQuery Version: ' + $.fn.jquery + '\n';
      }

      if ($.ui && $.ui.version) {
        info += 'jQuery UI Version: ' + $.ui.version + '\n';
      }
    }

    if (oj.ComponentBinding) {
      info += 'Knockout Version: ' + oj.ComponentBinding.__getKnockoutVersion() + '\n';
    } // Local require doesn't have version #


    if (windowDefined && window.require) {
      info += 'Require Version: ' + window.require.version + '\n';
    }

    return info;
  };
  /**
   * Dump information to the browser's console containing important version information about JET and
   * the libraries it has loaded
   * @method logVersionInfo
   * @return {undefined}
   * @memberof oj.Config
   * @export
   */


  Config.logVersionInfo = function () {};
  /**
   * This method gets replaced at build time. For AMD, RequireJS is used. For ESM,
   * it remains blank.
   * When bundled with Webpack, JET's WebpackRequireFixupPlugin will replace the
   * contents to return the correct relative path for the base.
   * @private
   * @ignore
   */


  Config._getOjBaseUrl = function () {
    var base = null;

    if (oj.__isAmdLoaderPresent()) {
      // : use ojs/_foo_ instead of ojs/ojcore to handle the case when ojs.core ends up in a partition bundle
      // in a different location
      var modulePath = require.toUrl('ojs/_foo_');

      base = modulePath.replace(/[^/]*$/, '../');
    }

    return base;
  };
  /**
   * Retrives JET's template engine for dealing with inline templates (currently internal only)
   * @ignore
   * @memberof oj.Config
   * @private
   */


  Config.__getTemplateEngine = function () {
    if (!Config._templateEnginePromise) {
      if (!oj.__isAmdLoaderPresent()) {
        throw new Error('JET Template engine cannot be loaded without an AMD loader');
      }

      Config._templateEnginePromise = new Promise(function (resolve, reject) {
        require(['ojs/ojtemplateengine'], function (m) {
          resolve(_interopNamespace(m));
        }, reject);
      }).then(function (engine) {
        return engine.default;
      });
    }

    return Config._templateEnginePromise;
  };
  /**
   * Returns ojtranslation module. Called by oj.Translations, in this way we can make sure that the ojtranslation module
   * instance is shared between Config and Translations.
   * @ignore
   * @memberof oj.Config
   * @private
   */


  Config.getConfigBundle = function () {
    return trans;
  };
  /**
   * Returns expression evaluator
   * @return {undefined | Object}
   * @ignore
   * @export
   * @memberof oj.Config
   * @since 7.1.0
   */


  Config.getExpressionEvaluator = function () {
    return Config._expressionEvaluator;
  };
  /**
   * Sets an optional CSP-compliant expression evaluator for the JET binding provider and JET ExpressionUtils.
   * This method can only be called once and must be called before applying
   * knockout bindings in the application for the first time.
   * @see <a href="oj.CspExpressionEvaluator.html">CspExpressionEvaluator</a>
   * @method setExpressionEvaluator
   * @param {Object} expressionEvaluator An instance of CspExpressionEvaluator class
   * @return {undefined}
   * @memberof oj.Config
   * @ojshortdesc Sets a CSP-compliant expression evaluator.
   * @export
   * @ojsignature {target:"Type", value: "oj.CspExpressionEvaluator", for: "expressionEvaluator"}
   * @since 7.1.0
   */


  Config.setExpressionEvaluator = function (expressionEvaluator) {
    if (Config._expressionEvaluator) {
      throw new Error("JET Expression evaluator can't be set more than once.");
    }

    Config._expressionEvaluator = expressionEvaluator;
  };

  var getDeviceRenderMode = Config.getDeviceRenderMode;
  var getDeviceType = Config.getDeviceType;
  var getLocale = Config.getLocale;
  var setLocale = Config.setLocale;
  var getResourceUrl = Config.getResourceUrl;
  var setResourceBaseUrl = Config.setResourceBaseUrl;
  var setAutomationMode = Config.setAutomationMode;
  var getAutomationMode = Config.getAutomationMode;
  var getVersionInfo = Config.getVersionInfo;
  var logVersionInfo = Config.logVersionInfo;
  var setExpressionEvaluator = Config.setExpressionEvaluator;
  var getExpressionEvaluator = Config.getExpressionEvaluator;
  var getConfigBundle = Config.getConfigBundle;
  var __getTemplateEngine = Config.__getTemplateEngine;
  exports.__getTemplateEngine = __getTemplateEngine;
  exports.getAutomationMode = getAutomationMode;
  exports.getConfigBundle = getConfigBundle;
  exports.getDeviceRenderMode = getDeviceRenderMode;
  exports.getDeviceType = getDeviceType;
  exports.getExpressionEvaluator = getExpressionEvaluator;
  exports.getLocale = getLocale;
  exports.getResourceUrl = getResourceUrl;
  exports.getVersionInfo = getVersionInfo;
  exports.logVersionInfo = logVersionInfo;
  exports.setAutomationMode = setAutomationMode;
  exports.setExpressionEvaluator = setExpressionEvaluator;
  exports.setLocale = setLocale;
  exports.setResourceBaseUrl = setResourceBaseUrl;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())