/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { applyBindingsToDescendants, pureComputed, cleanNode, observable, utils, contextFor } from 'knockout';
import oj from 'ojs/ojcore';
import BindingProviderImpl from 'ojs/ojkoshared';
import { getTemplateContent } from 'ojs/ojhtmlutils';
import { mount, patch, getMountedNode, unmount } from 'ojs/ojvdom';
import { info } from 'ojs/ojlogger';
import { AttributeUtils } from 'ojs/ojcustomelement-utils';

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Default JET Template engine iumplementation
 * @ignore
 */
const JetTemplateEngine = function () {
  /**
   * Executes the template by deep-cloning the template nodes and then applying data binndings
   * @param {Element} componentElement component element
   * @param {Element} templateElement the <template> element
   * @param {Oject} properties data to be applied to the template
   * @param {string} alias an alias for referencing the data within a template
   * @return {Array.<Node>} HTML nodes representing the result of the execution
   * @ignore
   */
  this.execute = function (componentElement, templateElement, properties, alias) {
    // Check to see if data-oj-as was defined on the template element as an additional
    // alias to provide to the template children
    var templateAlias = templateElement.getAttribute('data-oj-as');
    var context = _getContext(componentElement, templateElement, properties, alias, templateAlias);

    // The 'render' property on a template means that the template is a part of a VComponent.
    // The template will be processed with VDom methods.
    if (templateElement.render) {
      return this._executeVDomTemplate(templateElement, context);
    }
    var tmpContainer = _createAndPopulateContainer(templateElement);
    applyBindingsToDescendants(context, tmpContainer);

    return Array.prototype.slice.call(tmpContainer.childNodes, 0);
  };

  /**
   * When a custom element is a part of a VComponent, we expect that its template
   * has 'render' property. The property contains a function callback that returns a body of the template.
   * In this case we want to process template using VDom methods in order to process template
   * expressions correctly.
   * Template nodes will be cached in order to be updated when 'render' proprety value is updated,
   * in this case we don't need to refresh parent custom element completely.
   * @param {Element} templateElement the <template> element
   * @param {Object} context the binding context for the template  element
   * @ignore
   */
  this._executeVDomTemplate = function (templateElement, context) {
    var computedVNode = pureComputed({
      read: () => {
        // Run render() callback to produce VNode element - root node for template content.
        // Then cache tempate the content.
        return templateElement.render(context.$current);
      }
    }).extend({ rateLimit: 0 });

    var vNode = computedVNode();
    this._extendTemplateForVComponent(templateElement);
    templateElement._cachedRows.push({
      currentContext: context.$current,
      vnode: vNode,
      computedVNode: computedVNode
    });

    // Mount template content and add a class to recognize the content during clean().
    var domNode = mount(vNode, false);
    domNode.classList.add('oj-vdom-template-root');
    domNode._vnodeTemplate = templateElement;

    computedVNode.subscribe((newVNode) => {
      var currRow = templateElement._cachedRows.find(row => row.computedVNode === computedVNode);
      patch(newVNode, currRow.vnode, getMountedNode(currRow.vnode).parentNode, false);
      currRow.vnode = newVNode;
    });

    return [domNode];
  };

  /**
   * The method is handles templates used inside VComponents by the regular custom elements.
   * The '_cachedRows' property is added to the template to store all the processed nodes and
   * the setter/getter methods are added for 'render' property in order to update nodes
   * created with this template.
   * @param {Element} node the <template> element
   * @ignore
   */
  this._extendTemplateForVComponent = function (node) {
    if (!node._cachedRows) {
      var fn = node.render;
      Object.defineProperties(node, {
        _cachedRows: { writable: true, value: [] },
        render: {
          enumerable: true,
          get() {
            return fn;
          },
          set(renderCallback) {
            fn = renderCallback;
            if (renderCallback) {
              this._cachedRows.forEach(rowItem => {
                var newVNode = renderCallback(rowItem.currentContext);
                patch(newVNode, rowItem.vnode,
                  getMountedNode(rowItem.vnode).parentNode,
                  false);
                // eslint-disable-next-line no-param-reassign
                rowItem.vnode = newVNode;
              });
            }
          }
        }
      });
    }
  };

  /**
   * Cleans the node where bindings were previously applied
   * @param {Node} node the node to clean.  Note that this is not the template element,
   *        but rather, some node that contains the result of a previous call to execute()
   * @ignore
   */
  this.clean = function (node) {
    // Search for nodes created with VDom methods.
    // Remove the corresponding VDom nodes from _cachedRows stored on the template.
    // Unmount the corresponding VDom nodes.
    var vdomTemplateRoots = node && node.getElementsByClassName ?
      node.getElementsByClassName('oj-vdom-template-root') : [];
    Array.from(vdomTemplateRoots).forEach(root => {
      var vnodeTemplate = root._vnodeTemplate;
      var rowsToStay = vnodeTemplate._cachedRows.filter(row => {
        if (getMountedNode(row.vnode) === root) {
          unmount(row.vnode);
          row.computedVNode.dispose();
          return false;
        }
        return true;
      });
      vnodeTemplate._cachedRows = rowsToStay;
    });

    return vdomTemplateRoots.length === 0 ? cleanNode(node) : null;
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

  function _createPropertyBackedByObservable(target, name, value, changeListener) {
    var obs = observable(value);
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
    var computed = pureComputed(function () {
      var boundValues = {};
      contribs.evalMap.forEach(function (evaluator, tokens) {
        var leafValue = utils.unwrapObservable(evaluator(context));
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
      var prop = AttributeUtils.attributeToPropertyName(attr.name);
      // Handle the 'dot' notation for bound subprops
      var propTokens = prop.split('.');
      if (propertySet.has(propTokens[0])) {
        var info = AttributeUtils.getExpressionInfo(attr.value);
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
    var nodes = getTemplateContent(node);
    for (var i = 0; i < nodes.length; i++) {
      div.appendChild(nodes[i]);
    }
    return div;
  }

  function _getContext(componentElement, node, properties, alias, templateAlias) {
    // Always use the binding context for the template  element
    // Note: the context for oj_bind_for_each template is stored on __ojBindingContext property.
    var bindingContext = node.__ojBindingContext ?
      node.__ojBindingContext : contextFor(node);
    // In the rare case it's not defined, check the componentElement and log a message
    if (!bindingContext) {
      info('Binding context not found when processing template for element with id: ' +
        componentElement.id + '. Using binding context for element instead.');
      bindingContext = contextFor(componentElement);
    }
    return BindingProviderImpl.extendBindingContext(bindingContext, properties,
      alias, templateAlias, componentElement);
  }
};

var index = new JetTemplateEngine();

export default index;
