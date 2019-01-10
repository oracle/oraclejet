/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils'], function(oj, ko, HtmlUtils)
{

/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global Promise:false, HtmlUtils:false */

/**
 * @namespace
 * @name ModuleElementUtils
 * @ojstatus preview
 * @ojtsmodule
 * @classdesc
 * <h3>Utility methods for oj-module element</h3>
 * <p>ModuleElementUtils is a helper object that provides convenience methods for creating views and view models using RequireJS.
 * In addition to loading a view, the loadView() method also converts loaded data into an array of nodes - format accepted by oj-module.
 * </p>
 *
 * <h3> Usage : </h3>
 * <pre class="prettyprint"><code>
 * //create oj-module config as an observable and initialize it with empty values
 * self.moduleConfig = ko.observable({'view':[],'viewModel':null});
 *
 * //create view and view model, mutate configuration object to update oj-module content
 * var masterPromise = Promise.all([
 *   moduleElementUtils.createView({'viewPath':'views/ojModule-simple/page.html'}),
 *   moduleElementUtils.createViewModel({'viewModelPath':'viewModels/ojModule-simple/page'})
 *  ]);
 *  masterPromise.then(
 *    function(values){
 *      self.moduleConfig({'view':values[0],'viewModel':values[1]});
 *    },
 *    function(reason){}
 *  );
 * </code></pre>
 *
 * @hideconstructor
 * @since 5.0.0
 */
var ModuleElementUtils = {};

// make it available internally
oj.ModuleElementUtils = ModuleElementUtils;

/**
 * Utility function for creating a view to be used in configuration object for oj-module.
 * @since 5.0.0
 * @ojstatus preview
 * @param {Object} options Options object used to create a view
 * @param {string} options.viewPath The path to the view, relative to the RequireJS baseURL.
 *                                  The text plugin will be used for loading the view.
 * @param {Function=} options.require An optional instance of the require() function to be used for loading the view.
 *                    By default the path is relative to the baseUrl specified for the application require calls.
 *
 * @example <caption>Get promise for the view</caption>
 * var viewPromise = moduleElementUtils.createView({'viewPath':'views/ojModule-simple/page.html'});
 *
 * @return {Promise} A promise that resolves into an array of DOM nodes
 * @ojsignature {target: "Type", for: "options.require", value: "((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)"}
 * @memberof! ModuleElementUtils
 * @static
 */
ModuleElementUtils.createView = function (options) {
  if (!(options && options.viewPath)) {
    return Promise.resolve([]);
  }

  var viewPromise = new Promise(function (resolve, reject) {
    var requireFunc = options.require ? options.require : require;
    requireFunc(['text!' + options.viewPath], resolve, reject);
  });

  var returnPromise = new Promise(function (resolve, reject) {
    viewPromise.then(
      function (value) {
        var viewArray = HtmlUtils.stringToNodeArray(value);
        return resolve(viewArray);
      },
      function (reason) {
        return reject(reason);
      }
    );
  });
  return returnPromise;
};
/**
 * Utility function for creating a view model to be used in configuration object for oj-module.
 * @since 5.0.0
 * @ojstatus preview
 * @param {Object} options Options object used to create a view model
 * @param {string} options.viewModelPath The path to the model, relative to the RequireJS baseURL.
 * @param {Function=} options.require An optional instance of the require() function to be used for loading the view.
 *                    By default the path is relative to the baseUrl specified for the application require calls.
 *
 * @example <caption>Get promise for the model</caption>
 * var modelPromise = moduleElementUtils.createViewModel({'viewModelPath':'viewModels/ojModule-simple/pageModel'});
 *
 * @return {Promise} A promise that contains either model instance or a model constructor.
 *                  When the promise is resolved into a constructor, the application is responsible
 *                  for constructing the model instance before passing it to the configuration object on the oj-module.
 * @ojsignature {target: "Type", for: "options.require", value: "((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)"}
 * @memberof! ModuleElementUtils
 * @static
 */
ModuleElementUtils.createViewModel = function (options) {
  if (!(options && options.viewModelPath)) {
    return Promise.resolve(null);
  }

  return new Promise(function (resolve, reject) {
    var requireFunc = options.require ? options.require : require;
    requireFunc([options.viewModelPath], resolve, reject);
  });
};

;return {
  'createView': ModuleElementUtils.createView,
  'createViewModel': ModuleElementUtils.createViewModel
}

});