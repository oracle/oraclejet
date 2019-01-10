/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojkoshared'], function(oj, ko, Logger, Context, BindingProviderImpl)
{
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

/**
 * @ojstatus preview
 * @ojcomponent oj.ojBindDom
 * @ojshortdesc Renders HTML content with access to passed in data properties.
 * @ojsignature {target: "Type", value:"class ojBindDom extends JetElement<ojBindDomSettableProperties>"}
 * @ojbindingelement
 * @since 6.1.0
 * @ojtsignore
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
 * Configuration object that defines a view and a data available to the oj-bind-dom element.
 * See details for each attribute. The configuration object can be specified
 * either directly or via a Promise.
 * @name config
 * @memberof oj.ojBindDom
 * @instance
 * @type {object|Promise}
 * @example <caption>Initialize the oj-bind-dom:</caption>
 * &lt;oj-bind-dom config='[[myConfig]]'>
 * &lt;/oj-bind-dom>
 */

/**
 * Defines the view for the ojBindDom. Note that oj-bind-dom will not be cloning the node array
 * before applying bindings to it. If the application needs to have access to the original node array,
 * it should be setting the 'view' property to a cloned copy. Node arrays should not have a longer lifespan
 * than their oj-bind-dom element as would be the case for a node array created in the application model and
 * referenced by an oj-bind-dom element that is detached and reattached by another binding element or script.
 * @name config.view
 * @ojshortdesc Defines oj-bind-dom view.
 * @memberof! oj.ojBindDom
 * @instance
 * @type {Array<Node>}
 */

/**
 * Only properties defined in the config.data object will be available to the view when
 * expressions are evaluated. The oj-bind-dom element's binding context will not be made
 * available to the view.
 * @name config.data
 * @ojshortdesc The data available to the oj-bind-dom view.
 * @memberof! oj.ojBindDom
 * @instance
 * @type {Object}
 */

});