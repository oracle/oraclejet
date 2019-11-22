/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['knockout', 'ojs/ojcore', 'ojs/ojkoshared', 'ojs/ojhtmlutils', 'ojs/ojlogger'],
function(ko, oj, BindingProviderImpl, HtmlUtils, Logger)
{
  "use strict";

/* global ko:false, oj:false, BindingProviderImpl: false, WeakMap: false, Map: false, HtmlUtils:false, Logger: false*/

/**
 * Default JET Template engine iumplementation
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
function JetTemplateEngine() {
  /**
   * Executes the template by deep-cloning the template nodes and then applying data binndings
   * @param {Element} componentElement component element
   * @param {Element} node the <template> element
   * @param {Oject} properties data to be applied to the template
   * @param {string} alias an alias for referencing the data within a template
   * @return {Array.<Node>} HTML nodes representing the result of the execution
   * @ignore
   */
  this.execute = function (componentElement, node, properties, alias) {
    var tmpContainer = _createAndPopulateContainer(node);

    // Check to see if data-oj-as was defined on the template element as an additional
    // alias to provide to the template children
    var templateAlias = node.getAttribute('data-oj-as');
    ko.applyBindingsToDescendants(_getContext(componentElement, node, properties, alias,
      templateAlias), tmpContainer);

    return Array.prototype.slice.call(tmpContainer.childNodes, 0);
  };

  /**
   * Cleans the node where bindings were previously applied
   * @param {Node} node
   * @ignore
   */
  this.clean = function (node) {
    return ko.cleanNode(node);
  };

  /**
   * Resolves properties on an element of the template without producing
   * any DOM. This method should be used when a template is used exclusively for collecting
   * properties while iterating over data
   * @param {Element} componentElement component element
   * @param {Element} node the <template> element
   * @param {string} elementTagName tag name of the element where the property should be collected
   * @param {Set.<string>} propertySet properties to be resolved
   * @param {Object} data data to be applied to the template
   * @param {string} alias an alias for referencing the data within a template
   * @param {Function=} propertyValidator a function to type check the value for a property
   * @param {Element=} alternateParent an element where the template element will be
   * temporarily added as a child. If the parameter is ommitted, the componentElement will
   * be used
   * @return {Object} an object that implemenets three functions: peek(), subscribe() and dispose()
   * peek() returns the current value of the resolved properties, subscribe allows registering a subscription to the changes in resolved property values with
   * the subscription callback receiving the new value as a parameter, and dispose() removes the subscription.
   * @ignore
   */
  this.resolveProperties = function (componentElement, node, elementTagName, propertySet,
    data, alias, propertyValidator, alternateParent) {
    var templateAlias = node.getAttribute('data-oj-as');

    var context = _getContext(componentElement, node, data, alias, templateAlias);

    var contribs = _getPropertyContributorsViaCache(node, context, elementTagName,
      propertySet, alternateParent || componentElement);

    return _createComputed(contribs, context, propertyValidator);
  };

  /**
   * Defines a special 'tracked' property on the target object. Mutating the tracked property will automatically update
   * the DOM previously produced by the .execute() method
   * @param {Object} target an object where the property is defined
   * @param {string} name property name
   * @param {*=} optional initial value
   * @param {Function=} optional listener for value changes. Note that the listener
   * will be invoked both for upsteream and downstream changes
   * @ignore
   */
  this.defineTrackableProperty = function (target, name, value, changeListener) {
    _createPropertyBackedByObservable(target, name, value, changeListener);
  };

  /**
    * Provides a promise for JET's Knockout throttling timeout
    * @return {Promise} a promise for JET's Knockout throttling timeout completing or a promise that will be resolved immediately for the case
    * when there is no outstanding throttling timeout
    * @ignore
    */
  this.getThrottlePromise = function () {
    return BindingProviderImpl.getThrottlePromise();
  };

  function _createPropertyBackedByObservable(target, name, value, changeListener) {
    var obs = ko.observable(value);
    Object.defineProperty(target, name, {
      get: function () { return obs(); },
      set: function (val) {
        obs(val);
        if (changeListener) {
          changeListener(val);
        }
      },
      enumerable: true
    });
  }

  var _propertyContribsCache = new WeakMap();

  function _createComputed(contribs, context, propertyValidator) {
    var computed = ko.pureComputed(function () {
      var boundValues = {};
      contribs.evalMap.forEach(function (evaluator, tokens) {
        var leafValue = ko.utils.unwrapObservable(evaluator(context));
        if (propertyValidator) {
          propertyValidator(tokens, leafValue);
        }
        boundValues[tokens[0]] = _getMergedValue(boundValues, tokens, leafValue);
      });
      var extend = oj.CollectionUtils.copyInto;
      var valueMap = extend({}, contribs.staticMap, null, true);
      valueMap = extend(valueMap, boundValues, null, true);

      return valueMap;
    });

    return _wrap(computed, ['peek', 'subscribe', 'dispose']);
  }

  function _wrap(delegate, methods) {
    var ret = {};
    methods.forEach(function (method) {
      ret[method] = delegate[method].bind(delegate);
    });
    return ret;
  }

  function _getPropertyContributorsViaCache(node, context, elementTagName, propertySet, parent) {
    var contribs = _propertyContribsCache.get(node);
    if (!contribs) {
      contribs = {};
      _propertyContribsCache.set(node, contribs);

      var tmpNode = _createAndPopulateContainer(node);
      var firstElem = tmpNode.querySelector(elementTagName);

      contribs.evalMap = _getPropertyEvaluatorMap(firstElem, propertySet, context);
      contribs.staticMap = _getStaticPropertyMap(firstElem, propertySet, parent);
    }
    return contribs;
  }

  function _getPropertyEvaluatorMap(firstElem, propertySet, context) {
    var evalMap = new Map();
    var attrs = firstElem ? firstElem.attributes : [];

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var prop = oj.__AttributeUtils.attributeToPropertyName(attr.name);
      // Handle the 'dot' notation for bound subprops
      var propTokens = prop.split('.');
      if (propertySet.has(propTokens[0])) {
        var info = oj.__AttributeUtils.getExpressionInfo(attr.value);
        var expr = info.expr;
        if (expr) {
          evalMap.set(propTokens,
            BindingProviderImpl.createBindingExpressionEvaluator(expr, context));
        }
      }
    }
    return evalMap;
  }

  function _getStaticPropertyMap(firstElem, propertySet, parent) {
    var staticMap = {};
    if (firstElem) {
      var st = firstElem.style;
      st.display = 'none';
      st.position = 'absolute';
      firstElem.setAttribute('data-oj-binding-provider', 'none');
      parent.appendChild(firstElem);

      propertySet.forEach(function (key) {
        if (firstElem[key] !== undefined) {
          staticMap[key] = firstElem[key];
        }
      });

      parent.removeChild(firstElem);
    }
    return staticMap;
  }

  function _getMergedValue(valuesObj, tokens, value) {
    if (tokens.length < 2) {
      return value;
    }
    var complexVal = valuesObj[tokens[0]] || {};
    var current = complexVal;
    var lastIndex = tokens.length - 1;

    for (var i = 1; i < lastIndex; i++) {
      var token = tokens[i];
      var newVal = current[token] || {};
      current[token] = newVal;
      current = newVal;
    }
    current[tokens[lastIndex]] = value;
    return complexVal;
  }

  function _createAndPopulateContainer(node) {
    var div = document.createElement('div');
    var nodes = HtmlUtils.getTemplateContent(node);
    for (var i = 0; i < nodes.length; i++) {
      div.appendChild(nodes[i]);
    }
    return div;
  }

  function _getContext(componentElement, node, properties, alias, templateAlias) {
    // Always use the binding context for the template  element
    // Note: the context for oj_bind_for_each template is stored on __ojBindingContext property.
    var bindingContext = node.__ojBindingContext ?
      node.__ojBindingContext : ko.contextFor(node);
    // In the rare case it's not defined, check the componentElement and log a message
    if (!bindingContext) {
      Logger.info('Binding context not found when processing template for element with id: ' +
        componentElement.id + '. Using binding context for element instead.');
      bindingContext = ko.contextFor(componentElement);
    }
    return BindingProviderImpl.extendBindingContext(bindingContext, properties,
      alias, templateAlias, componentElement);
  }
}

return new JetTemplateEngine();
});
