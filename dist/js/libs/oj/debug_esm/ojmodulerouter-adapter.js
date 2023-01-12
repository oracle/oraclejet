/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { error } from 'ojs/ojlogger';
import { createConfig } from 'ojs/ojmodule-element-utils';
import * as ModuleAnimations from 'ojs/ojmoduleanimations';
import { observable } from 'knockout';

/**
 * @class oj.ModuleRouterAdapter
 * @since 8.0.0
 * @ojshortdesc Utility class for loading oj-module configuration based on the current state of the router.
 * @classdesc ModuleRouterAdapter utility class.
 * <p>This class is designed to be an adapter between [oj-module]{@link oj.ojModule} element and {@link CoreRouter} object.
 * The properties defined on the class correspond to attributes on oj-module element.
 * The <code>koObservableConfig</code> property created and updated by the class is based on the current state of the CoreRouter.
 * The adapter also supports <code>animation</code> property, which is an implementation of ModuleElementAnimation interface
 * that can be used for <code>oj-module</code> animation.</p>
 *
 * <p>ModuleRouterAdapter reacts to changes of the <code>beforeStateChange</code> and <code>currentState</code> observable properties of CoreRouter.
 * Upon a change to <code>beforeStateChange</code>, ModuleRouterAdapter will invoke the <a href="oj.ModuleViewModel.html#canExit">canExit()</a>
 * callback of the current view model if it's defined; the Promise returned by this callback is passed on to the CoreRouter
 * to allow the pending state change to be canceled. Note that canExit() callback will be invoked on every
 * <code>beforeStateChange</code> mutation regardless whether the module path is changed or view model parameters are changed.</p>
 *
 * <p>Upon a change to the CoreRouter's <code>currentState</code> (i.e. a state change that was not canceled), ModuleRouterAdapter will load
 * the requested view and view model and update its <code>koObservableConfig</code> property.
 * View models may also optimize updates by implementing the <a href="oj.ModuleViewModel.html#parametersChanged">parametersChanged()</a>
 * callback. If this callback is present, CoreRouter state changes that do not result in changes to the module path will be handled
 * by invoking this callback on the already loaded view model with the new state parameter values.</p>
 *
 * <p>When the view model is loaded by ModuleRouterAdapter, an instance of <a href="oj.ModuleRouterAdapter.html#ViewModelParameters">ViewModelParameters</a>
 * will be passed either to the model constructor or to the initialize method on the loaded model instance.
 * See parameter passing contract in <a href="ModuleElementUtils.html#createConfig">ModuleElementUtils.createConfig()</a>.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * // define animation callback used to transition between views
 * var animationCallback = function (context) {
 *    return context.previousViewModel ? 'pushEnd' : 'fade';
 * };
 *
 * // create a new instance of ModuleRouterAdapter
 * var adapter = new ModuleRouterAdapter(
 *    baseRouter,
 *    {
 *      viewPath: 'views/baserouter/',
 *      viewModelPath: 'viewModels/baserouter/',
 *      animationCallback: animationCallback
 *    }
 * );
 * </code>
 * </pre>
 * @param {CoreRouter} router The instance of the CoreRouter, that manages application navigation for a page or a section of the page.
 * @param {Object=} options Options object used for loading views and view models and configuring oj-module animation.
 * @param {string=} options.viewPath The path to the view, relative to the RequireJS baseURL.
 *                  The text plugin will be used for loading the view. If the option is not provided
 *                  the default path will be used - 'views/'.
 * @param {string=} options.viewModelPath The path to the model, relative to the RequireJS baseURL.
 *                  If the option is not provided the default path wil be used - 'viewModels/'.
 * @param {string=} options.pathKey An optional key for retrieving module name from 'details' object on the router state.
 *                  By default the adapter will use the 'path' field of the router state as the name for the module.
 *                  However when 'path' does not represent the name of the module, the name can be retrieved from 'details' object
 *                  on the router state using specified pathKey.
 * @param {Function=} options.require An optional instance of the require() function to be used
 *                  for loading the view and view model. By default the path is relative to the baseUrl
 *                  specified for the application require calls.
 * @param {Function=} options.animationCallback An optional animation callback used to animate
 *                  transitions between views. <br/>The function will get
 *                  <a href="oj.ModuleRouterAdapter.html#AnimationCallbackParameters">a context object</a> as a parameter.
 *                  A return value should be a string containing
 *                  <a href="ModuleAnimations.html#Animations">an animation type</a> supported by ModuleAnimations
 *                  or an object that implements <a href="oj.ModuleElementAnimation.html">ModuleElementAnimation</a> interface.
 * @ojsignature [
 *    {target: "Type", value: "class ModuleRouterAdapter<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>>",
 *     genericParameters: [{"name": "D", "description": "Detail object for the router state"},
 *                         {"name": "P", "description": "Parameters object for the router state"}]},
 *    {target:"Type", for: "router", value: "CoreRouter<D,P>"},
 *    {target:"Type", for: "options.animationCallback", value: "(animationContext: ModuleRouterAdapter.AnimationCallbackParameters) => ModuleAnimations.Animations|ModuleElementAnimation"},
 *    {target: "Type", for: "options.require", value: "((module: string)=> any)|((modules: string[], ready?: any, errback?: any)=> void)"}
 *  ]
 * @export
 * @ojtsmodule
 * @ojtsimport {module: "ojmoduleanimations", type: "AMD", importName: "ModuleAnimations"}
 * @ojtsimport {module: "ojmodule-element", type: "AMD", imported: ["ModuleElementAnimation","ModuleViewModel"]}
 * @ojtsimport {module: "ojcorerouter", type: "AMD", importName: "CoreRouter"}
 */
/**
 * @typedef {Object} oj.ModuleRouterAdapter.AnimationCallbackParameters
 * @property {Element} node An oj-module element used for hosting the views
 * @property {any} previousViewModel The instance of previous ViewModel
 * @property {any} viewModel The instance of the current ViewModel
 * @property {any} previousState Previous router state.
 * @property {any} state Current router state.
 */

/**
 * @typedef {Object} oj.ModuleRouterAdapter.ViewModelParameters
 * @property {CoreRouter} parentRouter The instance of the CoreRouter, that used by the ModuleRouterAdapter instance.
 * @property {any} params The value of CoreRouterState params property.
 * @property {CoreRouter} router The instance of the CoreRouter, that used by the ModuleRouterAdapter instance.
 * @property {CoreRouter.CoreRouterState} routerState The current state of CoreRouter
 * @ojsignature [{target: "Type", value: "CoreRouter<D, P>", for: "parentRouter"},
 *               {target: "Type", value: "P", for: "params"},
 *               {target: "Type", value: "CoreRouter<D, P>", for: "router"},
 *               {target: "Type", value: "CoreRouter.CoreRouterState<D, P>", for: "routerState"},
 *               {target: "Type", value: "<D extends Record<string, any>, P extends Record<string, any>>", for: "genericTypeParameters"}]
 * @ojdeprecated [{target: "property", for: "parentRouter", since: "8.1.0", description: "Use router property instead."},
 *                 {target: "property", for: "params", since: "8.1.0", description: "Use CoreRouter.CoreRouterState.params instead."}]
 */
// eslint-disable-next-line no-unused-vars
function ModuleRouterAdapter(router, options) {
  var _router = router;
  var _options = options || {};
  var _prevState = null;
  var _currentState = null;
  var _configPromise = null;
  var _moduleConfig = observable({ view: [], viewModel: null });

  function getModuleAnimation(context) {
    var ctx = {
      node: context.node,
      previousViewModel: context.oldViewModel,
      viewModel: context.newViewModel,
      previousState: _prevState,
      state: _currentState
    };
    return _options.animationCallback(ctx);
  }

  function createAnimation(callback) {
    var AnimateProxy = function () {
      var _delegate;
      var _canAnimate = 'canAnimate';

      function _getDelegateInvoker(name) {
        return function (context) {
          return _delegate[name].call(_delegate, context);
        };
      }

      this[_canAnimate] = function (context) {
        // Get the 'delegate' animation
        var animation = callback(context);

        _delegate = typeof animation === 'string' ? ModuleAnimations[animation] : animation;

        if (!_delegate) {
          return false;
        }

        // Define the rest of the methods on the fly if we have a delegate
        ['prepareAnimation', 'animate'].forEach(
          function (item) {
            this[item] = _getDelegateInvoker(item);
          }.bind(this)
        );

        return _getDelegateInvoker(_canAnimate)(context);
      }.bind(this);
    };

    return new AnimateProxy();
  }

  function getModulePathFromState(state) {
    if (!state) {
      return null;
    }
    return _options.pathKey ? state.detail[_options.pathKey] : state.path;
  }

  // before state change handler
  function onBeforeStateChange(args) {
    // canExit must return a Promise resolution or rejection
    var vm = _moduleConfig().viewModel;
    var canExitPromise = vm && vm.canExit ? vm.canExit() : Promise.resolve();
    args.accept(canExitPromise);
  }

  // on state change handler
  function onStateChange(args) {
    var configPromise;
    var modulePath = getModulePathFromState(args ? args.state : null);
    if (modulePath) {
      var currentModulePath = getModulePathFromState(_currentState);
      // check if model path didn't change and we can just re-apply the parameters
      // using parametersChanged() callback
      if (
        modulePath === currentModulePath &&
        _moduleConfig().viewModel &&
        _moduleConfig().viewModel.parametersChanged
      ) {
        _moduleConfig().viewModel.parametersChanged(args.state.params);
        _currentState = args.state;
        return;
      }

      var viewPath = _options.viewPath || 'views/';
      var viewModelPath = _options.viewModelPath || 'viewModels/';
      configPromise = createConfig({
        require: _options.require,
        viewPath: viewPath + modulePath + '.html',
        viewModelPath: viewModelPath + modulePath,
        params: {
          parentRouter: _router,
          params: args.state.params,
          router: _router,
          routerState: args.state
        }
      });
    } else {
      configPromise = Promise.resolve({ view: [], viewModel: null });
    }
    args.complete(configPromise);
    _configPromise = configPromise;
    configPromise.then(
      function (config) {
        if (_configPromise === configPromise) {
          _prevState = _currentState;
          _currentState = args.state;
          // JET-38828 - ensure that a new view is being returned every time the oj-module is re-rendered.
          var clonedViewConfig = { viewModel: config.viewModel };
          Object.defineProperty(clonedViewConfig, 'view', {
            enumerable: true,
            get() {
              return config.view.map((node) => node.cloneNode(true));
            }
          });
          _moduleConfig(clonedViewConfig);
        }
      },
      function (reason) {
        error('Error creating oj-module config : ', reason);
      }
    );
  }

  // create module animation object if it's requested
  var _moduleAnimation = _options.animationCallback ? createAnimation(getModuleAnimation) : null;

  // Subscribe to router's before and state changes
  _router.beforeStateChange.subscribe(onBeforeStateChange);
  _router.currentState.subscribe(onStateChange);

  var moduleAdapter = {};
  Object.defineProperties(moduleAdapter, {
    /**
     * The observable object created by the ModuleRouterAdapter, which can be used
     * as the <code>config</code> property of the oj-module element.
     * @name koObservableConfig
     * @memberof oj.ModuleRouterAdapter
     * @instance
     * @type {Object}
     * @ojsignature {target: "Type", value: "{ view: Array.<Node>, viewModel: oj.ModuleViewModel}"}
     * @export
     */
    koObservableConfig: {
      get: function () {
        return _moduleConfig;
      }
    },
    /**
     * An implementation of ModuleElementAnimation interface created by the ModuleRouterAdapter,
     * which can be used as the <code>animation</code> property of the oj-module element.
     * This property is created only when animationCallback property is defined for the ModuleRouterAdapter.
     *
     * @name animation
     * @memberof oj.ModuleRouterAdapter
     * @instance
     * @type {oj.ModuleElementAnimation}
     * @export
     */
    animation: {
      get: function () {
        return _moduleAnimation;
      }
    }
  });
  return moduleAdapter;
}

export default ModuleRouterAdapter;
