/**
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

    // Add lifecycle listeners
    proto['attributeChangedCallback'] = this._attributeChangedCallback;
    proto['connectedCallback'] = this._connectedCallback;
    proto['disconnectedCallback'] = this._detachedCallback;
    
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

  getPropertiesPromise: function()
  {
    return this.GetDelayedPropertiesPromise().getPromise();
  },

  /**
   * Notifies the bridge that the bindings have failed so we can resolve the BusyState.
   */
  notifyBindingsFailed: function(element)
  {
    this.GetDelayedReadyPromise().rejectPromise();
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
   * Returns a promise that will be resolved when an element's properties can be set by the custom element binding.
   * @return {Promise}
   */
  GetDelayedPropertiesPromise: function()
  {
    if (!this._delayedProps)
      this._delayedProps = new oj.BaseCustomElementBridge.__DelayedPromise();
    return this._delayedProps;
  },

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
    return {};
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

  HandleBindingsCleaned: function(element) {},

  HandleDetached: function(element) {
    this._bConnected = false;
    if (!this._complete)
    {
      this._resolveBusyState();
    }
  },

  HandleReattached: function(element) {},

  InitializeElement: function(element) {
    var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);
    this.METADATA = this.GetMetadata(descriptor);
    this._eventListeners = {};
  },

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

  ValidateAndSetProperty: function(propNameFun, componentProps, property, value, element)
  {
    value = this.ValidatePropertySet(element, property, value);
    oj.BaseCustomElementBridge.__SetProperty(propNameFun, componentProps, property, value);
  },

  ValidatePropertySet: function(element, property, value)
  {
    if (value != null)
    {
      var propsMeta = oj.BaseCustomElementBridge.getProperties(this);
      var propMeta = oj.BaseCustomElementBridge.__GetPropertyMetadata(property, propsMeta);
      var propAr = property.split('.');
       
      // TODO: Remove canSkip checks post 4.0.0 after metadata is generated from jsDoc.
      // Temporary fix for JET component translation subproperties that are not specified in metadata.
      var canSkipTypeCheck = this.CanSkipTypeCheck(propAr);
      if (!propMeta && !canSkipTypeCheck) 
      {
        oj.Logger.warn("Ignoring property set for undefined property " + property + " on " + element.tagName);
        return;
      }

      // Check readOnly property for top level property
      if (propsMeta[propAr[0]]['readOnly'])
      {
        this.resolveDelayedReadyPromise();
        throw "Read-only property " + property + " cannot be set on "+ element.tagName;
      }

      oj.BaseCustomElementBridge.__CheckEnumValues(element, property, value, propMeta);
      
      if (!canSkipTypeCheck)
        return oj.BaseCustomElementBridge.__CheckType(element, property, value, propMeta);
    }
    return value;
  },

  _attributeChangedCallback: function(attr, oldValue, newValue) 
  {
    var bridge = oj.BaseCustomElementBridge.getInstance(this);

    // The 1.0 custom element polyfill calls attribute changed callback on object creation
    // which we want to ignore
    if (bridge._bCreateCalled)
    {
      var prop = oj.__AttributeUtils.attributeToPropertyName(attr);
      var propMeta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(bridge));

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

      if (propMeta) {
        var info = oj.__AttributeUtils.getExpressionInfo(newValue);
        if (!info.expr)
          this['setProperty'](prop, oj.BaseCustomElementBridge.__ParseAttrValue(this, attr, prop, newValue, propMeta, bridge.PARSE_FUNCTION));
      }

      // This allows subclasses to handle special cases like global transfer 
      // attributes for JET components
      bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
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
      
      oj.BaseCustomElementBridge._getBindingProvider(element).then(
        function(provider) 
        {
          provider.whenReady(element).then(
            function()
            {
              self.CreateComponent(element);
            }
          );
          
          // Add dispose callback (currently implemented only by the KO provider)
          provider.addDisposeCallback(element, self.HandleBindingsCleaned.bind(self));
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
         self._resolveBusyState();
      }
      self._complete = true;
    };
    
    this.GetDelayedReadyPromise().getPromise().then(
      function() {
        // Add marker class to unhide components
        element.classList.add('oj-complete');
        completeHandler();
      },
      completeHandler
    );
  },

  _registerBusyState: function(element)
  {
    var busyContext = oj.Context.getContext(element).getBusyContext();
    this._initCompleteCallback = busyContext.addBusyState({'description' : element.tagName + " identified by '" + element.id + "' is being upgraded."});
  },

  _resolveBusyState: function()
  {
    var callback = this._initCompleteCallback;
    if (!callback)
    {
      this.resolveDelayedReadyPromise();
      throw "Unexpected call to _resolveBusyState()";
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
        var type = propMeta['type'];
        if (type && type.toLowerCase() === 'object')
        {
          oj.BaseCustomElementBridge._getAttributesFromProperties(concatName + '.', propMeta['properties'], attrs);
        }
      }
    }
  }
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
      throw "Attempt to interact with the custom element before it has been registered";
    }
    
    instance = Object.create(info.bridgeProto);
    Object.defineProperty(element, oj.BaseCustomElementBridge._INSTANCE_KEY, {'value': instance});
  }
  
  return instance;
};

/**
 * Returns the properties stored on a bridge instance
 * @param  {Object} bridge The bridge instance
 * @return {Object}
 * @ignore
 */
oj.BaseCustomElementBridge.getProperties = function(bridge) 
{
  return (bridge.METADATA && bridge.METADATA['properties']);
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
 * @ignore
 */
oj.BaseCustomElementBridge._getBindingProvider = function(element)
{
  var promise;
  
  var name = oj.BaseCustomElementBridge._getBindingProviderName(element);
  
  if (name === oj.BaseCustomElementBridge._NO_BINDING_PROVIDER)
  {
    promise = Promise.resolve(
        {        
          whenReady: function(){return Promise.resolve(false);},
          addDisposeCallback: function(){}
        }
    );
  }
  else if (name == "knockout")
  {
    promise = oj.BaseCustomElementBridge._getKnockoutProviderPromise();
  }
  else
  {
    var bridge = oj.BaseCustomElementBridge.getInstance(element);
    bridge.resolveDelayedReadyPromise();
    throw "Unknown binding provider: " + name;
  }
  
  return promise;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge._getBindingProviderName = function(element)
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
        var bridge = oj.BaseCustomElementBridge.getInstance(element);
        bridge.resolveDelayedReadyPromise();
        throw "Cannot determine binding provider for a disconnected subtree";
      }
    }
    else
    {
      name = oj.BaseCustomElementBridge._getBindingProviderName(parent);
    }
  }
  // cache provider name as a non-enumerable property
  Object.defineProperty(element, cachedProp, {'value': name});
  
  return name;
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
 * @ignore
 */
oj.BaseCustomElementBridge._getKnockoutProviderPromise = function()
{
  if (!oj.BaseCustomElementBridge._cachedKnockoutProviderPromise)
  {
    if (!oj.__isAmdLoaderPresent())
    {
      oj.BaseCustomElementBridge._cachedKnockoutProviderPromise =
        Promise.resolve(oj._KnockoutBindingProvider.getInstance());
    }
    else
    {
      oj.BaseCustomElementBridge._cachedKnockoutProviderPromise =
        new Promise(
          function(resolve, reject)
          {
            require(['ojs/ojknockout'], resolve, reject);
          }
        );
    }
  }

  return oj.BaseCustomElementBridge._cachedKnockoutProviderPromise;
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
      bridge.resolveDelayedReadyPromise();
      throw "Invalid value found for property '" + property + "' on " + element.tagName + " with id " + element.id + 
          "'. Found: '" + value + "'. Expected one of the following: " + enums.toString();
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
      if (strIdx !== -1 && typeof typeAr[strIdx] !== 'string')
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
 * @ignore
 */
oj.BaseCustomElementBridge.__ThrowTypeError = function(element, property, value, type)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  bridge.resolveDelayedReadyPromise();
  throw "Invalid type found for " + element.tagName + " property '" + property + 
    "'. Found: " + value + " of type " + (typeof value) + ", but expected type " + type + ".";
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetDescriptor = function(tagName) 
{
  if (tagName)
    return oj.BaseCustomElementBridge._registry[tagName.toLowerCase()].descriptor;
  return null;
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
        bridge.resolveDelayedReadyPromise();
        throw "Cannot set overlapping attributes " + attr + " and " + attrSubPath;
      }
      attrPath.pop();
    }
  }
};

/**
  * Returns the metadata for the property, walking down the metadata hierarchy
  * for subproperties. Returns null for readOnly properties
  * @ignore
  */
oj.BaseCustomElementBridge.__GetPropertyMetadata = function(prop, metadata) 
{
  var meta = metadata;
  var propAr = prop.split('.');
  for (var i = 0; i < propAr.length; i++)
  {
    meta = meta[propAr[i]];
    if (propAr.length > 1 && i < propAr.length -1)
    {
      meta = meta['properties'];
      if (!meta)
        return null;
    }
  }
  return meta;
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__InitProperties = function(element, componentProps, parseFun)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  var metaProps = oj.BaseCustomElementBridge.getProperties(bridge);
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
        var value = oj.BaseCustomElementBridge.__ParseAttrValue(element, attr.nodeName, property, attr.value, meta, parseFun);
        bridge.ValidateAndSetProperty(bridge.GetAliasForProperty.bind(bridge), componentProps, property, value, element);
      }
    }
  }
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__SetProperty = function(propNameFun, componentProps, property, value)
{
  var propsObj = componentProps;
  var propPath = property.split('.');
  // Set subproperty, initializing parent objects along the way
  for (var i = 0; i < propPath.length; i++)
  {
    var subprop = propNameFun(propPath[i]);
    // If no metadata is passed in, assume that the value has already been evaluated
    if (i === propPath.length - 1) {
      propsObj[subprop] = value;
      return;
    }
    else if (!propsObj[subprop]) {
      propsObj[subprop] = {};
    }
    propsObj = propsObj[subprop];
  }
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge.__GetProperty = function(componentProps, property)
{
  var propsObj = componentProps;
  var propPath = property.split('.');
  // Set subproperty, initializing parent objects along the way
  for (var i = 0; i < propPath.length; i++)
  {
    var subprop = propPath[i];
    // If no metadata is passed in, assume that the value has already been evaluated
    if (i === propPath.length - 1)
      return propsObj[subprop];
    else if (!propsObj[subprop])
      return null;
    propsObj = propsObj[subprop];
  }
};

/**
 * Returns the coerced attribute value using a custom parse function or the framework default.
 * @ignore
 */
oj.BaseCustomElementBridge.__ParseAttrValue = function(elem, attr, prop, val, metadata, parseFunction) 
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
      bridge.resolveDelayedReadyPromise();
      throw ex;
    }
    return coercedValue;
  }

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
      throw "Error registering " + tagName + ": missing a descriptor.";
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
 */
oj.BaseCustomElementBridge.__FirePropertyChangeEvent = function(element, name, value, previousValue)
{
  var detail = {};
  var subpropPath = name.split('.');
  var eventName = name;
  var eventValue = value;
  var eventPrevValue = previousValue;
  if (subpropPath.length > 1)
  {
    var subproperty = {};
    subproperty['path'] = name;
    subproperty['value'] = value;
    subproperty['previousValue'] = previousValue;
    detail['subproperty'] = subproperty;
    eventName = subpropPath[0];
    // We don't make a copy of the top level property so the old and new values will be the same;
    eventValue = element[eventName];
    eventPrevValue = eventValue;
  }
  detail['value'] = eventValue;
  detail['previousValue'] = eventPrevValue;
  element.dispatchEvent(new CustomEvent(eventName + "Changed", {'detail': detail}));
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
    else
    {
      _promise = Promise.resolve(value);
    }
  };
}




/** 
 * @ojoverviewdoc CustomElementOverview - JET Custom Elements
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
 *            ready for interaction (e.g. using properties or methods) until the upgrade process is complete. The application should 
 *            listen to either the page-level or an element-scoped BusyContext before attempting to interact with 
 *            any JET custom elements. See the <a href="oj.BusyContext.html">BusyContext</a> documentation
 *            on how BusyContexts can be scoped.
 *        </p>
 *        
 *        <h4 id="ce-attributes-section" class="subsection-title">Attributes
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attributes-section"></a>
 *        </h4>
 *        <h5 id="ce-attrs-basics-sectionn" class="subsection-title">Basics
 *            <a class="bookmarkable-link" title="Bookmarkable Link" href="#ce-attrs-basics-section"></a>
 *        </h5>
 *        <p>
 *          The next two sections will discuss how to work with custom element attributes and properties. Attributes
 *          are declared in the custom element's HTML while properties are accessed using JavaScript on the element
 *          instance. Attribute values set as string literals will be parsed and coerced to the property type. JET currently
 *          only supports the following string literal type coercions: boolean, number, string, Object and Array, where 
 *          Object and Array types must use JSON notation with double quoted strings. A special 'any' type is also supported
 *          and is described <a href="#ce-attrs-any-section">below</a>.  All other types need to be set using 
 *          <a href="#ce-databind-section">expression syntax</a> in the DOM or using the property setters 
 *          after the JET element has been upgraded.
 *        </p>
 *        <p> 
 *          Attribute removals are treated as unsetting of a property where the component default value will be used if one exists. 
 *        </p>
 *        <p> 
 *          As described <a href="#ce-databind-section">below</a, JET uses [[...]] and {{...}} syntax to represent data bound expressions. 
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
 *          Attributes that support any type are documented with type {*} in the API doc and will be coerced as
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
 *                                        <td>The subproperty path that changed.</td>
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
 *          instead of the entire complex property, the <a href="#setProperty">setProperty</a> method should be used 
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
 *          with the evaluated expression. In the case of component attributes, applications are recommended to bind the attribute
 *          names directly and avoid the use of the ":" prefix.
 *        </p>
 *        <p>
 *          JET also supports a style binding using the same ':' prefix which takes an expression resolving to an Object. 
 *          The style Object names should be the JavaScript names for that style (e.g. fontWeight instead of font-weight). 
 *          Since the style attribute supports Object types, it also supports dot notation for setting style subproperties
 *          directly (e.g. :style.font-weight='[[...]]').
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
