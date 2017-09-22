/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
        throw "Read-only property " + property + " cannot be set on "+ this.tagName;
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
      this.HandleReattached();
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
  if (parseFunction)
  {
    return parseFunction(val, prop, metadata, 
      function(value) {
        return oj.__AttributeUtils.coerceValue(elem, attr, value, type); 
      }
    );
  }
  return oj.__AttributeUtils.coerceValue(elem, attr, val, type);
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




});
