/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'knockout', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojkoshared'], function(oj, ko, Logger, Context, BindingProviderImpl)
{
  "use strict";

/* global BindingProviderImpl:false */

/**
 * @protected
 * @ignore
 */
(function () {
  function _preprocessBindDom(node) {
    var newNodes;
    var binding = 'ko _ojBindDom_:';

    var expr = _getExpression(node.getAttribute('config'));
    if (expr) {
      binding += expr;
    }

    // oj-bind-dom has a single 'config' attribute
    var openComment = document.createComment(binding);
    var closeComment = document.createComment('/ko');

    newNodes = [openComment];

    var parent = node.parentNode;
    parent.insertBefore(openComment, node); // @HTMLUpdateOK

    // Copy children into the comment node
    while (node.childNodes.length > 0) {
      var child = node.childNodes[0];
      parent.insertBefore(child, node); // @HTMLUpdateOK
      newNodes.push(child);
    }

    newNodes.push(closeComment);

    parent.replaceChild(closeComment, node);
    return newNodes;
  }

  BindingProviderImpl.registerPreprocessor(
    'oj-bind-dom', _preprocessBindDom);

  function _getExpression(attrValue) {
    if (attrValue != null) {
      var exp = oj.__AttributeUtils.getExpressionInfo(attrValue).expr;
      if (exp == null) {
        exp = "'" + attrValue + "'";
      }
      return exp;
    }
    return null;
  }
}());


/* global Promise:false, ko:false, Logger:false, Context:false */

ko.bindingHandlers._ojBindDom_ = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var _currentPromise;
    var _resolveBusyStateCallback;
    var _childrenBindingsPromiseResolver;

    function configChanged(configPromise) {
      registerBusyState();
      initChildrenBindingsAppliedPromise();

      configPromise.then(function (config) {
        if (configPromise === _currentPromise) {
          try {
            ko.virtualElements.setDomNodeChildren(element, config.view || []);
            // Null out the parent references since we don't want the view to be able to access the outside context
            var childBindingContext = bindingContext.createChildContext(config.data, undefined,
              function (ctx) {
                ctx.$parent = null;
                ctx.$parentContext = null;
                ctx.$parents = null;
              }
            );

            ko.applyBindingsToDescendants(childBindingContext, element);
          } catch (e) {
            Logger.error('An error %o occurred during view insertion and apply bindings for oj-bind-dom.', e);
          } finally {
            resolveBusyState();
            resolveChildrenBindingsAppliedPromise();
          }
        }
      }, function (reason) { // errorback
        resolveBusyState();
        resolveChildrenBindingsAppliedPromise();
        Logger.error('An error %o occurred during view insertion and apply bindings for oj-bind-dom.', reason);
      }
      );
    }

    function findNearestCustomParent(parentTrackingContext) {
      var nearestCustomParent = element.parentNode;
      while (nearestCustomParent &&
        !oj.ElementUtils.isValidCustomElementName(nearestCustomParent.localName)) {
        nearestCustomParent = nearestCustomParent.parentNode;
      }
      if (!nearestCustomParent) {
        nearestCustomParent = parentTrackingContext ?
          parentTrackingContext._nearestCustomParent : null;
      }
      return nearestCustomParent;
    }

    function findImmediateState(nearestCustomParent, parentTrackingContext) {
      var isImmediate = false;
      var nestedElement = parentTrackingContext &&
        Object.prototype.hasOwnProperty.call(parentTrackingContext, '_immediate');
      if (element.parentNode === nearestCustomParent) {
        isImmediate = true;
      } else if (nestedElement && !element.parentNode.parentNode) {
        isImmediate = parentTrackingContext._immediate;
      }
      return isImmediate;
    }

    function initChildrenBindingsAppliedPromise() {
      if (!_childrenBindingsPromiseResolver) {
        // when oj-bind-dom is inside of oj-bind-for-each template, the element will be rendered disconnected
        // use bindingContext.$current to determine nearestCustomParent and isImmediate state
        var nearestCustomParent = findNearestCustomParent(bindingContext.$current);
        var isImmediate = findImmediateState(nearestCustomParent, bindingContext.$current);
        _childrenBindingsPromiseResolver = oj._KnockoutBindingProvider
          .getInstance()
          .__RegisterBindingAppliedPromiseForChildren(nearestCustomParent, isImmediate);
      }
    }

    function resolveChildrenBindingsAppliedPromise() {
      if (_childrenBindingsPromiseResolver) {
        _childrenBindingsPromiseResolver();
        _childrenBindingsPromiseResolver = null;
      }
    }

    function registerBusyState() {
      if (!_resolveBusyStateCallback) {
        // element is a comment node so look for the busy context on the parent node instead
        _resolveBusyStateCallback = Context.getContext(element.parentNode).getBusyContext()
          .addBusyState({ description: 'oj-bind-dom is waiting on config Promise resolution' });
      }
    }

    function resolveBusyState() {
      if (_resolveBusyStateCallback) {
        _resolveBusyStateCallback();
        _resolveBusyStateCallback = null;
      }
    }

    ko.computed(
      function () {
        _currentPromise = Promise.resolve(ko.utils.unwrapObservable(valueAccessor()));
        configChanged(_currentPromise);
      },
      null,
      { disposeWhenNodeIsRemoved: element }
    );

    return { controlsDescendantBindings: true };
  }
};

// Allow _ojBindDom_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
ko.virtualElements.allowedBindings._ojBindDom_ = true;


/**
 *
 * @ojcomponent oj.ojBindDom
 * @ojdisplayname Bind DOM
 * @ojshortdesc An oj-bind-dom element renders HTML content with access to passed in data properties.
 * @ojsignature {target: "Type",
 *               value: "class ojBindDom<D> extends HTMLElement",
 *               genericParameters: [{name: "D", description: "Type of data to be provided to the view"}]}
 * @ojbindingelement
 * @since 6.1.0
 *
 * @ojpropertylayout [ {propertyGroup: "common", items: ["config.view"]},
 *                     {propertyGroup: "data", items: ["config.data"]} ]
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 1
 *
 * @classdesc
 * <h3 id="overview-section">
 *   Dom Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>Use &lt;oj-bind-dom&gt; to render HTML content and activate optional bindings that will have access to a set of data properties.
 * Note that the &lt;oj-bind-dom&gt; element will be removed from the DOM
 * after bindings are applied. For slotting, applications need to wrap the oj-bind-dom element
 * inside another HTML element (e.g. &lt;span&gt;) with the slot attribute. The oj-bind-dom element does not support
 * the slot attribute.</p>
 *
 * @example <caption>Initialize the oj-bind-dom:</caption>
 * &lt;oj-bind-dom config='[[configObj]]'>
 * &lt;/oj-bind-dom>
 */

/**
 * Configuration object that defines HTML content to be inserted into the DOM and data
 * to use when applying bindings to this content.
 * The configuration object can be specified either directly or via a Promise.
 * @name config
 * @memberof oj.ojBindDom
 * @instance
 * @ojshortdesc Configuration object that defines a view and data available to the oj-bind-dom element. The configuration object can be specified directly or via a Promise.
 * @type {object|Promise}
 * @example <caption>Initialize the oj-bind-dom:</caption>
 * &lt;oj-bind-dom config='[[myConfig]]'>
 * &lt;/oj-bind-dom>
 * @ojsignature {target: "Type", value: "oj.ojBindDom.Config<D>|Promise<oj.ojBindDom.Config<D>>", jsdocOverride: true}
 */

/**
 * @typedef {Object} oj.ojBindDom.Config
 * @property {Array<Node>} view The Nodes to be inserted. Note that oj-bind-dom does not clone the node array
 * before applying bindings to it. If the application needs to have access to the original node array,
 * it should set the 'view' property to a cloned copy.  Node arrays should not have a longer lifespan
 * than their oj-bind-dom element as would be the case for a node array created in the application model and
 * referenced by an oj-bind-dom element that is detached and reattached by another binding element or script.
 * @property {Object} data The data available to the view when expressions are evaluated.  Note that the oj-bind-dom element's binding context will not be made available.
 * @ojsignature [{for: "data", target: "Type", value: "D"},
 *               {for: "genericTypeParameters", target: "Type", value: "<D>"}]
 */

});