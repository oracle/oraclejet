/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojcontext', 'ojs/ojcomposite', 'ojs/ojmodule'], function(oj, ko, Context, Composite)
{
 

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
    "ojTransitionStart": {},
    "ojViewConnected": {},
    "ojTransitionEnd": {},
    "ojViewDisconnected": {}
  },
  "extension": {}
};
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global ko:false, Promise:false, Context:false */

/**
 * @ojcomponent oj.ojModule
 * @since 4.2.0
 * @ojdisplayname ojModule Element
 * @ojshortdesc Navigational element that manages content replacement within a particular region of the page.
 * @ojsignature {target: "Type", value: "class ojModule extends JetElement<ojModuleSettableProperties>"}
 * @ojstatus preview

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
 * <h2 id="lifecycle">View Model Lifecycle
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
 * </h2>
 * <p>
 * If a ViewModel is provided as a part of configuration for the oj-module element, the following optional
 * callback methods can be defined on its ViewModel and will be called at each stage of the
 * component's lifecycle.
 *
 * <h4 class="name">connected<span class="signature">()</span></h4>
 * <div class="description">
 * <p>The optional method may be implemented on the ViewModel and will be invoked after the View is inserted into the DOM.</p>
 * <p>This method might be called multiple times - after the View is created and inserted into the DOM,
 * after the View is reconnected after being disconnected and after a parent element, oj-module, with attached View
 * is reconnected to the DOM.</p>
 * </div>
 *
 * <h4 class="name">transitionCompleted<span class="signature">()</span></h4>
 * <div class="description">
 * <p>This optional method may be implemented on ViewModel and invoked after transition to the new View is complete.
 * That includes any possible animation between the old and the new View.</p>
 * </div>
 *
 * <h4 class="name">disconnected<span class="signature">()</span></h4>
 * <div class="description">
 * <p>This optional method maybe implemented on the ViewModel and will be invoked when the View is disconnected from the DOM.</p>
 * <p>This method might be called multiple times - after the View is disconnected from the DOM and after a parent
 * element,oj-module, with attached View is disconnected from the DOM.</p>
 * </div>
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
 * @ojshortdesc The module configuration object
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
 * at the corresponding lifecycle stage. See <a href="./oj.ojModule.html#lifecycle">View Model Lifecycle section</a></p>
 * @expose
 * @name config.viewModel
 * @ojshortdesc The ViewModel instance.
 * @memberof! oj.ojModule
 * @instance
 * @type {Object|null}
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
 * @ojshortdesc Defines animation object used for view transitions.
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
 */

function moduleViewModel(context) {
  var element = context.element;
  var props = context.properties;
  var self = this;
  this.animation = context.properties.animation;
  this.config = ko.observable({ view: [] });
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
      self.busyCallback = Context.getContext(element).getBusyContext().addBusyState({ description: 'oj-module is waiting on config Promise resolution' });
    }
    var configPromise = Promise.resolve(props.config);
    self.configPromise = configPromise;
    configPromise.then(function (config) {
      if (configPromise === self.configPromise) {
        // Make sure the promise that just resolved is the latest one we're waiting for
        self.config(config);
        self.busyCallback();
        self.busyCallback = null;
      }
    }, function (reason) {
      if (configPromise === self.configPromise) {
        // Make sure the promise that just resolved is the latest one we're waiting for
        self.busyCallback();
        self.busyCallback = null;
        throw reason;
      }
    });
  }

  updateConfig();

  function isViewAttached(config) {
    var view = config ? config.view : null;
    return view && view.length > 0 && element.contains(view[0]);
  }

  function invokeViewModelMethod(model, name) {
    var handler = model && model[name];
    if (typeof handler === 'function') {
      ko.ignoreDependencies(handler, model);
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
    if (isViewAttached(props && props.config)) {
      invokeViewModelMethod(props.config.viewModel, 'connected');
      dispatchLifecycleEvent('ojViewConnected', props.config.viewModel);
    }
  };

  this.disconnected = function () {
    invokeViewModelMethod(props.config.viewModel, 'disconnected');
    dispatchLifecycleEvent('ojViewDisconnected', props.config.viewModel, props.config.view);
  };
}

var moduleValue = '{"view":config().view, "viewModel":config().viewModel,' +
                  '"cleanupMode":config().cleanupMode,"animation":animation}';

var moduleView = '<!-- ko ojModule: ' + moduleValue + ' --><!-- /ko -->';

/* global __oj_module_metadata */
// eslint-disable-next-line no-undef
Composite.register('oj-module',
  {
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
 * @ojstatus preview
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
 * @ojsignature [{target: "Type", value: "()=> undefined", for:"context.removeOldView"},
 *               {target: "Type", value: "()=> undefined", for:"context.insertNewView"}]
 * @memberof oj.ModuleElementAnimation
 * @instance
 */

});