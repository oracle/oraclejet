/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { stringToNodeArray } from 'ojs/ojhtmlutils';

/**
 * @namespace
 * @name ModuleElementUtils
 *
 * @ojtsmodule
 * @ojtsimport {module: "ojmodule-element", type: "AMD", imported: ["ModuleViewModel"]}
 * @classdesc
 * <h3>Utility methods for oj-module element</h3>
 * <p>ModuleElementUtils is a helper object that provides convenience methods for creating views, view models or entire oj-module configuration objects using RequireJS.
 * </p>
 * <h3>Conventions</h3>
 * <h4>View</h4>
 * <ul>
 *  <li>Views should have .html extension.</li>
 *  <li>In addition to loading the view, both the createView() and createConfig() methods will convert the loaded view into an array of nodes, as expected by oj-module.</li>
 * </ul>
 * <h4>View Model</h4>
 * <ul>
 *  <li>ViewModel modules should have .js extension.</li>
 *  <li>The view model is loaded as an AMD module and the value is expected to be either a constructor function or an object - a view model instance.</li>
 *  <li>See descriptions of the createViewModel() and createConfig() methods for details on how the loaded module is handled.</li>
 * </ul>
 *
 * <h3> Create configuration object using createView() and createViewModel()</h3>
 * <pre class="prettyprint"><code>
 * //define oj-module config as a Promise that resolves into a configuration object
 * self.moduleConfig = Promise.all([
 *   moduleElementUtils.createView({'viewPath':'views/dashboard/page.html'}),
 *   moduleElementUtils.createViewModel({'viewModelPath':'viewModels/dashboard/page'})
 *  ])
 *  .then(
 *    function(values){
 *      return {'view':values[0],'viewModel':values[1]};
 *    },
 *    function(reason){}
 *  );
 * </code></pre>
 *
 * <h3> Create configuration object using createConfig()</h3>
 * <pre class="prettyprint"><code>
 * //define oj-module config as a Promise that resolves into a configuration object
 * self.moduleConfig = moduleElementUtils.createConfig({ name: 'dashboard/page', params: {value:'A'} });
 * </code></pre>
 *
 * @hideconstructor
 * @since 5.0.0
 */
const ModuleElementUtils = {};

oj._registerLegacyNamespaceProp('ModuleElementUtils', ModuleElementUtils);

/**
 * Utility function for creating a view to be used in configuration object for oj-module.
 * @since 5.0.0
 *
 * @param {Object} options Options object used to create a view
 * @param {string} options.viewPath The path to the view, relative to the RequireJS baseURL.
 *                                  The text plugin will be used for loading the view.
 * @param {Function=} options.require An optional instance of the require() function to be used for loading the view.
 *                    By default the path is relative to the baseUrl specified for the application require calls.
 *
 * @example <caption>Get promise for the view</caption>
 * var viewPromise = moduleElementUtils.createView({'viewPath':'views/dashboard/page.html'});
 *
 * @return {Promise} A promise that resolves into an array of DOM nodes
 * @ojsignature [
 *   {target: "Type", for: "options.require", value: "((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)"},
 *   {target: "Type", value: "(options: {viewPath: string, require?: ((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)}):Promise<Node[]>"}]
 * @memberof! ModuleElementUtils
 * @static
 */
ModuleElementUtils.createView = function (options) {
  if (!(options && options.viewPath)) {
    return Promise.resolve([]);
  }

  return (
    new Promise(function (resolve, reject) {
      var requireFunc = options.require ? options.require : require;
      requireFunc(['text!' + options.viewPath], resolve, reject);
    })
      // NOTE: Do not put any calls referencing imported modules in this method. They
      // will cause issues during Webpack. The post-processing of the view HTML text
      // using HtmlUtils is moved to _processViewText because of this.
      .then(ModuleElementUtils._processViewText)
  );
};

/**
 * Read HTML content as text to construct HTMLElements.
 * This method is needed so that calls to HtmlUtils can be properly Webpack'd
 * when referenced from createView.
 * @param {string} viewText The view HTML as a string
 * @return Array<HTMLElement> An array of HTMLElement(s) from the parsed text
 * @private
 */
ModuleElementUtils._processViewText = function (viewText) {
  return stringToNodeArray(viewText);
};
/**
 * Utility function for creating a view model to be used in configuration object for oj-module.
 * @since 5.0.0
 *
 * @param {Object} options Options object used to create a view model
 * @param {string} options.viewModelPath The path to the model, relative to the RequireJS baseURL.
 * @param {Function=} options.require An optional instance of the require() function to be used for loading the view model.
 *                  By default the path is relative to the baseUrl specified for the application require calls.
 * @param {any=} options.params Parameters object that will be passed either to the model constructor or
 *                  to the <code>initialize</code> method on the loaded model.
 * @param {('always'|'never'|'ifParams')=} options.initialize valid values are "always", "never", "ifParams" (default)
 *                  <ul>
 *                   <li>always - the model will be instantiated from the constructor whether parameters are given or not.</li>
 *                   <li>never - an instance or a constructor will be given to the application and the application is responsible for constructing the model instance.</li>
 *                   <li>ifParams - the model will be instantiated from the constructor or <code>initialize</code> method will be called on the instance,
 *                       when parameters object is specified.</li>
 *                  </ul>
 * @example <caption>Get promise for the model</caption>
 * var modelPromise = moduleElementUtils.createViewModel({'viewModelPath':'viewModels/dashboard/page'});
 *
 * @return {Promise} A promise that contains either model instance or a model constructor.
 *                  When the promise is resolved into a constructor, the application is responsible
 *                  for constructing the model instance before passing it to the configuration object on the oj-module.
 * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
 *               {target: "Type", value: "P", for: "options.params"},
 *               {target: "Type", for: "options.require", value: "((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)"},
 *               {target: "Type", value: "(options: {viewModelPath: string, params?: P, require?: ((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void),initialize?: 'always' | 'never' | 'ifParams'}):Promise<oj.ModuleViewModel|Function>"}]
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
  }).then(function (viewModelValue) {
    var viewModel = viewModelValue;
    if (
      viewModel &&
      (options.initialize === 'always' ||
        (options.params != null && options.initialize !== 'never'))
    ) {
      if (typeof viewModel === 'function') {
        // eslint-disable-next-line new-cap
        viewModel = new viewModel(options.params);
      } else if (typeof viewModel.initialize === 'function') {
        viewModel.initialize(options.params);
      }
    }
    return viewModel;
  });
};

/**
 * Utility function for creating a configuration object for oj-module.
 * This method uses the name or paths to load a view and a view model and constructs a configuration
 * object for the oj-module element.
 * Note, the view model is loaded as an AMD module. If the returned value is a function,
 * it will be treated as a view model constructor; otherwise the returned value will be treated
 * as a view model instance. When view model parameters are specified, they will be passed to the
 * constructor or to the <code>initialize</code> method on the view model instance.
 * The <code>initialize</code> method on the view model is optional.
 *
 * @since 7.0.0
 *
 * @param {Object} options Options object used to create a view model
 * @param {string=} options.name View model name. If <code>viewPath</code> option is omitted,
 *                  the name is also going to be used for loading the view.
 *                  The view and view model will be loaded using default paths - 'views/' and 'viewModels/'.
 *                  The path is relative to the RequireJS baseURL.
 *                  The text plugin will be used for loading the view.
 *                  Use <code>viewPath</code> and <code>viewModelPath</code>
 *                  when you want to load view and view model from different locations.
 * @param {string=} options.viewPath The path to the view, relative to the RequireJS baseURL.
 *                  The text plugin will be used for loading the view.
 * @param {string=} options.viewModelPath The path to the model, relative to the RequireJS baseURL.
 * @param {Function=} options.require An optional instance of the require() function to be used
 *                  for loading the view and view model. By default the path is relative to the baseUrl
 *                  specified for the application require calls.
 * @param {any=} options.params Parameters object that will be passed either to the model constructor or
 *                  to the <code>initialize</code> method on the loaded model.
 *
 * @example <caption>Get promise for the oj-module configuration object.</caption>
 * var configPromise = moduleElementUtils.createConfig({ name: 'dashboard/page', params: {value:'A'} });
 *
 * @return {Promise} A promise that resolves into a configuration object for oj-module.
 * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
 *               {target: "Type", value: "P", for: "options.params"},
 *               {target: "Type", for: "options.require", value: "((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)"},
 *               {target: "Type", value: "(options: {name?: string, viewPath?: string, viewModelPath?: string, params?: P, require?: ((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)}):Promise<{view:Node[], viewModel:oj.ModuleViewModel|null}>"}]
 * @memberof! ModuleElementUtils
 * @static
 */
ModuleElementUtils.createConfig = function (options) {
  if (!(options && (options.name || options.viewPath))) {
    return Promise.resolve(null);
  }
  var viewPath = options.viewPath || 'views/' + options.name + '.html';
  var modelPath = options.viewModelPath || (options.name ? 'viewModels/' + options.name : null);
  return Promise.all([
    ModuleElementUtils.createView({ viewPath: viewPath, require: options.require }),
    ModuleElementUtils.createViewModel({
      viewModelPath: modelPath,
      require: options.require,
      params: options.params,
      initialize: 'always'
    })
  ]).then(function (values) {
    return { view: values[0], viewModel: values[1] };
  });
};

const createView = ModuleElementUtils.createView;
const createViewModel = ModuleElementUtils.createViewModel;
const createConfig = ModuleElementUtils.createConfig;

export { createConfig, createView, createViewModel };
