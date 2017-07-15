/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'promise', 'customElements'], function(oj)
{
/**
 * Custom element bridge prototype
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
  getPropertiesPromise: function()
  {
    return this.GetDelayedPropertiesPromise().getPromise();
  },

  getPrototype: function(descriptor) {
    var proto = Object.create(HTMLElement.prototype);
    this.InitProto(proto);

    var metadata = this.GetMetadata(descriptor);
    // Enumerate metadata to define the prototype properties, methods, and events 
    oj.BaseCustomElementBridge._enumerateMetadataForKey(proto, metadata, 'properties', this.DefinePropertyCallback.bind(this));
    oj.BaseCustomElementBridge._enumerateMetadataForKey(proto, metadata, 'methods', this.DefineMethodCallback.bind(this));
    
    // Add additional element methods not defined in metadata, e.g. getNodeBySubId/getSubIdByNode or get/setProperty
    this.AddComponentMethods(proto);

    // Add lifecycle listeners
    proto['createdCallback'] = oj.BaseCustomElementBridge._createdCallback;
    proto['attachedCallback'] = oj.BaseCustomElementBridge._attachedCallback;
    proto['attributeChangedCallback'] = oj.BaseCustomElementBridge._attributeChangedCallback;
    proto['detachedCallback'] = oj.BaseCustomElementBridge._detachedCallback;

    return proto;
  },

  notifyBindingsApplied: function(element, bindingContext)
  {
    this.HandleBindingsApplied(element, bindingContext);
  },  

  notifyBindingsCleaned: function(element)
  {
    this.HandleBindingsCleaned(element);
    this.GetDelayedReadyPromise().resolvePromise();
  },  

  /**
   * Notifies the bridge that the bindings have failed so we can resolve the BusyState.
   */
  notifyBindingsFailed: function(element)
  {
    this.GetDelayedReadyPromise().rejectPromise();
  },
  
  /**
   * Notifies the bridge that the bindings have been invoked and registers the given element 
   * as busy on the page level busy context.
   */
  notifyBindingsInvoked: function(element)
  {
    var busyContext = oj.Context.getContext(element).getBusyContext();
    var initCompleteCallback = busyContext.addBusyState({'description' : element.tagName + " identified by '" + element.id + "' is being upgraded."});
    
    this.GetDelayedReadyPromise().getPromise().then(
      function() {
        // Add marker class to unhide components
        element.classList.add('oj-complete');
        // Resolve BusyState when Promise is resolved
        initCompleteCallback();
      },
      function(reason) {
        // Resolve BusyState when Promise is rejected
        initCompleteCallback();
      }
    );
  },

  AddComponentMethods: function(proto) {},

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
   * Returns a promise that will be resolved when the comopnent has been initialized.
   * @return {Promise}
   */
  GetDelayedReadyPromise: function()
  {
    if (!this._delayedReady)
      this._delayedReady = new oj.BaseCustomElementBridge.__DelayedPromise();
    return this._delayedReady;
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

  HandleAttached: function(element) {},

  HandleAttributeChanged: function(element, attr, oldValue, newValue) {},

  HandleBindingsApplied: function(element, bindingContext) {},

  HandleBindingsCleaned: function(element) {},

  HandleCreated: function(element) {},

  HandleDetached: function(element) {},

  InitProto: function(proto) {},
  
};

/*************************/
/* PUBLIC STATIC METHODS */
/*************************/

/**
 * Returns the bridge instance for an element.
 * @ignore
 */
oj.BaseCustomElementBridge.getInstance = function(elem)
{
  var instance =  elem[oj.BaseCustomElementBridge._INSTANCE_KEY];
  if (!instance)
  {
    var info = oj.BaseCustomElementBridge._registry[elem.tagName.toLowerCase()];
    if (!info)
    {
      throw "Attempt to interact with the custom element before it has been registered";
    }
    
    instance = Object.create(info.bridgeProto);
    Object.defineProperty(elem, oj.BaseCustomElementBridge._INSTANCE_KEY, {'value': instance});
  }
  
  return instance;
};

/**
 * Returns whether a JET component tag has been registered.
 * @param  {string}  tagName The tag name to look up
 * @return {boolean} True if the component module has been loaded and registered
 * @ignore
 */
oj.BaseCustomElementBridge.isRegistered = function(tagName) 
{
  if (tagName)
    return oj.BaseCustomElementBridge._registry[tagName.toLowerCase()] !== undefined;
  return false;
};

oj.BaseCustomElementBridge.getProperties = function(bridge) 
{
  return (bridge.METADATA && bridge.METADATA['properties']);
};

/*****************************/
/* NON PUBLIC STATIC METHODS */
/*****************************/

/**
 * @ignore
 */
oj.BaseCustomElementBridge._attachedCallback = function()
{
  var bridge = oj.BaseCustomElementBridge.getInstance(this);
  bridge.HandleAttached(this);
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge._attributeChangedCallback = function(attr, oldValue, newValue)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(this);
  var prop = oj.__AttributeUtils.attributeToPropertyName(attr);
  var propMeta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(bridge));

  // Only deal with element defined attribute changes or transfer attributes
  if (propMeta && !propMeta['readOnly'])
  {
    oj.BaseCustomElementBridge.__CheckOverlappingAttribute(this, attr);

    var params = {
      'detail': {'attribute': attr, 'value': newValue, 'previousValue': oldValue}
    };
    this.dispatchEvent(new CustomEvent('attribute-changed', params));

    var info = oj.__AttributeUtils.getExpressionInfo(newValue);
    if (!info.expr)
      this['setProperty'](prop, oj.BaseCustomElementBridge.__ParseAttrValue(prop, newValue, propMeta, bridge.PARSE_FUNCTION));
  }

  bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge._createdCallback = function()
{
  var bridge = oj.BaseCustomElementBridge.getInstance(this);
  bridge.HandleCreated(this);
};

/**
 * @ignore
 */
oj.BaseCustomElementBridge._detachedCallback = function()
{
  var bridge = oj.BaseCustomElementBridge.getInstance(this);
  bridge.HandleDetached(this);
};

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
      throw "Invalid value found for " + element.tagName + "." + property + ". Found: " + value + ". Expected: " + enums.toString();
  }
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
        throw "Cannot set overlapping attributes " + attr + " and " + attrSubPath;
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
oj.BaseCustomElementBridge.__InitProperties = function(element, componentProps, metaProps, parseFun)
{
  var attrs = element.attributes; // attrs is a NodeList
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
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
      var value = oj.BaseCustomElementBridge.__ParseAttrValue(property, attr.value, meta, parseFun);
      oj.BaseCustomElementBridge.__CheckEnumValues(element, property, value, meta);
      oj.BaseCustomElementBridge.__SetProperty(bridge.GetAliasForProperty.bind(bridge), componentProps, property, value);
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
oj.BaseCustomElementBridge.__ParseAttrValue = function(prop, val, metadata, parseFunction) 
{
  if (val == null)
    return val;
  
  var type = metadata['type'];
  if (parseFunction)
  {
    return parseFunction(val, prop, metadata, 
      function(value) {
        return oj.__AttributeUtils.coerceValue(prop, value, type); 
      }
    );
  }
  return oj.__AttributeUtils.coerceValue(prop, val, type);
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
 */
oj.BaseCustomElementBridge.__Register = function(tagName, descriptor, bridgeProto)
{
  var name = tagName.toLowerCase();
  if (!oj.BaseCustomElementBridge._registry[name])
  {
    if (!descriptor)
      throw "Error registering " + tagName + ": missing a descriptor.";
    oj.BaseCustomElementBridge._registry[name] = {descriptor: descriptor, bridgeProto: bridgeProto};
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
