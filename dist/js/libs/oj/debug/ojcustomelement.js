/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'require', 'promise', 'customElements'], function(oj, require)
{
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
  getClass: function(descriptor) {
    var proto = Object.create(HTMLElement.prototype);
    this.InitializePrototype(proto);

    var metadata = this.GetMetadata(descriptor);
    // Enumerate metadata to define the prototype properties, methods, and events 
    oj.BaseCustomElementBridge._enumerateMetadataForKey(proto, metadata, 'properties', this.DefinePropertyCallback.bind(this));
    oj.BaseCustomElementBridge._enumerateMetadataForKey(proto, metadata, 'methods', this.DefineMethodCallback.bind(this));
    
    // Add additional element methods not defined in metadata, e.g. getNodeBySubId/getSubIdByNode or get/setProperty
    this.AddComponentMethods(proto);
    
    proto['setProperties'] = function(props){oj.BaseCustomElementBridge.getInstance(this)._setProperties(this, props);}; 

    // The set/unset methods are used for TypeScript only so we should define these as non enumerated properties
    Object.defineProperty(proto, 'set', { value: function(prop, value) { this.setProperty(prop, value); } });
    Object.defineProperty(proto, 'unset', { value: function(prop) { this.setProperty(prop, undefined); } });

    // Add lifecycle listeners
    proto['attributeChangedCallback'] = this._attributeChangedCallback;
    proto['connectedCallback'] = this._connectedCallback;
    proto['disconnectedCallback'] = this._detachedCallback;
    
    Object.defineProperty(proto, 'resolveBP', 
        {value: function(bp){oj.BaseCustomElementBridge.getInstance(this)._resolveBindingProvider(bp);}});
    
    var constructorFunc = function()
    { 
      var reflect = window['Reflect'];
      var ret;
      if (typeof reflect !== 'undefined')
      {
        ret = reflect['construct'](HTMLElement, [], this['constructor']);
      }
      else
      {
        ret = HTMLElement.call(this);
      }
      return ret;
    };
    
    var bridge = this;
    Object.defineProperty(constructorFunc, 'observedAttributes', 
    {
      'get': function() 
      { 
        return bridge.GetAttributes(metadata);
      }
    });

    Object.defineProperty(proto,  'constructor', { 'value': constructorFunc, 'writable': true, 'configurable': true });
    constructorFunc.prototype = proto;
    Object.setPrototypeOf(constructorFunc, HTMLElement);

    return constructorFunc;
  },

  resolveDelayedReadyPromise: function(element)
  {
    this.GetDelayedReadyPromise().resolvePromise();
  },  

  AddComponentMethods: function(proto) {},

  CreateComponent: function(element) {},

  DefineMethodCallback: function (proto, method, methodMeta) {},
  
  DefinePropertyCallback: function (proto, property, propertyMeta) {},

  /**
   * Returns a promise that will be resolved when the component has been initialized.
   * @return {Promise}
   */
  GetDelayedReadyPromise: function()
  {
    if (!this._delayedReady)
      this._delayedReady = new oj.BaseCustomElementBridge.__DelayedPromise();
    return this._delayedReady;
  },

  GetAttributes: function(metadata)
  {
    return oj.BaseCustomElementBridge.getAttributes(metadata['properties']);
  },

  GetMetadata: function(descriptor)
  {
    return descriptor[oj.BaseCustomElementBridge.DESC_KEY_META];
  },

  /**
   * Returns the aliased component property for a given custom element property,
   * e.g. readOnly for oj-switch's readonly custom element property. 
   * Will return the original property if there is no aliasing.
   * @param {string} property The property to check
   */
  GetAliasForProperty: function(property)
  {
    return property;
  },

  HandleAttributeChanged: function(element, attr, oldValue, newValue) {},

  HandleBindingsApplied: function(element, bindingContext) {},

  HandleDetached: function(element) {
    this._bConnected = false;
    if (!this._complete)
    {
      this._resolveBusyState(element);
    }
  },

  HandleReattached: function(element) {},

  InitializeElement: function(element) {},

  InitializePrototype: function(proto) {},
  
  BatchedPropertySet: function(elem, props) 
  {
    var keys = Object.keys(props);
    
    for (var i=0; i<keys.length; i++)
    {
      var key = keys[i];
      elem['setProperty'](key, props[key]);
    }
  },

  CanSkipTypeCheck: function(propAr)
  {
    // TODO: Remove method post 4.0.0 after metadata is generated from jsDoc.
    // Temporary fix for JET component translation subproperties that are not specified in metadata.
    return false;
  },

  GetProperty: function(element, prop, props)
  {
    var event = oj.__AttributeUtils.eventListenerPropertyToEventType(prop);
    var meta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(this, element));

    // For event listener and non component properties, retrieve the value directly stored on the element.
    // For top level properties, this will delegate to our 'set' methods so we can handle default values.
    // props is the properties object we pass the definitional element or composite ViewModel
    if (event || !meta || prop.indexOf('.') === -1)
      return props[prop];
    else
      return oj.BaseCustomElementBridge.__GetProperty(props, prop);
  },

  InitializeBridge: function(element)
  {
    // Initialize property storage and other variables needed for property sets. 
    // Since early property sets can occur before the element's connected callback
    // is triggered we can't rely on performing this logic there. The cases where
    // the connected callback isn't called before a property set can occur if the 
    // custom element is programatically created and sets are done before adding 
    // the element to the DOM or if the element is stamped by knockout and its expressions
    // processed disconnected as in the case for oj-bind-for-each.
    var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);
    this.METADATA = this.GetMetadata(descriptor);
    this._eventListeners = {};
  },

  PlaybackEarlyPropertySets: function(element)
  {
    this._bCanSetProperty = true;
    if (this._earlySets)
    {
      while (this._earlySets.length)
      {
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
  SaveEarlyPropertySet: function(prop, value)
  {
    // Do not save sets that occur during oj.BaseCustomElementBridge.__InitProperties 
    // or expression evaluation. We can process these as normal. Playback occurs before the 
    // binding provider promise is resolved leading to component creation.
    if (this.__INITIALIZING_PROPS || this._bCanSetProperty)
      return false;

    if (!this._earlySets)
      this._earlySets = [];

    this._earlySets.push({property: prop, value: value});
    return true;
  },

  SetEventListenerProperty: function(element, property, value) {
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
    }
    else {
      oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, 'function');
    }
  },

  SetProperty: function(element, prop, value, props, bOuter)
  {      
    // Check value against any defined enums
    var event = oj.__AttributeUtils.eventListenerPropertyToEventType(prop);
    var meta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(this, element));
    if (event || !meta) 
    {
      element[prop] = value;
    }
    else
    {
      // props is the properties object we pass the definitional element or composite ViewModel
      var previousValue = element['getProperty'](prop);
      var propPath = prop.split('.');
      var topProp = propPath[0]
      // If the top level property is an object, make a copy otherwise the old/new values 
      // will be the same.
      var topPropPrevValue = props[topProp];
      if (oj.CollectionUtils.isPlainObject(topPropPrevValue))
        topPropPrevValue = oj.CollectionUtils.copyInto({}, topPropPrevValue, undefined, true);

      if (!oj.BaseCustomElementBridge.__CompareOptionValues(prop, meta, value, previousValue))
      {
        if (bOuter)
        {
          // This ultimately triggers our element defined property setter
          this.ValidateAndSetProperty(this.GetAliasForProperty.bind(this), props, prop, value, element);
        }
        else
        {
          // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
          oj.BaseCustomElementBridge.__SetProperty(this.GetAliasForProperty.bind(this), props, prop, value);
        }

        // Property change events for top level properties will be triggered by ValidateAndSetProperty so avoid firing twice
        var isSubprop = prop.indexOf('.') !== -1;
        if (isSubprop) {
          var subprop = {};
          subprop['path'] = prop;
          subprop['value'] = value;
          subprop['previousValue'] = previousValue;
          // Pass the top level property value/previousValues
          var updatedFrom = bOuter ? 'external' : 'internal';
          oj.BaseCustomElementBridge.__FirePropertyChangeEvent(element, topProp, props[topProp], topPropPrevValue, updatedFrom, subprop);
        }
        return { property: topProp, propertySet: true, isSubproperty: isSubprop };
      }
    }
    // We return true if a component property is updated with a different value and false
    // for other cases like on[Event] property updates
    return { property: null, propertySet: false, isSubproperty: false };
  },

  ValidateAndSetProperty: function(propNameFun, componentProps, property, value, element)
  {
    value = this.ValidatePropertySet(element, property, value);
    oj.BaseCustomElementBridge.__SetProperty(propNameFun, componentProps, property, value);
  },

  ValidatePropertySet: function(element, property, value)
  {
    var propsMeta = oj.BaseCustomElementBridge.getProperties(this, element);
    var propMeta = oj.BaseCustomElementBridge.__GetPropertyMetadata(property, propsMeta);
    var propAr = property.split('.');
     
    // TODO: Remove canSkip checks post 4.0.0 after metadata is generated from jsDoc.
    // Temporary fix for JET component translation subproperties that are not specified in metadata.
    var canSkipTypeCheck = this.CanSkipTypeCheck(propAr);
    if (!propMeta && !canSkipTypeCheck) 
    {
      oj.Logger.warn(oj.BaseCustomElementBridge.getElementInfo(element) + ": Ignoring property set for undefined property '" + property + "'.");
      return;
    }

    // Check readOnly property for top level property
    if (propsMeta[propAr[0]]['readOnly'])
    {
      this._throwError(element, "Read-only property '" + property + "' cannot be set.");
    }

    oj.BaseCustomElementBridge.__CheckEnumValues(element, property, value, propMeta);
    
    // TODO support checking for null values once we generate metadata from jsDoc and have accurate info
    // about component support for undefined/null
    if (!canSkipTypeCheck && value != null)
      return oj.BaseCustomElementBridge.__CheckType(element, property, value, propMeta);

    return value;
  },

  _attributeChangedCallback: function(attr, oldValue, newValue) 
  {
    var bridge = oj.BaseCustomElementBridge.getInstance(this);

    // The 1.0 custom element polyfill calls attribute changed callback on object creation which we want to ignore.
    // Also skip setProperty if the method isn't defined which should never be the case, but has occured in 
    // ojdatepicker Safari tests () so add this safety check to be sure. Best guess is test setup/polyfill issue.
    if (bridge._bCreateCalled && this['setProperty'])
    {
      var prop = oj.__AttributeUtils.attributeToPropertyName(attr);
      var propMeta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(bridge, this));

      oj.BaseCustomElementBridge.__CheckOverlappingAttribute(this, attr);

      // removeAttribute calls return null as the newValue which we want to treat as
      // a property unset and convert to undefined. We allow property null sets as an
      // actual property override.
      if (newValue === null)
        newValue = undefined;

      var params = {
        'detail': {'attribute': attr, 'value': newValue, 'previousValue': oldValue}
      };
      this.dispatchEvent(new CustomEvent('attribute-changed', params));

      var expression = oj.__AttributeUtils.getExpressionInfo(newValue).expr;
      if (!expression)
      {
        if (propMeta)
          this['setProperty'](prop, oj.BaseCustomElementBridge.__ParseAttrValue(this, attr, prop, newValue, propMeta));

        // This allows subclasses to handle special cases like global transfer 
        // attributes for JET components
        bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
      }
    }
  },

  _connected: function(element)
  {
    this._bConnected = true;
    if (!this._bCreateCalled) // initial attach
    {
      this._bCreateCalled = true;
      
      this._registerBusyState(element);
      
      this._monitorReadyPromise(element);
      
      this.InitializeElement(element);
      
      var self = this;
      
      this._getBindingProvider(element).then(
        function() 
        {
          self.CreateComponent(element);
        
        });
    }
    else
    {
	  // If the component had been previosly disconnected, and the 'ready'
	  // promise is still not resolved, we need to re-register the busy state
      if (!this._complete)
      {
        this._registerBusyState(element);
      }
      this.HandleReattached(element);
    }
  },

  _connectedCallback: function()
  {
    var bridge = oj.BaseCustomElementBridge.getInstance(this);
    bridge._connected(this);
  },

  _detachedCallback: function()
  {
    var bridge = oj.BaseCustomElementBridge.getInstance(this);
    bridge.HandleDetached(this);
  },

  // This wrapper does not provide any additional functionality to event listener functions
  // It exists solely to preserve event listener order
  _createEventListenerWrapper: function() {
    var eventListener;
    var domListener = function(event) {
      if (eventListener) {
        eventListener(event);
      }
    };
    domListener.setListener = function(listener) {
      eventListener = listener;
    }
    return domListener;    
  },

  _monitorReadyPromise: function(element)
  {
    var self = this;
    
    var completeHandler = function()
    {
  	  // If the component is disconnected, the busy state
  	  // must be already resolved
      if (self._bConnected)
      {
         self._resolveBusyState(element);
      }
      self._complete = true;
    };
    
    this.GetDelayedReadyPromise().getPromise().then(
      function() {
        // Add marker class to unhide components
        element.classList.add('oj-complete');
        completeHandler();
      },
      function() {
        // Add marker class to mark that there was an error duing upgrade so consumers like
        // VBCS can apply their own styling to incorrectly setup custom elements.
        element.classList.add('oj-incomplete');
        completeHandler();
      }
    );
  },

  _registerBusyState: function(element)
  {
    var busyContext = oj.Context.getContext(element).getBusyContext();
    this._initCompleteCallback = busyContext.addBusyState({'description' : oj.BaseCustomElementBridge.getElementInfo(element) + " is being upgraded."});
  },

  _resolveBusyState: function(element)
  {
    var callback = this._initCompleteCallback;
    if (!callback)
    {
      this._throwError(element, "Unexpected call to _resolveBusyState().");
    }
    
    this._initCompleteCallback = null;
    callback();
  },

  _setProperties: function(elem, props)
  {
    var mutationKeys = []; // keys for the 'dot mutation' properties
    var regularProps = {}; // the rest of the properties
    var hasRegularProps = false;
    
    var keys = Object.keys(props);
    for (var i=0; i<keys.length; i++)
    {
      var key = keys[i];
      if (key.indexOf('.') >= 0)
      {
        mutationKeys.push(key);
      }
      else
      {
        regularProps[key] = props[key];
        hasRegularProps = true;
      }
    }
    
    // Regular property updates may be batched
    if (hasRegularProps)
    {
      this.BatchedPropertySet(elem, regularProps);
    }
    
    // 'Dot notation' properties can only be set individually for now
    for (var p=0; p<mutationKeys.length; p++)
    {
      var mkey = mutationKeys[p];
      elem['setProperty'](mkey, props[mkey]);
    }
  },

  _throwError: function (elem, msg)
  {
    this.GetDelayedReadyPromise().rejectPromise();
    throw new Error(oj.BaseCustomElementBridge.getElementInfo(elem) + ": " + msg);
  },
  
  _resolveBindingProvider: function(provider)
  {
    if (this._bpResolve)
    {
      this._bpResolve(provider);
    }
    else
    {
      this._bpInst = provider;
    }
  },
  
  _setBpResolver: function(resolve)
  {
    this._bpResolve = resolve;
  },
  
  _getBindingProvider: function(element)
  { 
    var name = this._getBindingProviderName(element);
    
    if (name === oj.BaseCustomElementBridge._NO_BINDING_PROVIDER)
    {
      this.PlaybackEarlyPropertySets(element);
  
      return Promise.resolve(null);
    }
    else if (name == "knockout")
    {
      if (this._bpInst)
      {
        return Promise.resolve(this._bpInst);
      }
      else
      {
        return new Promise(this._setBpResolver.bind(this));
      }
    }
    else
    {
      this._throwError(element, "Unknown binding provider '" + name + "'.");
    }
  },
  
  _getBindingProviderName:function(element)
  {
    var cachedProp = "_ojBndgPrv";
    
    var name = element[cachedProp];
    if (name)
    {
      return name;
    }
    
    name = element.getAttribute("data-oj-binding-provider") || 
                oj.BaseCustomElementBridge._getCompositeBindingProviderName(element);
    
    if (!name)
    {
      var parent = element.parentElement;
      if (parent == null)
      {
        if (element === document.documentElement)
        {
          name = "knockout"; // the default
        }
        else
        {
          this._throwError(element, "Cannot determine binding provider for a disconnected subtree.");
        }
      }
      else
      {
        name = this._getBindingProviderName(parent);
      }
    }
    // cache provider name as a non-enumerable property
    Object.defineProperty(element, cachedProp, {'value': name});
    
    return name;
  }
 
  
};

/*************************/
/* PUBLIC STATIC METHODS */
/*************************/

/**
 * Returns the attributes including the dot notation versions of all complex properties
 * not including readOnly properties.
 * @param {Object} props The properties object
 * @return {Array}
 * @ignore
 */
oj.BaseCustomElementBridge.getAttributes = function(props) 
{
  var attrs = [];
  oj.BaseCustomElementBridge._getAttributesFromProperties('', props, attrs);
  return attrs;
};

/**
 * Helper method for Returns the attributes including the dot notation versions of all complex attributes
 * stored on a bridge instance
 * @param {string} propName The property to evaluate
 * @param {Object} props The properties object
 * @param {Array} attrs The attribute array to add to
 * @ignore
 */
oj.BaseCustomElementBridge._getAttributesFromProperties = function(propName, props, attrs) 
{
  if (props)
  {
    for (var prop in props)
    {
      var propMeta = props[prop];
      if (!propMeta['readOnly']) 
      {
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
oj.BaseCustomElementBridge.getElementInfo = function(element) 
{
  if (element)
    return element.tagName.toLowerCase() + " with id '" + element.id + "'";
  return "";
};

/**
 * Returns the bridge instance for an element.
 * @ignore
 */
oj.BaseCustomElementBridge.getInstance = function(element)
{
  var instance =  element[oj.BaseCustomElementBridge._INSTANCE_KEY];
  if (!instance)
  {
    var info = oj.BaseCustomElementBridge._registry[element.tagName.toLowerCase()];
    if (!info)
    {
      throw new Error(oj.BaseCustomElementBridge.getElementInfo(element) + " Attempt to interact with the custom element before it has been registered.");
    }
    
    instance = Object.create(info.bridgeProto);
    instance.InitializeBridge(element);
    Object.defineProperty(element, oj.BaseCustomElementBridge._INSTANCE_KEY, {'value': instance});
  }
  
  return instance;
};

/**
 * Returns the properties stored on a bridge instance
 * @param  {Object} bridge The bridge instance
 * @param  {Object} element The element instance
 * @return {Object}
 * @ignore
 */
oj.BaseCustomElementBridge.getProperties = function(bridge, element) 
{
  return bridge.METADATA['properties'];
};

/**
 * Returns an object if JET component tag has been registered, null otherwise.
 * @param  {string}  tagName The tag name to look up
 * @return {Object|null} True if the component module has been loaded and registered
 * @ignore
 */
oj.BaseCustomElementBridge.getRegistered = function(tagName) 
{
  if (tagName)
  {
    var info = oj.BaseCustomElementBridge._registry[tagName.toLowerCase()];
    if (info)
    {
      return {composite: info.composite};
    }
  }
  
  return null;
};

/**
 * Returns the slot map of slot name to slotted child elements for a given custom element.
 * If the given element has no children, this method returns an empty object.
 * Note that the default slot name is mapped to the empty string.
 * @param  {Element} element The custom element
 * @param {boolean} isComposite True if we are returning the slot map for a composite
 * @return {Object} A map of the child elements for a given custom element.
 * @ignore
 */
oj.BaseCustomElementBridge.getSlotMap = function (element, isComposite) {
  var slotMap = {};
  var childNodeList = element.childNodes;
  for (var i = 0; i < childNodeList.length; i++) {
    var child = childNodeList[i];
    // Only assign Text and Element nodes to a slot
    if (oj.BaseCustomElementBridge.isSlotAssignable(child)) {
      // Ignore text nodes that only contain whitespace
      if (child.nodeType !== 3 || child.nodeValue.trim()) {
        // Text nodes and elements with no slot attribute map to the default slot
        var savedSlot = isComposite ? child.__oj_slots : null;
        var slot = savedSlot != null ? savedSlot : child.getAttribute && child.getAttribute('slot');
        if (!slot) {
          slot = '';
        }
 
        if (!slotMap[slot]) {
          slotMap[slot] = [];
        }
        slotMap[slot].push(child);
      }
    }
  }
  return slotMap;
};

/**
 * Returns true if an element is slot assignable.
 * @param {Element} node The element to check
 * @return {boolean}
 * @ignore
 */
oj.BaseCustomElementBridge.isSlotAssignable = function(node)
{
  return node.nodeType === 1 || node.nodeType === 3;
};

/*****************************/
/* NON PUBLIC STATIC METHODS */
/*****************************/

/**
 * @ignore
 */
oj.BaseCustomElementBridge._NO_BINDING_PROVIDER = "none";

/**
 * @ignore
 */
oj.BaseCustomElementBridge._enumerateMetadataForKey = function(proto, metadata, key, callback)
{
  if (!metadata || !metadata[key])
    return;

  var values = metadata[key];
  var names = Object.keys(values);
  names.forEach(
    function(name) { 
      callback(proto, name, values[name]); 
    }
  );
};



/**
 * Returns a binding provder name if the element is managed by a JET composite
 * @ignore
 */
oj.BaseCustomElementBridge._getCompositeBindingProviderName = function(element)
{
  var name = oj.Composite ? oj.Composite.getBindingProviderName(element.parentElement) : null;
  return name;
};


/**
 * Verify metadata for required properties
 * @ignore
 */
oj.BaseCustomElementBridge._verifyMetadata = function(tagName, metadata)
{
  if (metadata)
  {
    // Verify that declared properties don't override any global HTML element properties
    var properties = metadata['properties'];
    if (properties)
    {
      // We are not currently checking for redefined aria-*, data-*, or event handler attributes, e.g. onclick.
      var globals = oj.BaseCustomElementBridge._GLOBAL_PROPERTIES;
      for (var i = 0; i < globals.length; i++)
      {
        if (properties[globals[i]])
          oj.Logger.error("Error registering composite %s. Redefined global HTML element attribute '%s' in metadata.", tagName, globals[i]);
      }
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
oj.BaseCustomElementBridge.__CheckEnumValues = function(element, property, value, metadata)
{
  // Only check enum values for string types
  if (typeof value == 'string' && metadata)
  {
    var enums = metadata["enumValues"];
    if (enums && enums.indexOf(value) === -1)
    {
      var bridge = oj.BaseCustomElementBridge.getInstance(element);
      bridge._throwError(element, "Invalid value '" + value + "' found for property '" + property + 
        "'. Expected one of the following '" + enums.toString() + "'.");
    }
  }
};


/**
 * @ignore
 */
oj.BaseCustomElementBridge.__CheckType = function(element, property, value, metadata)
{
  // We currently support checking of single typed properties of type: string, number,
  // boolean, Array, Object OR properties w/ two possible types where
  // the value can either be of type string|Array, string|Object, string|function, Array|Promise.
  // Any other types are currently skipped, but can be validated by the component in a future ER.
  var type = metadata['type'];
  if (type)
  {
    type = type.toLowerCase();

    var typeAr = type.split('|');
    var typeOf = typeof value;
    if (typeAr.length === 1)
    {
      if ((type.substring(0, 5) === 'array' && !Array.isArray(value)) ||
          (type.substring(0, 6) === 'object' && typeOf !== 'object') ||
          (type === 'number' && !(typeof value === 'number' && isFinite(value))) || // Number.isFinite isn't availabe on IE11
          (type === 'string' && typeOf !== 'string'))
      {
        oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, type);
      }

      // Treat boolean property sets like the DOM does where any value that passes 
      // 'if (boolVal)' results in a true prop set 
      if (type === 'boolean')
        value = !!value;
    }
    else if (typeAr.length === 2)
    {
      var strIdx = typeAr.indexOf('string');
      var promiseIdx = typeAr.indexOf('promise');
      if (strIdx !== -1 && typeOf !== 'string')
      {
        var otherType = strIdx === 0 ? typeAr[1] : typeAr[0];
        if ((otherType === 'function' && typeOf !== 'function') ||
            (otherType.substring(0, 5) === 'array' && !Array.isArray(value)) ||
            (otherType.substring(0, 6) === 'object' && typeOf !== 'object'))
        {
          oj.BaseCustomElementBridge.__ThrowTypeError(element, property, value, type);
        }
      }
      else if (promiseIdx !== -1 && !(value instanceof Promise))
      {
        var otherType = promiseIdx === 0 ? typeAr[1] : typeAr[0];
        if ((otherType.substring(0, 5) === 'array' && !Array.isArray(value)))
        {
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
oj.BaseCustomElementBridge.__CompareOptionValues = function(property, metadata, value1, value2)
{
  if (metadata['writeback'])
    return oj.Object.compareValues(value1, value2);
  else
    return value1 === value2;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__ThrowTypeError = function(element, property, value, type)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  bridge._throwError(element, "Invalid type '" + (typeof value) + "' found for property '" + 
    property + "'. Expected value of type '" + type + "'.");
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetDescriptor = function(tagName) 
{
  return oj.BaseCustomElementBridge._registry[tagName.toLowerCase()].descriptor;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetCache = function(tagName) 
{
  if (tagName)
    return oj.BaseCustomElementBridge._registry[tagName.toLowerCase()].cache;
  return null;
};

/**
 * Checks to see if there are any overlapping attribute for the given element and attribute
 * @ignore
 */
oj.BaseCustomElementBridge.__CheckOverlappingAttribute = function(element, attr) 
{
  var attrPath = attr.split('.');
  if (attrPath.length > 1)
  {
    attrPath.pop();
    while (attrPath.length)
    {
      var attrSubPath = attrPath.join('.');
      if (element.hasAttribute(attrSubPath))
      {
        var bridge = oj.BaseCustomElementBridge.getInstance(element);
        bridge._throwError(element, "Cannot set overlapping attributes '" + attr + "' and '" + attrSubPath + "'.");
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
oj.BaseCustomElementBridge.__GetPropertyMetadata = function(prop, metadata) 
{
  var meta = metadata;
  var propAr = prop.split('.');
  for (var i = 0; i < propAr.length; i++)
  {
    meta = meta[propAr[i]];
    if (!meta)
      break;
    
    if (propAr.length > 1 && i < propAr.length -1)
    {
      meta = meta['properties'];
      if (!meta)
        break;
    }
  }
  return meta;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__InitProperties = function(element, componentProps)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  bridge.__INITIALIZING_PROPS = true;
  var metaProps = oj.BaseCustomElementBridge.getProperties(bridge, element);
  if (metaProps)
  {
    var attrs = element.attributes; // attrs is a NodeList
    for (var i = 0; i < attrs.length; i++)
    {
      var attr = attrs[i];
      var property = oj.__AttributeUtils.attributeToPropertyName(attr.nodeName);

      // See if attribute is a component property
      var meta = oj.BaseCustomElementBridge.__GetPropertyMetadata(property, metaProps);
      if (!meta || meta['readOnly'])
        continue;

      // If complex property, check if there are any overlapping attributes
      oj.BaseCustomElementBridge.__CheckOverlappingAttribute(element, attr.nodeName);

      var info = oj.__AttributeUtils.getExpressionInfo(attr.value);
      if (!info.expr)
      {
        var value = oj.BaseCustomElementBridge.__ParseAttrValue(element, attr.nodeName, property, attr.value, meta);
        bridge.ValidateAndSetProperty(bridge.GetAliasForProperty.bind(bridge), componentProps, property, value, element);
      }
    }
  }
  bridge.__INITIALIZING_PROPS = false;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__SetProperty = function(propNameFun, componentProps, property, value)
{
  var propsObj = componentProps;
  var propPath = property.split('.');
  var branchedProps;
  // Set subproperty, initializing parent objects along the way unless the top level
  // property is not defined since setting it to an empty object will trigger a property changed
  // event. Instead, branch and set at the end. We only have listeners on top level properties
  // so setting a subproperty will not trigger a property changed event along the way.
  var topProp = propNameFun(propPath[0]);
  if (propPath.length > 1 && !componentProps[topProp])
  {
    branchedProps = {};
    propsObj = branchedProps;
  }

  // Walk to the correct location
  for (var i = 0; i < propPath.length; i++)
  {
    var subprop = propNameFun(propPath[i]);
    if (i === propPath.length - 1)
      propsObj[subprop] = value;
    else if (!propsObj[subprop]) {
      propsObj[subprop] = {};
    }
    propsObj = propsObj[subprop];
  }

  // Update the original component properties if we branched
  if (branchedProps)
    componentProps[topProp] = branchedProps[topProp];
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetProperty = function(componentProps, property)
{
  var propsObj = componentProps;
  var propPath = property.split('.');
  for (var i = 0; i < propPath.length; i++)
  {
    var subprop = propPath[i];
    // If no metadata is passed in, assume that the value has already been evaluated
    if (i === propPath.length - 1)
      return propsObj[subprop];
    else if (!propsObj[subprop])
      return undefined;
    propsObj = propsObj[subprop];
  }
};

/**
 * Returns the coerced attribute value using a custom parse function or the framework default.
 * @ignore
 */
oj.BaseCustomElementBridge.__ParseAttrValue = function(elem, attr, prop, val, metadata) 
{
  if (val == null)
    return val;
  
  var type = metadata['type'];
  var bridge = oj.BaseCustomElementBridge.getInstance(elem);
  function _coerceVal(value) {
    var coercedValue;
    try 
    {
      coercedValue = oj.__AttributeUtils.coerceValue(elem, attr, value, type);
    }
    catch (ex)
    {
      bridge._throwError(elem, ex);
    }
    return coercedValue;
  }

  var parseFunction = oj.BaseCustomElementBridge.__GetDescriptor(elem.tagName)['parseFunction'];
  if (parseFunction)
  {
    return parseFunction(val, prop, metadata, 
      function(value) {
        return _coerceVal(value); 
      }
    );
  }
  return _coerceVal(val);
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__ProcessEventListeners = function(metadata, bConvertName) 
{
  metadata = oj.CollectionUtils.copyInto({}, metadata, undefined, true, 1);
  metadata['properties'] = metadata['properties'] || {};
  oj.BaseCustomElementBridge._enumerateMetadataForKey(null, metadata, 'properties',
    function(proto, property, propertyMeta)
    {
      var eventName = oj.__AttributeUtils.propertyNameToChangeEventType(property);
      var eventListenerProperty = oj.__AttributeUtils.eventTypeToEventListenerProperty(eventName);
      metadata['properties'][eventListenerProperty] = {_derived:true, _eventListener:true};
    }
  );
  oj.BaseCustomElementBridge._enumerateMetadataForKey(null, metadata, 'events',
    function(proto, event, eventMeta)
    {
      var eventName = bConvertName ? oj.__AttributeUtils.eventTriggerToEventType(event) : event;
      var eventListenerProperty = oj.__AttributeUtils.eventTypeToEventListenerProperty(eventName);
      metadata['properties'][eventListenerProperty] = {_derived:true, _eventListener:true};
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
oj.BaseCustomElementBridge.__Register = function(tagName, descriptor, bridgeProto, isComposite)
{
  var name = tagName.toLowerCase();
  if (!oj.BaseCustomElementBridge._registry[name])
  {
    if (!descriptor)
      throw new Error("Cannot register " + tagName + ". Missing a descriptor.");

    oj.BaseCustomElementBridge._verifyMetadata(tagName, descriptor[oj.BaseCustomElementBridge.DESC_KEY_META]);
    oj.BaseCustomElementBridge._registry[name] = {descriptor: descriptor, bridgeProto: bridgeProto, composite: isComposite, cache: {}};
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
oj.BaseCustomElementBridge.__FirePropertyChangeEvent = function(element, name, value, previousValue, updatedFrom, subprop)
{
  // The bridge sets the ready to fire flag after the component has been instantiated.
  // We shouldn't fire property changed events before then unless the update comes from internally
  // for cases like readOnly property updates.
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  if (updatedFrom === 'external' && !bridge.__READY_TO_FIRE)
    return;

  var detail = {};
  if (subprop)
    detail['subproperty'] = subprop;
  detail['value'] = value;
  detail['previousValue'] = previousValue;
  detail['updatedFrom'] = updatedFrom;

  // Check if the subclass needs to do anything before we fire the property change event,
  // e.g. composites that need to call the propertyChanged ViewModel callback.
  if (bridge.beforePropertyChangedEvent)
    bridge.beforePropertyChangedEvent(element, name, detail);
  element.dispatchEvent(new CustomEvent(name + "Changed", {'detail': detail}));
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__DefineDynamicObjectProperty = function(obj, property, getter, setter)
{
  Object.defineProperty(obj, property, { 'enumerable': true, 'get': getter, 'set': setter });
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetUnique = function()
{
  return _UNIQUE + _UNIQUE_INCR++;
};

var _UNIQUE_INCR = 0;
var _UNIQUE = '_ojcustomelem';

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
/** @ignore */
oj.BaseCustomElementBridge._GLOBAL_PROPERTIES = ['accesskey', 'class', 'contenteditable', 'contextmenu',
'dir', 'draggable', 'hidden', 'id', 'is', 'lang', 'style', 'tabindex', 'title'];

/**
 * @ignore
 */
oj.BaseCustomElementBridge._INSTANCE_KEY = "_ojBridge";

/**
 * Class used to track the create state.
 * @constructor
 * @protected
 * @ignore
 */
oj.BaseCustomElementBridge.__DelayedPromise = function()
{
  var _promise;
  var _resolve;
  var _reject;

  /**
   * Returns the create Promise, creating one as needed.
   * @return {Promise}
   * @ignore
   */
  this.getPromise = function()
  {
    if (!_promise)
    {
      _promise = new Promise(function (resolve, reject) 
      {
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
  this.rejectPromise = function(reason)
  {
    if (_reject) 
    {
      _reject(reason);
    }
  };

  /**
   * Resolves the create Promise if one exists.
   * @ignore
   */
  this.resolvePromise = function(value)
  {
    if (_resolve) 
    {
      _resolve(value);
    }
  };
}




/** 
 * @ojoverviewdoc CustomElementOverview - JET Custom Elements
 * @since 4.1.0
 * @classdesc
 * {@ojinclude "name":"customElementOverviewDoc"}
 */ 

/**
 *       <h3 id="ce-usage-section" class="subsection-title">
 *               JET Custom Element Usage
 *           <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-usage-section"></a>
 *        </h3>
 *        <p>
 *            JET components are implemented as 
 *            <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements">custom HTML elements</a>
 *            and programmatic access to these components is similar to interacting with regular HTML elements. 
 *            All JET custom elements have names starting with 'oj-'. A custom element will be recognized by the framework 
 *            only after its module is loaded by the application. Once the element is recognized, the framework will register 
 *            a busy state for the element and will begin the process of 'upgrading' the element. The element will not be 
 *            ready for interaction (e.g. retrieving properties or calling methods) until the upgrade process is complete with 
 *            the exception of property setters and the <code>setProperty</code> and <code>setProperties</code> methods. The application should 
 *            listen to either the page-level or an element-scoped BusyContext before attempting to interact with 
 *            any JET custom elements. See the <a href="oj.BusyContext.html">BusyContext</a> documentation
 *            on how BusyContexts can be scoped.
 *        </p>
 *        
 *        <h4 id="ce-attributes-section" class="subsection-title">Attributes
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attributes-section"></a>
 *        </h4>
 *        <h5 id="ce-attrs-basics-section" class="subsection-title">Basics
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-basics-section"></a>
 *        </h5>
 *        <p>
 *          The next two sections will discuss how to work with custom element attributes and properties. Attributes
 *          are declared in the custom element's HTML while properties are accessed using JavaScript on the element
 *          instance. Attribute values set as string literals will be parsed and coerced to the property type. JET currently
 *          only supports the following string literal type coercions: boolean, number, string, Object and Array, where 
 *          Object and Array types must use JSON notation with double quoted strings. A special 'any' type is also supported
 *          and is described <a href="#ce-attrs-any-section">below</a>. All other types need to be set using 
 *          <a href="#ce-databind-section">expression syntax</a> in the DOM or using the element's property setters or <code>setProperty</code>
 *          and <code>setProperties</code> methods. Early property sets before the composite has been upgraded
 *          will not result in [property]Changed events and will be passed to the component as part of its initial state.
 *        </p>
 *        <p> 
 *          Attribute removals are treated as unsetting of a property where the component default value will be used if one exists. 
 *        </p>
 *        <p>
 *          As described <a href="#ce-databind-section">below</a>, JET uses [[...]] and {{...}} syntax to represent data bound expressions.
 *          JET does not currently provide any escaping syntax for "[[" or "{{" appearing at the beginning of the attribute
 *          value. You will need to add a space character to avoid having the string literal value interpreted as a binding
 *          expression (e.g. &lt;oj-some-element some-attribute='[ ["arrayValue1", "arrayValue2", ... ] ]'>&lt;/oj-some-element>).
 *        </p>
 *        <h5 id="ce-attrs-boolean-section" class="subsection-title">Boolean Attributes
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-boolean-section"></a>
 *        </h5>
 *        <p>
 *          JET custom elements treat boolean attributes differently than HTML5. Since a common application use case
 *          is to toggle a data bound boolean attribute, JET will coerce the string literal "false" to the boolean
 *          false for boolean attributes. The absence of a boolean attribute in the DOM will also be interpreted as false.
 *          JET will coerce the following string literal values to the boolean true and throw an Error for all other 
 *          invalid values.
 *          <ul>
 *            <li>No value assignment (e.g. &lt;oj-some-element boolean-attribute>&lt;/oj-some-element>)</li>
 *            <li>Empty string (e.g. &lt;oj-some-element boolean-attribute=''>&lt;/oj-some-element>)</li>
 *            <li>The 'true' string literal (e.g. &lt;oj-some-element boolean-attribute='true'>&lt;/oj-some-element>)</li>
 *            <li>The case-insensitive attribute name (e.g. &lt;oj-some-element boolean-attribute='boolean-attribute'>&lt;/oj-some-element>)</li>
 *          </ul>
 *        </p>
 *        <h5 id="ce-attrs-object-section" class="subsection-title">Object-Typed Attributes
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-object-section"></a>
 *        </h5>
 *        <p>
 *          Attributes that support Object type can be declaratively set using dot notation. 
 *          Note that applications should not set overlapping attributes as these will cause an error to be thrown.
 *          <pre class="prettyprint">
 *            <code>
 *              &lt;!-- person is an Object typed attribute with a firstName subproperty -->
 *              &lt;oj-some-element person.first-name="{{name}}">&lt;/oj-some-element>
 *              
 *              &lt;!-- overlapping attributes will throw an error -->
 *              &lt;oj-some-element person="{{personInfo}}" person.first-name="{{name}}">&lt;/oj-some-element>
 *            </code>
 *          </pre>
 *          If applications need to programmatically set subproperties, they can call  the JET custom element's <code>setProperty</code> 
 *          method with dot notation using the camelCased property syntax (e.g. element.setProperty("person.firstName", "Sally")).
 *        </p>
 *        <h5 id="ce-attrs-any-section" class="subsection-title">Any-Typed Attributes
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-any-section"></a>
 *        </h5>
 *        <p>
 *          Attributes that support any type are documented with type {any} in the API doc and will be coerced as
 *          Objects, Arrays, or strings. This limitation is due to the fact that we cannot determine whether value='2'
 *          for a property supporting any type should be parsed as a string or a number. The application should use
 *          data binding for all other value types.
 *        </p>
 *        <h4 id="ce-properties-section" class="subsection-title">Properties
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-properties-section"></a>
 *        </h4>
 *        <p>
 *            Every attribute listed in the component API doc will have a corresponding property
 *            on the HTML element and can be accessed once the component is fully upgraded. 
 *            See the <a href="#ce-proptoattr-section">property to attribute mapping</a>
 *            section below to see the syntax difference between setting attributes and properties. 
 *            Note that some properties are read only and updates to those properties using the property 
 *            setter will be ignored. The undefined value is treated as unsetting of a property when passed to the
 *            property setter and will result in the component using the default value if one exists. Unsetting of
 *            subproperties using the element's <code>setProperty</code> is not supported. Subproperties can only
 *            only be unset when the top level property is unset. 
 *            Property sets will not result in DOM attribute updates and after the custom 
 *            element is upgraded, the application should use the custom element properties, not attributes to check 
 *            the current value.
 *        </p>
 *        <p>
 *            When a property or attribute value changes, a [property]Changed <code>CustomEvent</code> 
 *            will be fired with the following properties in the event's detail property.
 *            <table class="props">
 *                <thead>
 *                    <tr>
 *                        <th>Name</th>
 *                        <th>Type</th>
 *                        <th>Description</th>
 *                    </tr>
 *                </thead>
 *                <tbody>
 *                    <tr>
 *                        <td>value</td>
 *                        <td>*</td>
 *                        <td>The current value of the property that changed.</td>
 *                    </tr>
 *                    <tr>
 *                        <td>previousValue</td>
 *                        <td>*</td>
 *                        <td>The previous value of the property that changed.</td>
 *                    </tr>
 *                    <tr>
 *                        <td>updatedFrom</td>
 *                        <td>string</td>
 *                        <td>
 *                          Where the property was updated from. Supported values are:
 *                          <ul>
 *                            <li>external - By the application, using either the element's property setter, setAttribute, or external data binding.</li>
 *                            <li>internal - By the component, e.g. after user interaction with a text field or selection.</li>
 *                          </ul>  
 *                        </td>
 *                    </tr>
 *                    <tr>
 *                        <td>subproperty</td>
 *                        <td>Object</td>
 *                        <td>An object holding information about the subproperty that changed.
 *                            <table class="props">
 *                                <thead>
 *                                    <tr>
 *                                        <th>Name</th>
 *                                        <th>Type</th>
 *                                        <th>Description</th>
 *                                    </tr>
 *                                </thead>
 *                                <tbody>
 *                                    <tr>
 *                                        <td>path</td>
 *                                        <td>string</td>
 *                                        <td>
 *                                          The subproperty path that changed, starting from the top level 
 *                                          property with subproperties delimited by '.'.
 *                                        </td>
 *                                    </tr>
 *                                    <tr>
 *                                        <td>value</td>
 *                                        <td>*</td>
 *                                        <td>The current value of the subproperty that changed.</td>
 *                                    </tr>
 *                                    <tr>
 *                                        <td>previousValue</td>
 *                                        <td>*</td>
 *                                        <td>The previous value of the subproperty that changed.</td>
 *                                    </tr>
 *                                </tbody>
 *                            </table>
 *                        </td>
 *                    </tr>
 *                </tbody>
 *            </table>
 *        </p>
 *        <p>
 *          Please note that in order for components to be notified of a property change for Array properties, the
 *          value should be data bound and updated using an expression, setting the property to an updated copy 
 *          by calling slice(), or by refreshing the component after an in place Array mutation.
 *        </p>
 *        <p>
 *          The application can listen to these [property]Changed events by adding a listener either declaratively:
 *          <pre class="prettyprint">
 *            <code>
 *              &lt;oj-some-element value="{{currentValue}}" on-value-changed="{{valueChangedListener}}">&lt;/oj-some-element>
 *            </code>
 *          </pre>
 *          or programmatically using the element property or the DOM addEventListener :
 *          <pre class="prettyprint">
 *            <code>
 *              someElement.addEventListener("valueChanged", function(event) {...});
 *            </code>
 *            <code>
 *              someElement.onValueChanged = function(event) {...};
 *            </code>
 *          </pre>
 *        </p>
 *        <p>
 *          Some JET components support complex properties. If the application needs to set a single subproperty
 *          instead of the entire complex property, the <code>setProperty</code> method should be used 
 *          instead to ensure that [property]Changed events will be fired correctly. Note that directly updating
 *          the subproperty via dot notation (e.g. element.topProp.subProp = newValue) will not result in a 
 *          [property]Changed event being fired.
 *        </p>
 *        <h4 id="ce-proptoattr-section" class="subsection-title">Property-to-Attribute Mapping
 *          <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-proptoattr-section"></a>
 *        </h4>
 *        <p>
 *          The following rules apply when mapping property to attribute names:
 *          <ul>
 *             <li>Attribute names are case insensitive. CamelCased properties are mapped to 
 *               kebab-cased attribute names by inserting a dash before the uppercase letter and converting that letter to lower case
 *               (e.g. a "chartType" property will be mapped to a "chart-type" attribute).</li>
 *             <li> The reverse occurs when mapping a property name from an attribute name.</li>
 *          </ul>
 *        </p>        
 *        <h4 id="ce-databind-section" class="subsection-title">Data Binding and Expression Writeback
 *          <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-databind-section"></a>
 *        </h4>
 *          The upgrade of JET custom elements relies on any data binding resolving, the management of which 
 *          is done by a binding provider. The binding provider is responsible for setting and updating attribute
 *          expressions and any custom elements within its managed subtree will not finish upgrading until it
 *          applies bindings on that subtree. By default, there is a single binding provider for a page, 
 *          but subtree specific binding providers can be added by using the <code>data-oj-binding-provider</code> 
 *          attribute with values of "none" and "knockout". The default binding provider is knockout, but if a 
 *          page or DOM subtree does not use any expression syntax or knockout, the application can set 
 *          <code>data-oj-binding-provider="none"</code> on that element so its dependent JET custom elements
 *          do not need to wait for bindings to be applied to finish upgrading. <b>When using the knockout binding
 *          provider, applications should require the ojknockout module.</b>
 *        <p>
 *          When a JET custom element is managed by a binding provider, its attributes may be set to a binding
 *          expression. Component attributes can be set directly using one-way [[...]] or two-way {{...}} data binding syntax
 *          whereas global attributes and attributes on any native HTML element may be one-way bound by prefixing the attribute
 *          name with ':' (e.g. :id='[[idVar]]'). The attribute binding syntax results in the attribute being set in the DOM
 *          with the evaluated expression. Since global HTML attributes are always string typed, expressions using the ':' 
 *          prefixing should resolve to strings with the exception of the style and class attributes which support additional types. 
 *          In the case of component attributes, applications are recommended to bind the attribute names directly and avoid the 
 *          use of the ":" prefix.
 *        </p>
 *        <p>
 *          The class attribute binding supports a space delimited string of classes, an Array of classes, or an Object to toggle
 *          classes (e.g. :class='[[{errorClass: hasErrors}]]' where the hasErrors expression determines whether the errorClass class
 *          is present in the DOM). Note that the Array and string types will override existing values in the class attribute 
 *          when updates occur, whereas the Object type will only add and remove the classes specified. Since JET custom elements 
 *          add their own classes, we recommend using the Object type when using the class attribute binding on JET custom elements.
 *        </p>
 *        <p>
 *          When using the style attribute binding with an Object type, the style Object names should be the JavaScript 
 *          names for that style (e.g. fontWeight instead of font-weight). Since the style attribute supports Object 
 *          types, it also supports dot notation for setting style subproperties directly (e.g. :style.font-weight='[[...]]').
 *        </p>
 *        <p>
 *          Applications can control expression writeback in the 
 *          custom element by using {{...}} syntax for two-way writable binding expressions or [[...]] for 
 *          one-way only expressions. Most component properties do not writeback and those that do will indicate
 *          it in their API doc. Please note that there should be no spaces between the braces when using the data 
 *          bind syntax (e.g. some-attribute='[ [...] ]').
 *        </p>
 *        <p>
 *          Certain properties such as 'value' on editable components support updating the associated expression 
 *          automatically whenever their value changes. This functionality is also known as 'writeback'. 
 *          Applications can control expression writeback by using  the {{...}} syntax for two-way writable 
 *          binding expressions or [[...]] for one-way only expressions. The one-way expressions should 
 *          be used when the application needs expressions strictly for 'downstream-only' purposes, e.g. only for 
 *          updating a component property. This is different from the read-only properties, which are 'upstream-only', 
 *          e.g. they are used only to monitor component state. Thus an expression associated with a read-only property 
 *          should always use the {{}} syntax. Most component properties do not writeback and those that do will 
 *          indicate it in their API doc. Please note that there should be no spaces between the braces when using 
 *          the data bind syntax (e.g. some-attribute='[ [...] ]').
 *        </p>
 *        <pre class="prettyprint">
 *          <code>
 *            &lt;oj-some-element value="[[currentValue]]" selection={{currentSelection}}>&lt;/oj-some-element>
 *          </code>
 *        </pre>        
 *        <h4 id="ce-methods-section" class="subsection-title">Methods
 *          <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-methods-section"></a>
 *        </h4>
 *        <p>
 *          Methods can be accessed on the JET custom HTML element after the element is fully upgraded. See
 *          the specific method doc for sample usages.
 *        </p>        
 *        <h4 id="ce-events-section" class="subsection-title">Events and Listeners
 *          <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-events-section"></a>
 *        </h4>
 *        <p>
 *          By default, JET components will fire [property]Changed (e.g. valueChanged) <code>CustomEvents</code>
 *          whenever a property is updated. These events, unlike other component events, are non bubbling.
 *          See the <a href="#ce-properties-section">properties section</a> above
 *          for details on the event payload.
 *        </p>
 *        <p>
 *          In addition to supporting event listeners via the standard <code>addEventListener</code>
 *          mechanism, both JET custom elements and native HTML elements support declarative specification of event
 *          listeners via <code>on-[event-name]</code> attributes (e.g. <code>on-click</code>,
 *          <code>on-value-changed</code> or <code>on-oj-expand</code>). The attributes ultimately delegate to the standard
 *          <code>addEventListener</code> mechanism and only support data bound expressions
 *          that evaluate to functions; arbitrary JavaScript will not be accepted.
 *          Sample usages can be seen in the attribute API doc.
 *        </p>
 *        <p>
 *          In addition to the event parameter, event listeners specified via <code>on-[event-name]</code>
 *          attributes will receive two additional parameters when they are invoked: <code>data</code> and <code>bindingContext</code>.
 *          The <code>bindingContext</code> parameter provides the listener with the entire data binding context that
 *          was applied to the element while the data parameter provides convenient access to relevant data.
 *          When in an iteration context (e.g. inside an <code>oj-bind-for-each</code>), the <code>data</code> parameter
 *          is equal to <code>bindingContext['$current']</code>; otherwise, it is equal to <code>bindingContext['$data']</code>.
 *          These event listeners should be written with signatures of <code>function(event, data, bindingContext)</code>.
 *        </p>
 *        <p>
 *          Please note that there is a
 *          current limitation where event listeners specified using this syntax can only be
 *          set during component initialization. Subsequent setAttribute calls for the
 *          event listener attributes will be ignored.
 *        </p>
 *        <p>
 *          Component events that are specifically documented in a JET custom element's API
 *          doc (including [property]Changed events) can also have listeners set via direct
 *          assignment of an on[EventName] property on the element (e.g. onClick or
 *          onOjExpand).  Note however that when these events bubble up through the DOM,
 *          they can only be listened to via addEventListener calls or on-[event-name]
 *          attributes on parent elements.  Event listeners that are specified via addEventListener
 *          or direct property assignment will not receive the additional parameters described above;
 *          they will be invoked with the single event parameter only.
 *        </p>
 * @ojfragment customElementOverviewDoc - General description doc fragment that shows up in every component's page via a link.
 * @memberof CustomElementOverview
 */
});