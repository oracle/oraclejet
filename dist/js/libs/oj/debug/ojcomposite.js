/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojknockout'], function(oj, ko)
{
/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
*/

/**
 * @ignore
 * @constructor
 */
function PropertyUpdater(element, props, bindingContext)
{
  this.setup = function(metadata)
  {
    // Since we are tracking all our dependencies explicitly, we are suspending dependency detection here.
    // update() will be called only once as a result

    var metadataProps = metadata['properties'];
    if (metadataProps)
    {
      // Override set/removeAttribute so we get notifications when DOM changes
      originalMethods.setAttribute = element.setAttribute,
      originalMethods.removeAttribute = element.removeAttribute
      element.setAttribute = function(name, value)
      {
        changeAttribute(name, value, originalMethods.setAttribute);
      };
      element.removeAttribute = function(name)
      {
        changeAttribute(name, null, originalMethods.removeAttribute);
      };
      var changeAttribute = function(name, value, operation)
      {
        name = name.toLowerCase();
        var previousValue = element.getAttribute(name);
        operation.apply(element, arguments);
        var newValue = element.getAttribute(name);
        var propName = _attributeToPropertyName(name);
        if (element.hasOwnProperty(propName) && newValue !== previousValue)
        {
          _setPropertyFromAttribute(props, metadataProps[propName], propName, newValue);
        }
      }

      var names = Object.keys(metadataProps);

      _setInitializing(true);

      try{

        names.forEach(
          function(name)
          {
            var attrName = _propertyNameToAttribute(name);
            var elemHasAttr = element.hasAttribute(attrName);
            var propertyMetadata = metadataProps[name];
            if (elemHasAttr)
            {
              var attrVal = element.getAttribute(attrName);
              _setPropertyFromAttribute(props, propertyMetadata, name, attrVal);
            }
            else
            {
              if (!propertyMetadata['readOnly'])
              {
                element[name] = propertyMetadata['value'];
              }
            }
          }
        );
      }
      finally
      {
        _setInitializing(false);
      }
    }
    return this;
  }

  this.isInitializing = function()
  {
    return _initializing;
  }

  function _setPropertyFromAttribute(props, metadata, propName, attrVal)
  {
    if (!_setupExpression(attrVal, props, propName, metadata) && !metadata['readOnly'])
    {
      var value = _coerceValue(attrVal, metadata['type']);
      _setElementProperty(propName, value);
    }
  }

  function _coerceValue(val, type)
  {
    // We only support primitive types and JSON objects for coerced properties
    var typeLwr = type.toLowerCase();
    switch (typeLwr) {
      case "boolean":
        return Boolean(val);
      case "number":
        return Number(val);
      case "string":
        return val;
      default:
        return JSON.parse(val);
    }
  }

  this.teardown = function(element)
  {
    var names;
    [observableListeners, expressionListeners].forEach(
      function(listeners)
      {
        names = Object.keys(listeners);
        for (var i=0; i<names.length; i++)
        {
          expressionListeners[names[i]]['dispose']();
        }
      }
    );
    observableListeners = {};
    expressionListeners = {};


    // reset overridden methods
    names = Object.keys(originalMethods);
    var i;
    for (i=0; i<names.length; i++)
    {
      var method = names[i];
      element[method] = originalMethods[method];
    }
    originalMethods = {};

    // reset change listeners
    names = Object.keys(changeListeners);
    for (i=0; i<names.length; i++)
    {
      var prop = names[i];
      element.removeEventListener(prop + _CHANGED_EVENT_SUFFIX, changeListeners[prop]);
    }
    changeListeners = {};
  }

  function _attributeToPropertyName(attr)
  {
    return attr.toLowerCase().replace(/-(.)/g,
      function(match, group1)
      {
        return group1.toUpperCase();
      }
    );
  }

  // This function should be called when the bindings are applied initially and whenever the expression attribute changes
  function _setupExpression(attrVal, props, propName, metadata)
  {
    var info = oj.ExpressionUtils.getExpressionInfo(attrVal);

    delete propsWithLocalValue[propName];

    var oldListener = expressionListeners[propName];
    if (oldListener)
    {
      oldListener['dispose']();
      delete expressionListeners[propName];
    }

    // Clean up property change listeners to handler the case when the type of the expression changes
    var changeListener  = changeListeners[propName];
    if (changeListener)
    {
      element.removeEventListener(propName + _CHANGED_EVENT_SUFFIX, changeListener);
      delete changeListeners[propName];
    }

    var cleanupObservableListener;

    var readOnly = metadata['readOnly'];

    if (!readOnly)
    {
      cleanupObservableListener = function()
      {
        var observableListener = observableListeners[propName];
        if (observableListener)
        {
          observableListener['dispose']();
          delete observableListeners[propName];
        }
      }
      cleanupObservableListener();
    }

    var expr = info.expr;

    if (expr)
    {
      // TODO: consider moving  __CreateEvaluator() to a more generic utility class
      var evaluator = oj.ComponentBinding.__CreateEvaluator(expr);

      if (!readOnly)
      {
        ko.ignoreDependencies(
          function()
          {
            expressionListeners[propName] = ko.computed(
              // The read() function for the computed will be called when the computed is created and whenever any of
              // the expression's dependency changes
              function()
              {
                cleanupObservableListener();

                if (!propsWithLocalValue[propName])
                {
                  var value = evaluator(bindingContext);
                  if (ko.isObservable(value))
                  {
                    observableListeners[propName] = _setAndWatchObservableValue(propName, value);
                  }
                  else
                  {
                    _setElementProperty(propName, value);
                  }
                }
              }
            );
          }
        );
      }

      changeListeners[propName] = _listenToPropertyChanges(propName, expr, evaluator, metadata['writeback'] && !info.downstreamOnly);

      return true;
    }


    return false;
  }

  function _setAndWatchObservableValue(propName, value)
  {
    ko.ignoreDependencies(
      function()
      {
        _setElementProperty(propName, ko.utils.unwrapObservable(value));
      }
    );

    var listener = value['subscribe'](

      function(newVal)
      {
        if (!propsWithLocalValue[propName])
        {
          _setElementProperty(propName, newVal);
        }
      }

    );

    return listener;
  }


  function _listenToPropertyChanges(propName, expr, evaluator, writable)
  {
    var listener = function(evt)
    {
      var written  = false;
      if (!_settingProperty)
      {
        if (writable)
        {
          ko.ignoreDependencies(
            function()
            {
              var value = evt['detail']['value'];

              var target = evaluator(bindingContext);

              if (ko.isWriteableObservable(target))
              {
                written = true;
                target(value);
              }
              else
              {
                 var writerExpr = oj.ExpressionUtils.getPropertyWriterExpression(expr);
                  if (writerExpr != null)
                  {
                    // TODO: consider caching the evaluator
                    var wrirerEvaluator = oj.ComponentBinding.__CreateEvaluator(writerExpr);
                    wrirerEvaluator(bindingContext)(value);
                    written = true;
                  }
              }
            }
          );
        }
        if (!written)
        {
          propsWithLocalValue[propName] = true;
        }
      }

    };

    element.addEventListener(propName + _CHANGED_EVENT_SUFFIX, listener);
    return listener;
  }

  function _propertyNameToAttribute(name)
  {
    return name.replace(/([A-Z])/g,
      function(match)
      {
        return '-' + match.toLowerCase();
      }
    );
  }

  function _setInitializing(flag)
  {
    _initializing = flag;
  }

  function _setElementProperty(propName, value)
  {
    _settingProperty = true;
    try
    {
      element[propName] = value;
    }
    finally
    {
      _settingProperty = false;
    }
  }

  var expressionListeners = {};
  var observableListeners = {};
  var changeListeners = {};
  var originalMethods = {};
  var propsWithLocalValue = {};
  var _initializing;
  var _settingProperty;
  var _CHANGED_EVENT_SUFFIX = "-changed";
}

/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
*/

ko['bindingHandlers']['_ojNodeStorage_'] =
{
  'init': function()
  {
    return {'controlsDescendantBindings' : true};
  }
}

/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
*/

ko['bindingHandlers']['_ojSlot_'] =
{
  'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {

    function cleanup(bindingContext)
    {
      var nodeStorage = bindingContext['__oj_nodestorage'];
      // Move all non default slot children to nodeStorage
      if (nodeStorage)
      {
        // Check to see if we've processed this node as an assigned node by seeing if we've
        // added a 'data-oj-slot' property to the node
        var node;
        while (node = ko.virtualElements.firstChild(element))
        {
          if (node['__oj_slots'] != null)
            nodeStorage.appendChild(node);
        }
      }
    }
    ko.utils.domNodeDisposal.addDisposeCallback(element, cleanup.bind(null, bindingContext));

    var slots = bindingContext['__oj_slots'];

    var values = valueAccessor();
    var unwrap = ko.utils.unwrapObservable;
    var slotName =  unwrap(values['name']) || '';
    var index =  unwrap(values['index']);
    var assignedNodes = index != null ? [slots[slotName][index]] : slots[slotName];

    if (assignedNodes)
    {
      for (var i = 0; i < assignedNodes.length; i++)
      {
        // Save references to nodes we need to cleanup ._slot field
        var node = assignedNodes[i];
        // Get the slot value of this oj-slot element so we can assign it to its
        // assigned nodes for downstream slotting
        node['__oj_slots'] = unwrap(values['slot']) || '';
      }
      ko.virtualElements.setDomNodeChildren(element, assignedNodes);

      // If no assigned nodes, let ko apply bindings to default slot content
      return {'controlsDescendantBindings' : true};
    }
  }
}

// Allow _ojSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
ko.virtualElements.allowedBindings['_ojSlot_'] = true;

/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

(function()
{

  oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE.addPostprocessor
  (
    {
      'nodeHasBindings': function(node, wrappedReturn)
      {
        return wrappedReturn || (node.nodeType === 1 && oj.Composite.__GetDescriptor(node.nodeName.toLowerCase()));
      },

      'getBindingAccessors': function(node, bindingContext, wrappedReturn)
      {
        if (node.nodeType === 1)
        {
          var name = node.nodeName.toLowerCase();
          var descriptor = oj.Composite.__GetDescriptor(name);
          if (descriptor)
          {
            wrappedReturn = wrappedReturn || {};

            var compositionBinding  = 'ojComposite';

            if (wrappedReturn[compositionBinding])
            {

              throw "Cannot use " + compositionBinding +  " binding on a custom element whose name is already registered for a composite binding";
            }

            var bindingValue = {'name': name};

            wrappedReturn[compositionBinding] = function() {return bindingValue;}

          }
        }

        return wrappedReturn;
      },

      'preprocessNode': function(node, wrappedReturn)
      {
        var newNodes;
        if (node.nodeType === 1)
        {
          if ('oj-slot' === node.nodeName.toLowerCase())
          {
            var attrs = ['name', 'slot', 'index'];

            var binding = 'ko _ojSlot_:{'
            var valueExpressions = [];

            for (var i=0; i<attrs.length; i++)
            {
              var attr = attrs[i];
              var expr = _getExpression(node.getAttribute(attr));
              if (expr)
              {
                valueExpressions.push(attr + ':' + expr);
              }
            }
            binding += valueExpressions.join(',');
            binding += '}';

            var openComment = document.createComment(binding);

            var closeComment = document.createComment('/ko');

            newNodes = [openComment];

            var parent  = node.parentNode;
            parent.insertBefore(openComment, node);

            // Copy the 'fallback content' children into the comment node
            while (node.childNodes.length > 0)
            {
              var child = node.childNodes[0];
              parent.insertBefore(child, node);
              newNodes.push(child);
            }

            newNodes.push(closeComment);

            parent.replaceChild(closeComment, node);
          }
        }
        return newNodes? newNodes: wrappedReturn;
      }
    }

  );

  function _getExpression(attrValue)
  {
    if (attrValue != null)
    {
      var exp = oj.ExpressionUtils.getExpressionInfo(attrValue).expr;
      if (exp == null)
      {
        exp = "'" + attrValue + "'";
      }
      return exp;
    }

    return null;
  }

}
)();

/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/



/**
 * Composite Components' APIs
 * @namespace
 */
oj.Composite = {};


/**
 * Default configuration values
 * Composite component conventions may be overridden for the entire application after the ojs/ojcomposite
 * module is loaded. For example:
 * <p><code class="prettyprint">
 * oj.Composite.defaults.modelPath = 'models/';
 * </code></p>
 * @property {string} viewPath default View path. Defaults to 'text!composite/views/'
 * @property {string} viewSuffix default View suffix. Defaults to '.html'
 * @property {string} modelPath default Model suffix. Defaults to 'composite/viewModels//'
 * @property {string} initializeMethod name of the initialialization method
 * @property {string} activatedMethod name of the method invoked after the Model is instantiated
 * @property {string} attachedMethod name of the method invoked when the view is inserted into the document DOM
 * @property {string} bindingsAppliedMethod name of the method invoked after the bindings are applied on the View
 * @property {string} disposeMethod name of the dispose method
 *
 * @export
 * @memberof oj.Composite
 */
oj.Composite.defaults =
{
  'viewPath': 'text!composite/views/',
  'viewSuffix': '.html',
  'modelPath': 'composite/viewModels/',
  'metadataPath': 'text!composite/metadata/',
  'metadataSuffix': '.json',
  'cssPath': 'css!composite/css/',
  'initializeMethod': 'initialize',
  'activatedMethod': 'activated',
  'attachedMethod': 'attached',
  'bindingsAppliedMethod': 'bindingsApplied',
  'disposeMethod': 'dispose'
};

/**
 * Registers a composite component
 * @param {string} name the component name.
 *
 * @param {Object} descriptor registration descriptor. The descriptor will contain keys for metadata, view, viewModel
 * and metadatda that are detailed below. The value for each key is a plain Javascript object that describes the loading
 * behavior. One of the following keys must be set on the object:
 * <ul>
 * <li>require - specifies the name of the Require.js module</li>
 * <li>promise - specifies the promise instance</li>
 * <li>inline - provides the object inline which can be of the following types:
 * <ul>
 * <li>metadata - JSON object</li>
 * <li>view - string, array of DOM nodes, or document fragment</li>
 * <li>css - string</li>
 * <li>viewModel - constructor function or object instance</li>
 * </ul>
 * </li>
 * </ul>
 * @param {Object} descriptor.metadata describes how component metadata is loaded. The object must contain one of the keys
 * documented above.
 * @param {Object} descriptor.view describes how component's View is loaded. The object must contain one of the keys
 * documented above.
 * @param {Object} descriptor.css describes how component's CSS is loaded. If specified, the object must contain one of the keys
 * documented above.
 * @param {Object} descriptor.viewModel describes how component's viewModel is loaded. If specified, the object must contain one of the keys
 * documented above. This option is only applicable to composites hosting a Knockout template
 * with a ViewModel
 *
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.register = function(name, descriptor)
{
  oj.Composite._registry[name] = descriptor;
}

/**
 * @ignore
 */
oj.Composite.__GetDescriptor = function(name)
{
  return oj.Composite._registry[name];
}

/**
 * @ignore
 */
oj.Composite._registry = {};

/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
*/

ko['bindingHandlers']['ojComposite'] =
{
  'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {
    return {'controlsDescendantBindings' : true};
  },

  'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {
    var _INTERRUPTED_ERROR = new Error();
    var childViewModel;
    var propertyUpdater;
    var pendingLoadId = -1;
    var nodeDisposed = false;
    var compMetadata;
    var props = {};
    var nodeStorage;

    function cleanup(isNodeDispose, bindingContext)
    {
      if (propertyUpdater)
      {
        propertyUpdater.teardown(element);
        propertyUpdater = null;
      }

      nodeDisposed = isNodeDispose;

      _invokeCompositeViewModelMethod(childViewModel, 'disposeMethod', [element]);

      childViewModel = null;

      if (compMetadata)
      {
        _resetElement(element, compMetadata);
      }

      // cleanup nodeStorage after view slotting is complete
      if (nodeStorage)
      {
        element.removeChild(nodeStorage);
        nodeStorage = null;
      }

      compMetadata = null;
      props = {};
    }

    // Wraps a callback functions to associate it with the the current Load Id
    function wrapToCheckLoadId(func)
    {
      var checker = function(id)
      {
        if (nodeDisposed || id != pendingLoadId)
        {
          throw _INTERRUPTED_ERROR;
        }

        // Exclude the first argument (load Id) when invoking the callback
        return func.apply(this, Array.prototype.slice.call(arguments, 1));

      }.bind(null, pendingLoadId);

      return checker;
    }

    var unwrap = ko.utils.unwrapObservable;


    // Since we are tracking all our dependencies explicitly, we are suspending dependency detection here.
    // update() will be called only once as a result
    ko.ignoreDependencies(
      function()
      {
        ko.computed(
          function()
          {
            // Increment the load Id to ensure that we discard any old pending promises
            pendingLoadId++;
            _fireEvent('pending', element);

            cleanup(false, bindingContext);

            var value = unwrap(valueAccessor()) || {};

            var name = unwrap(value['name']);

            var descriptor = oj.Composite.__GetDescriptor(name);

            if (!descriptor)
            {
              throw "Composite is missing a descriptor";
            }

            var metadataPromise = _getResourcePromise(descriptor, "metadata");
            var propertiesInitializedPromise = null;
            if (metadataPromise)
            {
              propertiesInitializedPromise = metadataPromise.then(
                wrapToCheckLoadId (
                  function(metadata)
                  {
                    if (metadata)
                    {
                      compMetadata = metadata;

                      propertyUpdater = new PropertyUpdater(element, props, bindingContext);
                      _setupProperties(element, props, metadata, propertyUpdater);
                      propertyUpdater.setup(metadata);
                    }
                    else
                    {
                      oj.Logger.warning("ojComposite is being loaded without metadata. No element properties will be set up");
                    }

                    return props;
                  }
                )
              );
            }

            var resolveSlotsPromise;
            var slotsPromise = new Promise(function(resolve) {
              resolveSlotsPromise = resolve;
            });

            var unique = _getUnique();
            var vmContext = {
              'element': element,
              'props': propertiesInitializedPromise,
              'slotNodeCounts': slotsPromise,
              'unique': unique
            };
            var modelInstancePromise = null;
            var modelPromise = _getResourcePromise(descriptor, "viewModel");
            if (modelPromise)
            {
              modelInstancePromise = modelPromise.then(
                wrapToCheckLoadId(
                  function(model)
                  {
                    if (typeof model === 'function')
                    {
                      model = new model(vmContext);
                    }
                    else
                    {
                      // If the function returns a value, use it as the new model instance
                      model = _invokeCompositeViewModelMethod(model, 'initializeMethod', [vmContext]) || model;
                    }

                    return model;
                  }
                )
              );
            }

            var activatedPromise = null;
            if (modelInstancePromise) {
              activatedPromise = modelInstancePromise.then(
                wrapToCheckLoadId(
                  function(model)
                  {
                    return _invokeCompositeViewModelMethod(model, 'activatedMethod', [vmContext]);
                  }
                )
              );
            }

            var viewPromise =  _getResourcePromise(descriptor, "view");
            if (viewPromise)
            {
              viewPromise = viewPromise.then (
                 wrapToCheckLoadId(
                  function(view)
                  {
                    return _getDomNodes(view);
                  }
                 )
              );
            }

            var cssPromise =  _getResourcePromise(descriptor, "css");
            if (cssPromise)
            {
              cssPromise = cssPromise.then (
                wrapToCheckLoadId(
                  function(css)
                  {
                    // The block below is only for the case that css is loaded inline
                    // or via a promise.  When css is loaded via require the css obj is null.
                    if (css) {
                      var style = document.createElement('style');
                      style.type = 'text/css';
                      if (style.styleSheet) // for IE
                      {
                        style.styleSheet.cssText = css;
                      }
                      else
                      {
                        style.appendChild(document.createTextNode(css));
                      }
                      document.head.appendChild(style);
                    }
                  }
                )
              );
            }

            // apply bindings to original DOM in composite context before creating slot map
            ko.applyBindingsToDescendants(bindingContext, element);

            var masterPromise = Promise.all([viewPromise, modelInstancePromise, propertiesInitializedPromise, cssPromise, activatedPromise]);
            masterPromise.then(
              function(id, values)
              {
                if (nodeDisposed || id != pendingLoadId)
                {
                  return;
                }
                var view = values[0];
                if (!view)
                {
                  throw "ojComposite is missing a View";
                }

                // generate slot map before we update DOM with view nodes
                var slotMap = _createSlotMap(element);
                var slotNodeCounts = {};
                for (var slot in slotMap)
                {
                  slotNodeCounts[slot] = slotMap[slot].length;
                }
                resolveSlotsPromise(slotNodeCounts);

                // Store composite children on a hidden node while slotting to avoid stale knockout bindings
                // when observables are updated while children are disconnected from DOM. The _storeNodes methods
                // also adds the storage node to the view so it's added to the DOM in setDomNodChildren
                nodeStorage = _storeNodes(element, view);
                ko.virtualElements.setDomNodeChildren(element, view);

                childViewModel = values[1];
                _invokeCompositeViewModelMethod(childViewModel, 'attachedMethod', [vmContext]);

                var childBindingContext = bindingContext['createChildContext'](childViewModel,
                  undefined, function (ctx)
                  {
                    ctx['__oj_slots'] = slotMap;
                    ctx['__oj_nodestorage'] = nodeStorage;
                    ctx['$slotNodeCounts'] = slotNodeCounts;
                    ctx['$props'] = props;
                    ctx['$unique'] = unique;
                  }
                );

                // Setup view model methods before apply bindings
                if (compMetadata && childViewModel)
                {
                  _setupMethods(element, compMetadata, childViewModel);
                }

                ko.applyBindingsToDescendants(childBindingContext, element);

                _invokeCompositeViewModelMethod(childViewModel, 'bindingsAppliedMethod', [vmContext]);

                _fireEvent('ready', element);

              }.bind(null, pendingLoadId),
              /* reject callback */
              function(id, reason)
              {
                // Ignore failures that were interrupted due to the response no longer being expected
                if (reason === _INTERRUPTED_ERROR)
                {
                  return;
                }

                if (reason != null)
                {
                  oj.Logger.error(reason);
                }

              }.bind(null, pendingLoadId)
            );
          },
          null,
          {'disposeWhenNodeIsRemoved' : element}
        )
      }
    );

    ko.utils.domNodeDisposal.addDisposeCallback(element, cleanup.bind(null, true, bindingContext));


  }
}

function _getResourceModuleName(name, type)
{
  switch(type)
  {
    case 'view':
      return oj.Composite.defaults['viewPath'] + name + oj.Composite.defaults['viewSuffix'];
    case 'viewModel':
      return oj.Composite.defaults['modelPath'] + name;
    case 'metadata':
      return oj.Composite.defaults['metadataPath'] + name + oj.Composite.defaults['metadataSuffix'];
    case 'css':
      return oj.Composite.defaults['cssPath'] + name;
  }
}

/**
 * @ignore
 */
function _getResourcePromise(descriptor, resourceType)
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
      case 'require':
        var module = _getResourceModuleName(val, resourceType);
        promise = new Promise(
          function(resolve, reject)
          {
            require([module],
              function(loaded)
              {
                resolve(resourceType === 'metadata' ? JSON.parse(loaded) : loaded);
              },
              function(reason)
              {
                var error = "ojComposite failed to load " + module;
                if (reason && typeof(reason) === 'string')
                {
                  error = error + " due to: " + reason;
                }
                oj.Logger.error(error);
                // Additionally log the stack trace for the original error
                if (reason instanceof Error)
                {
                  oj.Logger.error(reason.stack);
                }
              }

            );
          }
        );
        break;
      default:
        throw "Invalid descriptor key " + key + " for the resopurce type: " + resourceType;
    }
  }
  return promise;
}

/**
 * @ignore
 */
function _invokeCompositeViewModelMethod(model, key, args)
{
  if (model == null)
  {
    return;
  }
  var name = oj.Composite.defaults[key];
  if (name != null && model)
  {
    var handler = model[name];
    if (typeof handler === 'function')
    {
      return ko.ignoreDependencies(handler, model, args);
    }
  }
}

// TODO: Copied from ModuleBinding.js - consider sharing
/**
 * @ignore
 */
function _getDomNodes(content)
{
  if (typeof content === 'string')
  {
    content = ko.utils.parseHtmlFragment(content);
  }
  else if (_isDocumentFragment(content))
  {
    content = ko.utils.arrayPushAll([], content.childNodes);
  }
  else if (Array.isArray(content))
  {
    content = ko.utils.arrayPushAll([], content);
  }
  else
  {
    throw "The View (" + content + ") has an unsupported type";
  }
  return content;
}

/**
 * @ignore
 */
function _isDocumentFragment(content)
{
  if (window['DocumentFragment'])
  {
    return content instanceof DocumentFragment;
  }
  else
  {
    return content && content.nodeType === 11;
  }
}

/**
 * @ignore
 */
function _setupProperties(element, props, metadata, propertyUpdater)
{
  _enumMetadataProperty(metadata, 'properties',
    function(name, propMetadata)
    {
      _defineDynamicCompositeProperty(element, props, name, propMetadata, propertyUpdater);
    }
  );
}

/**
 * @ignore
 */
function _setupMethods(element, metadata, model)
{
  _enumMetadataProperty(metadata, 'methods',
    function(name)
    {
      var internalName = metadata['methods'][name]['internalName'];
      if (internalName)
        element[name] = model[internalName].bind(model);
      else
        element[name] = model[name].bind(model);
    }
  );
}

/**
 * @ignore
 */
function _defineDynamicCompositeProperty(element, props, name, metadata, propertyUpdater)
{
  var propertyTracker = ko.observable();

  var innerSet = function(val)
  {
    var old = propertyTracker.peek();

    if(old !== val) // We should consider supporting custom comparators
    {
      propertyTracker(val);
      if (!propertyUpdater.isInitializing())
      {
        _firePropertyChangeEvent(element, name, val, old);
      }
    }
  }

  var outerSet = function(val)
  {
    if (metadata['readOnly'])
    {
      throw "Read-only property " + name + " cannot be set";
    }
    innerSet(val);
  }

  var get = function()
  {
    return propertyTracker();
  }

  var outerGet = function()
  {
    return propertyTracker.peek();
  }

  _defineDynamicObjectProperty(props, name, get, innerSet);
  _defineDynamicObjectProperty(element, name, outerGet, outerSet);
}

/**
 * @ignore
 */
function _defineDynamicObjectProperty(obj, name, getter, setter)
{
  Object.defineProperty(
    obj,
    name,
    {
      'configurable': true, // configurable needs to be true so we can delete in cleanup()
      'enumerable': true,
      'get': getter,
      'set': setter
    }
  );
}

/**
 * @ignore
 */
function _firePropertyChangeEvent(element, name, value, previousValue)
{
  var evt = new CustomEvent(name + "-changed",
  {
    'detail':
    {
      'value': value,
      'previousValue': previousValue
    }
  });

  element.dispatchEvent(evt);
}

/**
 * @ignore
 */
function _enumMetadataProperty(metadata, property, callback)
{
  if (!metadata)
  {
    return;
  }

  var properties  = metadata[property] || {};

  var names = Object.keys(properties);
  names.forEach(
    function(name)
    {
      callback(name, properties[name]);
    }
  );
}

/**
 * @ignore
 */
function _resetElement(element, metadata)
{
  ['methods', 'properties'].forEach(
    function(type)
    {
      _enumMetadataProperty(metadata, type,
        function(name)
        {
          delete element[name];
        }
      );
    }
  );
}
/**
 * @ignore
 */
function _isSlotAssignable(node)
{
  return node.nodeType === 1 || node.nodeType === 3;
}

/**
 * @ignore
 */
function _createSlotMap(element)
{
  var slotMap = {};
  var childNodeList = element.childNodes;
  for (var i = 0; i < childNodeList.length; i++)
  {
    var child = childNodeList[i];
    // Only assign Text and Element nodes to a slot
    if (_isSlotAssignable(child))
    {
      // Ignore text nodes that only contain whitespace
      if (child.nodeType === 3 && !child.nodeValue.trim())
      {
        continue;
      }

      // Text nodes and elements with no slot attribute map to the default slot
      var savedSlot = child['__oj_slots'];
      var slot = savedSlot != null ? savedSlot : child.getAttribute && child.getAttribute('slot');
      if (!slot)
        slot = '';

      if (!slotMap[slot])
      {
        slotMap[slot] = [];
      }
      slotMap[slot].push(child);
    }
  }
  return slotMap;
}

/**
 * @ignore
 */
function _storeNodes(element, view)
{
  var nodeStorage;
  var childNodes = element.childNodes;
  if (childNodes)
  {
    nodeStorage = document.createElement('div');
    nodeStorage.setAttribute('data-bind', '_ojNodeStorage_')
    nodeStorage.style.display = 'none';
    view.push(nodeStorage);
    var assignableNodes = [];
    for (var i = 0; i < childNodes.length; i++)
    {
      var node = childNodes[i];
      if (_isSlotAssignable(node))
      {
        assignableNodes.push(node);
      }
    }
    assignableNodes.forEach(function (node) {
      nodeStorage.appendChild(node);
    });
  }
  return nodeStorage;
}

/**
 * @ignore
 */
function _getUnique()
{
  return _UNIQUE + _UNIQUE_INCR++;
}

/**
 * @ignore
 */
function _fireEvent(type, element)
{
  element.dispatchEvent(new CustomEvent(type, {bubbles: true}));
}

var _UNIQUE_INCR = 0;
var _UNIQUE = '_ojcomposite';

});
