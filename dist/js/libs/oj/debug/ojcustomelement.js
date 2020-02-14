/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'require', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojmetadatautils', 'customElements'],
  function(oj, require, Logger, Context, MetadataUtils)
{
  "use strict";

/* global Promise:false, Set:false, Logger:false, Context:false */

/**
 * Custom element bridge prototype.
 *
 * @class
 * @ignore
 */
oj.BaseCustomElementBridge = {};

/**
 * Prototype for subclasses
 * @ignore
 */
oj.BaseCustomElementBridge.proto =
{
  getClass: function (descriptor) {
    var proto = Object.create(HTMLElement.prototype);
    this.InitializePrototype(proto);

    var metadata = this.GetMetadata(descriptor);
    // Enumerate metadata to define the prototype properties, methods, and events
    oj.BaseCustomElementBridge._enumerateMetadataForKey(proto, metadata, 'properties', this.DefinePropertyCallback.bind(this));
    oj.BaseCustomElementBridge._enumerateMetadataForKey(proto, metadata, 'methods', this.DefineMethodCallback.bind(this));

    // Add additional element methods not defined in metadata, e.g. getNodeBySubId/getSubIdByNode or get/setProperty
    this.AddComponentMethods(proto);

    proto.setProperties = function (props) {
      oj.BaseCustomElementBridge.getInstance(this)._setProperties(this, props);
    };

    // The set/unset methods are used for TypeScript only so we should define these as non enumerated properties
    Object.defineProperty(proto, 'set', { value: function (prop, value) { this.setProperty(prop, value); } });
    Object.defineProperty(proto, 'unset', { value: function (prop) { this.setProperty(prop, undefined); } });

    // Add lifecycle listeners
    proto.attributeChangedCallback = this.AttributeChangedCallback;
    proto.connectedCallback = this._connectedCallback;
    proto.disconnectedCallback = this._detachedCallback;

    var constructorFunc = function () {
      var reflect = window.Reflect;
      var ret;
      if (typeof reflect !== 'undefined') {
        ret = reflect.construct(HTMLElement, [], this.constructor);
      } else {
        ret = HTMLElement.call(this);
      }
      return ret;
    };

    var bridge = this;
    Object.defineProperty(constructorFunc, 'observedAttributes',
      {
        get: function () {
          return bridge.GetAttributes(metadata);
        }
      });

    Object.defineProperty(proto, 'constructor', { value: constructorFunc, writable: true, configurable: true });
    constructorFunc.prototype = proto;
    Object.setPrototypeOf(constructorFunc, HTMLElement);

    return constructorFunc;
  },

  playbackEarlyPropertySets: function (element) {
    this._bCanSetProperty = true;
    this.PlaybackEarlyPropertySets(element);
  },

  resolveBindingProvider: function (provider) {
    if (this._bpResolve) {
      this._bpResolve(provider);
    } else {
      this._bpInst = provider;
    }
  },

  disposeBindingProvider: function (element) {
    this._bDisposed = true;
    if (!this._complete && this._bConnected) {
      // The creation busy state is normally resolved upon component creation.
      // In the event that a component is disposed or disconnected before
      // creation, the busy state will be resolved by the first of the
      // disposal or disconnected callbacks that gets invoked.
      this._resolveBusyState(element);
    }
  },

  resolveDelayedReadyPromise: function () {
    this.GetDelayedReadyPromise().resolvePromise();
  },

  whenCreated: function () {
    return this._whenCreatedPromise;
  },

  // eslint-disable-next-line no-unused-vars
  AddComponentMethods: function (proto) {},

  AttributeChangedCallback: function (attr, oldValue, newValue) {
    // The browser triggers this callback even if old and new values are the same
    // so we should do an equality check ourselves to prevent extra work
    if (oldValue !== newValue) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);

      // Due to  where IE11 disables child inputs for a parent with the disabled attribute,
      // we will remove the disabled attribute after we save the value and will ignore all disabled
      // attribute sets after component initialization when the application can just as easily use the property
      // setter instead. Expressions will be handled in the CustomElementBinding.
      if (attr === 'disabled' && bridge.ShouldRemoveDisabled() && bridge._isDisabledAttributeRemoved()) {
        // Always remove the disabled attribute even after component initialization and log warning.
        // A null value indicates that the value was removed already.
        if (newValue != null) {
          Logger.warn("Ignoring 'disabled' attribute change after component initialization. Use element property setter instead.");
          bridge._removeDisabledAttribute(this);
        }
        return;
      }

      if (bridge.ShouldHandleAttributeChanged(this)) {
        var prop = oj.__AttributeUtils.attributeToPropertyName(attr);
        var propMeta = oj.BaseCustomElementBridge
            .__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(bridge));

        oj.BaseCustomElementBridge.__CheckOverlappingAttribute(this, attr);

        // removeAttribute calls return null as the newValue which we want to treat as
        // a property unset and convert to undefined. We allow property null sets as an
        // actual property override.
        if (newValue === null) {
          // eslint-disable-next-line no-param-reassign
          newValue = undefined;
        }

        var params = {
          detail: { attribute: attr, value: newValue, previousValue: oldValue }
        };
        this.dispatchEvent(new CustomEvent('attribute-changed', params));

        var expression = oj.__AttributeUtils.getExpressionInfo(newValue).expr;
        if (!expression) {
          if (propMeta) {
            this.setProperty(prop, oj.BaseCustomElementBridge.__ParseAttrValue(this, attr,
                                                                              prop, newValue,
                                                                              propMeta));
          }
          // This allows subclasses to handle special cases like global transfer
          // attributes for JET components or controlled properties for virtual components
          bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
        }
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  CreateComponent: function (element) {},

  // eslint-disable-next-line no-unused-vars
  DefineMethodCallback: function (proto, method, methodMeta) {},

  // eslint-disable-next-line no-unused-vars
  DefinePropertyCallback: function (proto, property, propertyMeta) {},

  /**
   * Returns a promise that will be resolved when the component has been initialized.
   * @return {Promise}
   */
  GetDelayedReadyPromise: function () {
    if (!this._delayedReady) {
      this._delayedReady = new oj.BaseCustomElementBridge.__DelayedPromise();
    }
    return this._delayedReady;
  },

  GetAttributes: function (metadata) {
    return oj.BaseCustomElementBridge.getAttributes(metadata.properties);
  },

  GetMetadata: function (descriptor) {
    return descriptor[oj.BaseCustomElementBridge.DESC_KEY_META];
  },

  /**
   * Returns the aliased component property for a given custom element property,
   * e.g. readOnly for oj-switch's readonly custom element property.
   * Will return the original property if there is no aliasing.
   * @param {string} property The property to check
   */
  GetAliasForProperty: function (property) {
    return property;
  },

  GetTrackChildrenOption: function () {
    return this.METADATA.extension && this.METADATA.extension._TRACK_CHILDREN ?
      this.METADATA.extension._TRACK_CHILDREN : 'none';
  },

  /**
   * Tests whether attribute changed processing should be performed.
   */
  // eslint-disable-next-line no-unused-vars
  ShouldHandleAttributeChanged: function (element) {
    return this._bCreateCalled;
  },

  /**
   * Tests whether the HandleAttributeChanged callback should be called.
   * This is only needed in the VirtualElementBridge case when a VComponent
   * is patching and updates a controlled property on the root element which we
   * want to update our internal _CONTROLLED_PROPS object with, but not cause a
   * rerender.
   */
  // eslint-disable-next-line no-unused-vars
  ShouldCallHandleAttributeChanged: function (element) {
    return this.ShouldHandleAttributeChanged();
  },


  // eslint-disable-next-line no-unused-vars
  HandleAttributeChanged: function (element, attr, oldValue, newValue) {},

  // eslint-disable-next-line no-unused-vars
  HandleBindingsApplied: function (element, bindingContext) {},

  // eslint-disable-next-line no-unused-vars
  HandleDetached: function (element) {},

  // eslint-disable-next-line no-unused-vars
  HandleReattached: function (element) {},

  // eslint-disable-next-line no-unused-vars
  InitializeElement: function (element) {},

  // eslint-disable-next-line no-unused-vars
  InitializePrototype: function (proto) {},

  BatchedPropertySet: function (elem, props) {
    var keys = Object.keys(props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      elem.setProperty(key, props[key]);
    }
  },

  GetEventListenerProperty: function (property) {
    var event = oj.__AttributeUtils.eventListenerPropertyToEventType(property);
    // Get event listener
    var eventListener = this._eventListeners[event];
    if (eventListener) {
      return eventListener.getListener();
    }
    return undefined;
  },

  GetProperty: function (element, prop, props) {
    var event = oj.__AttributeUtils.eventListenerPropertyToEventType(prop);
    var meta = oj.BaseCustomElementBridge
        .__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(this));

    // For event listener and non component properties, retrieve the value directly stored on the element.
    // For top level properties, this will delegate to our 'set' methods so we can handle default values.
    // props is the properties object we pass the definitional element or composite ViewModel
    if (event || !meta || prop.indexOf('.') === -1) {
      return props[prop];
    }
    return oj.BaseCustomElementBridge.__GetProperty(props, prop);
  },

  InitializeBridge: function (element, descriptor) {
    // Initialize property storage and other variables needed for property sets.
    // Since early property sets can occur before the element's connected callback
    // is triggered we can't rely on performing this logic there. The cases where
    // the connected callback isn't called before a property set can occur if the
    // custom element is programatically created and sets are done before adding
    // the element to the DOM or if the element is stamped by knockout and its expressions
    // processed disconnected as in the case for oj-bind-for-each.
    this.METADATA = this.GetMetadata(descriptor);
    this._eventListeners = {};
  },

  PlaybackEarlyPropertySets: function (element) {
    if (this._earlySets) {
      while (this._earlySets.length) {
        var setObj = this._earlySets.shift();
        element.setProperty(setObj.property, setObj.value);
      }
    }
  },

  /**
   * Returns true if this property set was handled as an early property set.
   * An early property set is any set that occurs before the component is created.
   * These sets do not trigger [property]Changed events.
   * @param {string} prop
   * @param {any} value
   * @return {boolean}
   */
  SaveEarlyPropertySet: function (prop, value) {
    // Do not save sets that occur during oj.BaseCustomElementBridge.__InitProperties
    // or expression evaluation. We can process these as normal. Playback occurs before the
    // binding provider promise is resolved leading to component creation.
    if (this.__INITIALIZING_PROPS || this._bCanSetProperty) {
      return false;
    }

    if (!this._earlySets) {
      this._earlySets = [];
    }

    this._earlySets.push({ property: prop, value: value });
    return true;
  },

  SetEventListenerProperty: function (element, property, value) {
    var event = oj.__AttributeUtils.eventListenerPropertyToEventType(property);
    // Get event listener
    var eventListener = this._eventListeners[event];
    if (!eventListener) {
      // Create the wrapper
      eventListener = this._createEventListenerWrapper();
      this._eventListeners[event] = eventListener;
      element.addEventListener(event, eventListener);
    }
    if (value == null || value instanceof Function) {
      eventListener.setListener(value);
    } else {
      oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, 'function');
    }
  },

  SetProperty: function (element, prop, value, props, bOuter) {
    // Check value against any defined enums
    var event = oj.__AttributeUtils.eventListenerPropertyToEventType(prop);
    var meta = oj.BaseCustomElementBridge
        .__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(this));
    if (event || !meta) {
      // eslint-disable-next-line no-param-reassign
      element[prop] = value;
    } else {
      // props is the properties object we pass the definitional element or composite ViewModel
      var previousValue = element.getProperty(prop);
      var propPath = prop.split('.');
      var topProp = propPath[0];
      // If the top level property is an object, make a copy otherwise the old/new values
      // will be the same.
      var topPropPrevValue = props[topProp];
      if (oj.CollectionUtils.isPlainObject(topPropPrevValue)) {
        topPropPrevValue = oj.CollectionUtils.copyInto({}, topPropPrevValue, undefined, true);
      }

      if (!oj.BaseCustomElementBridge.__CompareOptionValues(prop, meta, value, previousValue)) {
        var isSubprop = prop.indexOf('.') !== -1;
        if (isSubprop) {
          // Set a flag for the case a subproperty results in a set of the top level property
          // which was not instantiated to an empty object to avoid firing two events.
          this._SKIP_PROP_CHANGE_EVENT = true;
        }

        if (bOuter) {
          // This ultimately triggers our element defined property setter
          this.ValidateAndSetProperty(this.GetAliasForProperty.bind(this),
                                      props, prop, value, element);
        } else {
          // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
          oj.BaseCustomElementBridge.__SetProperty(this.GetAliasForProperty.bind(this),
                                                   props, prop, value);
        }

        this._SKIP_PROP_CHANGE_EVENT = false;
        // Property change events for top level properties will be triggered by ValidateAndSetProperty so avoid firing twice
        if (isSubprop) {
          var subprop = {};
          subprop.path = prop;
          subprop.value = value;
          subprop.previousValue = previousValue;
          // Pass the top level property value/previousValues
          var updatedFrom = bOuter ? 'external' : 'internal';
          oj.BaseCustomElementBridge.__FirePropertyChangeEvent(element, topProp, props[topProp],
                                                               topPropPrevValue, updatedFrom,
                                                               subprop);
        }
        return { property: topProp, propertySet: true, isSubproperty: isSubprop };
      }
    }
    // We return true if a component property is updated with a different value and false
    // for other cases like on[Event] property updates
    return { property: null, propertySet: false, isSubproperty: false };
  },

  ShouldRemoveDisabled: function () {
    // Subclasses should override if the disabled attribute shouldn't be unconditionally removed
    // from the DOM, e.g. definitional and composite components
    return true;
  },

  ValidateAndSetProperty: function (propNameFun, componentProps, property, value, element) {
    var _value = this.ValidatePropertySet(element, property, value);
    oj.BaseCustomElementBridge.__SetProperty(propNameFun, componentProps, property, _value);
  },

  ValidatePropertySet: function (element, property, value) {
    var propsMeta = oj.BaseCustomElementBridge.getProperties(this);
    var propMeta = oj.BaseCustomElementBridge.__GetPropertyMetadata(property, propsMeta);
    var propAr = property.split('.');

    if (!propMeta) {
      Logger.warn(oj.BaseCustomElementBridge.getElementInfo(element) + ": Ignoring property set for undefined property '" + property + "'.");
      return undefined;
    }

    // Check readOnly property for top level property
    if (propsMeta[propAr[0]].readOnly) {
      this.throwError(element, "Read-only property '" + property + "' cannot be set.");
    }

    oj.BaseCustomElementBridge.checkEnumValues(element, property, value, propMeta);

    // TODO support checking for null values once we generate metadata from jsDoc and have accurate info
    // about component support for undefined/null
    if (value != null) {
      return oj.BaseCustomElementBridge.checkType(element, property, value, propMeta);
    }

    return value;
  },

  GetPreCreatePromise: function (element) {
    var preCreatePromise = this._getBindingProvider(element);
    var trackOption = oj.BaseCustomElementBridge.getTrackChildrenOption(element);
    if (trackOption !== 'none') {
      // this will return a promise that will get automatically chained to the binding provider promise
      preCreatePromise = preCreatePromise.then(function () {
        return this._whenChildrenCreated(element);
      }.bind(this));
    }
    return preCreatePromise;
  },

  PostCreate: function (element) {
    // After parsing the DOM attribute values and initializing properties, remove the disabled
    // property if it exists due to 
    if (element.hasAttribute('disabled') && this.ShouldRemoveDisabled() && !this._isDisabledAttributeRemoved()) {
      this._removeDisabledAttribute(element);
    }
  },

  _connected: function (element) {
    this._bConnected = true;
    if (!this._bCreateCalled) { // initial attach
      this._bCreateCalled = true;

      this._registerBusyState(element);

      this._monitorReadyPromise(element);

      this.InitializeElement(element);

      var self = this;

      var createComponentCallback = function () {
        try {
          // Short circuit component creation if disposed.
          // The state of the various flags are being reset here, but that's
          // not critical because attempting to reconnect a disposed node
          // is an invalid use case.
          //
          // The create flag is reset here.  Busy states will have been
          // resolved in the disposal (or disconnect) callback.
          if (!self._bDisposed) {
            self.CreateComponent(element);
            self.PostCreate(element);
          } else {
            // Reset the create flag
            self._bCreateCalled = false;
          }
        } catch (ex) {
          // If an error occurs during component creation, resolve the busy context and throw an error.
          self.throwError(element, 'Error while rendering component. ' + ex);
        }
      };

      this._whenCreatedPromise = this.GetPreCreatePromise(element).then(createComponentCallback);
    } else if (!this._complete) {
      // If the component had been previously disconnected, and the 'ready'
      // promise is still not resolved, we need to re-register the busy state
      this._registerBusyState(element);
    } else {
      this.HandleReattached(element);
    }
  },

  _connectedCallback: function () {
    var bridge = oj.BaseCustomElementBridge.getInstance(this);
    bridge._connected(this);
  },

  _detachedCallback: function () {
    var bridge = oj.BaseCustomElementBridge.getInstance(this);
    bridge._bConnected = false;
    if (!bridge._complete) {
      if (!bridge._bDisposed) {
        // The creation busy state is normally resolved upon component creation.
        // In the event that a component is disposed or disconnected before
        // creation, the busy state will be resolved by the first of the
        // disposal or disconnected callbacks that gets invoked.
        bridge._resolveBusyState(this);
      }
    } else {
      bridge.HandleDetached(this);
    }
  },

  // This wrapper does not provide any additional functionality to event listener functions
  // It exists solely to preserve event listener order
  _createEventListenerWrapper: function () {
    var eventListener;
    var domListener = function (event) {
      if (eventListener) {
        eventListener(event);
      }
    };
    domListener.setListener = function (listener) {
      eventListener = listener;
    };
    domListener.getListener = function () {
      return eventListener;
    };
    return domListener;
  },

  _monitorReadyPromise: function (element) {
    var self = this;

    var completeHandler = function () {
      // If the component is disconnected, the busy state
      // must be already resolved
      if (!self._complete && self._bConnected) {
        self._resolveBusyState(element);
        self._complete = true;
      }
    };

    this.GetDelayedReadyPromise().getPromise().then(
      function () {
        // Add marker class to unhide components
        element.classList.add('oj-complete');
        completeHandler();
      },
      function () {
        // Add marker class to mark that there was an error duing upgrade so consumers like
        // VBCS can apply their own styling to incorrectly setup custom elements.
        element.classList.add('oj-incomplete');
        completeHandler();
      }
    );
  },

  _registerBusyState: function (element) {
    var busyContext = Context.getContext(element).getBusyContext();
    this._initCompleteCallback = busyContext.addBusyState({ description: oj.BaseCustomElementBridge.getElementInfo(element) + ' is being upgraded.' });
  },

  _resolveBusyState: function (element) {
    var callback = this._initCompleteCallback;
    if (!callback) {
      this.throwError(element, 'Unexpected call to _resolveBusyState().');
    }

    this._initCompleteCallback = null;
    callback();
  },

  _setProperties: function (elem, props) {
    var mutationKeys = []; // keys for the 'dot mutation' properties
    var regularProps = {}; // the rest of the properties
    var hasRegularProps = false;

    var keys = Object.keys(props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key.indexOf('.') >= 0) {
        mutationKeys.push(key);
      } else {
        regularProps[key] = props[key];
        hasRegularProps = true;
      }
    }

    // Regular property updates may be batched
    if (hasRegularProps) {
      this.BatchedPropertySet(elem, regularProps);
    }

    // 'Dot notation' properties can only be set individually for now
    for (var p = 0; p < mutationKeys.length; p++) {
      var mkey = mutationKeys[p];
      elem.setProperty(mkey, props[mkey]);
    }
  },

  throwError: function (elem, msg) {
    this.GetDelayedReadyPromise().rejectPromise();
    throw new Error(oj.BaseCustomElementBridge.getElementInfo(elem) + ': ' + msg);
  },

  _setBpResolver: function (resolve) {
    this._bpResolve = resolve;
  },

  _getBindingProvider: function (element) {
    var name = this._getBindingProviderName(element);

    if (name === oj.BaseCustomElementBridge._NO_BINDING_PROVIDER) {
      this.playbackEarlyPropertySets(element);

      return Promise.resolve(null);
    } else if (name === 'knockout') {
      if (this._bpInst) {
        return Promise.resolve(this._bpInst);
      }

      return new Promise(this._setBpResolver.bind(this));
    }

    this.throwError(element, "Unknown binding provider '" + name + "'.");
    return undefined; // not reachable but eslint is too stupid to figure that out.
  },

  _getBindingProviderName: function (element) {
    var cachedProp = '_ojBndgPrv';

    var name = element[cachedProp];
    if (name) {
      return name;
    }

    name = element.getAttribute('data-oj-binding-provider') ||
                oj.BaseCustomElementBridge._getCompositeBindingProviderName(element);

    if (!name) {
      var parent = element.parentElement;
      if (parent == null) {
        if (element === document.documentElement) {
          name = 'knockout'; // the default
        } else {
          this.throwError(element, 'Cannot determine binding provider for a disconnected subtree.');
        }
      } else if (parent._vcomp) {
        // Content rendered by a VComponent parent does not get processed
        // by any binding provider.
        name = oj.BaseCustomElementBridge._NO_BINDING_PROVIDER;
      } else {
        name = this._getBindingProviderName(parent);
      }
    }
    // cache provider name as a non-enumerable property
    Object.defineProperty(element, cachedProp, { value: name });

    return name;
  },

  // used by _whenChildrenCreated() call - called for trackOption "immediate" or "nearestCustomElement"
  _getChildrenToTrack: function (element, trackOption, trackedElements) {
    var children = element.childNodes;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (oj.ElementUtils.isValidCustomElementName(child.localName)) {
        trackedElements.push(child);
      } else if (trackOption === 'nearestCustomElement') {
        this._getChildrenToTrack(child, trackOption, trackedElements);
      }
    }
    return trackedElements;
  },

  // tracks upgrade and creation of relevant children for the element
  _whenChildrenCreated: function (element) {
    var _UPGRADE_MESSAGE_INTERVAL = 20000;
    var trackOption = oj.BaseCustomElementBridge.getTrackChildrenOption(element);
    var busyContext = Context.getContext(element).getBusyContext();
    var trackedElements = this._getChildrenToTrack(element, trackOption, []);

    // map tracked elements to promises
    var promises = trackedElements.map(function (trackedElement) {
      // register busy state for the element
      var resolveElementDefinedBusyState = busyContext.addBusyState({ description: 'Waiting for element ' + trackedElement.localName + ' to be defined.' });

      // setup a timer to log 'waiting' message for an element
      var timer = setInterval(function () {
        Logger.warn('Warning: waiting for element ' + trackedElement.localName + ' to be defined.');
      }, _UPGRADE_MESSAGE_INTERVAL);

      // return a promise that will be resolved, when element is defined and created
      return customElements
              .whenDefined(trackedElement.localName)
              .then(function () {
                resolveElementDefinedBusyState();
                clearInterval(timer);
                if (oj.BaseCustomElementBridge.getRegistered(trackedElement.tagName)) {
                  return oj.BaseCustomElementBridge.getInstance(trackedElement).whenCreated();
                }
                return null;
              })
              .catch(function (error) {
                resolveElementDefinedBusyState();
                clearInterval(timer);
                throw new Error('Error defining element ' + trackedElement.localName + ' : ' + error);
              });
    });
    return Promise.all(promises);
  },

  /**
   * Returns true if the disabled attribute has already been removed by the bridge.
   * @return  {boolean}
   * @private
   */
  _isDisabledAttributeRemoved: function () {
    return this._disabledProcessed === true;
  },

  /**
   * Removes the disabled attribute from an element and marks the bridge as having
   * processed the value to prevent evaluation of additional attribute sets.
   * @param  {Element} element The custom element
   * @private
   */
  _removeDisabledAttribute: function (element) {
    this._disabledProcessed = true;
    element.removeAttribute('disabled');
  }

};

/** ***********************/
/* PUBLIC STATIC METHODS */
/** ***********************/

/**
 * Returns the attributes including the dot notation versions of all complex properties
 * not including readOnly properties.
 * @param {Object} props The properties object
 * @return {Array}
 * @ignore
 */
oj.BaseCustomElementBridge.getAttributes = function (props) {
  var attrs = [];
  oj.BaseCustomElementBridge._getAttributesFromProperties('', props, attrs);
  return attrs;
};

/**
 * Returns track children option for the element - 'none', 'immediate' or 'nearestCustomElement'
 * @param {Element} element Custom element
 * @return {String}
 * @ignore
 */
oj.BaseCustomElementBridge.getTrackChildrenOption = function (element) {
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  return bridge ? bridge.GetTrackChildrenOption() : 'none';
};

/**
 * Helper method for Returns the attributes including the dot notation versions of all complex attributes
 * stored on a bridge instance
 * @param {string} propName The property to evaluate
 * @param {Object} props The properties object
 * @param {Array} attrs The attribute array to add to
 * @ignore
 */
oj.BaseCustomElementBridge._getAttributesFromProperties = function (propName, props, attrs) {
  if (props) {
    var propKeys = Object.keys(props);
    for (var i = 0; i < propKeys.length; i++) {
      var prop = propKeys[i];
      var propMeta = props[prop];
      if (!propMeta.readOnly) {
        var concatName = propName + prop;
        attrs.push(oj.__AttributeUtils.propertyNameToAttribute(concatName));
        if (propMeta.properties) {
          oj.BaseCustomElementBridge._getAttributesFromProperties(concatName + '.', propMeta.properties, attrs);
        }
      }
    }
  }
};

/**
 * Returns a string including the element tag name and id for use in error messages and logging.
 * @param {Element} element The element to get the information for.
 * @return {string}
 * @ignore
 */
oj.BaseCustomElementBridge.getElementInfo = function (element) {
  if (element) {
    return element.tagName.toLowerCase() + " with id '" + element.id + "'";
  }
  return '';
};

/**
 * Returns the bridge instance for an element.
 * @ignore
 */
oj.BaseCustomElementBridge.getInstance = function (element) {
  var instance = element[oj.BaseCustomElementBridge._INSTANCE_KEY];
  if (!instance) {
    var info = oj.BaseCustomElementBridge._registry[element.tagName.toLowerCase()];
    if (!info) {
      Logger.error(oj.BaseCustomElementBridge.getElementInfo(element) + ' Attempt to interact with the custom element before it has been registered.');
    }

    instance = Object.create(info.bridgeProto);
    var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);
    instance.InitializeBridge(element, descriptor);
    Object.defineProperty(element, oj.BaseCustomElementBridge._INSTANCE_KEY, { value: instance });
  }

  return instance;
};

/**
 * Returns the properties stored on a bridge instance
 * @param  {Object} bridge The bridge instance
 * @return {Object}
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
oj.BaseCustomElementBridge.getProperties = function (bridge) {
  return bridge.METADATA.properties;
};

/**
 * Returns an object if JET component tag has been registered, null otherwise.
 * @param  {string}  tagName The tag name to look up
 * @return {Object|null} True if the component module has been loaded and registered
 * @ignore
 */
oj.BaseCustomElementBridge.getRegistered = function (tagName) {
  if (tagName) {
    var info = oj.BaseCustomElementBridge._registry[tagName.toLowerCase()];
    if (info) {
      return { composite: info.composite };
    }
  }

  return null;
};

/**
 * Returns the slot map of slot name to slotted child elements for a given custom element.
 * If the given element has no children, this method returns an empty object.
 * Note that the default slot name is mapped to the empty string.
 * @param  {Element} element The custom element
 * @return {Object} A map of the child elements for a given custom element.
 * @ignore
 */
oj.BaseCustomElementBridge.getSlotMap = function (element) {
  var slotMap = {};
  var childNodeList = element.childNodes;
  for (var i = 0; i < childNodeList.length; i++) {
    var child = childNodeList[i];
    // Only assign Text and Element nodes to a slot
    if (oj.BaseCustomElementBridge.isSlotable(child)) {
      var slot = oj.BaseCustomElementBridge.getSlotAssignment(child);
      if (!slotMap[slot]) {
        slotMap[slot] = [];
      }
      slotMap[slot].push(child);
    }
  }
  return slotMap;
};

/**
 * Returns the slot that the node should get assigned to.
 * Note that the default slot name is mapped to the empty string.
 * @param  {Node} node The custom element
 * @return {string} The slot name of the element
 * @ignore
 */
oj.BaseCustomElementBridge.getSlotAssignment = function (node) {
  // Text nodes and elements with no slot attribute map to the default slot.
  // __oj_slots is the slot attribute saved from an oj-bind-slot or oj-bind-template-slot element
  // Remember that the slot name can be the empty string so we should do a null check instead of just using || directly
  var slot = node.__oj_slots != null ? node.__oj_slots : (node.getAttribute && node.getAttribute('slot'));
  if (!slot) {
    slot = '';
  }
  return slot;
};

/**
 * Returns true if an element is slot assignable.
 * @param {Element} node The element to check
 * @return {boolean}
 * @ignore
 */
oj.BaseCustomElementBridge.isSlotable = function (node) {
  // Ignore text nodes that only contain whitespace
  return node.nodeType === 1 || (node.nodeType === 3 && node.nodeValue.trim());
};

/** ***************************/
/* NON PUBLIC STATIC METHODS */
/** ***************************/

/**
 * @ignore
 */
oj.BaseCustomElementBridge._NO_BINDING_PROVIDER = 'none';

/**
 * @ignore
 */
oj.BaseCustomElementBridge._enumerateMetadataForKey = function (proto, metadata, key, callback) {
  if (!metadata || !metadata[key]) {
    return;
  }

  var values = metadata[key];
  var names = Object.keys(values);
  names.forEach(
    function (name) {
      callback(proto, name, values[name]);
    }
  );
};


/**
 * Returns a binding provder name if the element is managed by a JET composite
 * @ignore
 */
oj.BaseCustomElementBridge._getCompositeBindingProviderName = function (element) {
  // for upstream dependency we will still rely components being registered on the oj namespace.
  var name = oj.Composite ? oj.Composite.getBindingProviderName(element.parentElement) : null;
  return name;
};


/**
 * Verify metadata for required properties
 * @ignore
 */
oj.BaseCustomElementBridge._verifyMetadata = function (tagName, metadata) {
  if (metadata) {
    // Verify that declared properties don't override any global HTML element properties
    var properties = metadata.properties;
    if (properties) {
      // We are not currently checking for redefined aria-*, data-*, or event handler attributes, e.g. onclick.
      Object.keys(properties).forEach(function (prop) {
        if (oj.__AttributeUtils.isGlobal(prop)) {
          Logger.error("Error registering composite %s. Redefined global HTML element attribute '%s' in metadata.", tagName, prop);
        }
      });
    }
  }
};

/**
 * Checks to see whether a value is valid for an element property's enum and throws an error if not.
 * @param  {Element}  element The custom element
 * @param  {string}  property The property to check
 * @param  {string}  value The property value
 * @param  {Object}  metadata The property metadata
 * @ignore
 */
oj.BaseCustomElementBridge.checkEnumValues = function (element, property, value, metadata) {
  // Only check enum values for string types
  if (typeof value === 'string' && metadata) {
    var enums = metadata.enumValues;
    if (enums && enums.indexOf(value) === -1) {
      var bridge = oj.BaseCustomElementBridge.getInstance(element);
      bridge.throwError(element, "Invalid value '" + value + "' found for property '" + property +
        "'. Expected one of the following '" + enums.toString() + "'.");
    }
  }
};


/**
 * Checks to see whether a value is valid for an element property and throws an error if not.
 * @param  {Element}  element The custom element
 * @param  {string}  property The property to check
 * @param  {string}  value The property value
 * @param  {Object}  metadata The property metadata
 * @ignore
 */
oj.BaseCustomElementBridge.checkType = function (element, property, value, metadata) {
  // We currently support checking of single typed properties of type: string, number,
  // boolean, Array, Object OR properties w/ two possible types where
  // the value can either be of type string|Array, string|Object, string|function, Array|Promise.
  // Any other types are currently skipped, but can be validated by the component in a future ER.
  var type = metadata.type;
  if (type) {
    type = type.toLowerCase();

    var typeAr = type.split('|');
    var typeOf = typeof value;
    if (typeAr.length === 1) {
      if ((type.substring(0, 5) === 'array' && !Array.isArray(value)) ||
          (type.substring(0, 6) === 'object' && typeOf !== 'object') ||
          (type === 'number' && !(typeof value === 'number' && isFinite(value))) || // Number.isFinite isn't availabe on IE11
          (type === 'string' && typeOf !== 'string')) {
        oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, type);
      }

      // Treat boolean property sets like the DOM does where any value that passes
      // 'if (boolVal)' results in a true prop set
      if (type === 'boolean') {
        // eslint-disable-next-line no-param-reassign
        value = !!value;
      }
    } else if (typeAr.length === 2) {
      var strIdx = typeAr.indexOf('string');
      var promiseIdx = typeAr.indexOf('promise');
      var otherType;
      if (strIdx !== -1 && typeOf !== 'string') {
        otherType = strIdx === 0 ? typeAr[1] : typeAr[0];
        if ((otherType === 'function' && typeOf !== 'function') ||
            (otherType.substring(0, 5) === 'array' && !Array.isArray(value)) ||
            (otherType.substring(0, 6) === 'object' && typeOf !== 'object')) {
          oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, type);
        }
      } else if (promiseIdx !== -1 && !(value instanceof Promise)) {
        otherType = promiseIdx === 0 ? typeAr[1] : typeAr[0];
        if ((otherType.substring(0, 5) === 'array' && !Array.isArray(value))) {
          oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, type);
        }
      }
    }
  }
  return value;
};

/**
 * Compares two values, returning true if they are equal. Does a deeper check for writeback values
 * because we can't prevent knockout from triggering a second property set with the same values
 * when writing back, but we do want to prevent the addtional update and property changed event.
 * @ignore
 */
oj.BaseCustomElementBridge.__CompareOptionValues = function (property, metadata, value1, value2) {
  if (metadata.writeback) {
    return oj.Object.compareValues(value1, value2);
  }
  return value1 === value2;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__ThrowTypeError = function (element, property, value, type) {
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  bridge.throwError(element, "Invalid type '" + (typeof value) + "' found for property '" +
    property + "'. Expected value of type '" + type + "'.");
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetDescriptor = function (tagName) {
  return oj.BaseCustomElementBridge._registry[tagName.toLowerCase()].descriptor;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetCache = function (tagName) {
  if (tagName) {
    return oj.BaseCustomElementBridge._registry[tagName.toLowerCase()].cache;
  }
  return null;
};

/**
 * Checks to see if there are any overlapping attribute for the given element and attribute
 * @ignore
 */
oj.BaseCustomElementBridge.__CheckOverlappingAttribute = function (element, attr) {
  var attrPath = attr.split('.');
  if (attrPath.length > 1) {
    attrPath.pop();
    while (attrPath.length) {
      var attrSubPath = attrPath.join('.');
      if (element.hasAttribute(attrSubPath)) {
        var bridge = oj.BaseCustomElementBridge.getInstance(element);
        bridge.throwError(element, "Cannot set overlapping attributes '" + attr + "' and '" + attrSubPath + "'.");
      }
      attrPath.pop();
    }
  }
};

/**
  * Returns the metadata for the property, walking down the metadata hierarchy
  * for subproperties.
  * @param {string} prop The property including dot notation if applicable
  * @param {Object} metadata The component metadata
  * @return {Object|null} The metadata for the property or subproperty or
  *                       null if not a component property, e.g. a global attribute
  * @ignore
  */
oj.BaseCustomElementBridge.__GetPropertyMetadata = function (prop, metadata) {
  var meta = metadata;
  var propAr = prop.split('.');
  for (var i = 0; i < propAr.length; i++) {
    meta = meta[propAr[i]];
    if (!meta) {
      break;
    }

    if (propAr.length > 1 && i < propAr.length - 1) {
      meta = meta.properties;
      if (!meta) {
        break;
      }
    }
  }
  return meta;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__InitProperties = function (element, componentProps) {
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  bridge.__INITIALIZING_PROPS = true;
  var metaProps = oj.BaseCustomElementBridge.getProperties(bridge);
  if (metaProps) {
    var attrs = element.attributes; // attrs is a NodeList
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var property = oj.__AttributeUtils.attributeToPropertyName(attr.nodeName);

      // See if attribute is a component property
      var meta = oj.BaseCustomElementBridge.__GetPropertyMetadata(property, metaProps);
      if (meta && !meta.readOnly) {
        // If complex property, check if there are any overlapping attributes
        oj.BaseCustomElementBridge.__CheckOverlappingAttribute(element, attr.nodeName);

        var info = oj.__AttributeUtils.getExpressionInfo(attr.value);
        if (!info.expr) {
          var value = oj.BaseCustomElementBridge.__ParseAttrValue(element,
                                                                  attr.nodeName,
                                                                  property,
                                                                  attr.value,
                                                                  meta);
          bridge.ValidateAndSetProperty(bridge.GetAliasForProperty.bind(bridge),
                                        componentProps, property, value, element);
        }
      }
    }
  }
  bridge.__INITIALIZING_PROPS = false;
};

/**
 * @param {function} propNameFun A function that returns the actual property name to use, e.g. an alias
 * @param {Object} componentProps The object to set the new property value on which is the
 *                                element for outer property sets and the property bag for inner sets.
 * @param {string} property The property name
 * @param {Object} value The value to set for the property
 * @ignore
 */
oj.BaseCustomElementBridge.__SetProperty = function (propNameFun, componentProps, property, value) {
  var propsObj = componentProps;
  var propPath = property.split('.');
  var branchedProps;
  // Set subproperty, initializing parent objects along the way unless the top level
  // property is not defined since setting it to an empty object will trigger a property changed
  // event. Instead, branch and set at the end. We only have listeners on top level properties
  // so setting a subproperty will not trigger a property changed event along the way.
  var topProp = propNameFun(propPath[0]);
  if (propPath.length > 1 && !componentProps[topProp]) {
    branchedProps = {};
    propsObj = branchedProps;
  }

  // Walk to the correct location
  for (var i = 0; i < propPath.length; i++) {
    var subprop = propNameFun(propPath[i]);
    if (i === propPath.length - 1) {
      propsObj[subprop] = value;
    } else if (!propsObj[subprop]) {
      propsObj[subprop] = {};
    }
    propsObj = propsObj[subprop];
  }

  // Update the original component properties if we branched
  if (branchedProps) {
    // eslint-disable-next-line no-param-reassign
    componentProps[topProp] = branchedProps[topProp];
  }
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetProperty = function (componentProps, property) {
  var propsObj = componentProps;
  var propPath = property.split('.');
  for (var i = 0; i < propPath.length; i++) {
    var subprop = propPath[i];
    // If no metadata is passed in, assume that the value has already been evaluated
    if (i === propPath.length - 1) {
      return propsObj[subprop];
    } else if (!propsObj[subprop]) {
      return undefined;
    }
    propsObj = propsObj[subprop];
  }
  return undefined;
};

/**
 * Returns the coerced attribute value using a custom parse function or the framework default.
 * @ignore
 */
oj.BaseCustomElementBridge.__ParseAttrValue = function (elem, attr, prop, val, metadata) {
  if (val == null) {
    return val;
  }

  var type = metadata.type;
  var bridge = oj.BaseCustomElementBridge.getInstance(elem);
  function _coerceVal(value) {
    var coercedValue;
    try {
      coercedValue = oj.__AttributeUtils.coerceValue(elem, attr, value, type);
    } catch (ex) {
      bridge.throwError(elem, ex);
    }
    return coercedValue;
  }

  var parseFunction = oj.BaseCustomElementBridge.__GetDescriptor(elem.tagName).parseFunction;
  if (parseFunction) {
    return parseFunction(val, prop, metadata,
      function (value) {
        return _coerceVal(value);
      }
    );
  }
  return _coerceVal(val);
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__ProcessEventListeners = function (_metadata) {
  var metadata = oj.CollectionUtils.copyInto({}, _metadata, undefined, true, 1);
  metadata.properties = metadata.properties || {};
  oj.BaseCustomElementBridge._enumerateMetadataForKey(null, metadata, 'properties',
    function (proto, property) {
      var eventName = oj.__AttributeUtils.propertyNameToChangeEventType(property);
      var eventListenerProperty = oj.__AttributeUtils.eventTypeToEventListenerProperty(eventName);
      metadata.properties[eventListenerProperty] = { _derived: true, _eventListener: true };
    }
  );
  oj.BaseCustomElementBridge._enumerateMetadataForKey(null, metadata, 'events',
    function (proto, event) {
      var eventListenerProperty = oj.__AttributeUtils.eventTypeToEventListenerProperty(event);
      metadata.properties[eventListenerProperty] = { _derived: true, _eventListener: true };
    }
  );
  return metadata;
};

/**
 * @ignore
 * @param {string} tagName
 * @param {Object} descriptor
 * @param {Object} bridgeProto
 * @param {boolean=} isComposite
 */
oj.BaseCustomElementBridge.__Register = function (tagName, descriptor, bridgeProto, isComposite) {
  var name = tagName.toLowerCase();
  if (!oj.BaseCustomElementBridge._registry[name]) {
    if (!descriptor) {
      Logger.error('Cannot register ' + tagName + '. Missing a descriptor.');
    }

    oj.BaseCustomElementBridge
      ._verifyMetadata(tagName, descriptor[oj.BaseCustomElementBridge.DESC_KEY_META]);
    oj.BaseCustomElementBridge._registry[name] =
      { descriptor: descriptor, bridgeProto: bridgeProto, composite: isComposite, cache: {} };
    return true;
  }
  return false;
};

/**
 * @ignore
 * @param {Element} element
 * @param {string} name
 * @param {Object} value
 * @param {Object} previousValue
 * @param {string} updatedFrom
 * @param {Object=} subprop
 */
oj.BaseCustomElementBridge.__FirePropertyChangeEvent =
  function (element, name, value, previousValue, updatedFrom, subprop) {
    var bridge = oj.BaseCustomElementBridge.getInstance(element);
    // There are cases where a subproperty set can trigger a top level property set
    // if the top level property was not instantiated to an empty object. We don't want
    // to fire two events for that case. The BaseCustomElementBridge has logic to fire
    // the subproperty change event there.
    if (!bridge._SKIP_PROP_CHANGE_EVENT) {
      var detail = {};
      if (subprop) {
        detail.subproperty = subprop;
      }
      detail.value = value;
      detail.previousValue = previousValue;
      detail.updatedFrom = updatedFrom;

      // Check if the subclass needs to do anything before we fire the property change event,
      // e.g. composites that need to call the propertyChanged ViewModel callback.
      if (bridge.beforePropertyChangedEvent) {
        bridge.beforePropertyChangedEvent(element, name, detail);
      }
      // The bridge sets the ready to fire flag after the component has been instantiated.
      // We shouldn't fire property changed events before then unless the update comes from internally
      // for cases like readOnly property updates.
      if (updatedFrom !== 'external' || bridge.__READY_TO_FIRE) {
        element.dispatchEvent(new CustomEvent(name + 'Changed', { detail: detail }));
      }
    }
  };

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__DefineDynamicObjectProperty =
  function (obj, property, getter, setter) {
    Object.defineProperty(obj, property, {
      enumerable: true,
      get: getter,
      set: setter
    });
  };

/**
 * @ignore
 */
oj.BaseCustomElementBridge._registry = {};

/** @ignore */
oj.BaseCustomElementBridge.DESC_KEY_CSS = 'css';
/** @ignore */
oj.BaseCustomElementBridge.DESC_KEY_META = 'metadata';
/** @ignore */
oj.BaseCustomElementBridge.DESC_KEY_PARSE_FUN = 'parseFunction';
/** @ignore */
oj.BaseCustomElementBridge.DESC_KEY_VIEW = 'view';
/** @ignore */
oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL = 'viewModel';

/**
 * @ignore
 */
oj.BaseCustomElementBridge._INSTANCE_KEY = '_ojBridge';

/**
 * Class used to track the create state.
 * @constructor
 * @protected
 * @ignore
 */
oj.BaseCustomElementBridge.__DelayedPromise = function () {
  var _promise;
  var _resolve;
  var _reject;

  /**
   * Returns the create Promise, creating one as needed.
   * @return {Promise}
   * @ignore
   */
  this.getPromise = function () {
    if (!_promise) {
      _promise = new Promise(function (resolve, reject) {
        _resolve = resolve;
        _reject = reject;
      });
    }
    return _promise;
  };

  /**
   * Rejects the create Promise if one exists.
   * @ignore
   */
  this.rejectPromise = function (reason) {
    if (_reject) {
      _reject(reason);
    }
  };

  /**
   * Resolves the create Promise if one exists.
   * @ignore
   */
  this.resolvePromise = function (value) {
    if (_resolve) {
      _resolve(value);
    }
  };
};


/**
 * @ojoverviewdoc CustomElementOverview - [2]JET Web Components
 * @classdesc
 * {@ojinclude "name":"customElementOverviewDoc"}
 */

/**
 * <h2 id="ce-overview-section" class="subsection-title">
 *   Overview<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-overview-section"></a>
 * </h2>
 * <p>
 *   JET components and <a href="CompositeOverview.html">custom components</a>, collectively referred to as <b>JET Web Components</b>,
 *   are implemented as <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements">custom HTML elements</a>
 *   and extend the HTMLElement interface. This means that JET custom elements automatically inherit
 *   <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes">global attributes</a>
 *   and programmatic access to these components is similar to interacting with native HTML elements.
 *   All JET components live in the "oj" namespace and have HTML element names starting with "oj-". We will use
 *   the term "JET component" to refer to both native JET custom elements and custom elements implemented using the
 *   <a href="oj.Composite.html">Composite</a> component APIs after this point.
 * </p>
 * <h2 id="ce-overview-upgrade-section" class="subsection-title">
 *   Upgrading a Custom Element<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-overview-upgrade-section"></a>
 * </h2>
 * <p>
 *   The upgrade process will begin for current JET custom elements in the DOM when the component module is loaded,
 *   registering a class constructor with its tag name using the
 *   <a href="https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define">CustomElementRegistry</a>
 *   <code>define()</code> API. Existing elements matching the registered tag name will be updated to inherit the new
 *   class definition and all of the component properties and methods will be available on the custom element after
 *   this process completes. Additionally, JET components will resolve any data bindings during the upgrade process.
 *   The application is responsible for calling their binding provider to apply bindings or for adding a
 *   <code>data-oj-binding-provider="none"</code> attribute in their page to indicate that no data bindings exist.
 *   Note that the JET custom element upgrade process will not complete until data bindings
 *   are resolved or no binding provider is indicated using the <code>data-oj-binding-provider</code> attribute.
 *   Also, due to JET components' data binding support, all JET component upgrades will occur asynchronously regardless
 *   of whether a binding provider is used.
 *   Please see the <a href="#ce-databind-section">data binding</a> section for more details on binding providers and data binding.
 *   The application should not interact with the JET custom element except to  programmatically set properties until the
 *   custom element upgrade is complete. The recommended way to wait on the asynchronous upgrade process is to use an
 *   element-scoped or page-level <a href="oj.BusyContext.html">BusyContext</a>.
 * </p>
 * <h2 id="ce-overview-usage-section" class="subsection-title">
 *   Using a JET Custom Element<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-overview-usage-section"></a>
 * </h2>
 * <p>
 *   Custom elements can be used declaratively in HTML by using the component tag name and attributes. They are not self closing
 *   elements and applications should include a closing tag. To interact with them  programmatically, DOM APIs can be used to
 *   retrieve the element and then access properties and methods directly on the element instance. JET custom elements can also fire
 *   <code>CustomEvents</code> for which the application can attach event listeners both declaratively and  programmatically.
 *   The rest of this document discusses these features in more detail.
 * </p>
 *
 * <h2 id="ce-attributes-section" class="subsection-title">
 *   Attributes<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attributes-section"></a>
 * </h2>
 * <p>
 *   Attribute values set as string literals will be parsed and coerced to the property type. JET currently
 *   only supports the following string literal type coercions: boolean, number, string, Object and Array, where
 *   Object and Array types must use JSON notation with double quoted strings. A special "any" type is also supported
 *   and is described <a href="#ce-attrs-any-section">below</a>. All other types should to be set using
 *   <a href="#ce-databind-section">expression syntax</a> in the DOM or using the element's property setters or <code>setProperty</code>
 *   and <code>setProperties</code> methods programmatically. Unless updates are done via the DOM element.setAttribute(),
 *   the DOM's attribute value will not reflect changes like those done via the property setters or the setProperty and
 *   setProperties methods. Attribute removals are treated as unsetting of a property where the component default value will be used if one exists.
 * </p>
 * <p>
 *   As described <a href="#ce-databind-section">below</a>, JET uses [[...]] and {{...}} syntax to represent data bound expressions.
 *   JET does not currently provide any escaping syntax for "[[" or "{{" appearing at the beginning of the attribute
 *   value. You will need to add a space character to avoid having the string literal value interpreted as a binding
 *   expression (e.g. &lt;oj-some-element some-attribute='[ ["arrayValue1", "arrayValue2", ... ] ]'>&lt;/oj-some-element>).
 * </p>
 * <h2 id="ce-attrs-boolean-section" class="subsection-title">
 *   Boolean Attributes<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-boolean-section"></a>
 * </h2>
 * <p>
 *   JET components treat boolean attributes differently than HTML5. Since a common application use case
 *   is to toggle a data bound boolean attribute, JET will coerce the string literal "false" to the boolean
 *   false for boolean attributes. The absence of a boolean attribute in the DOM will also be interpreted as false.
 *   JET will coerce the following string literal values to the boolean true and throw an Error for all other
 *   invalid values.
 *   <ul>
 *    <li>No value assignment (e.g. &lt;oj-some-element boolean-attribute>&lt;/oj-some-element>)</li>
 *    <li>Empty string (e.g. &lt;oj-some-element boolean-attribute="">&lt;/oj-some-element>)</li>
 *    <li>The "true" string literal (e.g. &lt;oj-some-element boolean-attribute="true">&lt;/oj-some-element>)</li>
 *    <li>The case-insensitive attribute name (e.g. &lt;oj-some-element boolean-attribute="boolean-attribute">&lt;/oj-some-element>)</li>
 *   </ul>
 * </p>
 * <h2 id="ce-attrs-object-section" class="subsection-title">
 *   Object-Typed Attributes<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-object-section"></a>
 * </h2>
 * <p>
 *   Attributes that support Object type can be declaratively set using dot notation.
 *   Note that applications should not set overlapping attributes as these will cause an error to be thrown.
 *   <pre class="prettyprint">
 *   <code>
 * &lt;!-- person is an Object typed attribute with a firstName subproperty -->
 * &lt;oj-some-element person.first-name="{{name}}">&lt;/oj-some-element>
 *
 * &lt;!-- overlapping attributes will throw an error -->
 * &lt;oj-some-element person="{{personInfo}}" person.first-name="{{name}}">&lt;/oj-some-element>
 *   </code>
 *   </pre>
 *   If applications need to programmatically set subproperties, they can call the JET components's <code>setProperty</code>
 *   method with dot notation using the camelCased property syntax (e.g. element.setProperty("person.firstName", "Sally")).
 * </p>
 * <h2 id="ce-attrs-any-section" class="subsection-title">
 *   Any-Typed Attributes<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-any-section"></a>
 * </h2>
 * <p>
 *   Attributes that support any type are documented with type {any} in the API doc and will be coerced as
 *   Objects, Arrays, or strings when set in HTML as a string literal. Numeric types are not supported due
 *   to the fact that we cannot determine whether value="2" on a property supporting any type should be
 *   coerced to a string or a number. The application should use data binding for all other value types and ensure
 *   that when linking any-typed attributes across multiple components, that the resolved types will match, e.g.
 *   do not data bind an <oj-select-one> <code>value</code> attribute to a numeric value and use a string literal
 *   number for its child <oj-option> <code>value</code> attributes since those would evaluate to strings.
 * </p>
 *
 * <h2 id="ce-databind-section" class="subsection-title">
 *   Data Binding<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-section"></a>
 * </h2>
 * <p>
 *   Applications can use the JET data binding syntax in order to use expressions or a non coercible attribute
 *   type (e.g. a type other than boolean, number, string, Object or Array) declaratively in HTML.
 *   This syntax can be used on both JET custom elements and native HTML elements.
 *   The application is responsible for applying bindings using a supported binding provider which then notifies
 *   JET framework code that the bindings have been resolved and to finish the custom element upgrade process.
 * </p>
 * <h2 id="ce-databind-bindingprovider-section" class="subsection-title">
 *   Binding Providers<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-bindingprovider-section"></a>
 * </h2>
 * <p>
 *   The binding provider is responsible for setting and updating attribute
 *   expressions and any custom elements within its managed subtree will not finish upgrading until it
 *   applies bindings on that subtree. By default, there is a single binding provider for a page,
 *   but subtree specific binding providers can be added by using the <code>data-oj-binding-provider</code>
 *   attribute with values of "none" and "knockout". The default binding provider is knockout, but if a
 *   page or DOM subtree does not use any expression syntax or knockout, the application can set
 *   <code>data-oj-binding-provider="none"</code> on that element so its dependent JET custom elements
 *   do not need to wait for bindings to be applied to finish upgrading. Note that regardless of whether a
 *   binding provider is used, the custom element upgrade process will be asynchronous. <b>When using the
 *   knockout binding provider, applications should require the ojknockout module.</b>
 * </p>
 * <h2 id="ce-databind-syntax-section" class="subsection-title">
 *   Data Binding Syntax for JET Components<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-syntax-section"></a>
 * </h2>
 * <p>
 *   Data binding syntax can be used directly on component attributes. See the specific component API doc
 *   for the complete list of component attributes. Global HTML attributes inherited from HTMLElement can also be
 *   data bound, but require special syntax described below. JET detects data bound attributes by looking for values
 *   wrapped with {{...}} or [[...]]. Please note that there should be no spaces between the braces
 *   when using the data bind syntax (e.g. some-attribute="[ [...] ]"). The {{...}} wrapped expression indicates that the
 *   application is allowing the component to update the expression which can be a knockout observable. Attributes
 *   bound using [[...]] will not be updated or "written back" to by the component. Unless the component attribute documents
 *   that it supports "writeback", we recommend that the [[...]] syntax be used, e.g. selection-mode="[[currentSelectionMode]]".
 * </p>
 * <h2 id="ce-databind-writeback-section" class="subsection-title">
 *   Writeback<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-writeback-section"></a>
 * </h2>
 * <p>
 *   Certain properties such as "value" on editable components support updating the associated expression
 *   automatically whenever their value changes. This usually occurs after user interaction such as with selection
 *   or typing into an input field. This expression update functionality is also known as "writeback".
 *   Applications can control expression writeback by using the {{...}} syntax for two-way writable
 *   binding expressions or [[...]] for one-way only expressions. The one-way expressions should
 *   be used when the application needs expressions strictly for "downstream-only" purposes, e.g. only for
 *   updating a component property. Note that if a writeback attribute is bound using the "downstream-only"
 *   syntax, the application and component states can become out of sync. This is different from the
 *   read-only properties, which are "upstream-only", e.g. they are used only to monitor component state.
 *   Thus an expression associated with a read-only property should always use the {{}} syntax.
 *   Most component properties do not writeback and those that do will indicate it in their API doc.
 * </p>
 * <pre class="prettyprint">
 *   <code>
 *   &lt;oj-some-element value="[[currentValue]]" selection={{currentSelection}}>&lt;/oj-some-element>
 *   </code>
 * </pre>
 * <h2 id="ce-databind-global-section" class="subsection-title">
 *   Data Binding Syntax for Native HTML Elements and Global Attributes
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-global-section"></a>
 * </h2>
 * <p>
 *   JET's data binding syntax can also be used on native HTML elements and
 *   <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes">global attributes</a>
 *   to create one-way bindings by prefixing the attribute
 *   name with ":" (e.g. :id="[[idVar]]"). The attribute binding syntax results in the attribute being set in the DOM
 *   with the evaluated expression. Since global HTML attributes are always string typed, expressions using the ":"
 *   prefixing should resolve to strings with the exception of the style and class attributes which support additional types
 *   and are described in more detail below. In the case of component attributes, applications are recommended to bind
 *   the attribute names directly and avoid the use of the ":" prefix.
 * </p>
 * <h2 id="ce-databind-class-section" class="subsection-title">
 *   :Class Attribute<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-class-section"></a>
 * </h2>
 * <p>
 *   The class attribute binding supports a space delimited string of classes, an Array of classes, or an Object whose keys are
 *   individual style classes and whose values are booleans to determine whether those style classes should be present in the DOM
 *   (e.g. :class="[[{errorClass: hasErrors}]]"). Note that the Array and string types will override existing values in the class
 *   attribute when updates occur, whereas the Object type will only add and remove the classes specified. Since JET custom elements
 *   add their own classes, we recommend using the Object type when using the class attribute binding on JET custom elements.
 * </p>
 * <h2 id="ce-databind-style-section" class="subsection-title">
 *   :Style Attribute<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-style-section"></a>
 * </h2>
 * <p>
 *   When using the style attribute binding with an Object type, the style Object names should be the JavaScript
 *   names for that style (e.g. "fontWeight" instead of "font-weight" style='{"fontWeight": "..."}').
 *   Since the style attribute supports Object types, it also supports dot notation for setting style subproperties
 *   directly (e.g. :style.font-weight="[[...]]").
 * </p>
 *
 * <h2 id="ce-properties-section" class="subsection-title">
 *   Properties<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-properties-section"></a>
 * </h2>
 * <p>
 *   In addition to properties inherited from the HTMLElement prototype, attributes listed
 *   in the component API doc will also be exposed as properties on the JET custom element.
 *   See the <a href="#ce-proptoattr-section">property to attribute mapping</a>
 *   section below to see the syntax difference between setting attributes and properties.
 *   These properties can be set at any time, but can only be retrieved once the HTML element
 *   is fully upgraded. Early property sets before the component has been upgraded
 *   will not result in [property]Changed events and will be passed to the component as part of its initial state.
 * </p>
 * <h2 id="ce-properties-readonlywriteback-section" class="subsection-title">
 *   Read-only and Writeback Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-properties-readonlywriteback-section"></a>
 * </h2>
 * <p>
 *   Some properties are specially marked as read-only or supporting writeback in the component API doc.
 *   Read-only properties can only be read and not set by the application and generally support writeback.
 *   Writeback properties support automatic updates if they are bound using two way data binding syntax to an
 *   expression, e.g. value="{{valueObservable}}".
 *   Applications can bind an expression to a read-only attribute in HTML by using the {{..}} to ensure
 *   that updates will be reflected in the observable, but should not use this syntax to try and push a
 *   value to the read-only attribute which will result in an error state.
 *   Similarly, property sets using the setProperty, setProperties, or the element property setters should also
 *   be avoided for a read-only property.
 * </p>
 * <h2 id="ce-properties-subproperties-section" class="subsection-title">Subproperties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-properties-subproperties-section"></a>
 * </h2>
 * <p>
 *   Some JET components support complex properties where the top level property is of type Object and it
 *   contains additional subproperties. If the application needs to set a single subproperty
 *   instead of the entire complex property, the <code>setProperty</code> method should be used
 *   instead to ensure that [property]Changed events will be fired with the subproperty changes.
 *   Note that directly updating the subproperty via dot notation (e.g. element.topProp.subProp = newValue)
 *   will not result in a [property]Changed event being fired.
 * </p>
 * <h2 id="ce-properties-unset-section" class="subsection-title">Unsetting of a Property
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-properties-unset-section"></a>
 * </h2>
 * <p>
 *   The undefined value is treated as unsetting of a property when passed to the
 *   property setter and will result in the component using the default value if one exists. Unsetting of
 *   subproperties using the element's <code>setProperty</code> is not supported. Subproperties can only
 *   only be unset when the top level property is unset.
 *   Property sets will not result in DOM attribute updates and after the custom
 *   element is upgraded, the application should use the custom element properties, not attributes to check
 *   the current value.
 * </p>
 * <h2 id="ce-properties-changed-section" class="subsection-title">[property]Changed Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-properties-changed-section"></a>
 * </h2>
 * <p>
 *   When a property or attribute value changes, a non-bubbling [property]Changed <code>CustomEvent</code>
 *   will be fired with the following properties in the event's detail property.
 *   <table class="props">
 *     <thead>
 *       <tr>
 *         <th>Name</th>
 *         <th>Type</th>
 *         <th>Description</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       <tr>
 *      <td>value</td>
 *      <td>any</td>
 *      <td>The current value of the property that changed.</td>
 *    </tr>
 *    <tr>
 *      <td>previousValue</td>
 *      <td>any</td>
 *      <td>The previous value of the property that changed.</td>
 *    </tr>
 *    <tr>
 *      <td>updatedFrom</td>
 *      <td>string</td>
 *      <td>
 *        Where the property was updated from. Supported values are:
 *        <ul>
 *          <li>external - By the application, using either the element's property setter, setAttribute, or external data binding.</li>
 *          <li>internal - By the component, e.g. after user interaction with a text field or selection.</li>
 *        </ul>
 *      </td>
 *    </tr>
 *    <tr>
 *      <td>subproperty</td>
 *      <td>Object</td>
 *      <td>An object holding information about the subproperty that changed.
 *        <table class="props">
 *          <thead>
 *            <tr>
 *              <th>Name</th>
 *              <th>Type</th>
 *              <th>Description</th>
 *            </tr>
 *          </thead>
 *        <tbody>
 *          <tr>
 *            <td>path</td>
 *            <td>string</td>
 *            <td>
 *              The subproperty path that changed, starting from the top level
 *              property with subproperties delimited by ".".
 *            </td>
 *          </tr>
 *          <tr>
 *            <td>value</td>
 *            <td>any</td>
 *            <td>The current value of the subproperty that changed.</td>
 *          </tr>
 *          <tr>
 *            <td>previousValue</td>
 *            <td>any</td>
 *            <td>The previous value of the subproperty that changed.</td>
 *            </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *      </tr>
 *    </tbody>
 *   </table>
 * </p>
 * <p>
 *   Please note that in order for components to be notified of a property change for Array properties, the
 *   value should be data bound and updated using an expression, setting the property to an updated copy
 *   by calling slice(), or by refreshing the component after an in place Array mutation.
 * </p>
 * <p>
 *   See <a href="#ce-events-section">Events and Listeners</a> for additional information on how to listen for
 *   these events.
 * </p>
 * <h2 id="ce-proptoattr-section" class="subsection-title">Property-to-Attribute Mapping
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-proptoattr-section"></a>
 * </h2>
 * <p>
 *   The following rules apply when mapping property to attribute names:
 *   <ul>
 *     <li>Attribute names are case insensitive. CamelCased properties are mapped to
 *   kebab-cased attribute names by inserting a dash before the uppercase letter and converting that letter to lower case
 *   (e.g. a "chartType" property will be mapped to a "chart-type" attribute).</li>
 *     <li> The reverse occurs when mapping a property name from an attribute name.</li>
 *   </ul>
 * </p>
 *
 * <h2 id="ce-methods-section" class="subsection-title">
 *   Methods<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-methods-section"></a>
 * </h2>
 * <p>
 *   Methods can be accessed on the JET component after the element is fully upgraded. See
 *   the component API doc for specifics.
 * </p>
 *
 * <h2 id="ce-events-section" class="subsection-title">
 *   Events and Listeners<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-events-section"></a>
 * </h2>
 * <p>
 *   JET Web Components, like other custom HTML elements, may fire <code>CustomEvents</code>.  These
 *   events typically bubble and will be described in component documentation.  In addition, JET components
 *   fire non-bubbling [property]Changed (e.g. valueChanged) <code>CustomEvents</code>
 *   whenever a property is updated. See the <a href="#ce-properties-section">properties section</a> above
 *   for details on the event payload.
 * </p>
 *  <p>
 *   JET <code>CustomEvents</code> can be listened to using the standard addEventListener mechanism:
 *   <pre class="prettyprint">
 *   <code>
 * someElement.addEventListener("eventName", function(event) {...});
 *   </code>
 *   </pre>
 * </p>
 * <p>
 *   Additionally, JET custom elements and native HTML elements within JET pages support declarative specification of event
 *   listeners via <code>on-[event-name]</code> attributes (e.g. <code>on-click</code>,
 *   <code>on-value-changed</code> or <code>on-oj-expand</code>). The attributes ultimately delegate to the standard
 *   <code>addEventListener</code> mechanism and only support data bound expressions
 *   that evaluate to functions; arbitrary JavaScript will not be accepted.
 * </p>
 * <p>
 *   In addition to the event parameter, event listeners specified via <code>on-[event-name]</code>
 *   attributes will receive two additional parameters when they are invoked: <code>data</code> and <code>bindingContext</code>.
 *   The <code>bindingContext</code> parameter provides the listener with the entire data binding context that
 *   was applied to the element while the data parameter provides convenient access to relevant data.
 *   When in an iteration context (e.g. inside an <code>oj-bind-for-each</code>), the <code>data</code> parameter
 *   is equal to <code>bindingContext["$current"]</code>; otherwise, it is equal to <code>bindingContext["$data"]</code>.
 *   These declarative event listeners should take the form:
 *   <pre class="prettyprint">
 *   <code>
 * &lt;oj-some-element on-event-name="[[eventListener]]">&lt;/oj-some-element>
 *
 *
 * function eventListener(event, data, bindingContext) {
 *   ...
 * }
 *   </code>
 *   </pre>
 * </p>
 * <p>
 *   Please note that there is a
 *   current limitation where event listeners specified using this syntax can only be
 *   set during component initialization. Subsequent setAttribute calls for the
 *   event listener attributes will be ignored.
 * </p>
 *
 * <h2 id="ce-slots-section" class="subsection-title">
 *   Slots<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-slots-section"></a>
 * </h2>
 * <p>
 *  Some JET components allow application provided child content. This child content will be moved by the JET component to
 *  a designated "slot" and is referred to as slot content. Slot content can have one of two characteristics:
 *  <ul>
 *    <li>
 *      Named slot content - Any direct child element with a slot attribute will be moved into that named slot, e.g.  &lt;span slot='startIcon'>... &lt;/span>.
 *      All supported named slots are described in the API Doc. Child elements with unsupported named slots will be removed from the DOM.
 *    </li>
 *    <li>
 *      Default slot content - Any direct child element lacking a slot attribute will be moved to the default slot, also known as a regular child.
 *    </li>
 *  </ul>
 *  Bindings are applied to slot content in the application's context with the exception of template slots which are described
 *  below. Slot content are moved to their designated component slots after bindings are applied. <b>Please note that only text and
 *  element nodes can be assigned to a slot. Comment nodes are not eligible, so oj-bind-* elements which resolve to comment nodes
 *  after bindings are applied should be wrapped in a span or other element node for slotting.</b>
 * </p>
 * <h3 id="ce-slots-template-section" class="subsection-title">
 *   Template Slots<a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-slots-template-section"></a>
 * </h3>
 * <p>
 *  Some components support template slots which allow the application to pass a template element with a DOM fragment that
 *  will be stamped out by the component. Bindings are not applied to template slot content until they are stamped out by the
 *  component. All template slot children will have access to the following variables:
 *  <ul>
 *    <li>$current - Default variable that contains component exposed subproperties as documented in the component's API doc.</li>
 *    <li>component-level template alias - Set by the application if the component has provided a component-level alias attribute
 *        as part of its API. Provides a template alias available to all template slot binding contexts and has the same
 *        subproperties as the $current variable.</li>
 *    <li>template-level alias - Set by the application on the template element via the 'data-oj-as' attribute. Provides an alias
 *        for a specific template instance and has the same subproperties as the $current variable.</li>
 *  </ul>
 *  Note that $current is always availble on the binding context regardless of whether any application provided aliases are set.
 * </p>
 *
 * @ojfragment customElementOverviewDoc - General description doc fragment that shows up in every component's page via a link.
 * @memberof CustomElementOverview
 */

});