/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { virtualElements, applyBindingsToDescendants, contextFor, observable, ignoreDependencies, applyBindings, cleanNode, bindingHandlers, utils, computed } from 'knockout';
import 'ojs/ojcustomelement';
import { CustomElementUtils, AttributeUtils } from 'ojs/ojcustomelement-utils';
import BindingProviderImpl from 'ojs/ojkoshared';
import { error } from 'ojs/ojlogger';
import TemplateEngine from 'ojs/ojtemplateengine-ko';
import PreactTemplateEngine from 'ojs/ojtemplateengine-preact-ko';

/**
 * @ignore
 */
const CompositeTemplateRenderer = {};

oj._registerLegacyNamespaceProp('CompositeTemplateRenderer', CompositeTemplateRenderer);

/**
 * @ignore
 */
CompositeTemplateRenderer.renderTemplate = function (params, element, view) {
  // Store composite children on a hidden node while slotting to avoid stale knockout bindings
  // when observables are updated while children are disconnected from DOM. The _storeNodes methods
  // also adds the storage node to the view so it's added to the DOM in setDomNodChildren
  var nodeStorage = CompositeTemplateRenderer._storeNodes(element, view);
  virtualElements.setDomNodeChildren(element, view);

  // Attached is deprecated in 4.2.0 for connected which is called when the view is first attached to the DOM
  // and then each time the component is connected to the DOM after a disconnect
  CompositeTemplateRenderer.invokeViewModelMethod(element, params.viewModel, 'attached', [
    params.viewModelContext
  ]);
  CompositeTemplateRenderer.invokeViewModelMethod(element, params.viewModel, 'connected', [
    params.viewModelContext
  ]);

  var bindingContext = CompositeTemplateRenderer._getKoBindingContext();

  // Null out the parent references since we don't want the composite View to be able to access the outside context
  var childBindingContext = bindingContext.createChildContext(
    params.viewModel,
    undefined,
    function (ctx) {
      // for upstream dependency we will still rely components being registered on the oj namespace.
      ctx[oj.Composite.__COMPOSITE_PROP] = element;
      ctx.__oj_slots = params.slotMap;
      ctx.__oj_nodestorage = nodeStorage;
      ctx.$slotNodeCounts = params.slotNodeCounts;
      ctx.$slotCounts = params.slotNodeCounts;
      ctx.$props = params.props;
      ctx.$properties = params.props;
      ctx.$unique = params.unique;
      ctx.$uniqueId = params.uniqueId;
      ctx.$parent = null;
      ctx.$parentContext = null;
      ctx.$parents = null;
      ctx.$provided = null;
    }
  );

  applyBindingsToDescendants(childBindingContext, element);

  CompositeTemplateRenderer.invokeViewModelMethod(element, params.viewModel, 'bindingsApplied', [
    params.viewModelContext
  ]);
};

/**
 * @ignore
 */
CompositeTemplateRenderer.getEnclosingComposite = function (node) {
  var enclosing = null;
  // for upstream dependency we will still rely components being registered on the oj namespace.
  for (var ctx = contextFor(node); ctx && !enclosing; ctx = ctx.$parentContext) {
    enclosing = ctx[oj.Composite.__COMPOSITE_PROP];
  }

  return enclosing;
};

/**
 * @ignore
 */
CompositeTemplateRenderer.createTracker = function () {
  return observable();
};

/**
 * @ignore
 */
CompositeTemplateRenderer.invokeViewModelMethod = function (elem, model, name, args) {
  if (model == null) {
    return undefined;
  }
  var handler = model[name];
  if (typeof handler === 'function') {
    try {
      return ignoreDependencies(handler, model, args);
    } catch (ex) {
      throw new Error(
        'Error while invoking ' +
          name +
          ' callback for ' +
          elem.tagName.toLowerCase() +
          " with id '" +
          elem.id +
          "'."
      );
    }
  }
  return undefined;
};

/**
 * @ignore
 */
CompositeTemplateRenderer._storeNodes = function (element, view) {
  var nodeStorage;
  var childNodes = element.childNodes;
  if (childNodes) {
    nodeStorage = document.createElement('div');
    nodeStorage.setAttribute('data-bind', '_ojNodeStorage_');
    nodeStorage.style.display = 'none';
    view.push(nodeStorage);
    var assignableNodes = [];
    for (var i = 0; i < childNodes.length; i++) {
      var node = childNodes[i];
      if (CustomElementUtils.isSlotable(node)) {
        assignableNodes.push(node);
      }
    }
    assignableNodes.forEach(function (_node) {
      nodeStorage.appendChild(_node); // @HTMLUpdateOK
    });
    // Notifies JET components inside nodeStorage that they have been hidden
    // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
    if (oj.Components) {
      oj.Components.subtreeHidden(nodeStorage);
    }
  }
  return nodeStorage;
};

/**
 * @ignore
 */
CompositeTemplateRenderer._getKoBindingContext = function () {
  // Cache the binding context that we use to generate the child
  // binding context for the View
  if (!CompositeTemplateRenderer._BINDING_CONTEXT) {
    var div = document.createElement('div');
    applyBindings(null, div);
    CompositeTemplateRenderer._BINDING_CONTEXT = contextFor(div);
    cleanNode(div);
  }

  return CompositeTemplateRenderer._BINDING_CONTEXT;
};

/**
 * @private
 */
CompositeTemplateRenderer._BINDING_CONTEXT = null;

/**
 * @protected
 * @ignore
 */
(function () {
  function _preprocessBindSlot(node, isTemplate) {
    var newNodes;
    var binding;
    var attrs = ['name', 'slot'];
    if (!isTemplate) {
      attrs.push('index');
      binding = 'ko _ojBindSlot_:{';
    } else {
      attrs.push('data');
      attrs.push('as');
      binding = 'ko _ojBindTemplateSlot_:{';
    }

    var valueExpressions = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var expr = _getExpression(node.getAttribute(attr));
      if (expr) {
        valueExpressions.push(attr + ':' + expr);
      }
    }
    binding += valueExpressions.join(',');
    binding += '}';

    var openComment = document.createComment(binding);

    var closeComment = document.createComment('/ko');

    newNodes = [openComment];

    var parent = node.parentNode;
    parent.insertBefore(openComment, node); // @HTMLUpdateOK

    // Copy the 'fallback content' children into the comment node
    while (node.childNodes.length > 0) {
      var child = node.childNodes[0];
      parent.insertBefore(child, node); // @HTMLUpdateOK
      newNodes.push(child);
    }

    newNodes.push(closeComment);

    parent.replaceChild(closeComment, node);
    return newNodes;
  }

  BindingProviderImpl.registerPreprocessor('oj-bind-slot', _preprocessBindSlot);

  BindingProviderImpl.registerPreprocessor('oj-slot', _preprocessBindSlot);

  BindingProviderImpl.registerPreprocessor('oj-bind-template-slot', function (node) {
    return _preprocessBindSlot(node, true);
  });

  function _getExpression(attrValue) {
    if (attrValue != null) {
      var exp = AttributeUtils.getExpressionInfo(attrValue).expr;
      if (exp == null) {
        exp = "'" + attrValue + "'";
      }
      return exp;
    }

    return null;
  }
})();

bindingHandlers._ojNodeStorage_ = {
  init: function () {
    return { controlsDescendantBindings: true };
  }
};

/**
 * Utilities shared between oj-bind-slot and oj-bind-template slot elements.
 * @private
 */
const SlotUtils = {};

oj._registerLegacyNamespaceProp('SlotUtils', SlotUtils);

/**
 * Utility to move slot content to node storage to keep
 * bindings alive during cleanup.
 * @param {Element} element
 * @param {Object} bindingContext
 * @private
 */
SlotUtils.cleanup = function (element, bindingContext) {
  var nodeStorage = bindingContext.__oj_nodestorage;
  // Move all non default template children to nodeStorage to keep bindings alive for
  // case where knockout if binding cleans up node when toggling state
  if (nodeStorage) {
    // Check to see if we've processed this node as an assigned node, skipping it if we haven't
    var node = virtualElements.firstChild(element);
    while (node) {
      // Save a reference to the next node before we move it
      var next = virtualElements.nextSibling(node);
      if (node.__oj_slots != null) {
        nodeStorage.appendChild(node); // @HTMLUpdateOK
        // Notifies JET components in node that they have been hidden
        // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
        if (oj.Components && node.nodeType === 1) {
          oj.Components.subtreeHidden(node);
        }
      }
      node = next;
    }
  }
};

bindingHandlers._ojBindSlot_ = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    // Add callback so we can move slot content to node storage during cleanup
    utils.domNodeDisposal.addDisposeCallback(
      element,
      SlotUtils.cleanup.bind(null, element, bindingContext)
    );

    var slots = bindingContext.__oj_slots;

    var values = valueAccessor();
    var unwrap = utils.unwrapObservable;
    var slotName = unwrap(values.name) || '';
    var slotAttr = unwrap(values.slot) || '';
    var index = unwrap(values.index);
    var assignedNodes = index != null ? [slots[slotName][index]] : slots[slotName];

    if (assignedNodes) {
      var i;
      for (i = 0; i < assignedNodes.length; i++) {
        // Save references to nodes we need to cleanup ._slot field
        var node = assignedNodes[i];
        // Get the slot value of this oj-bind-slot element so we can assign it to its
        // assigned nodes for downstream slotting
        node.__oj_slots = slotAttr;
      }
      CustomElementUtils.allowSlotRelocation(true);
      try {
        virtualElements.setDomNodeChildren(element, assignedNodes);
      } finally {
        CustomElementUtils.allowSlotRelocation(false);
      }

      // Notifies JET components in node that they have been shown
      // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
      if (oj.Components) {
        for (i = 0; i < assignedNodes.length; i++) {
          var assignedNode = assignedNodes[i];
          if (assignedNode.nodeType === 1) {
            oj.Components.subtreeShown(assignedNode);
          }
        }
      }
      return { controlsDescendantBindings: true };
    }

    // If no assigned nodes, then pass the slot value to default content
    var virtualChildren = virtualElements.childNodes(element);
    virtualChildren.forEach(function (child) {
      if (isNodeSlotable(child)) {
        // eslint-disable-next-line no-param-reassign
        child.__oj_slots = slotAttr;
      }
    });
    // If no assigned nodes, let ko apply bindings to default slot content
    return undefined;
  }
};

function isNodeSlotable(node) {
  return node.nodeType === 1 || (node.nodeType === 3 && node.nodeValue.trim());
}

// Allow _ojBindSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
virtualElements.allowedBindings._ojBindSlot_ = true;

bindingHandlers._ojBindTemplateSlot_ = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    // Add callback so we can move slot content to node storage during cleanup
    utils.domNodeDisposal.addDisposeCallback(
      element,
      SlotUtils.cleanup.bind(null, element, bindingContext)
    );

    var slots = bindingContext.__oj_slots;

    var values = valueAccessor();
    var unwrap = utils.unwrapObservable;
    var slotName = unwrap(values.name) || '';
    var slotChildren = slots[slotName];
    // Take the last item matching the slot name
    var template = slotChildren && slotChildren[slotChildren.length - 1];
    // If no application provided template, check for default template
    var isDefaultTemplate = false;
    if (!template) {
      var virtualChildren = virtualElements.childNodes(element);
      for (var i = 0; i < virtualChildren.length; i++) {
        if (virtualChildren[i].tagName === 'TEMPLATE') {
          isDefaultTemplate = true;
          template = virtualChildren[i];
          break;
        }
      }
    }

    if (template) {
      // for upstream dependency we will still rely components being registered on the oj namespace.
      var composite = bindingContext[oj.Composite.__COMPOSITE_PROP];
      if (template.tagName !== 'TEMPLATE') {
        error(
          "Slot content for slot '" +
            slotName +
            "' under " +
            composite.tagName.toLowerCase() +
            " with id '" +
            composite.id +
            "' should be wrapped inside a <template> node."
        );
      }
      // Get the slot value of this oj-bind-template element so we can assign it to its
      // assigned nodes for downstream slotting
      template.__oj_slots = unwrap(values.slot) || '';
      const engine = template.render ? PreactTemplateEngine : TemplateEngine;

      // Re-execute the template if the oj-bind-template-slot bound attributes change
      computed(function () {
        // Use the template engine to execute the template
        var data = unwrap(values.data);
        var as = unwrap(values.as);

        // Extend the composite's bindingContext for the default template
        var nodes = engine.execute(
          isDefaultTemplate ? element : composite,
          template,
          data,
          isDefaultTemplate ? as : null
        );

        virtualElements.setDomNodeChildren(element, nodes);
      });
    } else {
      // Clear out any child nodes if no slot children or default template found
      virtualElements.setDomNodeChildren(element, []);
    }
    return { controlsDescendantBindings: true };
  }
};

// Allow _ojBindTemplateSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
virtualElements.allowedBindings._ojBindTemplateSlot_ = true;
