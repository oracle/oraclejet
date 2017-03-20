/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'promise', 'ojs/ojcustomelement', 'ojs/ojcomposite-knockout'], function(oj)
{
/**
 * JET component custom element bridge
 * @class
 * @ignore
 */
oj.CompositeElementBridge = {};

/**
 * Prototype for the JET component custom element bridge instance
 */
oj.CompositeElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);

oj.CollectionUtils.copyInto(oj.CompositeElementBridge.proto,
{
  AddComponentMethods: function(proto) 
  {
    // Add subproperty getter/setter
    proto['setProperty'] = function(prop, value) { 
      var event = oj.__AttributeUtils.eventListenerPropertyToEventType(prop);
      if (event)
      {
        this[prop] = value;
      }
      else
      {
        var previousValue = this['getProperty'](prop);
        // Property change events for top level properties will be triggered by __SetProperty so avoid firing twice
        var bridge = oj.BaseCustomElementBridge.getInstance(this);

        // Check value against any defined enums
        var propsMeta = oj.BaseCustomElementBridge.getProperties(bridge);
        var propAr = prop.split('.');
        var meta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, propsMeta);
        if (!meta && propAr.length == 1) 
        {
          oj.Logger.error("Ignoring property set for undefined property " + prop + " on " + this.tagName);
          return;
        }

        // Check readOnly property for top level property
        if (propsMeta[propAr[0]]['readOnly'])
          throw "Read-only property " + prop + " cannot be set on "+ this.tagName;
        
        oj.BaseCustomElementBridge.__CheckEnumValues(this, prop, value, meta);

        oj.BaseCustomElementBridge.__SetProperty(bridge.GetAliasForProperty.bind(bridge), this, prop, value);
        if (bridge._READY_TO_FIRE && prop.indexOf('.') !== -1)
          oj.CompositeElementBridge._firePropertyChangeEvent(this, prop, value, previousValue, 'external');
      }
    };
    proto['getProperty'] = function(prop) { 
      var event = oj.__AttributeUtils.eventListenerPropertyToEventType(prop);
      if (event)
        return event;
      else
      {
        // Use the element/props getters for top level properties to handle default values
        if (prop.indexOf('.') !== -1)
          return oj.BaseCustomElementBridge.__GetProperty(this, prop);
        else
          return this[prop];
      }
    };
    proto['_propsProto']['setProperty'] = function(prop, value) { 
      var previousValue = this['getProperty'](prop);

      // Check value against any defined enums
      var meta = oj.BaseCustomElementBridge.__GetPropertyMetadata(prop, oj.BaseCustomElementBridge.getProperties(this._BRIDGE));
      if (!meta && prop.indexOf('.') === -1) 
      {
        oj.Logger.error("Ignoring property set for undefined property " + prop + " on " + this._ELEMENT.tagName);
        return;
      }
      oj.BaseCustomElementBridge.__CheckEnumValues(this._ELEMENT, prop, value, meta);

      // Property change events for top level properties will be triggered by __SetProperty so avoid firing twice
      oj.BaseCustomElementBridge.__SetProperty(this._BRIDGE.GetAliasForProperty.bind(this._BRIDGE), this, prop, value);
      if (prop.indexOf('.') !== -1)
        oj.CompositeElementBridge._firePropertyChangeEvent(this._ELEMENT, prop, value, previousValue, 'internal');
    };
    proto['_propsProto']['getProperty'] = function(prop) {
      // Use the element/props getters for top level properties to handle default values
      if (prop.indexOf('.') !== -1)
        return oj.BaseCustomElementBridge.__GetProperty(this, prop);
      else
        return this[prop];
    };
    // Always add automation methods, but if the ViewModel defines overrides, wrap the overrides
    // and pass the default implementation in as the last parameter to the ViewModel's method.
    proto['getNodeBySubId'] = function(locator) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      if (bridge._VIEW_MODEL.getNodeBySubId)
        return bridge._VIEW_MODEL.getNodeBySubId(locator, bridge._getNodeBySubId.bind(this));
      else
        return bridge._getNodeBySubId.bind(this)(locator);
    };
    proto['getSubIdByNode'] = function(node) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      if (bridge._VIEW_MODEL.getSubIdByNode)
        return bridge._VIEW_MODEL.getSubIdByNode(node, bridge._getSubIdByNode.bind(this));
      else
        return bridge._getSubIdByNode.bind(this)(node);
    };
  },

  DefineMethodCallback: function (proto, method, methodMeta) 
  {
    proto[method] = function()
    {
      var methodName = methodMeta['internalName'] || method;
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      return bridge._VIEW_MODEL[methodName].apply(null, arguments);
    };
  },
  
  DefinePropertyCallback: function (proto, property, propertyMeta) 
  {
    var set = function(val, bOuterSet)
    {
      var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(this._BRIDGE, property);
      var old = propertyTracker.peek();
      if (old !== val) // We should consider supporting custom comparators
      {
        oj.BaseCustomElementBridge.__CheckEnumValues(this._ELEMENT, property, val, propertyMeta);
        propertyTracker(val);
        if (propertyMeta._eventListener)
        {
          var event = oj.__AttributeUtils.eventListenerPropertyToEventType(property);
          // Remove old event listener
          if (old)
            this._ELEMENT.removeEventListener(event, old);
          // Add new event listener
          if (val && val instanceof Function)
            this._ELEMENT.addEventListener(event, val);
        }

        if (!propertyMeta._derived && (!bOuterSet || (bOuterSet && this._BRIDGE._READY_TO_FIRE)))
        {
          var updatedFrom = bOuterSet ? 'external' : 'internal';
          oj.CompositeElementBridge._firePropertyChangeEvent(this._ELEMENT, property, val, old, updatedFrom);
        }
      }
    }

    // Called on the ViewModel props object
    var innerSet = function(val)
    {
      set.bind(this)(val, false);
    }

    // Called on the custom element
    var outerSet = function(val)
    {
      if (propertyMeta['readOnly'])
        throw "Read-only property " + property + " cannot be set on "+ this.tagName;
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      set.bind(bridge._PROPS)(val, true);
    }

    // Called on the ViewModel props object
    var innerGet = function()
    {
      var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(this._BRIDGE, property);
      // If the attribute has not been set, return the default value
      var value = propertyTracker();
      if (value == null)
        return propertyMeta['value'];
      return value;
    }

    // Called on the custom element
    var outerGet = function()
    {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(bridge, property);
      var value = propertyTracker.peek();
      // If the attribute has not been set, return the default value
      if (value == null)
        return propertyMeta['value'];
      return value;
    }

    // Don't add event listener properties for inner props
    if (!propertyMeta._derived)
      oj.CompositeElementBridge._defineDynamicObjectProperty(proto['_propsProto'], property, innerGet, innerSet);
    oj.CompositeElementBridge._defineDynamicObjectProperty(proto, property, outerGet, outerSet);
  },

  GetMetadata: function(descriptor)
  {
    return descriptor['_metadata'];
  },

  HandleAttached: function(element)
  {
    // Loop through all element attributes to get initial properties
    var props = oj.BaseCustomElementBridge.getProperties(this);
    oj.BaseCustomElementBridge.__InitProperties(element, this._PROPS, props, this.PARSE_FUNCTION);
    this.GetDelayedPropertiesPromise().resolvePromise();
  },

  HandleBindingsApplied: function(element, bindingContext) 
  {
    if (this._MODEL_PROMISE) 
    {
      var bridge = this;
      this._ACTIVATED_PROMISE = this._MODEL_PROMISE.then(
        function(model)
        {
          return oj.CompositeTemplateRenderer.invokeViewModelMethod(model, 'activatedMethod', [bridge._VM_CONTEXT]);
        }
      );
    }

    this._PROPS_DELAYED_PROMISE.resolvePromise(this._PROPS);

    var slotNodeCounts = {};
    // Generate slot map before we update DOM with view nodes
    var slotMap = oj.CompositeTemplateRenderer.createSlotMap(element);
    for (var slot in slotMap)
      slotNodeCounts[slot] = slotMap[slot].length;
    this._SLOT_MAP = slotMap;
    this._SLOTS_DELAYED_PROMISE.resolvePromise(slotNodeCounts);
    
    var bridge = this;
    var masterPromise = Promise.all([this._VIEW_PROMISE, this._MODEL_PROMISE, this._PROPS_DELAYED_PROMISE.getPromise(), this._CSS_PROMISE, this._ACTIVATED_PROMISE]);
    masterPromise.then(function(values)
    {
      var view = values[0];
      if (!view)
        throw "ojComposite is missing a View";

      var params = {
        props: bridge._PROPS,
        slotMap: bridge._SLOT_MAP,
        slotNodeCounts: slotNodeCounts,
        unique: bridge._VM_CONTEXT['unique'],
        viewModel: bridge._VIEW_MODEL,
        viewModelContext: bridge._VM_CONTEXT
      };

      oj.CompositeTemplateRenderer.renderTemplate(params, element, view, bindingContext);

      // Deprecated 3.0.0
      oj.CompositeElementBridge._fireEvent('ready', element);

      // Set flag when we can fire property change events
      bridge._READY_TO_FIRE = true;

      // Resolve the component busy state 
      bridge.GetDelayedReadyPromise().resolvePromise();
    });
  },


  HandleBindingsCleaned: function(element)
  {
    if (this._MODEL_PROMISE)
    {
      this._MODEL_PROMISE.then(function(model)
      {
        oj.CompositeTemplateRenderer.invokeViewModelMethod(model, 'disposeMethod', [element]);
      });
    }
  },

  HandleCreated: function(element) 
  { 
    // Deprecated 3.0.0
    oj.CompositeElementBridge._fireEvent('pending', element);

    var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);
    if (!descriptor)
      throw "Composite is missing a descriptor";

    this.METADATA = this.GetMetadata(descriptor);
    this.PARSE_FUNCTION = descriptor['parseFunction'];
    if (element['_propsProto'])
    {
      this._PROPS = Object.create(element['_propsProto']);
      this._PROPS._BRIDGE = this;
      this._PROPS._ELEMENT = element;
    }
    this._PROPS_DELAYED_PROMISE = new oj.BaseCustomElementBridge.__DelayedPromise();
    this._SLOTS_DELAYED_PROMISE = new oj.BaseCustomElementBridge.__DelayedPromise();

    var vmContext = {
      'element': element,
      'props': this._PROPS_DELAYED_PROMISE.getPromise(),
      'slotNodeCounts': this._SLOTS_DELAYED_PROMISE.getPromise(),
      'unique': oj.CompositeElementBridge._getUnique()
    };
    this._VM_CONTEXT = vmContext;

    var modelPromise = oj.CompositeElementBridge._getResourcePromise(descriptor, "viewModel");
    if (modelPromise)
    {
      var bridge = this;
      this._MODEL_PROMISE = modelPromise.then(
        function(model)
        {
          if (typeof model === 'function')
            model = new model(vmContext);
          else // If the function returns a value, use it as the new model instance
            model = oj.CompositeTemplateRenderer.invokeViewModelMethod(model, 'initializeMethod', [vmContext]) || model;

          bridge._VIEW_MODEL = model;
          return model;
        }
      );
    }

    var viewPromise = oj.CompositeElementBridge._getResourcePromise(descriptor, "view");
    if (viewPromise) 
    {
      this._VIEW_PROMISE = viewPromise.then(function(view) 
      { 
        return oj.CompositeElementBridge._getDomNodes(view); 
      });
    }

    // The CSS Promise will be null if loaded by the require-css plugin
    var cssPromise = oj.CompositeElementBridge._getResourcePromise(descriptor, "css");
    if (cssPromise)
    {
      this._CSS_PROMISE = cssPromise.then(function(css)
      {
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) // for IE
          style.styleSheet.cssText = css;
        else
          style.appendChild(document.createTextNode(css)); // @HTMLUpdateOK
        document.head.appendChild(style); // @HTMLUpdateOK
      });
    }
  },

  HandleDetached: function(element) 
  {
    if (this._MODEL_PROMISE)
    {
      this._MODEL_PROMISE.then(function(model)
      {
        oj.CompositeTemplateRenderer.invokeViewModelMethod(model, 'detachedMethod', [element]);
      });
    }
  },

  InitProto: function(proto)
  {
    Object.defineProperty(proto, '_propsProto', {value: {}});
  },

  _getNodeBySubId: function(locator) 
  {
    // The locator subId can fall into one of 3 categories below:
    // 1) The target node belongs to a JET component or composite with a subId map
    // 2) The target node maps directly to a subId
    // 3) The composite does not have a match for the subId 
    
    // The returned subId map the following key/value pairs:
    // {
    //    [subId]: {
    //      alias: [alias or null for non JET components], 
    //      node: [node]
    //    }
    // }
    var map = oj.CompositeElementBridge.__GetSubIdMap(this);
    var match = map[locator['subId']];
    if (match)
    {
      if (match['alias']) // Case #1
      {
        var clone = oj.CollectionUtils.copyInto({}, locator, undefined, true)
        clone['subId'] = match['alias'];
        var component = match['node'];
        // Check to see if we should call the method on the element or widget
        if (component.getNodeBySubId) 
        {
          return component.getNodeBySubId(clone);
        } 
        else 
        {
          return oj.Components.getWidgetConstructor(component)('getNodeBySubId', clone);
        }
      }
      else
      {
        return match['node']; // Case #2
      }
    }

    return null; // Case #3
  },

  _getSubIdByNode: function(node)
  {
    // The node can fall into one of 3 categories below:
    // 1) The node is not a child of this composite.
    // 2) The node is a child of an inner composite and we need to convert its aliased subId
    // 3) The node is a child of this composite
    // 3a) The node is mapped directly to a subId
    // 3b) The node is owned by an element that has a getSubIdByNode method and we need to convert its aliased subId
  
    // Case #1
    if (!this.contains(node))
      return null;

    // The returned node map has the following key/value pairs where nodeKey is 
    // the value of the node's data-oj-subid[-map] attribute:
    // [nodeKey]: { map: [subIdMap], node: [node] }
    var nodeMap = oj.CompositeElementBridge.__GetNodeMap(this);

    // Case #2
    var composite = oj.Composite.getContainingComposite(node, this);
    if (composite != null)
    {
      var nodeKey = composite.node.getAttribute('data-oj-subid-map');
      var match = nodeMap[nodeKey];
      if (match)
      {
        if (composite.getSubIdByNode)
        {
          var locator = composite.getSubIdByNode(node);
          if (locator)
          {
            var alias = match['map'][locator['subId']];
            locator['subId'] = alias;
            return locator;
          }
        }
      }
      // Return null if we did not expose the node even though the inner composite does
      return null;
    }
    
    // Case #3
    // Walk up DOM tree until we find the containing node with the subId mapping
    var curNode = node;
    while (curNode !== this)
    {
      // We do not support an element having both attributes. If both are specified, -map takes precedence.
      var nodeKey = curNode.getAttribute('data-oj-subid-map') || curNode.getAttribute('data-oj-subid');
      if (nodeKey)
        break;
      curNode = curNode.parentNode;
    }

    var match = nodeMap[nodeKey];
    if (match) 
    {
      var map = match['map'];
      if (!map) // Case #3a
      {
        return {'subId': nodeKey};
      }
      else // Case #3b
      {
        var component = match['node'];
        var locator;
        // Check to see if we should call the method on the element or widget
        if (component.getSubIdByNode) 
        {
          locator = component.getSubIdByNode(node);
        } 
        else 
        {
          locator = oj.Components.getWidgetConstructor(component)('getSubIdByNode', node);
        }

        if (locator)
        {
          locator['subId'] = match['map'][locator['subId']];
          return locator;
        }
      }
    }

    return null;
  }
  
});

/*************************/
/* PUBLIC STATIC METHODS */
/*************************/

/**
 * Registers a composite component
 * @param {string} tagName The component name, which should contain a dash '-' and not be a reserved tag name.
 * @param {Object} descriptor The registration descriptor. The descriptor will contain keys for Metadata, View, ViewModel
 * and CSS that are detailed below. A View is required, but all others are optional.
 * See the <a href="#registration">registration section</a> above for a sample usage.
 * The value for each key is a plain Javascript object that describes the loading
 * behavior. One of the following keys must be set on the object:
 * <ul>
 * <li>promise - specifies the promise instance</li>
 * <li>inline - provides the object inline</li>
 * </ul>
 * @param {Object} descriptor.metadata Describes how component Metadata is loaded. The object must contain one of the keys
 * documented above and ultimately resolve to a JSON object.
 * @param {Object} descriptor.view Describes how component's View is loaded. The object must contain one of the keys
 * documented above and ultimately resolve to a string, array of DOM nodes, or document fragment.
 * @param {Object} descriptor.css Describes how component's CSS is loaded. If specified, the object must contain one of the keys
 * documented above and ultimately resolve to a string if loaded inline or as a Promise.
 * @param {Object} descriptor.viewModel Describes how component's ViewModel is loaded. If specified, the object must contain one of the keys
 * documented above. This option is only applicable to composites hosting a Knockout template
 * with a ViewModel and ultimately resolves to a constructor function or object instance. If the initial ViewModel resolves to an object instance, the
 * initialize lifecycle listener will be called. See the <a href="#lifecycle">initialize documentation</a> for more information.
 * @param {function(string, string, Object, function(string))} descriptor.parseFunction The function that will be called to parse attribute values.
 * Note that this function is only called for non bound attributes. The parseFunction will take the following parameters:
 * <ul>
 *  <li>{string} value: The value to parse.</li>
 *  <li>{string} name: The name of the property.</li>
 *  <li>{Object} meta: The metadata object for the property which can include its type, default value, 
 *      and any extensions that the composite has provided on top of the required metadata.</li>
 *  <li>{function(string)} defaultParseFunction: The default parse function for the given attribute 
 *      type which is used when a custom parse function isn't provided and takes as its parameters 
 *      the value to parse.</li>
 * </ul>
 * @ignore
 *
 */
oj.CompositeElementBridge.register = function(tagName, descriptor)
{
  // Need to retrieve metadata to create prototype
  if (oj.BaseCustomElementBridge.__Register(tagName, descriptor, oj.CompositeElementBridge.proto))
  {
    var metadataPromise = oj.CompositeElementBridge.getMetadata(tagName);
    metadataPromise.then(function(metadata)
    {
      // Check that the component name, version, and JET versions are defined in the metadata
      var name = metadata['name'];
      if (!name)
        oj.Logger.warn('Required property "name" missing from metadata for %s.', tagName);
      else if (tagName != name)
        oj.Logger.warn('Registered property tagName: %s does not match name: %s provided in metadata.', tagName, name);
      if (!metadata['version'])
        oj.Logger.warn('Required property "version" missing from metadata for %s.', tagName);
      if (!metadata['jetVersion'])
        oj.Logger.warn('Required composite "jetVersion" missing from metadata for %s.', tagName);
      descriptor['_metadata'] = oj.BaseCustomElementBridge.__ProcessEventListeners(metadata, false);
      document.registerElement(tagName.toLowerCase(), {'prototype': oj.CompositeElementBridge.proto.getPrototype(descriptor)});
    });
  }
};

/**
 * Returns a Promise resolving with the composite metadata with the given name.
 * @param {string} tagName The component name, which should contain a dash '-' and not be a reserved tag name.
 * @return {Promise}
 * @ignore
 */
oj.CompositeElementBridge.getMetadata = function(tagName)
{
  var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(tagName);
  if (descriptor)
  {
    var metadataPromise = descriptor['_metadataPromise'];
    if (!metadataPromise)
    {
      metadataPromise = oj.CompositeElementBridge._getResourcePromise(descriptor, 'metadata');
      // Metadata is required starting in 3.0.0, but to be backwards compatible, just log a warning.
      if (!metadataPromise) {
        oj.Logger.warn("Required metadata is missing for " + tagName);
        metadataPromise = Promise.resolve({});
      }
      descriptor['_metadataPromise'] = metadataPromise;
    }
    return metadataPromise;
  }
  return null;
};

/*****************************/
/* NON PUBLIC STATIC METHODS */
/*****************************/

/**
 * @ignore
 */
oj.CompositeElementBridge._defineDynamicObjectProperty = function(obj, property, getter, setter)
{
  Object.defineProperty(obj, property, { 'enumerable': true, 'get': getter, 'set': setter });
};

/**
 * @ignore
 */
oj.CompositeElementBridge._fireEvent = function(type, element)
{
  element.dispatchEvent(new CustomEvent(type, {bubbles: true}));
};

/**
 * @ignore
 */
oj.CompositeElementBridge._firePropertyChangeEvent = function(element, name, value, previousValue, updatedFrom)
{
  var detail = {}
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
  detail['updatedFrom'] = updatedFrom;
  element.dispatchEvent(new CustomEvent(eventName + "-changed", {'detail': detail}));
  element.dispatchEvent(new CustomEvent(eventName + "Changed", {'detail': detail}));
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getDomNodes = function(content)
{
  if (typeof content === 'string')
  {
    var div = document.createElement('div');
    div.innerHTML = content; //@HTMLUpdateOK content is the composite View which does not come from the end user
    var nodes = [];
    for (var i = 0; i < div.childNodes.length; i++)
      nodes.push(div.childNodes[i])
    return nodes;
  }
  else if (oj.CompositeElementBridge._isDocumentFragment(content))
  {
    var nodes = [];
    for (var i = 0; i < content.childNodes.length; i++)
      nodes.push(content.childNodes[i]);
    return nodes;
  }
  else if (Array.isArray(content))
  {
    return content.splice(0);
  }
  else
  {
    throw "The View (" + content + ") has an unsupported type";
  }
};

/**
 * Creates the subId and node maps needed for automation
 * @ignore
 */
oj.CompositeElementBridge._generateSubIdMap = function(bridge, element)
{
  if (!bridge._SUBID_MAP)
  {
    // The format of the map will be { [composite subId] : {alias: [alias], node: [node] } }
    var subIdMap = {};
    var nodeMap = {};

    // data-oj-subid or data-oj-subid-map attributes can be defined on nested objects so we need
    // to walk the composite tree skipping over slots
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
      oj.CompositeElementBridge._walkSubtree(subIdMap, nodeMap, children[i]);
    }

    bridge._NODE_MAP = nodeMap;
    bridge._SUBID_MAP = subIdMap;
  }
};

/**
 * Walks a composite subtree, parsing and generating subId mappings.
 * @ignore
 */
oj.CompositeElementBridge._walkSubtree = function(subIdMap, nodeMap, node)
{
  if (!node.hasAttribute('slot'))
  {
    oj.CompositeElementBridge._addNodeToSubIdMap(subIdMap, nodeMap, node);
    if (!oj.BaseCustomElementBridge.isRegistered(node.tagName) && !oj.Components.getWidgetConstructor(node))
    {
      var children = node.children;
      for (var i = 0; i < children.length; i++)
      {
        oj.CompositeElementBridge._walkSubtree(subIdMap, nodeMap, children[i]);
      }
    }
  }
};

/**
 * Checks to see if a node has defined subIds and adds them to the composite's
 * cached subId -> node and node -> subId maps for automation.
 * @ignore
 */
oj.CompositeElementBridge._addNodeToSubIdMap = function(subIdMap, nodeMap, node)
{
  var nodeSubId = node.getAttribute('data-oj-subid');
  var nodeSubIdMapStr = node.getAttribute('data-oj-subid-map');
  // We do not support an element having both attributes. If both are specified, -map takes precedence.
  if (nodeSubIdMapStr)
  {
    var parsedValue = JSON.parse(nodeSubIdMapStr);
    if (typeof parsedValue === 'object' && !(parsedValue instanceof Array))
    { 
      // Due to closure compiler issues with passing in result of JSON.parse which has type * into Object.keys 
      // which requires an Object, use for loop here instead of iterating over key Array.
      var nodeSubIdMap = parsedValue;
      var reverseMap = {};
      for (var key in nodeSubIdMap)
      {
        subIdMap[key] = {'alias': nodeSubIdMap[key], 'node': node};
        reverseMap[nodeSubIdMap[key]] = key;
      }
      nodeMap[nodeSubIdMapStr] = {'map': reverseMap, 'node': node};
    }
  }
  else if (nodeSubId)
  {
    subIdMap[nodeSubId] = {'node': node};
    nodeMap[nodeSubId] = {'node': node};
  }
};

/**
 * Returns the subId to node mapping for the composite's View.
 * @ignore
 */
oj.CompositeElementBridge.__GetSubIdMap = function(element)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  oj.CompositeElementBridge._generateSubIdMap(bridge, element);
  return bridge._SUBID_MAP;
};

/**
 * Returns the node to subId mapping for the composite's View. The returned map has the 
 * following key/value pairs where nodeKey is value of the node's data-oj-subid[-map] attribute:
 * {
 *   [nodeKey]: {
 *     map: [subIdMap],
 *     node: [node]
 *   }
 * }
 * @return {Map}
 * @ignore
 */
oj.CompositeElementBridge.__GetNodeMap = function(element)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  oj.CompositeElementBridge._generateSubIdMap(bridge, element);
  return bridge._NODE_MAP;
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getPropertyTracker = function(bridge, property)
{
  if (!bridge._TRACKERS)
    bridge._TRACKERS = {};
  if (!bridge._TRACKERS[property])
    bridge._TRACKERS[property] = oj.CompositeTemplateRenderer.createTracker();
  return bridge._TRACKERS[property];
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getResourcePromise = function(descriptor, resourceType)
{
  var promise = null;
  var value = descriptor[resourceType];
  if (value != null)
  {
    var key = Object.keys(value)[0];
    var val = value[key];

    if (key == null)
    {
      throw "Invalid component descriptor key";
    }

    switch(key)
    {
      case 'inline':
        promise = Promise.resolve(val);
        break;
      case 'promise':
        promise = val;
        break;
      default:
        throw "Invalid descriptor key " + key + " for the resource type: " + resourceType;
    }
  }
  return promise;
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getUnique = function()
{
  return _UNIQUE + _UNIQUE_INCR++;
};

/**
 * @ignore
 */
oj.CompositeElementBridge._isDocumentFragment = function(content)
{
  if (window['DocumentFragment'])
  {
    return content instanceof DocumentFragment;
  }
  else
  {
    return content && content.nodeType === 11;
  }
};

/**
 * @ignore
 */
oj.CompositeElementBridge._isSlotAssignable = function(node)
{
  return node.nodeType === 1 || node.nodeType === 3;
};

var _UNIQUE_INCR = 0;
var _UNIQUE = '_ojcomposite';


/**
 * <p>
 * A composite component is a reusable piece of UI that can be embedded as a custom HTML element and
 * can be composed of other composites, JET components, HTML, JavaScript, or CSS.
 * </p>
 *
 * <h2 id="registration">Packaging and Registration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#registration"></a>
 * </h2>
 * <p>
 * Composite components should be packaged as a standalone module in a folder matching the tag name it will be registered with, e.g. 'my-chart'.
 * An application would use a composite by requiring it as a module, e.g. 'jet-composites/my-chart/loader'. The composite module could be 
 * stored locally in the app which is the recommended approach, but could also be stored on a different server, or a CDN.  Note that there are
 * XHR restrictions when using the RequireJS text plugin which may need additional RequireJS config settings.  Please see the 
 * <a href="https://github.com/requirejs/text#xhr-restrictions">text plugin documentation</a> for the full set of limitations and options.
 * By using RequireJS path mappings, the application can control where individual composites are loaded from. 
 * See below for a sample RequireJS composite path configuration.
 *
 * Note that the 'jet-composites/my-chart' mapping is only required if the 'my-chart' composite module maps to a folder other than 
 * 'someSubFolder/jet-composites/my-chart' using the configuration below.
 * <pre class="prettyprint">
 * <code>
 * requirejs.config(
 * {
 *   baseUrl: 'js',
 *   paths:
 *   {
 *     'jet-composites': 'someSubFolder/jet-composites',
 *     'jet-composites/my-chart': 'https://someCDNurl',
 *     'jet-composites/my-table': 'https://someServerUrl'
 *   }
 * }
 * </code>
 * </pre>
 * </p>
 * 
 * <p>
 * All composite modules should contain a loader.js file which will handle registering and specifying the dependencies for a composite component.
 * We recommend using RequireJS to define your composite module with relative file dependencies.  
 * Registration is done via the <a href="#register">oj.Composite.register</a> API.
 * By registering a composite component, an application links an HTML tag with provided
 * Metadata, View, ViewModel and CSS which will be used to render the composite. These optional
 * pieces can be provided via a descriptor object passed into the register API which defines how
 * each piece will be loaded, either inline or as a Promise. See below for sample loader.js file configurations.
 * </p>
 *
 * Note that in this example we are using a RequireJS plugin for loading css which will load the styles within our page
 * so we do not need to pass any css into the register call.
 * <pre class="prettyprint">
 * <code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json', 'css!./my-chart'],
 *   function(view, viewModel, metadata) {
 *     oj.Composite.register('my-chart',
 *     {
 *       metadata: {inline: JSON.parse(metadata)},
 *       view: {inline: view},
 *       viewModel: {inline: viewModel}
 *     });
 *   }
 * );
 * </code>
 * </pre>
 *
 * This example shows how to pass inline CSS to the register call.
 * <pre class="prettyprint">
 * <code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json'],
 *   function(view, viewModel, metadata) {
 *     oj.Composite.register('my-chart',
 *     {
 *       metadata: {inline: JSON.parse(metadata)},
 *       view: {inline: view},
 *       viewModel: {inline: viewModel},
 *       css: {inline: 'my-chart {font-size:20px; color:blue;}'}
 *     });
 *   }
 * );
 * </code>
 * </pre>
 *
 * This example shows how to register a custom parse function which will be called to parse attribute values defined in the metadata.
 * <pre class="prettyprint">
 * <code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json'],
 *   function(view, viewModel, metadata) {
 *     var myChartParseFunction = function(value, name, meta, defaultParseFunction) {
 *       // Custom parsing logic goes here which can also return defaultParseFunction(value) for
 *       // values the composite wants to default to the default parsing logic for.
 *       // This function is only called for non bound attributes.
 *     }
 * 
 *     oj.Composite.register('my-chart',
 *     {
 *       metadata: {inline: JSON.parse(metadata)},
 *       view: {inline: view},
 *       viewModel: {inline: viewModel},
 *       parseFunction: myChartParseFunction
 *     });
 *   }
 * );
 * </code>
 * </pre>
 *
 * <h2 id="usage">Usage
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#usage"></a>
 * </h2>
 * <p>Once registered within a page, a composite component can be used in the DOM as a custom HTML element like in the example below.  Currently, composites need
 * to be in a knockout activated subtree, but this requirement may change in future releases.
 * </p>
 * <pre class="prettyprint">
 * <code>
 * &lt;my-chart type="bubble" data="{{dataModel}}">&lt;/my-chart>
 * </code>
 * </pre>
 *
 * <h2 id="metadata">Metadata
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#metadata"></a>
 * </h2>
 * <p>Metadata can be provided via JSON format which will be used to define the composite component.
 *  The Metadata can be extended by appending any extra information in an "extension" field except at the first level of 
 *  the "properties", "methods", "events" or "slots" objects. Any metadata in an extension field will be ignored.</p>
 *  
 * <p>The Metadata JSON object should have the following required properties: "name", "version", "jetVersion" and 
 *  the following optional properties: "description", compositeDependencies", properties", "methods", "events", or "slots". 
 *  See the tables below for descriptions of these properties.</p>
 *  
 * <p>Keys defined in the "properties" top level object should map to the composite component's properties following
 *  the same naming convention described in the <a href="#attr-to-prop-mapping">Property-to-Attribute mapping</a> section.
 *  Non expression bound composite component attributes will be correctly evaluated only if they are a primitive JavaScript type (boolean, number, string)
 *  or a JSON object. Note that JSON syntax requires that strings use double quotes. Attributes evaluating to any other types must be bound via expression syntax.  
 *  Boolean attributes are considered true if set to the case-insensitive attribute name, the empty string or have no value assignment. 
 *  JET composite components will also evalute boolean attributes set explicitly to 'true' or 'false' to their respective boolean values. All other values are invalid.</p>
 *  
 * <p>Not all information provided in the Metadata is required at run time and those not indicated to be required at run time in the tables
 *  below can be omitted to reduce the Metadata download size. Any non run time information can be used for design time tools and property editors and could
 *  be kept in a separate JSON file which applications can use directly or merge with the run time metadata as needed, but would not be required by the loader.js
 *  file. For methods and events, only the method/event name is required at run time.</p>
 *
 * <h3>Metadata Properties</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Required</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>name</code></td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component tag name.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>version</code></td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component version.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>jetVersion</code></td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The <a href="http://semver.org/">semantic version</a> of the supported JET version(s).</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>compositeDependencies</code></td>
 *       <td>no</td>
 *       <td>{Object<string, string>}</td>
 *       <td>Dependency to semantic version mapping for composite dependencies. 
 *         3rd party libraries should not be included in this mapping. Not used at run time.
 *         <code>{"composite1": "1.2.0", "composite2": ">=2.1.0"}</code></td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>description</code></td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A high-level description for the component. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>properties</code></td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See Properties table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>methods</code></td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See Methods table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>events</code></td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See Events table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>slots</code></td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See Slots table below for details. Not used at run time.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * <h3>Properties</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[property name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>{string}</td>
 *               <td>A description for the property. Not used at run time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>readOnly</code></td>
 *               <td>{boolean}</td>
 *               <td>Determines whether a property can be updated outside of the ViewModel.
 *                 False by default. If readOnly is true, the property can only be updated by the ViewModel or by the
 *                 components within the composite. This property only needs to be defined for the top level property, 
 *                 with subproperties inheriting that value.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>type</code></td>
 *               <td>{string}</td>
 *               <td>The type of the property, following 
 *                 <a href="https://developers.google.com/closure/compiler/docs/js-for-compiler#types">Google's Closure Compiler</a> syntax.
 *                 We will parse string, number, boolean, array and object types for non data-bound attributes, but will not provide 
 *                 type checking for array and object elements. However, for documentation purposes, it may still be beneficial to provide
 *                 array and object element details using the Closure Compiler syntax.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>value</code></td>
 *               <td>{object}</td>
 *               <td>An optional default value for a property.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>writeback</code></td>
 *               <td>{boolean}</td>
 *               <td>Determines whether an expression bound to this property should be written back to. False by default.
 *                 If writeback is true, any updates to the property will result in an update to the expression. This property only needs to be defined
 *                 for the top level property, with subproperties inheriting that value.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>enumValues</code></td>
 *               <td>{Array<string>}</td>
 *               <td>An optional list of valid enum values for a string property. An error is thrown if a property value does not
 *                 match one of the provided enumValues.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>properties</code></td>
 *               <td>{Object}</td>
 *               <td>A nested properties object for complex properties. Subproperties exposed using nested properties objects in the metadata can
 *                 be set using dot notation in the attribute. See the <a href="#subproperties">Subproperties</a> section for more details on 
 *                 working with subproperties.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3>Methods</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[method name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>{string}</td>
 *               <td>A description for the method. Not used at run time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>internalName</code></td>
 *               <td>{string}</td>
 *               <td>An optional ViewModel method name that is different from, but maps to this method.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>params</code></td>
 *               <td>{Array<{description: string, name: string, type: string}>}</td>
 *               <td>An array of objects describing the method parameter. Not used at run time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>return</code></td>
 *               <td>{string}</td>
 *               <td>The return type of the method, following Closure Compiler syntax. Not used at run time.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3>Events</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[event name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>bubbles</code></td>
 *               <td>{boolean}</td>
 *               <td>Indicates whether the event bubbles up through the DOM or not. Defaults to false. Not used at run time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>cancelable</code></td>
 *               <td>{boolean}</td>
 *               <td>Indicates whether the event is cancelable or not. Defaults to false. Not used at run time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>{string}</td>
 *               <td>A description for the event. Not used at run time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>detail</code></td>
 *               <td>{object}</td>
 *               <td>Describes the properties available on the event's detail property which contains data passed when initializing the event. Not used at run time.</p>
 *                 <h6>Properties</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>[field name]</code></td>
 *                       <td>{description: string, type: string}</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *               </td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3>Slots</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[slot name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>{string}</td>
 *               <td>A description for the slot. Not used at run time.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * <h3>Example of Run Time Metadata</h3>
 * <p>The JET framework will ignore "extension" fields. Extension fields cannot be defined at 
 *   the first level of the "properties", "methods", "events", or "slots" objects.</p>
 * <pre class="prettyprint">
 * <code>
 * {
 *  "name": "demo-card",
 *  "version": "1.0.0",
 *  "jetVersion": ">=3.0.0",
 *  "properties": {
 *    "currentImage" : {
 *      "type": "string",
 *      "readOnly": true
 *    },
 *    "images": {
 *      "type": "Array<string>"
 *    },
 *    "isShown": {
 *      "type": "boolean",
 *      "value": true
 *    }
 *  },
 *  "methods": {
 *    "nextImage": {
 *      "internalName": "_nextImg"
 *      "extension": "This is where a composite can store additional data."
 *    },
 *    "prevImage": {}
 *   },
 *   "events": {
 *     "cardclick": {}
 *   }
 * }
 * </code>
 * </pre>
 *
 * <h2 id="properties">Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#properties"></a>
 * </h2>
 * <p>
 * Properties defined in provided Metadata will be made available through the $props property of the View binding context
 * and through the props property on the context passed to the provided ViewModel constructor function or lifecycle listeners
 * if an object instance is passed. Unlike the $props property for the View, the props property made available to the
 * ViewModel will be a Promise which will contain the properties object when resolved. The application can access
 * the composite component properties by accessing them directly from the DOM element. Using the DOM setAttribute and
 * removeAttribute APIs will also result in property updates. Changes made to properties will
 * result in a [propertyName]Changed event being fired for that property regardless of where they are modified.
 * </p>
 *
 * <h3 id="attr-to-prop-mapping">Property-to-Attribute Mapping
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#attr-to-prop-mapping"></a>
 * </h3>
 * <p>
 * The following rules apply when mapping property to attribute names:
 * 
 * <ul>
 *  <li>Attribute names are case insensitive and are considered to be all lower case. Properties with camelCase are mapped to 
 *    attribute names by inserting a dash before the uppercase letter and converting that letter to lower case, 
 *    e.g. a "chartType" property will be mapped to a "chart-type" attribute.</li>
 *  <li> The reverse occurs when mapping a property name from an attribute name.</li>
 * </ul>
 * </p>
 *
 * <h3 id="subproperties">Subproperties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#subproperties"></a>
 * </h3>
 * <p>
 * Subproperties can be exposed and documented by adding nested properties objects in the composite <a href="#metadata">metadata</a>. Event listeners
 * should be added for the top level property, with applications checking the event's <a href="#events">subproperty</a> field to access information about the
 * subproperty changes. Subproperties can be set declaratively using dot notation, e.g. person.first-name="{{name}}".  Setting overlapping attributes, 
 * e.g. person="{{personInfo}}" person.first-name="{{name}}" will cause an error to be thrown.
 * </p> 
 * 
 * <p>Subproperties can also be set programmatically using the <code>set/getProperty</code> methods. 
 * Note that while setting the subproperty using dot notation via the element's top level property is allowed, the setProperty method must be used in order
 * to trigger a property change event.
 * <pre class="prettyprint">
 * <code>
 * element.setProperty("person.firstName", Fred);
 * var firstName = element.getProperty("person.firstName");
 * </code>
 * </pre>
 * </p>
 * 
 * <h2 id="styling">Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling"></a>
 * </h2>
 * <p>
 * Composite component styling can be done via provided css. The application should note that
 * CSS will not be scoped to the composite component and selectors will need to be appropriately selective.
 * The JET framework will add the <code>oj-complete</code> class to the composite DOM element after metadata properties have been resolved.
 * To prevent a flash of unstyled content before the composite properties have been setup, the composite css can include the following rule to hide the
 * composite until the <code>oj-complete</code> class is set on the element.
 * <pre class="prettyprint">
 * <code>
 * my-chart:not(.oj-complete) {
 *   visibility: hidden;
 * }
 * </code>
 * </pre>
 * </p>
 *
 * <h2 id="events">Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events"></a>
 * </h2>
 * <p>
 * Composite components fire the following events. Any custom composite events should be created and fired by the composite's ViewModel and documented in the metadata
 * for design and run time environments as needed.  In addition to standard add/removeEventListener syntax, declarative event listeners will also be supported for
 * custom composite events and [propertyName]Changed events.  As a result, if a composite declares an event of type "customType", applications can listen by setting the
 * "onCustomType" property or the "on-custom-type" attribute.  Similarly, property change listeners can be set via the appropriate "on[PropertyName]Changed" property or
 * "on-[property-name]-changed" attribute. Expression syntax can be used in the on-[event-name] attributes, but we do not support executing arbitrary JavaScript like those for
 * native event attributes like onclick.
 * <ul>
 *  <li><b><i>pending (Deprecated)</i></b> - Fired to notify the application that a composite component is about to render. 
 *    This event is deprecated. The application should use the page's oj.BusyContext to determine when the composite is ready.</li>
 *  <li><b><i>ready (Deprecated)</i></b> - Fired after bindings are applied on the composite component's children. Child pending events will be fired before the parent
 *    composite component's ready event. Note that this does not gaurantee that its children are ready at this point as they could be performing
 *    their own asynchronous operations. Applications may use the pending and ready events  to determine when a composite
 *    component and its children are fully ready (i.e. when the number of received ready events matches the number of received pending events).
 *    This event is deprecated. The application should use the page's oj.BusyContext to determine when the composite is ready.</li>
 *  <li><b><i>[propertyName]-changed (Deprecated) </i></b> - Fired when a property is modified and contains the following fields in its event detail object:
 *    <ul>
 *      <li>previousValue - The previous property value</li>
 *      <li>value - The new property value</li>
 *      <li>updatedFrom - Where the property was updated from. Supported values are:
 *        <ul>
 *          <li>default - The default value specified in the metadata.</li>
 *          <li>internal - The View or ViewModel</li>
 *          <li>external - The DOM Element either by its property setter, setAttribute, or external data binding.</li>
 *        </ul>
 *      </li>
 *      <li>subproperty - An object containing information about the subproperty that changed with the following fields:
 *        <ul>
 *          <li>path - The subproperty path that changed</li>
 *          <li>previousValue - The previous subproperty value</li>
 *          <li>value - The new subproperty value</li>
 *        </ul>
 *      </li>
 *    </ul>
 *    This event is deprecated.  Applications should listen to [propertyName]Changed events instead.
 *  </li>
 *  <li><b><i>[propertyName]Changed</i></b> - Fired when a property is modified and contains the following fields in its event detail object:
 *    <ul>
 *      <li>previousValue - The previous property value</li>
 *      <li>value - The new property value</li>
 *      <li>updatedFrom - Where the property was updated from. Supported values are:
 *        <ul>
 *          <li>default - The default value specified in the metadata.</li>
 *          <li>internal - The View or ViewModel</li>
 *          <li>external - The DOM Element either by its property setter, setAttribute, or external data binding.</li>
 *        </ul>
 *      </li>
 *      <li>subproperty - An object containing information about the subproperty that changed with the following fields:
 *        <ul>
 *          <li>path - The subproperty path that changed</li>
 *          <li>previousValue - The previous subproperty value</li>
 *          <li>value - The new subproperty value</li>
 *        </ul>
 *      </li>
 *    </ul>
 *  </li>
 * </ul>
 * </p>
 *  
 * <h2 id="lifecycle">Lifecycle
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
 * </h2>
 * <p>
 * If a ViewModel is provided for a composite component, the following optional
 * callback methods can be defined on its ViewModel and will be called at each stage of the composite
 * component's lifecycle. The ViewModel provided at registration can either be a function which will be 
 * treated as a constructor that will be invoked to create the ViewModel instance or an object which will
 * be treated as a singleton instance.
 *
 * <h4 class="name">initialize<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel to perform initialization tasks.
 * This method will be invoked only if the ViewModel specified during registration is an object instance as opposed to a constructor function.
 * If the registered ViewModel is a constructor function, the same context object will be passed to the constructor function instead.
 * This method can return 1) nothing in which case the original model instance will be used, 2) a new model instance which will replace the original, 
 * or 3) a Promise which resolves to a new model instance which will replace the original and delay additional lifecycle phases until it is resolved.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">activated<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked after the ViewModel is initialized.
 * This method can return a Promise which will delay additional lifecycle phases until it is resolved and can be used 
 * as a hook for data fetching.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">attached<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked after the View is inserted into the document DOM.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">bindingsApplied<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked after the bindings are applied on this View.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * <h4 class="name">detached<span class="signature">(element)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked when this composite component is detached from the DOM.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>element</code></td>
 *       <td>Node</td>
 *       <td>The composite component DOM element.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">dispose<span class="signature">(element)</span></h4>
 * <div class="description">
 * <b>Deprecated</b>: use the detached method instead.
 * This optional method may be implemented on the ViewModel and will be invoked when this composite component is being disposed.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>element</code></td>
 *       <td>Node</td>
 *       <td>The composite component DOM element.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * <h2 id="writeback">Data Binding and Expression Writeback
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#writeback"></a>
 * </h2>
 * <p>Besides string literals, composite attributes can be set using expression syntax which is currently compatible with knockout expression syntax.
 * Applications can control expression writeback in the composite component by using {{}} syntax for two-way writable binding expressions
 * or [[]] for one-way only expressions. In the example below, the salesData expression will not be written back to if the 'data' property
 * is updated by the composite component's ViewModel. The 'data' property will contain the current value, but the salesData expression will not
 * be updated. Alternatively, if the 'axisLabels' property is updated by the ViewModel, both the 'axisLabel' property and the showAxisLabels expression
 * will contain the updated value. Updating a readOnly property will disconnect the expression binding since the expression will no longer be
 * in sync with the property value. The property will still update and a property change event, [propertyName]Changed, will still be fired when 
 * the property value changes regardless of whether the expression is written back to.
 * <pre class="prettyprint">
 * <code>
 * &lt;my-chart data="[[salesData]]" axis-labels={{showAxisLabels}} ... >
 * &lt;/my-chart>
 * </code>
 * </pre>
 * </p>
 * <h3>readOnly</h3>
 * <p>The composite component Metadata also defines properties to control expression writeback and property updates.
 * If a property's readOnly option is omitted, the value is false by default, meaning the property can be updated outside of the
 * composite component.  If readOnly is true, the property can only be updated inside of the composite component by the ViewModel or View.
 * </p>
 * <h3>writeback</h3>
 * <p>If a property's Metadata defines its writeback property as true (false by default), any bound attribute expressions will
 * be updated when the property is updated unless the attribute binding was done with a one-way "[[]]"" binding syntax.</p>
 *
 * <h2 id="slotting">Slotting
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#slotting"></a>
 * </h2>
 * <p>
 * Complex composite components which can contain additional composites and/or content for child facets defined in its associated View can be constructed via slotting.
 * </p>
 * <h3>Definitions</h3>
 * <h4>Assignable Node</h4>
 * <h5>Properties</h5>
 * <ul>
 *  <li>Nodes with slot attributes will be assigned to the corresponding named slots (if
 *    present) and all other assignable nodes (Text or Element) will be assigned to
 *    the default slot (if present).</li>
 *  <li>The slot attribute of a node is only applied once. If the View contains a
 *    composite and the node's assigned slot is a child of that composite, the slot
 *    attribute of the assigned slot is inherited for the slotting of that composite.</li>
 *  <li>Nodes with slot attributes that reference slots not present in the View will not appear in the DOM.</li>
 *  <li>If the View does not contain a default slot, nodes assigned to the default slot will not appear in the DOM.</li>
 *  <li>Nodes that are not assigned to a slot will not appear in the DOM.</li>
 * </ul>
 *
 * <h4>Slot</h4>
 * <h5>Properties</h5>
 * <ul>
 *  <li>A default slot is a slot element whose slot name is the empty string or missing.</li>
 *  <li>More than one node can be assigned to the same slot.</li>
 *  <li>A slot can also have a slot attribute and be assigned to another slot.</li>
 *  <li>A slot can have fallback content which are its child nodes that will be used in the DOM in its place if it has no assigned nodes.</li>
 *  <li>A slot can also also have an index attribute to allow the slot's assigned nodes
 *    to be individually slotted (e.g. in conjunction with a Knockout foreach binding).</li>
 * </ul>
 *
 * <h3>Applying Bindings</h3>
 * <p>The following steps will occur when processing the binding for a composite component:
 * <ol>
 *  <li>Apply bindings to children using the composite component's binding context.</li>
 *  <li>Create a slot map assigning component child nodes to View slot elements.
 *    <ol>
 *      <li>At this point the component child nodes are removed from the DOM and live in the slot map.</li>
 *    </ol>
 *  </li>
 *  <li>Insert the View and apply bindings to it with the ViewModel's binding context.
 *    <ol>
 *      <li>The composite's children will be 'slotted' into their assigned View slots.</li>
 *      <li>The oj-slot's slot attribute, which is "" by default, will override its assigned node's slot attribute.</li>
 *    </ol>
 *  </li>
 * </ol>
 * </p>
 *
 * <h4>Example #1: Basic Usage</h4>
 * Note that the IDs are provided for sample purposes only.
 * <h5>Initial DOM</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-a>
 *  &lt;div id="A" slot="foo">&lt;/div>
 *  &lt;div id="B" slot="bar">&lt;/div>
 *  &lt;div id="C">&lt;/div>
 *  &lt;div id="D" slot="foo">&lt;/div>
 *  &lt;div id="E" slot="cat">&lt;/div>
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <h5>View</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- oj-a View -->
 * &lt;div id="outerFoo">
 *  &lt;oj-slot name="foo">&lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerBar">
 *  &lt;oj-slot name="bar">&lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerBaz">
 *  &lt;oj-slot name="baz">
 *    &lt;!-- Default Content -->
 *    &lt;img id="F">&lt;/img>
 *    &lt;div id="G">&lt;/div>
 *  &lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerDefault">
 *  &lt;oj-slot>
 *    &lt;!-- Default Content -->
 *    &lt;div id="H">&lt;/div>
 *  &lt;/oj-slot>
 * &lt;/div>
 * </code>
 * </pre>
 *
 * <h5>Final DOM</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-a>
 *  &lt;div id="outerFoo">  
 *      &lt;div id="A" slot="foo">&lt;/div>
 *      &lt;div id="D" slot="foo">&lt;/div>
 *  &lt;/div>
 *  &lt;div id="outerBar">
 *      &lt;div id="B" slot="bar">&lt;/div>
 *   &lt;/div>
 *  &lt;div id="outerBaz">
 *      &lt;img id="F">&lt;/img>
 *      &lt;div id="G">&lt;/div>
 *  &lt;/div>
 *  &lt;div id="outerDefault">
 *      &lt;div id="C">&lt;/div>
 *  &lt;/div>
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <h4>Example #2: Slot Attribute Evaluation</h4>
 * <p>When a node is assigned to a slot, its slot value is not used for subsequent
 *  slot assignments when child bindings are applied. Instead that slot's slot attribute,
 *  which by default is "", overrides the assigned node's slot attribute. No actual
 *  DOM changes will be made to the assigned node's slot attribute, but its evaluated
 *  slot value will be managed internally and used for applying subsequent child bindings.</p>
 *
 * <h5>Initial DOM</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-a>
 *  &lt;div id="A" slot="foo">&lt;/div>
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <h5>View</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- oj-a View -->
 * &lt;oj-b>
 *  &lt;oj-slot name="foo">&lt;/oj-slot>
 * &lt;/oj-b>
 *
 * &lt;!-- oj-b View -->
 * &lt;div id="outerFoo">
 *  &lt;oj-slot name="foo">&lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerDefault">
 *  &lt;oj-slot>&lt;/oj-slot>
 * &lt;/div>
 * </code>
 * </pre>
 *
 * <p>When applying bindings for the oj-a View, the oj-slot binding will replace
 * slot foo with div A. Slot foo's slot attribute ("") overrides div A's ("foo")
 * so that the evaluated slot value ("") will be used when applying subsequent child bindings.<p>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- DOM -->
 * &lt;oj-a>
 *  &lt;!-- Start oj-a View -->
 *  &lt;oj-b>
 *    &lt;!-- Evaluated slot value is "" -->
 *    &lt;div id="A" slot="foo">&lt;/div>
 *  &lt;/oj-b>
 *  &lt;!-- End oj-a View -->
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <p>When applying bindings for the oj-b View, the oj-slot binding will replace
 *  oj-b's default slot with div A since it's evaluated slot value is "".</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- DOM -->
 * &lt;oj-a>
 *  &lt;!-- Start oj-a View -->
 *  &lt;oj-b>
 *    &lt;!-- Start oj-b View -->
 *    &lt;div id="outerFoo">
 *    &lt;/div>
 *    &lt;div id="outerDefault">
 *      &lt;div id="A" slot="foo">&lt;/div>
 *    &lt;/div>
 *    &lt;!-- End oj-b View -->
 *  &lt;/oj-b>
 *  &lt;!-- End oj-a View -->
 * &lt;/oj-a>
 * </code>
 * </pre>
 * 
 * <h2 id="automation">Automation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#automation"></a>
 * </h2>
 * <p>
 * The JET framework will by default expose <code>getNodeBySubId/getSubIdByNode</code> implementations on the composite element, using the presence of <code>data-oj-subid(-map)</code> 
 * attribute markup within the composite View to determine which elements to expose. The data-oj-subid attribute takes a single string which maps that element to the given subid 
 * The data-oj-subid-map attribute takes a JSON object containing custom subIds that map to component subIds when the component is another composite or JET component. 
 * If both attributes are specified, the data-oj-subid-map value takes precedence and data-oj-subid will be ignored as we do not recommend exposing both.
 * If the composite can expose all necessary subIds via the data-oj-subid(-map) attributes then it does not need to provide its own implementation. 
 * However, for cases like exposing subIds on stamped items, the composite can provide its own implementation on the composite ViewModel. For an example
 * and more details, please see the "Preparing Oracle JET Composite Components for Automation Testing" section of the Developer's Guide. The composite does not need to 
 * define <code>getNodeBySubId/getSubIdByNode</code> methods in the metadata except for documentation purposes.
 * </p>
 * 
 * @namespace
 */
oj.Composite = {};

/**
 * Default configuration values.
 * Composite component conventions may be overridden for the entire application after the ojs/ojcomposite
 * module is loaded. For example:
 * <p><code class="prettyprint">
 * oj.Composite.defaults.bindingsAppliedMethod = 'applied';
 * </code></p>
 * @property {string} initializeMethod The name of the initialialization method. Defaults to 'initialize'.
 * @property {string} activatedMethod The name of the method invoked after the Model is instantiated. Defaults to 'activated'.
 * @property {string} attachedMethod The name of the method invoked when the View is inserted into the document DOM. Defaults to 'attached'.
 * @property {string} bindingsAppliedMethod The name of the method invoked after the bindings are applied on the View. Defaults to 'bindingsApplied'.
 * @property {string} detachedMethod The name of the method called when the composite is detached from the DOM. Defaults to 'detached'.
 * @property {string} disposeMethod <b>Deprecated</b>: Use the detached method instead. The name of the method called when the composite is disposed. Defaults to 'dispose'.
 * @deprecated Since composites are designed to be reusable components, we do not recommend overriding the default lifecycle listener names and potentially breaking consumed composites.
 *
 * @export
 * @memberof oj.Composite
 */
oj.Composite.defaults =
{
  'initializeMethod': 'initialize',
  'activatedMethod': 'activated',
  'attachedMethod': 'attached',
  'bindingsAppliedMethod': 'bindingsApplied',
  'detachedMethod': 'detached',
  'disposeMethod': 'dispose'
};


/**
 * Returns a Promise resolving with the composite metadata with the given name.
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @return {Promise}
 * 
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.getMetadata = function(name)
{
  return oj.CompositeElementBridge.getMetadata(name);
};

/**
 * Registers a composite component
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @param {Object} descriptor The registration descriptor. The descriptor will contain keys for Metadata, View, ViewModel
 * and CSS that are detailed below. At a minimum a composite must register Metadata and View files, but all others are optional.
 * See the <a href="#registration">registration section</a> above for a sample usage.
 * The value for each key is a plain Javascript object that describes the loading
 * behavior. One of the following keys must be set on the object:
 * <ul>
 * <li>promise - specifies the promise instance</li>
 * <li>inline - provides the object inline</li>
 * </ul>
 * @param {Object} descriptor.metadata Describes how component Metadata is loaded. The object must contain one of the keys
 * documented above and ultimately resolve to a JSON object.
 * @param {Object} descriptor.view Describes how component's View is loaded. The object must contain one of the keys
 * documented above and ultimately resolve to a string, array of DOM nodes, or document fragment.
 * @param {Object} descriptor.css Describes how component's CSS is loaded. If specified, the object must contain one of the keys
 * documented above and ultimately resolve to a string if loaded inline or as a Promise.
 * @param {Object} descriptor.viewModel Describes how component's ViewModel is loaded. If specified, the object must contain one of the keys
 * documented above. This option is only applicable to composites hosting a Knockout template
 * with a ViewModel and ultimately resolves to a constructor function or object instance. If the initial ViewModel resolves to an object instance, the
 * initialize lifecycle listener will be called. See the <a href="#lifecycle">initialize documentation</a> for more information.
 * @param {function(string, string, Object, function(string))} descriptor.parseFunction The function that will be called to parse attribute values.
 * Note that this function is only called for non bound attributes. The parseFunction will take the following parameters:
 * <ul>
 *  <li>{string} value: The value to parse.</li>
 *  <li>{string} name: The name of the property.</li>
 *  <li>{Object} meta: The metadata object for the property which can include its type, default value, 
 *      and any extensions that the composite has provided on top of the required metadata.</li>
 *  <li>{function(string)} defaultParseFunction: The default parse function for the given attribute 
 *      type which is used when a custom parse function isn't provided and takes as its parameters 
 *      the value to parse.</li>
 * </ul>
 *
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.register = function(name, descriptor)
{
  oj.CompositeElementBridge.register(name, descriptor);
};

/**
 * Finds the containing composite component for a given node. If the immediate enclosing
 * composite component is contained by another composite, the method will keep
 * walking up the composite hierarchy until the top-level composite
 * or the optional 'stopBelow' element is reached
 * 
 * @param {Node} node the DOM node whose containing composite should be returned
 * @param {Element=} stopBelow the element where search should stop
 * @return {Element|null} the containing composite
 * 
 * This method is currently intended for internal use only, and it is not exported
 * @ignore
 */
oj.Composite.getContainingComposite = function(node, stopBelow)
{
  var composite = null;
  
  while(node)
  {
    node = oj.CompositeTemplateRenderer.getEnclosingComposite(node);
    if (node)
    {
      if (stopBelow && !(node.compareDocumentPosition(stopBelow) & 16/*contained by*/))
      {
        break;
      }
      composite = node;
    }
  }
  
  return composite;
};

/**
 * @ignore
 */
oj.Composite.__COMPOSITE_PROP = '__oj_composite';
});
