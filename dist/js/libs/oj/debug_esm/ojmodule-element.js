/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { observable, ignoreDependencies } from 'knockout';
import Context from 'ojs/ojcontext';
import 'ojs/ojmodule';
import { register } from 'ojs/ojcomposite';

/**
 * @ojcomponent oj.ojModule
 * @since 4.2.0
 * @ojdisplayname ojModule Element
 * @ojshortdesc A module is a navigational element that manages content replacement within a particular region of the page.
 * @ojsignature {target: "Type", value: "class ojModule extends JetElement<ojModuleSettableProperties>"}
 *
 * @ojoracleicon 'oj-ux-ico-code'
 *
 * @classdesc
 * <h3 id="ojModuleOverview-section">
 *   JET Module
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ojModuleOverview-section"></a>
 * </h3>
 *
 * <p>
 * The oj-module custom element is used for binding a view and a corresponding view model to an element
 * to provide content replacement within a particular region of the page. In case of a single page application
 * the element <code>config</code> attribute defines navigation within a region.
 * </p>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-module config='[[moduleConfig]]' animation='[[moduleAnimation]]'>
 * &lt;/oj-module>
 * </code>
 * </pre>
 * <p><b>ModuleElementUtils</b> - You can use ModuleElementUtils helper methods in conjunction with oj-module
 * to generate a configuration object for the element. See the demos and documentation for
 * the <a href="ModuleElementUtils.html">ModuleElementUtils</a> class for details on the available methods.</p>
 *
 * <h2 id="lifecycle">View Models
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#viewmodel"></a>
 * </h2>
 * <h3 id="lifecycle">Lifecycle
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
 * </h3>
 * <p>
 * If a ViewModel is provided as a part of configuration for the oj-module element, it should implement the
 * <a href="oj.ModuleViewModel.html">ModuleViewModel</a> interface to provide lifecycle callbacks.
 * See the lifecycle methods that could be implemented on the view model
 * that will be called at each stage of the component's lifecycle.
 * </p>
 *
 * <h3 id="lifecycle">Best Practices
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bestpractice"></a>
 * </h3>
 * <p>
 * We recommend using non-singleton ViewModels for modules that may contain
 * child modules. If the parent module's ViewModel has to be a singleton,
 * application developers have to ensure that a new view is being returned
 * every time the child module is re-rendered (this can be achieved by binding
 * the child module's config object to a function call).
 * </p>
 * <p>
 * When the parent module is cleaning its view, it will not stop at the
 * boundary of the child module, i.e. the entire DOM hierarchy will be cleaned.
 * This creates problems when the cleaned child module's view is cached.
 * To avoid this issue, only cache child modules if their parent modules are also being cached,
 * or ensure that the child module's cache is emptied when the parent module's view is about
 * to be cleaned (see the <a href="oj.ModuleViewModel.html#disconnected">disconnected</a> callback
 * and the <a href="oj.ojModule.html#event:viewDisconnected">ojViewDisconnected</a> event).
 * </p>
 */

/**
 * Configuration object that defines a view and a corresponding view model responsible the markup section
 * under oj-module. An application can also specify a clean up mode for the view as a part of the configuration object.
 * See details for each attribute.  The configuration object can be specified either directly or via a Promise.
 *
 * @member
 * @name config
 * @memberof! oj.ojModule
 * @instance
 * @type {Object|Promise}
 * @ojshortdesc The module configuration object. See the Help documentation for more information.
 *
 * @example <caption>Initialize the ojModule element with the <code class="prettyprint">config</code> attribute:</caption>
 * &lt;oj-module config='[[moduleConfig]]'>&lt;/oj-module>
 *
 * @example <caption>Get or set the <code class="prettyprint">accept</code> property after initialization:</caption>
 * // getter
 * var config = myModule.config;
 *
 * // setter
 * myModule.config = {'view':view,'viewModel':viewModel}; // where view is an Array of DOM nodes and viewModel is a model object for the view
 */

/**
 * Defines the view for the ojModule.
 * <p>Note that oj-module will not be cloning the node array before using it as the module's View
 * and applying bindings to it. If the application needs to have an access to the original node array,
 * it should be setting the 'view' property to a cloned copy.</p>
 * @expose
 * @name config.view
 * @ojshortdesc Defines module view.
 * @memberof! oj.ojModule
 * @instance
 * @type {Array.<Node>}
 * @default null
 */

/**
 * Defines model for the view.
 * <p>The following optional lifecycle methods can be defined on the ViewModel object and will be called
 * at the corresponding lifecycle stage. See <a href="oj.ojModule.html#lifecycle">View Model Lifecycle section</a></p>
 * @expose
 * @name config.viewModel
 * @ojshortdesc The ViewModel instance.
 * @memberof! oj.ojModule
 * @instance
 * @type {(Object|null)=}
 * @ojsignature {target: "Type", value: "oj.ModuleViewModel|null", jsdocOverride:true}
 * @default null
 */

/**
 * Defines the clean up mode for the view. The setting allows an application to use an external cache for the view and view model.
 * By default the oj-module element will clean up and release the view nodes when the view is removed from the DOM.
 * If an application wants to keep the view and view model in memory for faster access,
 * it should set the cleanupMode to "none" and retain references to the view and viewModel to be used when the module is reloaded.
 * Note, when the cached view is no longer needed, the application should call the Knockout <code>ko.cleanNode()</code> method
 * on all the top-level nodes in the view.
 * Also, if the cached view might receive observable changes, it must be kept connected in the DOM (perhaps with the CSS <code>display:none</code> style).
 * @expose
 * @name config.cleanupMode
 * @ojshortdesc The cleanup mode for the view.
 * @memberof! oj.ojModule
 * @instance
 * @type {string}
 * @default "onDisconnect"
 * @ojsignature { target: "Type",
 *                value: "?"}
 * @ojvalue {string} "onDisconnect" The View nodes will be destroyed on disconnect.
 * @ojvalue {string} "none" Use the setting to preserve the view, e.g. if the view and view model will be stored in external cache.
 */

/**
 * Instance of the {@link oj.ModuleElementAnimation} duck-typing interface that will manage animation effects during View transitions.
 * Note that during the animation transition, the original View and the View that is being transitioned to may both be simultaneously
 * attached to the DOM.  Consequently, it is the application's responsbility to ensure that element IDs are unique across Views.
 * @member
 * @name animation
 * @memberof! oj.ojModule
 * @instance
 * @type {Object}
 * @default null
 * @ojshortdesc Specifies an animation object used for view transitions. See the Help documentation for more information.
 * @ojsignature {target: "Type", value: "ModuleElementAnimation", jsdocOverride:true}
 */

/**
 * Triggered before transition to the new View is started - before View is inserted into the DOM.
 * @member
 * @name transitionStart
 * @memberof oj.ojModule
 * @instance
 * @event
 * @ojshortdesc Triggered before transition to the new View is started
 * @property {Object} viewModel ViewModel for the new View.
 * @ojsignature {target: "Type", value: "oj.ModuleViewModel", for: "viewModel", jsdocOverride:true}
 */

/**
 * Triggered after the View is inserted into the DOM.
 * @member
 * @name viewConnected
 * @memberof oj.ojModule
 * @instance
 * @event
 * @ojshortdesc Triggered after the View is inserted into the DOM
 * @property {Object} viewModel ViewModel for the View being attached to the DOM.
 * @ojsignature {target: "Type", value: "oj.ModuleViewModel", for: "viewModel", jsdocOverride:true}
 */

/**
 * Triggered after transition to the new View is complete. That includes any possible animation between the old and the new View.
 * @member
 * @name transitionEnd
 * @memberof oj.ojModule
 * @instance
 * @event
 * @ojshortdesc Triggered after transition to the new View is complete
 * @property {Object} viewModel ViewModel for the new View.
 * @ojsignature {target: "Type", value: "oj.ModuleViewModel", for: "viewModel", jsdocOverride:true}
 */

/**
 * Triggered after the View is removed from the DOM
 * @member
 * @name viewDisconnected
 * @memberof oj.ojModule
 * @instance
 * @event
 * @ojshortdesc Triggered after the View is removed from the DOM
 * @property {Object} viewModel An array of DOM nodes that represent the disconnected View. The application can use the nodes to store them in cache.
 * @property {Array.<Node>} view ViewModel for the new View.
 * @ojsignature {target: "Type", value: "oj.ModuleViewModel", for: "viewModel", jsdocOverride:true}
 */

function moduleViewModel(context) {
  var element = context.element;
  var props = context.properties;
  var self = this;
  this.animation = context.properties.animation;
  this.config = observable({ view: [] });
  this.configPromise = null;

  this.propertyChanged = function (detail) {
    if (detail.property === 'animation') {
      self.animation = detail.value;
    } else if (detail.property === 'config') {
      updateConfig();
    }
  };

  function updateConfig() {
    if (!self.busyCallback) {
      self.busyCallback = Context.getContext(element)
        .getBusyContext()
        .addBusyState({ description: 'oj-module is waiting on config Promise resolution' });
    }
    var configPromise = Promise.resolve(props.config);
    self.configPromise = configPromise;
    configPromise.then(
      function (config) {
        if (configPromise === self.configPromise) {
          // Make sure the promise that just resolved is the latest one we're waiting for
          self.config(config);
          self.busyCallback();
          self.busyCallback = null;
        }
      },
      function (reason) {
        if (configPromise === self.configPromise) {
          // Make sure the promise that just resolved is the latest one we're waiting for
          self.busyCallback();
          self.busyCallback = null;
          throw reason;
        }
      }
    );
  }

  updateConfig();

  function isViewAttached(config) {
    var view = config ? config.view : null;
    return view && view.length > 0 && element.contains(view[0]);
  }

  function invokeViewModelMethod(model, name) {
    var handler = model && model[name];
    if (typeof handler === 'function') {
      ignoreDependencies(handler, model);
    }
  }

  function dispatchLifecycleEvent(eventName, viewModel, view) {
    var detail = {};
    if (viewModel) {
      detail.viewModel = viewModel;
    }
    if (view) {
      detail.view = view;
    }
    var customEvent = new CustomEvent(eventName, { detail: detail });
    element.dispatchEvent(customEvent);
  }

  this.connected = function () {
    var currentConfig = this.config();
    if (isViewAttached(currentConfig)) {
      invokeViewModelMethod(currentConfig.viewModel, 'connected');
      dispatchLifecycleEvent('ojViewConnected', currentConfig.viewModel);
    }
  }.bind(this);

  this.disconnected = function () {
    var currentConfig = this.config();
    invokeViewModelMethod(currentConfig.viewModel, 'disconnected');
    dispatchLifecycleEvent('ojViewDisconnected', currentConfig.viewModel, currentConfig.view);
  }.bind(this);
}

var moduleValue =
  '{"view":config().view, "viewModel":config().viewModel,' +
  '"cleanupMode":config().cleanupMode,"animation":animation}';

var moduleView = '<!-- ko ojModule: ' + moduleValue + ' --><!-- /ko -->';

var __oj_module_metadata = 
{
  "properties": {
    "animation": {
      "type": "object"
    },
    "config": {
      "type": "object|Promise",
      "properties": {
        "cleanupMode": {
          "type": "string",
          "enumValues": [
            "none",
            "onDisconnect"
          ],
          "value": "onDisconnect"
        },
        "view": {
          "type": "Array<Node>"
        },
        "viewModel": {
          "type": "object"
        }
      }
    }
  },
  "events": {
    "ojTransitionEnd": {},
    "ojTransitionStart": {},
    "ojViewConnected": {},
    "ojViewDisconnected": {}
  },
  "extension": {}
};
/* global __oj_module_metadata */
// eslint-disable-next-line no-undef
register('oj-module', {
  view: moduleView,
  metadata: __oj_module_metadata,
  viewModel: moduleViewModel
});

/**
 * A duck-typing interface that defines a contract for managing animations during the oj-module element View transitions.
 * Use 'animation' attribute on the [Module]{@link oj.ojModule#animation} to set ModuleElementAnimation instance.
 * @interface ModuleElementAnimation
 * @memberof oj
 * @since 4.2.0
 * @export
 *
 */

/**
 * Optional method that determines whether the animated transition should proceed. If the method is not implemented, all
 * transitions will be allowed to proceed
 * @method
 * @name canAnimate
 *
 * @param {Object} context a context object with the keys detailed below
 * @param {Node} context.node a DOM node for the oj-module element
 * @param {boolean} context.isInitial true if the initial View is about to be displayed, false otherwise
 * @param {Object} context.oldViewModel the instance of the ViewModel for the old View
 * @param {Object} context.newViewModel the instance of the ViewModel for the new View
 *
 * @return {boolean} true if animation should proceed, false otherwise
 * @memberof oj.ModuleElementAnimation
 * @ojsignature [{target: "Type", value: "oj.ModuleViewModel", for:"context.oldViewModel", jsdocOverride:true},
 *               {target: "Type", value: "oj.ModuleViewModel", for:"context.newViewModel", jsdocOverride:true}]
 * @instance
 */

/**
 * Prepares animation by designating where the new View should be inserted and optionally specifying where the old View
 * should be moved
 * @method
 * @name prepareAnimation
 *
 * @param {Object} context a context object with the keys detailed below
 * @param {Node} context.node a DOM node for the oj-module element
 * @param {boolean} context.isInitial true if the initial View is about to be displayed, false otherwise
 * @param {Object} context.oldViewModel the instance of the ViewModel for the old View
 * @param {Object} context.newViewModel the instance of the ViewModel for the new View
 *
 * @return {?Object} an object that may contain values for the following keys:
 * <ul>
 * <li>'newViewParent' - a DOM node where the new View should be inserted. If this parameter is not specified, the new View
 * will be inserted into the node associated with the oj-module element</li>
 * <li>'oldViewParent' - a DOM node where the old View should be moved. If this parameter is not specified, the old View
 * will not be moved</li>
 * </ul>
 * @memberof oj.ModuleElementAnimation
 * @ojsignature [{target: "Type", value: "oj.ModuleViewModel", for:"context.oldViewModel", jsdocOverride:true},
 *               {target: "Type", value: "oj.ModuleViewModel", for:"context.newViewModel", jsdocOverride:true},
 *               {target: "Type", value: "null|{ newViewParent?: Node, oldViewParent?: Node }", for: "returns"}]
 * @instance
 */

/**
 * Prepares animation by designating where the new View should be inserted and optionally specifying where the old View
 * should be moved
 * @method
 * @name animate
 *
 * @param {Object} context a context object with the keys detailed below
 * @param {Node} context.node a DOM node for the oj-module element
 * @param {boolean} context.isInitial true if the initial View is about to be displayed, false otherwise
 * @param {Object} context.oldViewModel the instance of the ViewModel for the old View
 * @param {Object} context.newViewModel the instance of the ViewModel for the new View
 * @param {Node} context.newViewParent the 'newViewParent' parameter returned by the prepareAnimation() method
 * @param {Node} context.oldViewParent the 'oldViewParent' parameter returned by the prepareAnimation() method
 * @param {Function} context.removeOldView calling this function will remove the DOM nodes representing the old View. If this
 * function is not invoked by the ModuleElementAnimation implementation, and the old View is still connected when the Promise is
 * resolved, the old View will be removed by the component.
 * @param {Function} context.insertNewView calling this function will insert new View's DOM nodes into the location
 * managed by the component. If this function is not invoked by the ModuleElementAnimation implementation, and the new View is not at
 * its intended location when the Promise is resolved, the View will be moved by the component.
 * @param {Array} context.oldDomNodes an array of DOM nodes representing the old View
 * @return {Promise} - a Promise that should be resolved when the animation, moving/removing of DOM nodes and the
 * cleanup are complete. Note that the component will not be able to navigate to a new View until the Promise is resolved.
 * @ojsignature [{target: "Type", value: "oj.ModuleViewModel", for:"context.oldViewModel", jsdocOverride:true},
 *               {target: "Type", value: "oj.ModuleViewModel", for:"context.newViewModel", jsdocOverride:true},
 *               {target: "Type", value: "()=> undefined", for:"context.removeOldView"},
 *               {target: "Type", value: "()=> undefined", for:"context.insertNewView"}]
 * @memberof oj.ModuleElementAnimation
 * @instance
 */

/**
 * A duck-typing interface that defines a contract for a view model consumed by the oj-module element.
 *
 * @since 7.0.0
 * @export
 * @interface ModuleViewModel
 * @memberof oj
 */

/**
 * This optional method may be implemented on the ViewModel and will be invoked
 * after the View is inserted into the DOM.
 * This method might be called multiple times - after the View is created and
 * inserted into the DOM, after the View is reconnected after being disconnected
 * and after a parent element, oj-module, with attached View is reconnected to the DOM.
 * An array of DOM nodes that represent the connected View will be passed to the callback.
 * @method
 * @since 7.0.0
 * @name connected
 * @ojshortdesc A callback method that is invoked after the View is inserted into the DOM.
 * @memberof oj.ModuleViewModel
 * @instance
 * @ojsignature {target: "Type", value: "?(view:Array<Node>): void"}
 */

/**
 * This optional method may be implemented on the ViewModel and invoked
 * after transition to the new View is complete, including any possible
 * animation between the old and the new View.
 * An array of DOM nodes that represent the new View will be passed to the callback.
 * @method
 * @since 7.0.0
 * @name transitionCompleted
 * @ojshortdesc A callback method that is invoked after transition to the new View is complete.
 * @memberof oj.ModuleViewModel
 * @instance
 * @ojsignature {target: "Type", value: "?(view:Array<Node>): void"}
 */

/**
 * This optional method may be implemented on the ViewModel and will be invoked
 * when the View is disconnected from the DOM.
 * This method might be called multiple times - after the View is disconnected
 * from the DOM and after a parent element, oj-module, with attached View is
 * disconnected from the DOM.
 * An array of DOM nodes that represent the disconnected View will be passed to the callback.
 * @method
 * @since 7.0.0
 * @name disconnected
 * @ojshortdesc A callback method that is invoked after View is disconnected from the DOM.
 * @memberof oj.ModuleViewModel
 * @instance
 * @ojsignature {target: "Type", value: "?(view:Array<Node>): void"}
 */

/**
 * This optional method may be implemented on the ViewModel and will be invoked
 * by <a href="oj.ModuleRouterAdapter.html">ModuleRouterAdapter</a> on <code>beforeStateChange</code> event
 * assuming that oj-module is used in conjuction with ModuleRouterAdapter.
 * <p>This method must return a Promise. When defined the method is invoked
 * before router state change. If the Promise is resolved, then the BaseRouter will continue
 * with the state change, otherwise (Promise rejected) the state change is vetoed and the current router state
 * does not change.<p>
 * <p>Note, that the method might be called at any time after the view model is created, e.g. before the corresponding view has been connected or bindings have been applied.</p>
 * @method
 * @since 8.0.0
 * @name canExit
 * @ojshortdesc A callback method that is invoked before BaseRouter state change.
 * @memberof oj.ModuleViewModel
 * @instance
 * @ojsignature {target: "Type", value: "?(): Promise<void>"}
 */

/**
 * This optional method may be implemented on the ViewModel and will be invoked
 * by <a href="oj.ModuleRouterAdapter.html">ModuleRouterAdapter</a> on <code>stateChange</code> event
 * assuming that oj-module is used in conjuction with ModuleRouterAdapter.
 * <p>If the method is present the ModuleRouterAdapter will assume that the view model knows how to handle parameter
 * change. It will not reload the module and re-apply binding. If the method is not present the ModuleRouterAdapter
 * will reload the module and apply the binding upon any parameter change.</p>
 * <p>Note, that the method might be called at any time after the view model is created, e.g. before the corresponding view has been connected or bindings have been applied.</p>
 * @method
 * @since 8.0.0
 * @name parametersChanged
 * @ojshortdesc A callback method that might be invoked on BaseRouter state change.
 * @memberof oj.ModuleViewModel
 * @instance
 * @ojsignature {target: "Type", value: "?(params:any): void"}
 */
