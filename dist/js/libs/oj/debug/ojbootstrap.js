/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

  /**
   * Contains utility functions intended to be used during application bootstrapping
   *
   * @namespace
   * @name Bootstrap
   * @ojtsmodule
   * @since 7.0.0
   */

  const Bootstrap = {
    /**
     * Returns a Promise that is resolved when document.readyState is no longer 'loading'
     * i.e. when it is 'interactive' or 'complete'.  This may be used to delay an application's
     * initial applyBindings call until DOM elements are accessible.
     *
     * @static
     * @memberof Bootstrap
     * @method
     * @return {Promise} a Promise that is resolved when document.readyState is no longer 'loading'
     * @ojsignature {target:"Type", value: "Promise<void>", for: "returns", jsdocOverride: true}
     */
    whenDocumentReady: (function () {
      var documentReadyPromise;
      return function () {
        if (!documentReadyPromise) {
          if (document.readyState === 'loading') {
            documentReadyPromise = new Promise(function (resolve) {
              var eventListener = function () {
                document.removeEventListener('DOMContentLoaded', eventListener);
                resolve();
              };
              document.addEventListener('DOMContentLoaded', eventListener);
            });
          } else {
            documentReadyPromise = Promise.resolve();
          }
        }
        return documentReadyPromise;
      };
    })()
  };

  const whenDocumentReady = Bootstrap.whenDocumentReady;

  exports.whenDocumentReady = whenDocumentReady;

  Object.defineProperty(exports, '__esModule', { value: true });

});
