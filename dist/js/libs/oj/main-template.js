/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Example of Require.js boostrap javascript
 */


/* global requirejs:false */
(function () {
  requirejs.config({
    // Path mappings for the logical module names
    paths: {
      'ojs': 'libs/oj/14.1.0/min@insertESLevelPath@',
      'ojL10n': 'libs/oj/14.1.0/ojL10n',
      'ojtranslations': 'libs/oj/14.1.0/resources',
      
  'knockout': 'libs/knockout/knockout-3.5.1',
  'jquery': 'libs/jquery/jquery-3.6.1.min',
  'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.13.2.min',
  'text': 'libs/require/text',
  'hammerjs': 'libs/hammer/hammer-2.0.8.min',
  'signals': 'libs/js-signals/signals.min',
  'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2.min',
  'css': 'libs/require-css/css.min',
  'css-builder': 'libs/require-css/css-builder',
  'normalize': 'libs/require-css/normalize',
  '@oracle/oraclejet-preact': 'libs/oraclejet-preact/amd',
  'preact': 'libs/preact/dist/preact.umd',
  'preact/hooks': 'libs/preact/hooks/dist/hooks.umd',
  'preact/compat': 'libs/preact/compat/dist/compat.umd',
  'preact/jsx-runtime': 'libs/preact/jsx-runtime/dist/jsxRuntime.umd',
  'proj4': 'libs/proj4js/dist/proj4',
  'touchr': 'libs/touchr/touchr'
    },
    // Shim configurations for modules that do not expose AMD
    shim: {
      jquery: {
        exports: ['jQuery', '$']
      }
    },

    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
      ojL10n: {
        merge: {
          // 'ojtranslations/nls/ojtranslations': 'resources/nls/myTranslations'
        }
      },
      text: {
        // Override for the requirejs text plugin XHR call for loading text resources on CORS configured servers
        // eslint-disable-next-line no-unused-vars
        useXhr: function (url, protocol, hostname, port) {
          // Override function for determining if XHR should be used.
          // url: the URL being requested
          // protocol: protocol of page text.js is running on
          // hostname: hostname of page text.js is running on
          // port: port of page text.js is running on
          // Use protocol, hostname, and port to compare against the url being requested.
          // Return true or false. true means "use xhr", false means "fetch the .js version of this resource".
          return true;
        }
      }
    }
  });
}());

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback.
 *
 * For a listing of which JET component modules are required for each component, see the specific component
 * demo pages in the JET cookbook.
 */
require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojmenu'], // add additional JET component modules as needed
  // eslint-disable-next-line no-unused-vars
  function (oj, ko, $) { // this callback gets executed when all required modules are loaded
      // add any startup code that you want here
  }
);

