/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";
define(['ojs/ojcore-base', 'ojs/ojcontext', 'ojs/ojmetadatautils',  'ojs/ojlogger', 
        'ojs/ojdefaultsutils', 'ojs/ojcustomelement'], 
        function(oj, Context, MetadataUtils, Logger, DefaultsUtils)
{
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * @private
 * @export
 */
var VComponent =
/*#__PURE__*/
function () {
  function VComponent(props) {
    _classCallCheck(this, VComponent);

    this.props = props;
    this.state = {};
    this._patching = false;
    this._isCustomElementFirst = false; // Components should instantiate their internal state and
    // bind event handlers in constructor
  }
  /**
   * Registers the given VComponent constructor as a custom element. The component
   * should implement the static tagName and metadata properties.
   * @param constr The VComponent constructor
   * @return void
   * @ignore
   */


  _createClass(VComponent, [{
    key: "postRender",

    /**
     * An optional component lifecycle method called after the
     * render method when all changes have been propagated to the DOM.
     * Additional DOM manipulation can be done here.
     * @return {void}
     */
    value: function postRender() {}
    /**
     * An optional lifecycle method called before the
     * render method with the new props. Components
     * should return the new state object or null if no changes are needed.
     * @param props {Object} The new component properties
     * @return {Object|null}
     */

  }, {
    key: "updateStateFromProps",
    value: function updateStateFromProps(props) {
      return null;
    }
    /**
     * An optional component lifecycle method called after the
     * virtual component has been initially rendered and inserted into the
     * DOM. Data fetches and global listeners can be added here.
     * This will not be called for reparenting cases.
     * @return {void}
     */

  }, {
    key: "mounted",
    value: function mounted() {}
    /**
     * An optional component lifecycle method called after the
     * virtual component has been removed from the DOM. This will not
     * be called for reparenting cases. Global listener cleanup can
     * be done here.
     * @return {void}
     */

  }, {
    key: "unmounted",
    value: function unmounted() {} // Other Component Methods

    /**
     * Returns either the slotted live DOM nodes for the given slot or the virtual children
     * representing the default content for that slot. The default slot should be referenced
     * using the empty string ('').
     * @param slotName {string}
     * @param defaultContent {any}
     * @return {any}
     * @protected
     */

  }, {
    key: "slot",
    value: function slot() {
      var slotName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var defaultContent = arguments.length > 1 ? arguments[1] : undefined;

      // This method should only be called in subclass' Render()
      // function meaning that mount() would have been called
      // and the slot map should have already been populated.
      if (this._slotMap) {
        return this._slotMap[slotName] || defaultContent;
      } else {
        throw new Error("Cannot access slot map before mount has been called");
      }
    }
    /**
     * Returns either the passed id or a unique string that can be used for
     * a prefix on child elements. This method can only be called after the VComponent
     * has been instantiated and will return undefined if called from the constructor.
     * @return {string}
     */

  }, {
    key: "uniqueId",
    value: function uniqueId() {
      // _uniqueId is set by the bridge and petit-dom where we have access to the element id
      return this._uniqueId;
    }
    /**
     * Updates a writeback component property. The shouldRender flag allows the component
     * to decided whether an asynchronous rerender should be queued, e.g. rawValue update may want
     * to skip rerender.
     * @param prop {string} The property to update
     * @param value {any} The new property value
     * @param shouldRender {boolean} True if this property change should trigger a component rerender
     * @return void
     * @protected
     */

  }, {
    key: "updateProperty",
    value: function updateProperty(prop, value) {
      var shouldRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      this._getCallback('updateProperty')(prop, value, shouldRender);
    }
    /**
     * Updates an internal component state. State updates always trigger an asynchronous rerender.
     * @param state {string} The state to update
     * @param value {any} The new state value
     * @return void
     * @protected
     */

  }, {
    key: "updateState",
    value: function updateState(state, value) {
      this.state[state] = value;

      this._getCallback('queueRender')(this._ref);
    }
    /**
     * Fires a component action.  In the custom element-first case, this will result in a CustomEvent
     * being dispatched.  In the VComponent-first case, this will directly invoke the registered action
     * listener, if one is present.
     *
     * @param type {string} The type of the action
     * @param detail {Object} The detail object containing the properties associated with the action
     * @return void
     * @protected
     */

  }, {
    key: "fireAction",
    value: function fireAction(type, detail) {
      this._getCallback('fireAction')(type, detail);
    } // Bridge and petit-dom Methods

    /**
     * Called by the VirtualElementBridge during the browser's connected
     * callback to instantiate the virtual component and generate the component subtree for
     * the custom element-first case.
     * @param props {Object} The current component properties
     * @param content {Array<Node>|null} The component slot children if any.
     * @param rootElem {HTMLElement} The custom element
     * @param controlledRootProps {Object} The current controlled root properties on the DOM node
     * @return void
     * @ignore
     */

  }, {
    key: "mountContent",
    value: function mountContent(props, content, rootElem, controlledRootProps) {
      this._isCustomElementFirst = true;
      this._ref = rootElem;
      this._vnode = this._renderForMount(props, content); // Set the _node on the vnode so that mount() has access to
      // the root custom element and doesn't attempt to re-create
      // it.

      this._vnode._node = rootElem;
      this._patching = true;

      try {
        // Patches controlled props
        PetitDom.mountComponentContent(this._vnode, controlledRootProps);
      } finally {
        this._patching = false;
      }
    }
    /**
     * Called by petit-dom when the constructor is passed to the h function instead of
     * a custom element tag name. This will be called instead of mountContent.
     * @param props {Object} The current component properties.
     * @param uncontrolledRootProps {Object} The uncontrolled root properties.
     * @param content {Array<Object>|null} The virtual component slot children if any.
     * @return {HTMLElement}
     * @ignore
     */

  }, {
    key: "mount",
    value: function mount(props, uncontrolledRootProps, content) {
      this._vnode = this._renderForMount(props, content); // Patches uncontrolled props followed by component props

      var mountNode = this._ref = PetitDom.mountComponent(this._vnode, uncontrolledRootProps); // Stash a reference of the virtual component onto the DOM node
      // so we don't regenerate the class during the connected callback

      Object.defineProperty(mountNode, '_vcomp', {
        value: this,
        enumerable: false
      });
      return mountNode;
    }
    /**
     * Called by petit-dom for the VComponent first case.
     * @param props Object The current component properties
     * @param uncontrolledRootProps {Object} The uncontrolled root properties.
     * @param oldUncontrolledRootProps {Object} The uncontrolled root properties.
     * @return void
     * @ignore
     */

  }, {
    key: "patch",
    value: function patch(props, uncontrolledRootProps, oldUncontrolledRootProps) {
      var oldVnode = this._vnode;
      this._vnode = this._renderForPatch(props); // We use this (hacky) patching flag to avoid recursive calls
      // to updateUI from the component's attributeChangedCallback.

      this._patching = true;

      try {
        PetitDom.patchComponent(this._vnode, oldVnode, uncontrolledRootProps, oldUncontrolledRootProps);
      } finally {
        this._patching = false;
      }

      this._postRenderForPatch();
    }
    /**
     * Called by the VirtualElementBridge for the custom element first case.
     * @param props Object The current component properties
     * @param controlledRootProps {Object} The current controlled root properties on the DOM node
     * @return void
     * @ignore
     */

  }, {
    key: "patchContent",
    value: function patchContent(props, controlledRootProps) {
      var oldVnode = this._vnode;
      this._vnode = this._renderForPatch(props); // We use this (hacky) patching flag to avoid recursive calls
      // to updateUI from the component's attributeChangedCallback.

      this._patching = true;

      try {
        PetitDom.patchComponentContent(this._vnode, oldVnode, controlledRootProps);
      } finally {
        this._patching = false;
      }

      this._postRenderForPatch();
    }
    /**
     * Called by VirtualElementBridge to short-circuit attribute change processing and
     * render queueing while we're in the midst of patching.
     * TODO: can we get rid of this by having VirtualElementBridge short-circuit most things
     * when the component is VComponent-first?
     * @return {boolean}
     * @ignore
     */

  }, {
    key: "isPatching",
    value: function isPatching() {
      return this._patching;
    }
    /**
     * Called by VirtualElementBridge to override the VComponent's builtin callback functions
     * when CustomElement-first
     *
     * @param callbacks {Object}
     * @ignore
     */

  }, {
    key: "setCallbacks",
    value: function setCallbacks(callbacks) {
      this._callbacks = callbacks;
    }
    /**
     * Called by VirtualElementBridge to determine whether this VComponent was created
     * CustomElement-first or VComponent-first
     *
     * @return {boolean}
     * @ignore
     */

  }, {
    key: "isCustomElementFirst",
    value: function isCustomElementFirst() {
      return this._isCustomElementFirst;
    }
    /**
     * Called by petit-dom when the constructor is passed to the h function instead of
     * a custom element tag name when the node is removed by petit-dom.
     * @param node {HTMLElement} The custom element to unmount
     * @return void
     * @ignore
     */

  }, {
    key: "unmount",
    value: function unmount(node) {
      PetitDom.unmount(this._vnode);
      this.unmounted();
    } // Private Helper Methods

    /**
     * Returns the slot map of slot name to slotted child elements for a given set
     * of child nodes. If the given element has no children, this method returns an
     * empty object. Note that the default slot name is mapped to the empty string.
     * @param {Array} childNodes An array of virtual nodes
     * @return {Object} A map of the child elements for a given custom element
     * @private
     */

  }, {
    key: "_renderForMount",

    /**
     * Common setup for mount and mountContent.
     * @param props The current component properties
     * @param content {Array<Object>|null} The virtual component slot children if any.
     * @return {Object}
     * @private
     */
    value: function _renderForMount(props, content) {
      // Before rendering content, generate the slot map given any slot content.
      // Note that we do not need to create a storage node for virtual nodes
      if (!this._slotMap && content) {
        this._slotMap = VComponent._getSlotMap(Array.isArray(content) ? content : [content]);
      }

      return this._renderForUpdate(props);
    }
    /**
     * Common setup for patch and patchContent.
     * @param props The current component properties
     * @return {Object}
     * @private
     */

  }, {
    key: "_renderForPatch",
    value: function _renderForPatch(props) {
      var vnode = this._renderForUpdate(props); // Set the node to the root element that was passed in if not already
      // set. PetitDom.patch will set _node, but other code paths will not.


      vnode._node = this._ref;
      return vnode;
    }
    /**
     * Common post render hook for patch and patchContent.
     * Moves unslotted nodes after patching and calls the postRender
     * lifecycle hook.
     * @private
     */

  }, {
    key: "_postRenderForPatch",
    value: function _postRenderForPatch() {
      this._getCallback('storeUnslottedNodes')(this._slotMap);

      this.postRender();
    }
    /**
     * Calls lifecycle hooks, updates this.props, and renders the new
     * virtual node for the VComponent when props are updated.
     * @param props The current component properties
     * @return {Object}
     * @ignore
     */

  }, {
    key: "_renderForUpdate",
    value: function _renderForUpdate(props) {
      var newState = this.updateStateFromProps(props);

      if (newState) {
        this.state = newState;
      }

      this.props = props;
      return this._verifiedRender();
    }
    /**
     * Gets the named callback function (either from builtin callbacks or from overrides provided
     * by the VirtualElementBridge)
     * @param name {'updateProperty'|'queueRender'|'fireAction'|'storeUnslottedNodes'} The callback to retrieve
     * @return function
     * @private
     */

  }, {
    key: "_getCallback",
    value: function _getCallback(name) {
      if (!this._callbacks) {
        this._callbacks = this._getBuiltInCallbacks();
      }

      return this._callbacks[name];
    }
    /**
     * Gets on object containing the built-in callback functions for the VComponent-first case
     * @return Object
     * @private
     */

  }, {
    key: "_getBuiltInCallbacks",
    value: function _getBuiltInCallbacks() {
      var callbacks = {
        updateProperty: function (prop, value, shouldRender) {
          this.fireAction(prop + 'Changed', {
            value: value,
            previousValue: this.props[prop],
            updatedFrom: 'internal'
          });
        }.bind(this),
        queueRender: function (element) {
          // TODO: Use busy state abstraction once JET-29316 is implemented
          if (!this._busyStateCallbackForRender && !this.isPatching()) {
            var busyContext = Context.getContext(element).getBusyContext();
            this._busyStateCallbackForRender = busyContext.addBusyState({
              description: this.props.id + ' is waiting to render.'
            });
            window.requestAnimationFrame(function () {
              try {
                // We are not passing the other two parameters for uncontrolled root props since the
                // VComponent queueRender case is only called by updateState for the VComponent-first case which would
                // not have any effect on uncontrolled properties.
                this.patch(this.props);
              } catch (error) {
                throw error;
              } finally {
                this._busyStateCallbackForRender();

                this._busyStateCallbackForRender = null;
              }
            }.bind(this));
          }
        }.bind(this),
        fireAction: function (type, detail) {
          // look for an action listener and call it directly
          var listenerProp = oj.__AttributeUtils.eventTypeToEventListenerProperty(type);

          var listener = this.props[listenerProp];

          if (listener) {
            listener({
              type: type,
              detail: detail
            });
          }
        }.bind(this),
        storeUnslottedNodes: function storeUnslottedNodes(slotMap) {// No storage node for VComponent-first cases so we don't need to worry about moving
          // any unslotted nodes to the storage node.
        }
      };
      callbacks['_vcomp'] = true;
      return callbacks;
    }
    /**
     * Checks a property to see if it is allowed on the root element
     * @param prop {string} The property name to check
     * @return boolean
     * @private
     */

  }, {
    key: "_isValidRootProp",
    value: function _isValidRootProp(prop) {
      // The properties being verified are the ones the VComponent is rendering on the root custom element.
      // We expect this to be a small set and include only:
      // 1) controlled properties
      // 2) DOM listeners
      // 3) className
      // 4) style
      var verifiedRootPropMap = this.constructor['metadata']['verifiedControlledPropsMap'] || {};
      return prop === 'className' || prop === 'style' || verifiedRootPropMap[prop] || oj.__AttributeUtils.eventListenerPropertyToEventType(prop) !== null;
    }
    /**
     * Checks a set of root custom element properties and warns/removes uncontrolled properties.
     * @param props {Object} The root custom element properties to verify
     * @return void
     * @private
     */

  }, {
    key: "_verifyProps",
    value: function _verifyProps(props) {
      for (var prop in props) {
        if (!this._isValidRootProp(prop)) {
          Logger.warn("Component can only render controlled global properties or DOM event listeners on the root custom element. " + prop + " will not be rendered.");
          delete props[prop];
        }
      }
    }
    /**
     * Calls the component's render method and verifies/removes illegal properties
     * from the resulting virtual node's properties, reutnring the verified virtual
     * node after.
     * @return {Object}
     * @private
     */

  }, {
    key: "_verifiedRender",
    value: function _verifiedRender() {
      var vnode = this.render();

      this._verifyProps(vnode.props);

      return vnode;
    }
  }], [{
    key: "register",
    value: function register(constr) {
      VirtualElementBridge.register(constr);
    }
  }, {
    key: "_getSlotMap",
    value: function _getSlotMap(childNodes) {
      var slotMap = {};
      childNodes.forEach(function (vnode) {
        var slot = vnode.props.slot || '';

        if (!slotMap[slot]) {
          slotMap[slot] = [];
        } // Generate the slotMap with the virtual node or the real DOM node.
        // petit-dom knows how to deal with both.


        slotMap[slot].push(vnode._refNode || vnode);
      });
      return slotMap;
    }
  }]);

  return VComponent;
}();



/* global vdom:false, Promise:false, Context:false, DefaultsUtils:false, Logger:false*/

/* eslint-disable global-require */

/**
 * @class
 * @ignore
 */
oj.VirtualElementBridge = {}; // Make this a module-local var so we don't have to use oj in VComponent
// eslint-disable-next-line no-unused-vars

var VirtualElementBridge = oj.VirtualElementBridge;
/**
 * Prototype for the JET component definitional bridge instance
 */

oj.VirtualElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);
oj.CollectionUtils.copyInto(oj.VirtualElementBridge.proto, {
  AddComponentMethods: function AddComponentMethods(proto) {
    // eslint-disable-next-line no-param-reassign
    proto.setProperty = function (prop, value) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);

      if (!bridge.SaveEarlyPropertySet(prop, value)) {
        bridge.SetProperty(this, prop, value, this, true);
      }
    }; // eslint-disable-next-line no-param-reassign


    proto.getProperty = function (prop) {
      // 'this' is the property object we pass to the definitional element contructor to track internal property changes
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      return bridge.GetProperty(this, prop, this);
    };
  },
  AttributeChangedCallback: function AttributeChangedCallback(attr, oldValue, newValue) {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.AttributeChangedCallback.call(this, attr, oldValue, newValue); // The browser triggers this callback even if old and new values are the same
    // so we should do an equality check ourselves to prevent extra work

    if (oldValue !== newValue) {
      // VComponents need to update _LIVE_CONTROLLED_PROPS even during the patching case
      var bridge = oj.BaseCustomElementBridge.getInstance(this); // If we haven't already called HandleAttributeChanged in superclass, check to see
      // if we should call it to update _LIVE_CONTROLLED_PROPS for attributes updated during
      // the VComponent render() patching cycle

      if (!bridge.ShouldHandleAttributeChanged(this) && oj.BaseCustomElementBridge.proto.ShouldHandleAttributeChanged.call(bridge, this)) {
        var vcomp = this._vcomp;

        if (!vcomp || vcomp.isCustomElementFirst()) {
          bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
        }
      }
    }
  },
  CreateComponent: function CreateComponent(element) {
    if (!element._vcomp) {
      if (oj.Components) {
        oj.Components.unmarkPendingSubtreeHidden(element);
      }

      var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);

      var slotMap = oj.BaseCustomElementBridge.getSlotMap(element);

      this._storePropsDerivedFromSlots(element, slotMap); // Initialize controlled root properties now that we know bindings have resolved and
      // data bound global attributes should be resolved.


      this._initializeControlledProps(element);

      var vprops = this._getVComponentProps();

      var vcomp = new descriptor._CONSTRUCTOR(vprops); // Cache a uniqueID on the vcomponent instance

      vcomp._uniqueId = oj.__AttributeUtils.getUniqueId(element.id);
      Object.defineProperty(element, '_vcomp', {
        value: vcomp,
        enumerable: false
      });
      vcomp.setCallbacks(this._getCallbacks(element));

      this._mountComponent(element, element._vcomp, vprops, slotMap);
    }

    element._vcomp.mounted(); // The bridge handles calling postRender after connected while the
    // VComponent handles postRender after patching since patching can be
    // triggered by DOM or virtually by the parent, but in all cases we have
    // a live DOM node so it is safe to call postRender after patch


    element._vcomp.postRender(); // Set flag when we can fire property change events


    this.__READY_TO_FIRE = true; // Resolve the component busy state

    this.resolveDelayedReadyPromise();
  },
  // eslint-disable-next-line no-unused-vars
  DefineMethodCallback: function DefineMethodCallback(proto, method, methodMeta) {
    // eslint-disable-next-line no-param-reassign
    proto[method] = function () {
      // The VComponent is asynchronously instantiated by CreateComponent so we
      // need to check that this has happened before we call any methods defined on it.
      // Custom elements are upgraded synchronously meaning the method will be available
      // on the HTMLElement, but we tell applications to wait on the component busy context
      // before accessing properties and methods due to the asynch CreateComponent call.
      if (!this._vcomp) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        bridge.throwError(this, 'Cannot access methods before element is upgraded.');
      }

      return this._vcomp[method].apply(this._vcomp, arguments);
    };
  },
  DefinePropertyCallback: function DefinePropertyCallback(proto, property, propertyMeta) {
    /**
     * Property sets are processed differently whether they are coming from the application
     * or interally from the component. All outer application sets will be processed synchronously
     * since that would be the expected behavior, while internal component sets will be processed
     * asynchronously. This allows the application to update a property, like oj-table's selection,
     * which will then cause the component to update an associated property first-selected-row and
     * trigger the [property]Changed events after all the properties have been updated. Otherwise,
     * the application will receive a selectionChanged event when the firstSelectedRow property could
     * be out of sync. Rendering is done asynchronously regardless of whether an application or component update
     * occured.
     * @param {any} value The property value to set
     * @param {boolean} bOuterSet True if the set is coming from the custom element
     *                            instead of the bridge's _PROPS_PROXY
     */
    function set(value, bOuterSet) {
      var propertyUpdate = {
        isOuter: bOuterSet,
        name: property,
        value: value,
        meta: propertyMeta
      };

      this._BRIDGE._updateProperty(this._ELEMENT, propertyUpdate, bOuterSet);
    }

    function innerSet(value) {
      set.bind(this)(value, false);
    } // Called on the custom element


    function outerSet(value) {
      // VComponent-first elements should only be updated by its parent during rendering
      // and not through the live DOM updates. We will ignore outer sets
      // for VComponent-first elements to avoid being out of sync with the
      // state the parent believes its child to be in.
      var vcomp = this._vcomp;
      var bridge = oj.BaseCustomElementBridge.getInstance(this);

      if (!vcomp || vcomp.isCustomElementFirst()) {
        set.bind(bridge._PROPS_PROXY)(value, true);
      } else if (vcomp && !vcomp.isCustomElementFirst()) {
        bridge.throwError(this, 'Cannot set properties on a VComponent-first element.');
      }
    }

    function get() {
      var value = this._BRIDGE._PROPS[property]; // If the attribute has not been set, return the default value

      if (value === undefined) {
        value = this._BRIDGE._getDefaultValue(property, propertyMeta);
        this._BRIDGE._PROPS[property] = value;
      }

      return value;
    }

    function innerGet() {
      return get.bind(this)();
    } // Called on the custom element


    function outerGet() {
      var vcomp = this._vcomp; // VComponent-first elements should only be updated by its parent during rendering
      // and not through the live DOM updates. We will ignore outer gets
      // for VComponent-first elements, since they are an implementation detail of the parent element
      // and should not be interacted with in the DOM. This case will be treated as an unsupported error case
      // and always return undefined.

      if (vcomp && !vcomp.isCustomElementFirst()) {
        return undefined;
      }

      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      return get.bind(bridge._PROPS_PROXY)();
    } // Don't add event listener properties for inner props


    if (!propertyMeta._derived) {
      oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto._propsProto, property, innerGet, innerSet);
    }

    oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
  },
  GetAttributes: function GetAttributes(metadata) {
    var attrs = oj.BaseCustomElementBridge.proto.GetAttributes.call(this, metadata); // Components can indicate additional global attributes they want to be notified about
    // via metadata. These attributes can be used by the component to then update the root
    // global attributes.

    if (metadata.verifiedControlledPropsMap) {
      Object.keys(metadata.verifiedControlledPropsMap).forEach(function (prop) {
        attrs.push(oj.__AttributeUtils.getGlobalAttrForProp(prop));
      });
    }

    return attrs;
  },
  ShouldHandleAttributeChanged: function ShouldHandleAttributeChanged(element) {
    if (!oj.BaseCustomElementBridge.proto.ShouldHandleAttributeChanged.call(this, element)) {
      return false;
    } // We only care about attribute change notifications if we're CustomElement-first,
    // since we need to re-render if the application has modified a controlled root property
    // directly on a custom element.
    //
    // Note that if the vcomp has not yet been created, we allow attribute changed
    // processing to continue, as BaseCustomElementBridge has binding-related work
    // that it may need to perform.


    var vcomp = element._vcomp;
    return !vcomp || vcomp.isCustomElementFirst() && !vcomp.isPatching();
  },
  HandleAttributeChanged: function HandleAttributeChanged(element, attr, oldValue, newValue) {
    var vcomp = element._vcomp;
    var rootPropsMap = this.METADATA.verifiedControlledPropsMap;

    if (vcomp && rootPropsMap) {
      var prop = oj.__AttributeUtils.getGlobalPropForAttr(attr) || attr;

      if (rootPropsMap[prop] && oldValue !== newValue) {
        // Get the property value if there is one so we pass the correctly typed value
        // to the VComponent unless that value is null in which case we should remove
        // the property from controlled props since this will get merged to the VComponent's
        // this.props and we don't pass values into this.props if undefined.
        if (newValue == null) {
          delete this._LIVE_CONTROLLED_PROPS[prop]; // Only update the _VCOMP_CONTROLLED_PROPS if the update was not triggered
          // by the vcomponent during patching

          if (!vcomp.isPatching()) {
            delete this._VCOMP_CONTROLLED_PROPS[prop];
          }
        } else {
          var propValue = element[prop];
          this._LIVE_CONTROLLED_PROPS[prop] = propValue != null ? propValue : newValue;

          if (!vcomp.isPatching()) {
            this._VCOMP_CONTROLLED_PROPS[prop] = this._LIVE_CONTROLLED_PROPS[prop];
          }
        } // Only rerender if we're not updating during a VComponent patching of controlled
        // global properties


        if (!vcomp.isPatching()) {
          this._queueRender(element);
        }
      }
    }
  },
  // eslint-disable-next-line no-unused-vars
  HandleReattached: function HandleReattached(element) {
    this._verifyConnectDisconnect(element, 1);
  },
  // eslint-disable-next-line no-unused-vars
  HandleDetached: function HandleDetached(element) {
    this._verifyConnectDisconnect(element, 0);
  },
  _verifyConnectDisconnect: function _verifyConnectDisconnect(element, state) {
    if (this._verifyingState === -1) {
      Promise.resolve().then(function () {
        // This checks that we don't call any lifecycle hooks
        // for reparent case where _verifyingState has been
        // updated but the initial state we called
        // this Promise with is different
        if (this._verifyingState === state) {
          if (this._verifyingState === 0) {
            element._vcomp.unmounted();
          } else {
            element._vcomp.mounted();
          }
        }

        this._verifyingState = -1;
      }.bind(this));
    }

    this._verifyingState = state;
  },
  InitializeElement: function InitializeElement(element) {
    if (!element._vcomp) {
      if (oj.Components) {
        oj.Components.markPendingSubtreeHidden(element);
      }

      oj.BaseCustomElementBridge.__InitProperties(element, element);
    }
  },
  InitializePrototype: function InitializePrototype(proto) {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);
    Object.defineProperty(proto, '_propsProto', {
      value: {}
    });
  },
  InitializeBridge: function InitializeBridge(element, descriptor) {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializeBridge.call(this, element, descriptor); // Flag used to detect a verified connected/disconnected state
    // -1 = not verifying
    // 0 = disconnected
    // 1 = connected

    this._verifyingState = -1;
    this._EXTENSION = this.METADATA.extension || {};
    this._CONSTRUCTOR = descriptor._CONSTRUCTOR; // For tracking all properties (source of truth for property storage)

    this._PROPS = {}; // Stores any requested property updates, gets processed synchronously for outer sets, but asynch for inner sets

    this._PROP_CHANGE_QUEUE = []; // Stores property change events that are waiting to be fired.  When multiple property updates are being processed in _PROP_CHANGE_QUEUE,
    // events are stored in _PROP_CHANGE_EVENT_QUEUE until property updates have been reflected, then all events are fired

    this._PROP_CHANGE_EVENT_QUEUE = []; // Has getters/setters and calls to set properties on this._PROPS

    if (element._propsProto) {
      this._PROPS_PROXY = Object.create(element._propsProto);
      this._PROPS_PROXY._BRIDGE = this;
      this._PROPS_PROXY._ELEMENT = element;
    } // We need to maintain two sets of controlled properties in the bridge. One set of controlled properties
    // should always reflect the current state of the DOM even after internal changes that occur during
    // patching and a second version that does not reflect the internal changes that we merge to the props
    // we pass to the VComponent for rendering. This former collection is what petit-dom will use as the
    // 'old' root props for patching. This will allow petit-dom to correctly respond to both application and
    // VComponent updates to controlled properties.


    this._LIVE_CONTROLLED_PROPS = {};
    this._VCOMP_CONTROLLED_PROPS = {};
  },
  PlaybackEarlyPropertySets: function PlaybackEarlyPropertySets(element) {
    if (!element._vcomp) {
      oj.BaseCustomElementBridge.proto.PlaybackEarlyPropertySets.call(this, element);
    }
  },
  GetPreCreatePromise: function GetPreCreatePromise(element) {
    var promise = oj.BaseCustomElementBridge.proto.GetPreCreatePromise.call(this, element); // If the template engine has not yet been loaded, and we have have some template elements as direct children,
    // chain the base class's pre-create promise with the promise for the template engine becoming
    // loaded and cached
    // eslint-disable-next-line no-use-before-define

    if (!_cachedTemplateEngine && _hasDirectTemplateChildren(element)) {
      promise = promise.then(function () {
        return _getTemplateEnginePromise();
      });
    }

    return promise;
  },
  ValidateAndSetProperty: function ValidateAndSetProperty(propNameFun, componentProps, property, value, element) {
    var _value = this.ValidatePropertySet(element, property, value);

    oj.VirtualElementBridge.__SetProperty(propNameFun, componentProps, property, _value);
  },
  _mountComponent: function _mountComponent(element, vcomp, vprops, slotMap) {
    var content = oj.VirtualElementBridge._processSlotContent(element, slotMap); // Make a copy of the controlled props so we get a snapshot before mounting.
    // We want to avoid the case where a VComponent updates the custom element
    // controlled properties during mount and the controlled props are updated
    // before a queued render is called.


    var controlledPropsCopy = Object.assign({}, this._LIVE_CONTROLLED_PROPS); // mountContent appends child nodes to element

    vcomp.mountContent(vprops, content, element, controlledPropsCopy);
  },

  /**
   * Property update callback to pass to VComponent.  Delegates to _PROPS_PROXY
   * which calls the inner set methods
   * @param {HTMLElement} element The custom element to process a property change for
   * @param {string} prop The property to update
   * @param {any} value The new property value
   * @param {boolean} queueRender whether to queue a render
   * @return void
   * @private
   */
  _queuePropertyUpdate: function _queuePropertyUpdate(element, prop, value, queueRender) {
    this._PROPS_PROXY[prop] = value;

    if (queueRender) {
      this._queueRender(element);
    }
  },

  /**
   * Pushes a property update to the queue. Processes the queue synchronously or asynchronously based on the specified flag.
   * Called by both inner and outer sets.
   *
   * @param {HTMLElement} element The custom element to process a property change for
   * @param {Object} propertyUpdate An object containing isOuter, name, value, meta keys
   * @param {boolean} sync whether to process the property synchronously
   * @private
   */
  _updateProperty: function _updateProperty(element, propertyUpdate, sync) {
    this._PROP_CHANGE_QUEUE.push(propertyUpdate); // Process the property set queue immediately for outer sets, but asynchronously for inner sets


    if (sync) {
      this._processPropertyQueue(element);
    } else if (!this._propsProcessingQueued) {
      // We do not need to add a busy state here because
      // the properties are processed as microtasks and
      // should be completed by the time the application
      // needs to interact with the component
      this._propsProcessingQueued = true;
      Promise.resolve().then(function () {
        this._processPropertyQueue(element);

        this._propsProcessingQueued = false;
      }.bind(this));
    }
  },

  /**
   * Process and apply the current set of property updates.
   * @param {HTMLElement} element The custom element to process a property change for
   * @return void
   * @private
   */
  _processPropertyQueue: function _processPropertyQueue(element) {
    var propertyUpdate = this._PROP_CHANGE_QUEUE.shift();

    while (propertyUpdate) {
      var name = propertyUpdate.name;
      var value = propertyUpdate.value;
      var meta = propertyUpdate.meta; // Properties can be set before the component is created. These early
      // sets are actually saved until after component creation and played back.

      if (!this.SaveEarlyPropertySet(name, value)) {
        var previousValue = this._PROPS[name];

        if (!oj.BaseCustomElementBridge.__CompareOptionValues(name, meta, value, previousValue)) {
          // Skip validation for inner sets so we don't throw an error when updating readOnly
          // writeable properties
          if (propertyUpdate.isOuter) {
            value = this.ValidatePropertySet(element, name, value);
          } // Instead of updating undefined in our property bag, delete the key
          // so later when we copy props for vcomponent rendering, we can use
          // Object.assign without overriding default values when the value is undefined


          if (value === undefined) {
            delete this._PROPS[name];
          } else {
            this._PROPS[name] = value;
          } // Queue a property change event to fire


          propertyUpdate.previousValue = previousValue;

          this._PROP_CHANGE_EVENT_QUEUE.push(propertyUpdate); // This will get called before connected callback so short circuit render for that case
          // Only force render for outer sets, internal sets can optionally trigger renders and will
          // be queued separately by the VComponent


          if (element._vcomp && propertyUpdate.isOuter) {
            this._queueRender(element);
          }
        }
      }

      propertyUpdate = this._PROP_CHANGE_QUEUE.shift();
    }

    this._firePropertyChangeEvents(element);
  },

  /**
   * Processes the current property changed queue and fires the appropriate
   * [property]Changed event from the custom element.
   * @param {HTMLElement} element The custom element to fire a [property]Changed event for
   * @return void
   * @private
   */
  _firePropertyChangeEvents: function _firePropertyChangeEvents(element) {
    var propertyUpdate = this._PROP_CHANGE_EVENT_QUEUE.shift();

    while (propertyUpdate) {
      oj.BaseCustomElementBridge.__FirePropertyChangeEvent(element, propertyUpdate.name, propertyUpdate.value, propertyUpdate.previousValue, propertyUpdate.isOuter ? 'external' : 'internal');

      propertyUpdate = this._PROP_CHANGE_EVENT_QUEUE.shift();
    }
  },

  /**
   * Registers an asynchronous component render as a result of a state or property update.
   * @param {HTMLElement} element The custom element to queue a render for
   * @return void
   * @private
   */
  _queueRender: function _queueRender(element) {
    if (!this._busyStateCallbackForRender && !element._vcomp.isPatching()) {
      var busyContext = Context.getContext(element).getBusyContext();
      this._busyStateCallbackForRender = busyContext.addBusyState({
        description: oj.BaseCustomElementBridge.getElementInfo(element) + ' is waiting to render.'
      });
      window.requestAnimationFrame(function () {
        var vprops = this._getVComponentProps();

        try {
          // We can't control if an error is thrown by the VComponent logic after a busy state
          // is registered and we give up the execution thread, but we can at least try and catch
          // errors thrown while patching and resolve the busy state for that case.
          var controlledPropsCopy = Object.assign({}, this._LIVE_CONTROLLED_PROPS);

          element._vcomp.patchContent(vprops, controlledPropsCopy);
        } catch (error) {
          throw error;
        } finally {
          this._busyStateCallbackForRender();

          this._busyStateCallbackForRender = null;
        }
      }.bind(this));
    }
  },

  /**
   * We need to make a copy of the properties any time we hand off props to the vcomp,
   * as we mutate our own copy and vcomp should not be exposed to these changes
   * (until we hand off a new copy). We will also augment the props we pass to the vcomp
   * with any controlled properties and slots the component has registered.
   * @private
   */
  _getVComponentProps: function _getVComponentProps() {
    var staticDefaults = DefaultsUtils.getStaticDefaults(this._CONSTRUCTOR, true);
    var propsCopy = staticDefaults ? Object.create(staticDefaults) : {}; // Copy the current root props into this.props so component can initialize property dependent state
    // Also copy properties that were derived from slots (i.e. template renderers)

    Object.assign(propsCopy, this._PROPS, this._VCOMP_CONTROLLED_PROPS, this._getPropsDerivedFromSlots());
    DefaultsUtils.applyDynamicDefaults(this._CONSTRUCTOR, propsCopy);
    return propsCopy;
  },

  /**
   * Returns an object containing override callbacks for VComponent functionality so that we can
   * cause different behavior for the custom element-first case.
   *
   * @private
   */
  _getCallbacks: function _getCallbacks(element) {
    var metadata = this.METADATA;
    return {
      updateProperty: this._queuePropertyUpdate.bind(this, element),
      queueRender: this._queueRender.bind(this),
      fireAction: function fireAction(type, detail) {
        var eventsMetadata = metadata.events || {};
        var eventMetadata = eventsMetadata[type] || {};
        var descriptor = {
          detail: detail,
          bubbles: !!eventMetadata.bubbles,
          cancelable: !!eventMetadata.cancelable
        };
        element.dispatchEvent(new CustomEvent(type, descriptor));
      },
      storeUnslottedNodes: function storeUnslottedNodes(slotMap) {
        oj.VirtualElementBridge._storeUnslottedNodes(element, slotMap);
      }
    };
  },

  /**
   * Initializes controlled roop props based on the controlled properties specified in the metadata
   * and the attributes of the specified element
   * @param {HTMLElement} element
   * @private
   */
  _initializeControlledProps: function _initializeControlledProps(element) {
    var rootPropsMap = this.METADATA.verifiedControlledPropsMap;

    if (rootPropsMap) {
      var liveRootProps = this._LIVE_CONTROLLED_PROPS;
      var vcompRootProps = this._VCOMP_CONTROLLED_PROPS;
      Object.keys(rootPropsMap).forEach(function (prop) {
        var attr = oj.__AttributeUtils.getGlobalAttrForProp(prop);

        if (element.hasAttribute(attr)) {
          // Try and get the property so the type is correct, if not available
          // get the attribute value, e.g. data-, aria-, tabindex (since property is tabIndex)
          var propValue = element[prop];
          liveRootProps[prop] = propValue != null ? propValue : element.getAttribute(attr);
          vcompRootProps[prop] = liveRootProps[prop];
        }
      });
    }
  },

  /**
   * Saves slot-derived properties on the bridge instance
   * @param {Element} hostElement
   * @param {Object} slotMap
   * @private
   */
  _storePropsDerivedFromSlots: function _storePropsDerivedFromSlots(hostElement, slotMap) {
    this._propsFromSlots = this._getInlineTemplatesAsRendererProps(hostElement, slotMap);
  },

  /**
   * Returns properties previously intiazlized by _storePropsDerivedFromSlots()
   * @return {Object} slot-derived proeprties
   * @private
   */
  _getPropsDerivedFromSlots: function _getPropsDerivedFromSlots() {
    return this._propsFromSlots;
  },

  /**
   * Converts inline templates to renderer functions
   * @param {Element} hostElement
   * @param {Object} slotMap
   * @return {Object|null} an object with property names as keys and renderer functions as values or null if there are none
   * @private
   */
  _getInlineTemplatesAsRendererProps: function _getInlineTemplatesAsRendererProps(hostElement, slotMap) {
    var renderers = null;
    var slots = this.METADATA.slots;

    if (slots) {
      var entries = Object.entries(slots);
      entries.forEach(function (entry) {
        if (_isTemplateSlot(entry[1])) {
          var name = entry[0];
          var templateNodes = slotMap[name];

          if (templateNodes) {
            renderers = renderers || {};
            renderers[_getRendererPropertyName(name)] = _createTemplateRenderer(hostElement, templateNodes[0]);
          }
        }
      });
    }

    return renderers;
  },
  _getDefaultValue: function _getDefaultValue(property) {
    // The VComponent defaults object contains metadata and dynamic defaults
    var defaults = DefaultsUtils.getDefaults(this._CONSTRUCTOR, this.METADATA, true);
    return defaults[property];
  }
});
/**
 * @export
 */

oj.VirtualElementBridge.register = function (constr) {
  var tagName = constr.tagName;
  var metadata = constr.metadata;
  var descriptor = {};
  descriptor[oj.BaseCustomElementBridge.DESC_KEY_META] = metadata;
  descriptor._CONSTRUCTOR = constr;

  if (oj.BaseCustomElementBridge.__Register(tagName, descriptor, oj.VirtualElementBridge.proto)) {
    var controlledRootProps = metadata.controlledRootProperties;

    if (controlledRootProps) {
      metadata.verifiedControlledPropsMap = _getVerifiedControlledPropsMap(controlledRootProps, tagName);
    }

    customElements.define(tagName.toLowerCase(), oj.VirtualElementBridge.proto.getClass(descriptor));
  }
};
/**
 * @private
 */


function _getVerifiedControlledPropsMap(controlledRootProps, tagName) {
  // Turn these props into a map for faster look up later,
  // filtering out invalid controlled properties
  var rootPropsMap = {};
  controlledRootProps.forEach(function (prop) {
    if (prop === 'id' || prop === 'className' || prop === 'style') {
      Logger.warn('"' + prop + '" cannot be registered as a controlled root property and will be ignored for ' + tagName);
      return;
    }

    rootPropsMap[prop] = true;
  });
  return rootPropsMap;
}
/**
 * @private
 */


function _hasDirectTemplateChildren(element) {
  var childNodeList = element.childNodes;

  for (var i = 0; i < childNodeList.length; i++) {
    var child = childNodeList[i];

    if (child.localName === 'template') {
      return true;
    }
  }

  return false;
}
/**
 * @private
 */


function _isTemplateSlot(metadataVal) {
  return metadataVal && metadataVal.data;
}
/**
 * @private
 */


function _getRendererPropertyName(slotName) {
  return slotName.replace(/(Template)?$/, 'Renderer');
}
/**
 * @private
 */


var _cachedTemplateEngine;
/**
 * @private
 */


function _getTemplateEnginePromise() {
  return new Promise(function (resolve, reject) {
    require(['ojs/ojtemplateengine'], function (eng) {
      _cachedTemplateEngine = eng;
      resolve(eng);
    }, reject);
  });
}
/**
 * @private
 */


function _createTemplateRenderer(hostElement, template) {
  if (!_cachedTemplateEngine) {
    throw new Error('Unexpected call to _createTemplateRenderer');
  }

  return function (datacontext) {
    return _cachedTemplateEngine.execute(hostElement, template, datacontext);
  };
}
/**
 * Creates a storage node for a custom element, moves all slot content to
 * the storage node and returns an Array of virtual nodes representing the
 * slot content or null if the custom element has no slot content.
 * @param {Element} element The custom element
 * @param {Object} slotMap
 * @return {Array|null}
 * @private
 */


oj.VirtualElementBridge._processSlotContent = function (element, slotMap) {
  if (element.childNodes) {
    // Needed to replicate what shadow DOM does since we don't have a
    // shadow root to hide slot content that do not map to a component
    // defined slot.
    if (!element._nodeStorage) {
      // eslint-disable-next-line no-param-reassign
      element._nodeStorage = document.createElement('div'); // eslint-disable-next-line no-param-reassign

      element._nodeStorage.style.display = 'none';
      element.appendChild(element._nodeStorage);
    } // Array of virtual nodes we will pass to the VComponent mountContent method


    var content = [];
    var assignableNodes = [];
    var entries = Object.entries(slotMap);
    entries.forEach(function (entry) {
      var slot = entry[0];
      entry[1].forEach(function (node) {
        // Create a lightweight virtual node that contains a reference
        // back to the original slot content and slot value
        content.push({
          _refNode: node,
          props: {
            slot: slot
          }
        });
        assignableNodes.push(node);
      });
    });
    assignableNodes.forEach(function (assignableNode) {
      element._nodeStorage.appendChild(assignableNode); // @HTMLUpdateOK

    }); // Notifies JET components inside nodeStorage that they have been hidden
    // For upstream or indirect dependency we will still rely components being registered on the oj namespace.

    if (oj.Components) {
      oj.Components.subtreeHidden(element._nodeStorage);
    }

    return content;
  }

  return null;
};
/**
 * @param {function} propNameFun A function that returns the actual property name to use, e.g. an alias
 * @param {Object} componentProps The object to set the new property value on which is the
 *                                element for outer property sets and the property bag for inner sets.
 * @param {string} property The property name
 * @param {Object} value The value to set for the property
 * @ignore
 */


oj.VirtualElementBridge.__SetProperty = function (propNameFun, componentProps, property, value) {
  var propsObj = componentProps;
  var propPath = property.split('.');
  var branchedProps; // Set subproperty, initializing parent objects along the way unless the top level
  // property is not defined since setting it to an empty object will trigger a property changed
  // event. Instead, branch and set at the end. We only have listeners on top level properties
  // so setting a subproperty will not trigger a property changed event along the way.

  var topProp = propNameFun(propPath[0]);

  if (propPath.length > 1 && !componentProps[topProp]) {
    branchedProps = {};
    propsObj = branchedProps;
  } // Walk to the correct location


  for (var i = 0; i < propPath.length; i++) {
    var subprop = propNameFun(propPath[i]);
    var objValue = propsObj[subprop];

    if (i === propPath.length - 1) {
      propsObj[subprop] = value;
    } else if (!objValue) {
      propsObj[subprop] = {};
    } else if (Object.isFrozen(objValue)) {
      // If value is frozen, make a copy since we freeze default values
      propsObj[subprop] = oj.CollectionUtils.copyInto({}, objValue, undefined, true);
    }

    propsObj = propsObj[subprop];
  } // Update the original component properties if we branched


  if (branchedProps) {
    // eslint-disable-next-line no-param-reassign
    componentProps[topProp] = branchedProps[topProp];
  }
};
/**
 * Given a custom element and its slotMap, checks all slotted nodes to see
 * if they were removed during patching and moves that node to the storage node.
 * Otherwise, unslotted content will get an unmounted call and knockout variables
 * receiving updates when not attached to the DOM will become out of sync.
 * @param {Element} element The custom element
 * @param {Object} slotMap The current slotMap for the element
 * @return {void}
 * @private
 */


oj.VirtualElementBridge._storeUnslottedNodes = function (element, slotMap) {
  if (element._nodeStorage) {
    var entries = Object.entries(slotMap);
    entries.forEach(function (entry) {
      entry[1].forEach(function (node) {
        // Check to see if the node has been disconnected in the last rerender
        // and move to the storage node and notify that node that it's been hidden.
        // Petit-dom handles calling subtreeShown when appending children into DOM.
        if (!element.contains(node)) {
          element._nodeStorage.appendChild(node);

          if (oj.Components) {
            oj.Components.subtreeHidden(node);
          }
        }
      });
    });
  }
};

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/**
 * @license
 * petit-dom - v0.2.2
 * https://github.com/yelouafi/petit-dom
 * Copyright (C) 2017 Yassine Elouafi;
 * Licensed under the MIT license
 *
 * Modification notice: The code is obtained from https://github.com/yelouafi/petit-dom
 * and modified by Oracle JET team to be included into Oracle JET project.
 * @ignore
 */

/* eslint-disable */
var PetitDom = function () {
  var EMPTYO = Object.freeze({});
  var EMPTYAR = Object.freeze([]);
  var isArray = Array.isArray;

  var isVNode = function isVNode(c) {
    return c && (c._vnode != null || c._text != null);
  };

  var isComponent = function isComponent(c) {
    return c && c.mount && c.patch && c.unmount;
  };

  function h(type, props, contArg) {
    var content,
        args,
        i,
        isSVG = false;
    var len = arguments.length - 2;

    if (typeof type !== "string") {
      if (len === 1) {
        content = contArg;
      } else if (len > 1) {
        args = Array(len);

        for (i = 0; i < len; i++) {
          args[i] = arguments[i + 2];
        }

        content = args;
      }
    } else {
      isSVG = type === "svg";

      if (len === 1) {
        if (isArray(contArg)) {
          content = maybeFlatten(contArg, isSVG);
        } else if (isVNode(contArg)) {
          contArg.isSVG = isSVG;
          content = [contArg];
        } else if (contArg instanceof Node) {
          content = [contArg];
        } else {
          content = [{
            _text: contArg == null ? "" : contArg
          }];
        }
      } else if (len > 1) {
        args = Array(len);

        for (i = 0; i < len; i++) {
          args[i] = arguments[i + 2];
        }

        content = maybeFlatten(args, isSVG);
      } else {
        content = EMPTYAR;
      }
    }

    return {
      _vnode: true,
      isSVG: isSVG,
      type: type,
      key: props && props.key || null,
      props: props || EMPTYO,
      content: content
    };
  }

  function maybeFlatten(arr, isSVG) {
    for (var i = 0; i < arr.length; i++) {
      var ch = arr[i];

      if (isArray(ch)) {
        return flattenChildren(arr, i, arr.slice(0, i), isSVG);
      } else if (ch instanceof Node) {
        arr[i] = ch;
      } else if (!isVNode(ch)) {
        arr[i] = {
          _text: ch == null ? "" : ch
        };
      } else if (isSVG && !ch.isSVG) {
        ch.isSVG = true;
      }
    }

    return arr;
  }

  function flattenChildren(children, start, arr, isSVG) {
    for (var i = start; i < children.length; i++) {
      var ch = children[i];

      if (isArray(ch)) {
        flattenChildren(ch, 0, arr, isSVG);
      } else if (ch instanceof Node) {
        arr.push(ch);
      } else if (isVNode(ch)) {
        if (isSVG && !ch.isSVG) {
          ch.isSVG = true;
        }

        arr.push(ch);
      } else if (ch == null || typeof ch === 'string') {
        arr.push({
          _text: ch == null ? "" : ch
        });
      } else {
        arr.push(ch);
      }
    }

    return arr;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  /**
    TODO: activate full namespaced attributes (not supported in JSX)
    const XML_NS = "http://www.w3.org/XML/1998/namespace"
  **/

  var XLINK_NS = "http://www.w3.org/1999/xlink";
  var NS_ATTRS = {
    show: XLINK_NS,
    actuate: XLINK_NS,
    href: XLINK_NS
  };

  function defShouldUpdate(p1, p2, c1, c2) {
    if (c1 !== c2) return true;

    for (var key in p1) {
      if (p1[key] !== p2[key]) return true;
    }

    return false;
  } // Called by the VComponent for mounting the virtual node in the VComponent-frst case.
  // Handles patching of both the uncontrolled root properties set by a parent
  // and the controlled root properties rendered by the VComponent.


  function mountComponent(vnode, uncontrolledRootProps) {
    var type = vnode.type,
        props = vnode.props,
        content = vnode.content;
    var node = document.createElement(type); // Patch the uncontrolled global properties we stashed on the VComponent
    // instance onto the root custom element

    patchDOM(node, uncontrolledRootProps, null, true); // Then we patch the properties that the vnode specifies

    patchDOM(node, props, null, true);
    mountChildren(node, content);
    vnode._node = node;
    return node;
  } // Called by the VComponent for mounting the virtual node in the custom element-frst case.
  // Handles patching of the controlled root properties rendered by the VComponent.


  function mountComponentContent(vnode, controlledRootProps) {
    var node = vnode._node; // Update only the controlled properties and DOM listeners, all other properties
    // came from the custom element and are already current.
    // The vnode.props should contain only the controlled global properties and event
    // listeners. We have a verification step in VComponent that's run before this method
    // is called.

    patchDOM(node, vnode.props, controlledRootProps, true);
    mountChildren(node, vnode.content);
  }

  function mount(c) {
    var node;

    if (c._text != null) {
      node = document.createTextNode(c._text);
    } else if (c._vnode === true) {
      var type = c.type,
          props = c.props,
          content = c.content,
          isSVG = c.isSVG;

      if (typeof type === "string") {
        // TODO : {is} for custom elements
        if (!isSVG) {
          node = document.createElement(type);
        } else {
          node = document.createElementNS(SVG_NS, type);
        }

        var isCustomElement = oj.ElementUtils.isValidCustomElementName(type);
        patchDOM(node, props, null, isCustomElement);
        mountChildren(node, content);
      } else if (typeof type === "function") {
        if (isComponent(type.prototype)) {
          var splitProps = sortControlled(type, props);
          c._uncontrolled = splitProps.uncontrolled;
          var instance = new type(splitProps.controlled); // Generate and cache a uniqueId on the vcomponent instance

          instance._uniqueId = oj.__AttributeUtils.getUniqueId(splitProps.uncontrolled.id); // When rendering VComponent-first, petit-dom creates a new instance of the VComponent
          // and calls mount(). The VComponent's mount method will call its render(), passing the
          // new vnode to petit-dom's patchComponent().

          node = instance.mount(splitProps.controlled, splitProps.uncontrolled, content);
          c._data = instance;
        } else {
          var vnode = type(props, content);
          node = mount(vnode);
          c._data = vnode;
        }
      }
    }

    if (node == null) {
      throw new Error("Unkown node type!");
    }

    c._node = node;
    return node;
  }

  function mountChildren(node, content) {
    if (!content) {
      return;
    }

    if (!isArray(content)) {
      var isDomNode = content instanceof Node;
      var childNode = isDomNode ? content : mount(content);
      node.appendChild(childNode); // Avoid calling subtree shown on text nodes

      if (isDomNode && ch.nodeType === 1 && oj.Components) {
        oj.Components.subtreeShown(childNode);
      }
    } else {
      appendChildren(node, content);
    }
  }

  function appendChildren(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var beforeNode = arguments[4];

    while (start <= end) {
      var ch = children[start++]; // Check to see if child is a vdom or a live DOM node

      var isDomNode = ch instanceof Node;
      var content = isDomNode ? ch : mount(ch);
      parent.insertBefore(content, beforeNode); // @HTMLUpdateOK
      // Notifies JET components in node that they have been shown
      // For upstream or indirect dependency we will still rely components
      // being registered on the oj namespace.
      // Avoid calling subtree shown on text nodes

      if (isDomNode && ch.nodeType === 1 && oj.Components) {
        oj.Components.subtreeShown(content);
      }
    }
  }

  function removeChildren(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var cleared = void 0;

    if (parent.childNodes.length === end - start + 1) {
      parent.textContent = "";
      cleared = true;
    }

    while (start <= end) {
      var ch = children[start++];
      if (!cleared) parent.removeChild(ch._node);
      unmount(ch);
    }
  }

  function unmount(ch) {
    if (isArray(ch)) {
      for (var i = 0; i < ch.length; i++) {
        unmount(ch[i]);
      }
    } else if (ch._vnode === true) {
      if (typeof ch.type === "function" && isComponent(ch.type.prototype)) {
        ch._data.unmount(ch._node);
      } else if (ch.content != null) {
        unmount(ch.content);
      }
    }
  }

  function isControlledProp(constr, prop) {
    var meta = constr.metadata;

    if (meta && meta.verifiedControlledPropsMap) {
      return meta.verifiedControlledPropsMap[prop] != null;
    }

    return false;
  }

  function isListener(prop) {
    return oj.__AttributeUtils.eventListenerPropertyToEventType(prop) !== null;
  }

  function sortControlled(constr, props) {
    // Create the controlled properties from the static defaults object
    // and then iterate over props which should be a smaller set.
    var staticDefaults = DefaultsUtils.getStaticDefaults(constr, true);
    var splitProps = {
      controlled: Object.create(staticDefaults),
      uncontrolled: {}
    }; // Check the root properties and log a warning if the VComponent
    // tries to set an uncontrolled global property that isn't an event
    // listener.

    for (var propName in props) {
      var value = props[propName]; // Undefined values shouldn't override default values

      if (value !== undefined) {
        if (!oj.__AttributeUtils.isGlobalOrData(propName) || isControlledProp(constr, propName)) {
          splitProps.controlled[propName] = value;
        } else {
          splitProps.uncontrolled[propName] = value;
        }
      }
    } // Even though static metadata defaults override dynamic defaults, because
    // dynamic default getters don't have a setter, we can't use Object.assign
    // so we iterate over those keys last.


    DefaultsUtils.applyDynamicDefaults(constr, splitProps.controlled);
    return splitProps;
  }

  function patchDOM(el, props, oldProps, isCustomElement) {
    if (props) {
      addOrUpdateProps(el, props, oldProps || EMPTYO, isCustomElement);
    }

    if (oldProps) {
      removeOldProps(el, props || EMPTYO, oldProps, isCustomElement);
    }
  }

  function addOrUpdateProps(el, props, oldProps, isCustomElement) {
    // We only set global attributes, everything else is set as property
    // or is an event listener.  Style is special-cased
    var propKeys = Object.keys(props);
    propKeys.forEach(function (key) {
      var value = props[key];
      var oldValue = oldProps[key];

      if (value !== oldValue) {
        if (key === 'style') {
          // To be compliant with CSP's unsafe-inline restrictions, we always want to set
          // style properties individually vs. setting the entire style attribute
          patchProperties(el.style, value || EMPTYO, oldValue || EMPTYO, '');
        } else if (isCustomElement && key === 'className') {
          // For custom elements, call el.classList.add/remove to avoid overriding
          // framework and application set classes. Set as attribute for all other elements.
          patchClassName(el, value, oldValue);
        } else if (!maybePatchListener(el, key, value, oldValue) && !maybePatchAttribute(el, key, value, isCustomElement)) {
          /*
           * We care about the following two cases:
           * 1) Standard HTML attributes which includes all attributes on native elements
           *    and global attributes on custom elements. We will always do attribute
           *    sets for this case with special handling for:
           *    a) the null/undefined property which will result in removing the attribute
           *    b) property names that don't  match the attribute name, e.g. className -> class and htmlFor -> for
           *    c) input elements' value property which is initially populated from the attribute value
           *       but not sync'd after which we will always set as a property
           * 2) Everything else. We will always do property sets for this case.
           */
          el[key] = value;
        }
      }
    });
  }

  function removeOldProps(el, props, oldProps, isCustomElement) {
    var propKeys = Object.keys(oldProps);
    propKeys.forEach(function (key) {
      var oldValue = oldProps[key];

      if (!(key in props)) {
        if (key === 'style') {
          patchProperties(el.style, EMPTYO, oldValue || EMPTYO, '');
        } else if (isCustomElement && key === 'className') {
          patchClassName(el, null, oldValue);
        } else if (!maybePatchListener(el, key, null, oldValue) && !maybePatchAttribute(el, key, null, isCustomElement)) {
          el[key] = undefined;
        }
      }
    });
  }

  function patchProperties(propertyHolder, props, oldProps, unsetValue) {
    for (var key in props) {
      var oldv = oldProps[key];
      var newv = props[key];

      if (oldv !== newv) {
        propertyHolder[key] = newv;
      }
    }

    for (var key in oldProps) {
      if (!(key in props)) {
        propertyHolder[key] = unsetValue;
      }
    }
  }

  function patchClassName(el, value, oldValue) {
    // TODO we think the list of classes should be
    // short but should look into optimizing for performance
    // by using Set difference in the future
    if (oldValue) {
      var oldClassList = oldValue.split(' ');
      oldClassList.forEach(function (className) {
        if (className) {
          el.classList.remove(className);
        }
      });
    }

    if (value) {
      var newClassList = value.split(' ');
      newClassList.forEach(function (className) {
        if (className) {
          el.classList.add(className);
        }
      });
    }
  }

  function maybePatchListener(el, key, value, oldValue) {
    var type = _typeof(value);

    var oldType = _typeof(oldValue);

    if (type === 'function' || oldType === 'function' || value != null && value.listener || oldValue != null && oldValue.listener) {
      var eventType = eventListenerPropertyToEventType(key);

      if (eventType) {
        patchListener(el, eventType, value, oldValue);
        return true;
      }
    }

    return false;
  }

  function patchListener(el, eventType, value, oldValue) {
    if (oldValue) {
      el.removeEventListener(eventType, oldValue.listener ? oldValue.listener : oldValue, oldValue.options);
    }

    if (value) {
      el.addEventListener(eventType, value.listener ? value.listener : value, value.options);
    }
  }

  function maybePatchAttribute(el, key, value, isCustomElement) {
    // The checked attribute while boolean, only reflects the inital DOM
    // so we need to use the checked property to update (Bug 30288985)
    if (isCustomElement && oj.__AttributeUtils.isGlobalOrData(key) || !isCustomElement && key !== 'value' && key !== 'checked') {
      var attr = oj.__AttributeUtils.getNativeAttr(key);

      if (value === true) {
        el.setAttribute(attr, "");
      } else if (value === false) {
        el.removeAttribute(attr);
      } else {
        if (value != null) {
          var ns = NS_ATTRS[attr];

          if (ns !== undefined) {
            el.setAttributeNS(ns, attr, value);
          } else {
            el.setAttribute(attr, value);
          }
        } else {
          el.removeAttribute(attr);
        }
      }

      return true;
    }

    return false;
  }

  function eventListenerPropertyToEventType(property) {
    if (/^on[A-Z]/.test(property)) {
      return property.substr(2, 1).toLowerCase() + property.substr(3);
    }

    return null;
  } // Called by the VComponent for patching in the VComponent-frst case.
  // Handles patching of both the uncontrolled root properties set by a parent
  // and the controlled root properties rendered by the VComponent.


  function patchComponent(newch, oldch, uncontrolledRootProps, oldUncontrolledRootProps) {
    var childNode = oldch._node;

    if (oldch === newch) {
      return childNode;
    }

    patchDOM(childNode, uncontrolledRootProps, oldUncontrolledRootProps, true);
    patchDOM(childNode, newch.props, oldch.props, true);
    patchContent(childNode, newch.content, oldch.content);
  } // Called by the VComponent for patching in the custom element-frst case.
  // Handles patching of the controlled root properties rendered by the VComponent.


  function patchComponentContent(newch, oldch, controlledRootProps) {
    var childNode = oldch._node;

    if (oldch === newch) {
      return childNode;
    } // Generate the root props to diff against. This set should include
    // the current controlled properties set on the DOM node and style/className/listeners
    // from oldch.props.


    var oldRootProps = {};
    var oldProps = oldch.props;

    for (var prop in oldProps) {
      if (isListener(prop) || prop === 'className' || prop === 'style') {
        oldRootProps[prop] = oldProps[prop];
      }
    }

    Object.assign(oldRootProps, controlledRootProps); // Update only the controlled properties and DOM listeners, all other properties
    // came from the custom element and are already current.
    // The newch.props should contain only the controlled global properties and event
    // listeners. We have a verification step in VComponent that's run before this method
    // is called.

    patchDOM(childNode, newch.props, oldRootProps, true);
    patchContent(childNode, newch.content, oldch.content);
  }

  function patch(newch, oldch, parent) {
    var childNode = oldch._node;

    if (oldch === newch) {
      return childNode;
    }

    var t1, t2;

    if ((t1 = oldch._text) != null && (t2 = newch._text) != null) {
      if (t1 !== t2) {
        childNode.nodeValue = t2;
      }
    } else if (oldch.type === newch.type && oldch.isSVG === newch.isSVG) {
      var type = oldch.type;

      if (typeof type === "function") {
        if (isComponent(type.prototype)) {
          var instance = oldch._data;
          var newSplitProps = sortControlled(type, newch.props); // cache for the next time patch is called

          newch._uncontrolled = newSplitProps.uncontrolled; // When rendering VComponent-first, petit-dom calls patch() on the VComponent instance.
          // The VComponent's patch method will then call its render(), passing the new vnode to
          // petit-dom's patchComponent().

          instance.patch(newSplitProps.controlled, newSplitProps.uncontrolled, oldch._uncontrolled);
          newch._data = instance;
        } else {
          var shouldUpdateFn = type.shouldUpdate || defShouldUpdate;

          if (shouldUpdateFn(newch.props, oldch.props, newch.content, oldch.content)) {
            var vnode = type(newch.props, newch.content);
            childNode = patch(vnode, oldch._data, parent);
            newch._data = vnode;
          } else {
            newch._data = oldch._data;
          }
        }
      } else if (typeof type === "string") {
        var isCustomElement = oj.ElementUtils.isValidCustomElementName(type);

        if (contentChangeRequiresRemount(newch.content, oldch.content)) {
          // Remount the custom element (recreate the component) for certain slot changes
          childNode = mount(newch);
          parent.replaceChild(childNode, oldch._node);
          unmount(oldch);
        } else {
          patchDOM(childNode, newch.props, oldch.props, isCustomElement);
          patchContent(childNode, newch.content, oldch.content);
        }
      } else if (oldch instanceof Node && newch instanceof Node) {
        if (oldch !== newch && parent) {
          parent.replaceChild(newch, oldch);
        }
      } else {
        throw new Error("Unknown node type! " + type);
      }
    } else {
      childNode = mount(newch);

      if (parent) {
        parent.replaceChild(childNode, oldch._node);
      }

      unmount(oldch);
    }

    newch._node = childNode;
    return childNode;
  }

  function patchContent(parent, content, oldContent) {
    if (!isArray(content) && !isArray(oldContent)) {
      if (content !== oldContent) {
        patch(content, oldContent, parent);
      }
    } else if (isArray(content) && isArray(oldContent)) {
      diffChildren(parent, content, oldContent);
    } else {
      removeChildren(parent, oldContent, 0, oldContent.length - 1);
      appendChildren(parent, content);
    }
  }

  function canPatch(v1, v2) {
    return v1.key === v2.key;
  }

  function diffChildren(parent, children, oldChildren) {
    var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
    var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;
    if (children === oldChildren) return;
    var oldCh;
    /**
      Before applying the diff algorithm we try some preprocessing optimizations
      to reduce the cost
      See https://neil.fraser.name/writing/diff/ for the full details.
        In the following : indel = INsertion/DELetion
    **/
    // common prefix/suffix

    var k = diffCommonPrefix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
    newStart += k;
    oldStart += k;
    k = diffCommonSufffix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
    newEnd -= k;
    oldEnd -= k;

    if (newStart > newEnd && oldStart > oldEnd) {
      return;
    } // simple indel: one of the 2 sequences is empty after common prefix/suffix removal
    // old sequence is empty -> insertion


    if (newStart <= newEnd && oldStart > oldEnd) {
      oldCh = oldChildren[oldStart];
      appendChildren(parent, children, newStart, newEnd, oldCh && oldCh._node);
      return;
    } // new sequence is empty -> deletion


    if (oldStart <= oldEnd && newStart > newEnd) {
      removeChildren(parent, oldChildren, oldStart, oldEnd);
      return;
    } // 2 simple indels: the shortest sequence is a subsequence of the longest


    var oldRem = oldEnd - oldStart + 1;
    var newRem = newEnd - newStart + 1;
    k = -1;

    if (oldRem < newRem) {
      k = indexOf(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch);

      if (k >= 0) {
        oldCh = oldChildren[oldStart];
        appendChildren(parent, children, newStart, k - 1, oldCh._node);
        var upperLimit = k + oldRem;
        newStart = k;

        while (newStart < upperLimit) {
          patch(children[newStart++], oldChildren[oldStart++]);
        }

        oldCh = oldChildren[oldEnd];
        appendChildren(parent, children, newStart, newEnd, oldCh && oldCh._node.nextSibling);
        return;
      }
    } else if (oldRem > newRem) {
      k = indexOf(oldChildren, children, oldStart, oldEnd, newStart, newEnd, canPatch);

      if (k >= 0) {
        removeChildren(parent, oldChildren, oldStart, k - 1);
        upperLimit = k + newRem;
        oldStart = k;

        while (oldStart < upperLimit) {
          patch(children[newStart++], oldChildren[oldStart++]);
        }

        removeChildren(parent, oldChildren, oldStart, oldEnd);
        return;
      }
    } // fast case: difference between the 2 sequences is only one item


    if (oldStart === oldEnd) {
      var node = oldChildren[oldStart]._node;
      appendChildren(parent, children, newStart, newEnd, node);
      parent.removeChild(node);
      unmount(node);
      return;
    }

    if (newStart === newEnd) {
      parent.insertBefore(mount(children[newStart]), oldChildren[oldStart]._node); // @HTMLUpdateOK

      removeChildren(parent, oldChildren, oldStart, oldEnd);
      return;
    }
    /*
      last preopt
      if we can find a subsequence that's at least half the longest sequence the it's guaranteed to
      be the longest common subsequence. This allows us to find the lcs using a simple O(N) algorithm
    */


    var hm;
    /*var oldShorter = oldRem < newRem;
    if (oldShorter) {
      hm = diffHalfMatch(
        children,
        oldChildren,
        newStart,
        newEnd,
        oldStart,
        oldEnd,
        canPatch
      );
    } else {
      hm = diffHalfMatch(
        oldChildren,
        children,
        oldStart,
        oldEnd,
        newStart,
        newEnd,
        canPatch
      );
    }
    if (hm) {
      var newStartHm = oldShorter ? hm.start1 : hm.start2;
      var newEndHm = newStartHm + hm.length - 1;
      var oldStartHm = oldShorter ? hm.start2 : hm.start1;
      var oldEndHm = oldStartHm + hm.length - 1;
      for (var i = newStartHm, j = oldStartHm; i <= newEndHm; i++, j++) {
        patch(children[i], oldChildren[j], parent);
      }
      diffChildren(
        parent,
        children,
        oldChildren,
        newStart,
        newStartHm - 1,
        oldStart,
        oldStartHm - 1
      );
      diffChildren(
        parent,
        children,
        oldChildren,
        newEndHm + 1,
        newEnd,
        oldEndHm + 1,
        oldEnd
      );
      return;
    }*/

    /*
      Run the diff algorithm
      First try the O(ND) algorithm. If O(ND) cost is high (Too match diffs between the 2 seqs)
      then fallback to Map lookup based algorithm
    */

    if (!hm) {
      var failed = diffOND(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd);
      if (failed) diffWithMap(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd);
    }
  }

  function diffCommonPrefix(s1, s2, start1, end1, start2, end2, eq, parent) {
    var k = 0,
        c1,
        c2;

    while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[start1], c2 = s2[start2])) {
      if (parent) patch(c1, c2, parent);
      start1++;
      start2++;
      k++;
    }

    return k;
  }

  function diffCommonSufffix(s1, s2, start1, end1, start2, end2, eq, parent) {
    var k = 0,
        c1,
        c2;

    while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[end1], c2 = s2[end2])) {
      if (parent) patch(c1, c2, parent);
      end1--;
      end2--;
      k++;
    }

    return k;
  }
  /*
  function diffHalfMatch(s1, s2, start1, end1, start2, end2, eq) {
    var len1 = end1 - start1 + 1;
    var len2 = end2 - start2 + 1;
     if (len1 < 2 || len2 < 1) {
      return null;
    }
     var hm1 = halfMatchInt(start1 + Math.ceil(len1 / 4));
    var hm2 = halfMatchInt(start1 + Math.ceil(len1 / 2));
    return !hm1 && !hm2
      ? null
      : !hm1 ? hm2 : !hm2 ? hm1 : hm1.length > hm2.length ? hm1 : hm2;
     function halfMatchInt(seedStart) {
      var seedEnd = seedStart + Math.floor(len1 / 4);
      var j = start2 - 1;
      var bestCS = { length: 0 };
      while (
        j < end2 &&
        (j = indexOf(s2, s1, j + 1, end2, seedStart, seedEnd, eq)) !== -1
      ) {
        var prefixLen = diffCommonPrefix(s1, s2, seedStart, end1, j, end2, eq);
        var suffixLen = diffCommonSufffix(
          s1,
          s2,
          start1,
          seedStart - 1,
          start2,
          j - 1,
          eq
        );
        if (bestCS.length < prefixLen + suffixLen) {
          bestCS.start1 = seedStart - suffixLen;
          bestCS.start2 = j - suffixLen;
          bestCS.length = prefixLen + suffixLen;
        }
      }
      return bestCS.length >= len1 / 2 ? bestCS : null;
    }
  }
  */


  var PATCH = 2;
  var INSERTION = 4;
  var DELETION = 8;
  /**
    Find the shortest edit script between the old and new sequences
    This is equivalent to finding the shortest path in the edit graph of the 2 sequences
    see "An O(ND) Difference Algorithm and Its Variations" at
    http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.4.6927&rep=rep1&type=pdf
  **/

  function diffOND(parent, children, oldChildren) {
    var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
    var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;
    var rows = newEnd - newStart + 1;
    var cols = oldEnd - oldStart + 1;
    var dmax = rows + cols;
    var v = [];
    var d, k, r, c, pv, cv, pd;

    outer: for (d = 0; d <= dmax; d++) {
      if (d > 50) return true;
      pd = d - 1;
      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];

      for (k = -d; k <= d; k += 2) {
        if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }

        r = c - k;

        while (c < cols && r < rows && canPatch(oldChildren[oldStart + c], children[newStart + r])) {
          c++;
          r++;
        }

        if (c === cols && r === rows) {
          break outer;
        }

        cv[d + k] = c;
      }
    }

    var diff = Array(d / 2 + dmax / 2);
    var deleteMap = {};
    var oldCh;
    var diffIdx = diff.length - 1;

    for (d = v.length - 1; d >= 0; d--) {
      while (c > 0 && r > 0 && canPatch(oldChildren[oldStart + c - 1], children[newStart + r - 1])) {
        // diagonal edge = equality
        diff[diffIdx--] = PATCH;
        c--;
        r--;
      }

      if (!d) break;
      pd = d - 1;
      pv = d ? v[d - 1] : [0, 0];
      k = c - r;

      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
        oldCh = oldChildren[oldStart + c];

        if (oldCh.key != null) {
          deleteMap[oldCh.key] = oldStart + c;
        }
      }
    }

    applyDiff(parent, diff, children, oldChildren, newStart, oldStart, deleteMap);
  }

  function applyDiff(parent, diff, children, oldChildren, newStart, oldStart, deleteMap) {
    var ch,
        oldCh,
        node,
        oldMatchIdx,
        moveMap = {};

    for (var i = 0, chIdx = newStart, oldChIdx = oldStart; i < diff.length; i++) {
      var op = diff[i];

      if (op === PATCH) {
        patch(children[chIdx++], oldChildren[oldChIdx++], parent);
      } else if (op === INSERTION) {
        ch = children[chIdx++];
        oldMatchIdx = null;

        if (ch.key != null) {
          oldMatchIdx = deleteMap[ch.key];
        }

        if (oldMatchIdx != null) {
          node = patch(ch, oldChildren[oldMatchIdx]);
          moveMap[ch.key] = oldMatchIdx;
        } else {
          node = mount(ch);
        }

        parent.insertBefore(node, oldChIdx < oldChildren.length ? oldChildren[oldChIdx]._node : null); // @HTMLUpdateOK
      } else if (op === DELETION) {
        oldChIdx++;
      }
    }

    for (i = 0, oldChIdx = oldStart; i < diff.length; i++) {
      var _op = diff[i];

      if (_op === PATCH) {
        oldChIdx++;
      } else if (_op === DELETION) {
        oldCh = oldChildren[oldChIdx++];

        if (oldCh.key == null || moveMap[oldCh.key] == null) {
          parent.removeChild(oldCh._node);
          unmount(oldCh);
        }
      }
    }
  }
  /**
    A simplified implementation of Hunt-Szymanski algorithm
    see "A Fast Algorithm for Computing Longest Common Subsequences"
    http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.608.1614&rep=rep1&type=pdf
    This implementation supposes keys are unique so we only use
    simple object maps to build the match list
  **/


  function diffWithMap(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd) {
    var keymap = {},
        unkeyed = [],
        idxUnkeyed = 0,
        ch,
        oldCh,
        k,
        idxInOld,
        key;
    var newLen = newEnd - newStart + 1;
    var oldLen = oldEnd - oldStart + 1;
    var minLen = Math.min(newLen, oldLen);
    var tresh = Array(minLen + 1);
    tresh[0] = -1;

    for (var i = 1; i < tresh.length; i++) {
      tresh[i] = oldEnd + 1;
    }

    var link = Array(minLen);

    for (i = oldStart; i <= oldEnd; i++) {
      oldCh = oldChildren[i];
      key = oldCh.key;

      if (key != null) {
        keymap[key] = i;
      } else {
        unkeyed.push(i);
      }
    }

    for (i = newStart; i <= newEnd; i++) {
      ch = children[i];
      idxInOld = ch.key == null ? unkeyed[idxUnkeyed++] : keymap[ch.key];

      if (idxInOld != null) {
        k = findK(tresh, idxInOld);

        if (k >= 0) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: i,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = tresh.length - 1;

    while (tresh[k] > oldEnd) {
      k--;
    }

    var ptr = link[k];
    var diff = Array(oldLen + newLen - k);
    var curNewi = newEnd,
        curOldi = oldEnd;
    var d = diff.length - 1;

    while (ptr) {
      var _ptr = ptr,
          newi = _ptr.newi,
          oldi = _ptr.oldi;

      while (curNewi > newi) {
        diff[d--] = INSERTION;
        curNewi--;
      }

      while (curOldi > oldi) {
        diff[d--] = DELETION;
        curOldi--;
      }

      diff[d--] = PATCH;
      curNewi--;
      curOldi--;
      ptr = ptr.prev;
    }

    while (curNewi >= newStart) {
      diff[d--] = INSERTION;
      curNewi--;
    }

    while (curOldi >= oldStart) {
      diff[d--] = DELETION;
      curOldi--;
    }

    applyDiff(parent, diff, children, oldChildren, newStart, oldStart, keymap);
  }

  function findK(ktr, j) {
    var lo = 1;
    var hi = ktr.length - 1;

    while (lo <= hi) {
      var mid = Math.ceil((lo + hi) / 2);
      if (j < ktr[mid]) hi = mid - 1;else lo = mid + 1;
    }

    return lo;
  }

  function indexOf(a, suba, aStart, aEnd, subaStart, subaEnd, eq) {
    var j = subaStart,
        k = -1;
    var subaLen = subaEnd - subaStart + 1;

    while (aStart <= aEnd && aEnd - aStart + 1 >= subaLen) {
      if (eq(a[aStart], suba[j])) {
        if (k < 0) k = aStart;
        j++;
        if (j > subaEnd) return k;
      } else {
        k = -1;
        j = subaStart;
      }

      aStart++;
    }

    return -1;
  }
  /**
   * Determines whether a change in the custom element's slots requires a remount (full re-render)
   * of that custom element
   * @param {any} content
   * @param {any} oldContent
   * @return true if the slot change requires a remount, false otherwise
   * @ignore
   */


  function contentChangeRequiresRemount(content, oldContent) {
    if (content === oldContent) {
      return false;
    } // We are not checking for null/undedined contentt and oldContent
    // because PetitDOM would already 'bomb' in that case (see the patch() method
    // called by patchContent() for the non-array case)


    content = isArray(content) ? content : [content];
    oldContent = isArray(oldContent) ? oldContent : [oldContent];

    if (content.length !== oldContent.length) {
      return true;
    }

    return content.some(function (node, index) {
      var oldNode = oldContent[index];

      if (node.type !== oldNode.type) {
        return true;
      }

      var props = node.props || EMPTYO;
      var oldProps = oldNode.props || EMPTYO;
      return props.slot !== oldProps.slot;
    });
  }

  return {
    h: h,
    mountComponent: mountComponent,
    mountComponentContent: mountComponentContent,
    patchComponent: patchComponent,
    patchComponentContent: patchComponentContent,
    unmount: unmount
  };
}();



/**
 * @ignore
 * @class VComponent
 * @param {Object} props The passed in component properties
 * @ojsignature [{
 *                target: "Type",
 *                value: "class VComponent<S, P>",
 *                genericParameters: [{"name": "S", "description": "Type of the state object"},
 *                                    {"name": "P", "description": "Type of the props object"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "VComponentSettableProperties<S, P>",
 *                for: "SettableProperties"
 *               },
 *               {target: "Type", value: "P", for: "props"}]
 * @constructor
 * @since 8.0.0
 * @ojtsimport {module: "ojmetadata", type: "AMD", importName:"MetadataTypes"}
 *
 * @classdesc The VComponent base class provides a mechanism for defining JET
 * <a href="CompositeOverview.html">Custom Components</a>.
 * Like the JET <a href="ComponentTypeOverview.html#corecomponents">Core Components</a>
 * and composite components, VComponent-based components
 * are exposed as custom elements. From the application developer’s perspective, these
 * custom elements are (essentially) indistinguishable from JET’s other component types.
 * Where VComponents differ is in the component implementation strategy: VComponents produce
 * content via virtual DOM rendering.
 *
 * To create a new VComponent-based custom component, the component author does the following:
 * <ul>
 *   <li>Implements a class that extends VComponent. This class is typically authored in TypeScript.</li>
 *   <li>Overrides the <a href="#render">render()</a> method to return a virtual DOM representation
 *       of the component’s content.</li>
 *   <li>Defines the tag name for the custom element via the static <a href="#tagName">tagName</a> property.</li>
 *   <li>Defines the public contract (properties, methods, events, slots) of the custom element
 *       via the static <a href="#metadata">metadata</a> property.</li>
 *   <li>Registers the class via a call to <a href="#register">VComponent.register()</a>.</li>
 * </ul>
 *
 * Given the above, JET generates an HTMLElement subclass and registers this as a custom
 * element with the browser. These VComponent-based custom elements can then be used anywhere
 * that other JET components are used, and application developers can leverage typical JET
 * functionality such as data binding, property writeback, slotting, etc.
 *
 * A minimal VComponent subclass is shown below:
 * <pre class="prettyprint"><code>
 * declare var define: RequireDefine;
 * // Needed for Babel
 * //** @jsx VComponent.h *&sol;
 * define(['ojs/ojvcomponent', 'text!./component.json', 'ojs/ojavatar'],
 *   function (VComponent, meta) {
 *
 *   class SampleEmployee extends VComponent {
 *     static readonly tagName = 'sample-employee';
 *     static readonly metadata = JSON.parse(meta);
 *
 *     render() {
 *       return (
 *         &lt;SampleEmployee.tagName>
 *           &lt;div>
 *             &lt;oj-avatar initials={this.props.initials} />
 *             &lt;span>{this.props.fullName}&lt;/span>
 *           &lt;/div>
 *         &lt;/SampleEmployee.tagName>
 *       );
 *     }
 *   }
 *   VComponent.register(SampleEmployee)
 *   return SampleEmployee;
 * });
 * </code></pre>
 *
 * <h3 id="render">
 *  Rendering
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#render"></a>
 * </h3>
 * Every VComponent class must provide an implementation of the <a href="#render">render()</a> method.
 * This method returns a tree of virtual DOM nodes that represent the component content,
 * with the root node of the tree representing the component’s own root custom element.
 *
 * Virtual DOM nodes are plain old JavaScript objects that specify the node type
 * (typically the element’s tag name), properties and children. This information is
 * used by the underlying virtual DOM engine to produce live DOM (ie. by calling
 * document.createElement()).
 *
 * Virtual DOM nodes can be created in one of two ways:
 * <ul>
 *   <li>By calling the <a href="#h">VComponent.h()</a> function and passing in the type, properties and children.</li>
 *   <li>Declaratively via TSX (a TypeScript flavor of JSX).</li>
 * </ul>
 *
 * The latter approach is strongly preferred as it results in more readable code. However, this does
 * require a build-time transformation step to convert the TSX markup into VComponent.h() calls.
 *
 * The <a href="#render">render()</a> method will be called whenever component state or properties change to return the new VDOM. The virtual
 * component will then diff the VDOM and patch the live DOM with updates. As custom elements,
 * these virtual components are used in the same way as other JET components, supporting data binding, property writeback,
 * and slotting.
 *
 * <h3 id="jsx">
 *  JSX Syntax
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#jsx"></a>
 * </h3>
 * Virtual component render functions support the use of JSX which is an XML
 * syntax that looks similar to HTML, but supports a different attribute syntax.
 * <h4>JSX Attributes</h4>
 * The virtual component JSX attribute syntax expects the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>
 * property names for all JSX attributes meaning that while the majority of attributes will
 * look similar to their HTML counterparts, there will be some cases where they will differ
 * e.g. className and htmlFor. In cases where an attribute does not have an
 * equivalent property on the HTMLElement (data-, aria-, role, etc), the attribute name
 * should be used. The style attribute is special cased and only supports object values
 * e.g. style={ {color: 'blue', fontSize: '12px'} }. Primitive JSX attribute values can
 * be set directly using the equal operator, or within {...} brackets for JavaScript values
 * e.g. the style example above. The JET
 * <a href="CustomElementOverview.html#ce-databind-syntax-section">data binding syntax</a>
 * using double curly or square brackets is not supported when using JSX.
 *
 * <h4>Root Attributes</h4>
 * In general, we do not recommend modifying core HTML properties on the custom element to
 * avoid overriding application set values. However in cases where this is necessary
 * (e.g. moving or copying attributes for accessibility), authors should register properties
 * they plan to control in an array in the <b>controlledRootProperties</b> key in the component
 * metadata. Any root properties not registered as a controlled property will be ignored.
 * The exceptions are style, className, id properties and event listeners. Event listeners
 * can be added using the on[PropertyName] syntax in the root element within the component's
 * <a href="#render">render()</a> method. These properties do not need to be registered in <b>controlledRootProperties</b>
 * metadata and will be added or removed using the DOM's addEventListener and removeEventListener methods.
 * A unique ID will be made available to all components in this.props so components will not
 * need to register id as a controlled property to access the custom element's value.
 * Components will be notified of changes for properties registered in <b>controlledRootProperties</b>
 * similar to component properties and trigger a rerender. These properties will also be made
 * available in the component's this.props object. Note that unlike component properties
 * which will return the default value in this.props, if a root property is not present in
 * the live DOM, it will not be made available in this.props.
 *
 * <h4>Event Listeners</h4>
 * Event listeners follow a 'on'[EventName] naming syntax e.g.
 * onClick={clickListener} and unlike data bound on-click listeners set on the root
 * custom element, JSX event listeners will only receive a single event parameter.
 * Listener properties can take either the event listener directly or an object with
 * listener and options keys where options is the object that would be passed to the
 * DOM addEventListener method for specifying capture or passive listeners. When passing
 * an object to listener properties, we recommend caching the object in the constructor
 * instead of recreating it on each render call for performance reasons.
 * <pre class="prettyprint"><code>
 * class SampleComponent extends VComponent {
 *   constructor(protected props) {
 *     super(props);
 *     this.touchStartHandler = function (event) {...}.bind(this);
 *     this.touchStartObj = {
 *       listener: this.touchStartHandler,
 *       options: { passive: true }
 *     };
 *   }
 *
 *   render() {
 *     return (
 *       &lt;SampleComponent.tagName>
 *         &lt;div onTouchStart={this.touchStartObj}>
 *           ...
 *         &lt;/div>
 *       &lt;/SampleComponent.tagName>
 *     );
 *   }
 * }
 * </code></pre>
 *
 * <h3 id="updates">
 *  State and Property Updates
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#updates"></a>
 * </h3>
 * Components should never directly modify their own component properties.
 * They should instead call the
 * <a href="#updateProperty">updateProperty(prop, value, shouldRender)</a> method
 * to request a property update. The framework will then schedule the change and
 * a rerender (unless shouldRender is set to false, e.g. if updating the rawValue
 * property) with the new property set.
 *
 * Components may also track internal state that's not reflected through their
 * properties. There is a state mechanism for supporting this. Components
 * should initialize their state objects in their constructors. After that,
 * components should use the
 * <a href="#updateState">updateState</a> or
 * <a href="#updateStateFromProps">updateStateFromProps</a> methods to request a state
 * update. The framework will then schedule the change and rerender the component.
 *
 * <h3 id="defaults">
 *  Dynamic Defaults
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#defaults"></a>
 * </h3>
 * In addition to specifying default values in metadata, VComponents can implement an
 * optional static getDynamicDefaults() method on their component to return an object
 * that has dynamic getters for properties with defaults that can only be determined at
 * runtime or are non-JSON-typed. If a default value for a property is specified in the
 * object returned by getDynamicDefaults(), a default value should not be provided
 * in the metadata. If one is found, the metadata default value will always override
 * the dynamic default value. Note that if the return value is of Object or Array type,
 * we recommend deep freezing the value to prevent modification by the application.
 * <pre class="prettyprint"><code>
 * class SampleComponent extends VComponent {
 *   ...
 *
 *   static getDynamicDefaults() {
 *     return {
 *       get birthDate() {
 *         return new Date('January 1, 1999');
 *       }
 *     }
 *   }
 * }
 * </code></pre>
 *
 * <h3 id="lifecycle">
 *  Lifecycle Methods
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
 * </h3>
 * In addition to the required render method, virtual components have several optional lifecycle
 * methods that give the component hooks to setup global listeners, geometry management, state updates,
 * and cleanup. See the API doc for each lifecycle method for details.
 *
 * <h4>Mount</h4>
 * <ul>
 *   <li><a href="#VComponent">constructor()</a></li>
 *   <li><a href="#updateStateFromProps">updateStateFromProps()</a></li>
 *   <li><a href="#render">render()</a></li>
 *   <li><a href="#mounted">mounted()</a></li>
 *   <li><a href="#postRender">postRender()</a></li>
 * </ul>
 *
 * <h4>Update</h4>
 * <ul>
 *   <li><a href="#updateStateFromProps">updateStateFromProps()</a></li>
 *   <li><a href="#render">render()</a></li>
 *   <li><a href="#postRender">postRender()</a></li>
 * </ul>
 *
 * <h4>Unmount</h4>
 * <ul>
 *   <li><a href="#unmounted">unmounted()</a></li>
 * </ul>
 *
 * <h3 id="slots">
 *  Slotting
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#slots"></a>
 * </h3>
 * Component authors can define where slot content goes by calling the
 * <a href="#slot">slot(slotName, defaultContent)</a> method on the VComponent instance.
 * The slot method returns an array of slot children for the given slot name, which the
 * component author can use to index into for stamping out additional DOM around slot
 * content or to limit the number of slot children for a slot. Unslotted content, e.g. those
 * not matching a slot name, will remain in the DOM, but not be visible.
 * <pre class="prettyprint"><code>
 * render() {
 *   return (
 *     &lt;MyComponent.tagName>
 *       &lt;div style="border-style: solid; width:200px;">
 *         {this.slot('main', <span>Default Content</span>)[this.props.index]}
 *       &lt;/div>
 *     &lt;/MyComponent.tagName>
 *   );
 * }
 * </code></pre>
 *
 * <h3 id="templates">
 *  Inline Templates
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#templates"></a>
 * </h3>
 * Components that wish to support passing special context, e.g. row context for data rows, to an
 * application-provided template, can do so by exposing template slots.
 * Template slot wiring is done automatically when the component does the following in its metadata:
 * <ul>
 *  <li>Expose a slot following the [slotName]Template syntax, e.g. itemTemplate.</li>
 *  <li>Document the <a href="http://jet/trunk/jsdocs/MetadataTypes.html#ComponentMetadataSlots">data</a>
 *    property for the slot, representing the properties available to the template content in the $current property.
 *  <li>Expose a property following the [slotName]Renderer syntax where the slot name should match the one defined
 *    for the [slotName]Template, e.g. itemRenderer.</li>
 *  <li>The application can provide either a function via the [slotName]Renderer property (preferred for performance)
 *   or a template with the [slotName]Template slot name. If the application provides a <code>&lt;template></code> element
 *   matching the template slot name, the VComponent will be passed a renderer in the corresponding this.props.[slotName]Renderer property.
 *   If both a template and renderer are specified, the template will take precedence.</li>
 *  <li>The component should call the [slotName]Renderer in its render() method passing it an object with the properties
 *   defined in the slot's data metadata property to get its slot content.</li>
 * </ul>
 * <pre class="prettyprint"><code>
 * &lt;sample-collection>
 *   &lt;template slot="itemTemplate">
 *     &lt;div>
 *      &lt;oj-bind-text value="[[$current.value]]">&lt;/oj-bind-text>
 *     &lt;/div>
 *   &lt;/template>
 * &lt;/sample-collection>
 * </code></pre>
 * <pre class="prettyprint"><code>
 * class SampleCollection extends VComponent {
 *   ...
 *   static readonly metadata = {
 *     "properties": {
 *       "itemRenderer": {
 *         "type": "Function"
 *         ...
 *       }
 *     },
 *     ...
 *     "slots": {
 *        "itemTemplate": {
 *          "description": "The itemTemplate slot is used to specify the template for rendering each item in the list.",
 *          "data": {
 *            "value": {
 *              "description": "The value from the stamped out data row.",
 *              "type": "string"
 *            }
 *          }
 *        }
 *     }
 *   }
 *
 *   render() {
 *     const fetchedData = this.state.fetchedData;
 *     const templateRenderer = this.props.itemRenderer;
 *     if (!templateRenderer) {
 *       return this._defaultRenderer(data);
 *     }
 *     return (
 *       &lt;SampleCollection.tagName>
 *         &lt;div>
 *           { data.map(row => { return <p>{templateRenderer({ value: row.value })}</p>; }) }
 *         &lt;/div>
 *       &lt;/SampleCollection.tagName>
 *     );
 *   }
 * }
 * </code></pre>
 *
 * <h3 id="perf">
 *  Performance Considerations
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf"></a>
 * </h3>
 * Every time a component's render function is called, everything contained is created anew.
 * As a result, complex properties (e.g. non-primitive values like Object types, event listeners),
 * should be created outside of the render function's scope. Otherwise, e.g. the component would
 * be specifying a different instance of an event listener each time the component is rendered
 * which would result in unnecessary DOM changes. Event listeners should be bound in the constructor
 * and just referred to in the render function.  Non-primitive values should be saved in variables
 * outside of the render function.
 * <pre class="prettyprint"><code>
 * class MyComponent extends VComponent {
 *   constructor(protected props) {
 *     super(props);
 *     this._handleClick = this._handleClick.bind(this);
 *   }
 *
 *   _handleClick(event) {...}
 *
 *   render() {
 *     return (
 *       &lt;MyComponent.tagName>
 *         &lt;div onClick={this._handleClick}/>
 *       &lt;/MyComponent.tagName>);
 *   }
 * }
 * </code></pre>
 */
// TYPEDEFS

/**
 * @typedef {Object} VComponent.VNode
 * @property {string} type The tagName of the element
 * @property {any?} key Identifier used to track the virtual node on the next patch
 * @property {Object} props The properties to render into the DOM
 * @property {Array<VComponent.VNode>|Array<Node>} content The child content of the virtual node
 *   which could be an array of virtual nodes or an array of DOM nodes if the content is application
 *   passed slot content
 * @ojsignature [{target: "Type", value: "{ [key: string]: any }", for: "props"}]
 */
// STATIC PROPERTIES

/**
 * The component metadata describing its properties, methods, slots, and events. See the
 * typedef for the full description of metadata keys.
 * @name metadata
 * @memberof VComponent
 * @type {Object}
 * @default undefined
 * @ojsignature [{target: "Type", value: "MetadataTypes.ComponentMetadata"}]
 * @expose
 */

/**
 * The custom element tag name that the virtual component will be registered with in the DOM.
 * A correctly namespaced value must be provided.
 * @name tagName
 * @memberof VComponent
 * @type {string}
 * @default undefined
 * @expose
 */
// STATIC METHODS

/**
 * Creates a virtual node for an HTML element of the given type, props, and children.
 * @function h
 * @memberof VComponent
 * @param {string} type An HTML or SVG tag name
 * @param {Object} props The properties to set in the real DOM node
 * @param {...Object} ...children Optional child DOM
 * @ojsignature [{target: "Type", value: "P", for: "props"},
 *               {target: "Type", value: "VComponent.VNode", for: "children"},
 *               {target: "Type", value: "VComponent.VNode", for: "returns"}]
 * @return {void}
 * @expose
 */

/**
 * Registers the given VComponent constructor as a custom element. The component
 * should implement the static tagName and metadata properties.
 * @function register
 * @memberof VComponent
 * @param {Function} constr The VComponent constructor to register
 * @return {void}
 * @ojsignature [{target: "Type", value: "Function<VComponent>", for: "constr"}]
 * @expose
 */

/**
 * An optional method that can return an object with non JSON compatible default values or
 * getters for properties with dynamic default values, e.g. theme dependent properties.
 * If a default for a property is also found in metadata, the dynamic value will be ignored.
 * @function getDynamicDefaults
 * @return {Object|null}
 * @ojsignature [{target: "Type", value: "{ [key: string]: any } | null", for: "returns"}]
 * @memberof VComponent
 * @expose
 */
// INSTANCE PROPERTIES

/**
 * The passed in component properties. This property should not be directly modified e.g.
 * this.props = {} or this.props.someProp = 'foo'. Internal updates for writeback properties
 * should be done through the updateProperty method.
 * @name props
 * @memberof VComponent
 * @type {Object}
 * @default {}
 * @ojsignature [{target: "Type", value: "P"}]
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * The component state. State updates should be done through the updateState or updateStateFromProps methods
 * and not by direct modification of this property in order to ensure that the component
 * is rerendered.
 * @expose
 * @name state
 * @memberof VComponent
 * @type {Object}
 * @default {}
 * @ojsignature [{target: "Type", value: "S"}]
 * @ojprotected
 * @instance
 */
// INSTANCE METHODS

/**
 * An optional lifecycle method called before the render method with the new props.
 * Components should return the new state object or null if no changes are needed.
 * @function updateStateFromProps
 * @param {Object} props The new component properties
 * @return {Object|nul}
 * @ojsignature [{target: "Type", value: "P", for: "props"},
 *              {target: "Type", value: "S|null", for: "returns"}]
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * Required lifecycle method which returns the component's virtual subtree.
 * @function render
 * @return {void}
 *
 * @memberof VComponent
 * @ojprotected
 * @abstract
 * @instance
 * @expose
 */

/**
 * An optional lifecycle method called after the
 * virtual component has been initially rendered and inserted into the
 * DOM. Data fetches and global listeners can be added here.
 * This will not be called for reparenting cases.
 * @function mounted
 * @return {void}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * An optional component lifecycle method called after the
 * virtual component has been removed from the DOM. This will not
 * be called for reparenting cases. Global listener cleanup can
 * be done here.
 * @function unmounted
 * @return {void}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * An optional component lifecycle method called after the
 * render method when all changes have been propagated to the DOM.
 * Additional DOM manipulation can be done here. This method is called
 * after component instantiation in addition to component updates.
 * @function postRender
 * @return {void}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * Dispatches a CustomEvent with the given type and detail field.
 * @function fireAction
 * @param {string} type The action type
 * @param {Object} detail The detail object that would get passed to an event's detail property
 * @return {void}
 * @ojsignature [{target: "Type", value: "{ [key: string]: any }", for: "detail"}]
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * Returns either the slotted live DOM nodes for the given slot or the virtual children
 * representing the default content for that slot. The default slot should be referenced
 * using the empty string ('').
 * @function slot
 * @param {string} slotName The name of the slot to look up
 * @param {Array<VComponent.VNode>} defaultContent The backup content for a slot in the case no slot children are provided.
 * @return {Array<VComponent.VNode|Node>}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * Returns either the passed id or a unique string that can be used for
 * a prefix on child elements. This method can only be called after the VComponent
 * has been instantiated and will return undefined if called from the constructor.
 * @function uniqueId
 * @return {string}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * Updates an internal component state. State updates always trigger an asynchronous rerender.
 * @function updateState
 * @param {string} state The name of the state property
 * @param {any} value The new state property value
 * @return {void}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */

/**
 * Updates a writeback component property. The shouldRender flag allows the component
 * to decided whether an asynchronous rerender should be queued, e.g. rawValue update may want
 * to skip rerender.
 * @function updateProperty
 * @param {string} prop The name of the property
 * @param {any} value The new property value
 * @param {boolean} [shouldRender = true] True if the property update should trigger a rerender
 * @return {void}
 *
 * @memberof VComponent
 * @ojprotected
 * @instance
 * @expose
 */


VComponent.h = PetitDom.h;
return VComponent;
});