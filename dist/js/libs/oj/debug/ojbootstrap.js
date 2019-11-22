/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define([], function()
{
  "use strict";

/* global Promise:false */

/**
 * Contains utility functions intended to be used during application bootstrapping
 *
 * @namespace
 * @name Bootstrap
 * @ojtsmodule
 * @since 7.0.0
 */
// eslint-disable-next-line no-unused-vars
var Bootstrap = {
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
  }())
};


  return Bootstrap;
});