/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojkoshared'], function(oj, ko, Logger, Context)
{
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

  oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE.registerPreprocessor(
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

    function configChanged(configPromise) {
      registerBusyState();

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
          }
        }
      }, function (reason) { // errorback
        resolveBusyState();
        Logger.error('An error %o occurred during view insertion and apply bindings for oj-bind-dom.', reason);
      }
      );
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

});