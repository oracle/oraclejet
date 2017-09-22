/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojkoshared'], function(oj, ko)
{
/**
 * @ignore
 */
oj.CompositeTemplateRenderer = {};


/**
 * @ignore
 */
oj.CompositeTemplateRenderer.renderTemplate = function(params, element, view) 
{
  // Store composite children on a hidden node while slotting to avoid stale knockout bindings
  // when observables are updated while children are disconnected from DOM. The _storeNodes methods
  // also adds the storage node to the view so it's added to the DOM in setDomNodChildren
  var nodeStorage = oj.CompositeTemplateRenderer._storeNodes(element, view);
  ko.virtualElements.setDomNodeChildren(element, view);

  oj.CompositeTemplateRenderer.invokeViewModelMethod(params.viewModel, 'attachedMethod', [params.viewModelContext]);
  
  var bindingContext = oj.CompositeTemplateRenderer._createKoBindingContext(element);

  // Null out the parent references since we don't want the composite View to be able to access the outside context
  var childBindingContext = bindingContext['createChildContext'](params.viewModel, undefined, 
    function (ctx) {
      ctx[oj.Composite.__COMPOSITE_PROP] = element;
      ctx['__oj_slots'] = params.slotMap;
      ctx['__oj_nodestorage'] = nodeStorage;
      ctx['$slotNodeCounts'] = params.slotNodeCounts;
      ctx['$props'] = params.props;
      ctx['$unique'] = params.unique;
      ctx['$uniqueId'] = params.uniqueId;
      ctx['$parent'] = null;
      ctx['$parentContext'] = null;
      ctx['$parents'] = null;
    }
  );
  
  ko.applyBindingsToDescendants(childBindingContext, element);

  oj.CompositeTemplateRenderer.invokeViewModelMethod(params.viewModel, 'bindingsAppliedMethod', [params.viewModelContext]);
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.getEnclosingComposite = function(node)
{
  var enclosing = null;

  for(var ctx = ko.contextFor(node); ctx && !enclosing; ctx = ctx['$parentContext'])
  {
    enclosing = ctx[oj.Composite.__COMPOSITE_PROP];
  }
  
  return enclosing;
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.createTracker = function()
{
  return ko.observable();
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.invokeViewModelMethod = function(model, key, args)
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
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.createSlotMap = function(element)
{
  var slotMap = {};
  var childNodeList = element.childNodes;
  for (var i = 0; i < childNodeList.length; i++)
  {
    var child = childNodeList[i];
    // Only assign Text and Element nodes to a slot
    if (oj.BaseCustomElementBridge.isSlotAssignable(child))
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
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer._storeNodes = function(element, view)
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
      if (oj.BaseCustomElementBridge.isSlotAssignable(node))
      {
        assignableNodes.push(node);
      }
    }
    assignableNodes.forEach(function (node) {
      nodeStorage.appendChild(node); // @HTMLUpdateOK
    });
    // Notifies JET components inside nodeStorage that they have been hidden
    if (oj.Components)
      oj.Components.subtreeHidden(nodeStorage);
  }
  return nodeStorage;
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer._createKoBindingContext = function(elem)
{
  var div = document.createElement("div");
  ko.applyBindings(null, div);
  var context = ko.contextFor(div);
  
  ko.cleanNode(div);
  
  return context;
};
(function()
{

  oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE.addPostprocessor
  (
    {
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
            parent.insertBefore(openComment, node); // @HTMLUpdateOK

            // Copy the 'fallback content' children into the comment node
            while (node.childNodes.length > 0)
            {
              var child = node.childNodes[0];
              parent.insertBefore(child, node); // @HTMLUpdateOK
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
      var exp = oj.__AttributeUtils.getExpressionInfo(attrValue).expr;
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

ko['bindingHandlers']['_ojNodeStorage_'] =
{
  'init': function()
  {
    return {'controlsDescendantBindings' : true};
  }
};

ko['bindingHandlers']['_ojSlot_'] =
{
  'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {

    function cleanup(bindingContext)
    {
      var nodeStorage = bindingContext['__oj_nodestorage'];
      // Move all non default slot children to nodeStorage to keep bindings alive for
      // case where knockout if binding cleans up node when toggling state
      if (nodeStorage)
      {
        // Check to see if we've processed this node as an assigned node, skipping it if we haven't
        var node = ko.virtualElements.firstChild(element);
        while (node)
        {
          // Save a reference to the next node before we move it
          var next = ko.virtualElements.nextSibling(node);
          if (node['__oj_slots'] != null)
          {
            nodeStorage.appendChild(node); // @HTMLUpdateOK
            // Notifies JET components in node that they have been hidden
            if (oj.Components)
              oj.Components.subtreeHidden(node);
          }
          node = next;
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
      
      // Notifies JET components in node that they have been shown
      if (oj.Components)
      {
        for (var i = 0; i < assignedNodes.length; i++)
        {
          oj.Components.subtreeShown(assignedNodes[i]);
        }
      }

      // If no assigned nodes, let ko apply bindings to default slot content
      return {'controlsDescendantBindings' : true};
    }
  }
}

// Allow _ojSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
ko.virtualElements.allowedBindings['_ojSlot_'] = true;

});
