/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['knockout', 'ojs/ojcore', 'ojs/ojbindingprovider'],
       function(ko, oj, BindingProvider)
{

/* global ko:false, oj:false, BindingProvider: false, WeakMap: false, Map: false */

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
    ko.applyBindingsToDescendants(_getContext(componentElement, properties, alias, templateAlias),
                                  tmpContainer);

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
   * @param {Element=} alternateParent an element where the template element will be
   * temporarily added as a child. If the parameter is ommitted, the componentElement will
   * be used
   * @return {Object} resolved properties
   * @ignore
   */
  this.resolveProperties = function (componentElement, node, elementTagName, propertySet,
    data, alias, alternateParent) {
    var templateAlias = node.getAttribute('data-oj-as');

    var context = _getContext(componentElement, data, alias, templateAlias);

    var contribs = _getPropertyContributorsViaCache(node, context, elementTagName,
                      propertySet, alternateParent || componentElement);

    var boundValues = {};
    contribs.evalMap.forEach(function (value, tokens) {
      boundValues[tokens[0]] = _getMergedValue(boundValues, tokens,
        ko.ignoreDependencies(value, null, [context]));
    });

    var extend = oj.CollectionUtils.copyInto;
    var valueMap = extend({}, contribs.staticMap, null, true);
    valueMap = extend(valueMap, boundValues, null, true);

    return valueMap;
  };

  var _propertyContribsCache = new WeakMap();

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

  function _getPropertyEvaluatorMap(firstElem, propertySet) {
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
          evalMap.set(propTokens, BindingProvider.createBindingExpressionEvaluator(expr));
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

    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'template') {
      var content = node.content;
      if (content) {
        div.appendChild(document.importNode(content, true));
      } else {
        Array.prototype.forEach.call(node.childNodes,
           function (child) {
             div.appendChild(child.cloneNode(true));
           }
         );
      }
    } else {
      throw new Error('Invalid template node ' + node);
    }

    return div;
  }

  function _getContext(componentElement, properties, alias, templateAlias) {
    var extension = { $current: properties };
    var bindingContext = ko.contextFor(componentElement);

    // The component provided properties will be made available on
    // $current, any alias passed in, and any alias defined on the
    // template element via data-oj-as
    if (bindingContext) {
      if (alias) {
        extension[alias] = properties;
      }
      if (templateAlias) {
        extension[templateAlias] = properties;
      }
      extension = bindingContext.extend(extension);
    } else {
      extension.$data = {}; // simulate binding context behvior
    }

    // All inline templates for a given component will share evaluator cache
    Object.defineProperty(extension, '_ojCacheScope', { value: componentElement });

    return extension;
  }
}

return new JetTemplateEngine();
});
