/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojtemplateengine', 'ojs/ojlogger', 'ojs/ojkoshared'], function(oj, ko, templateEngine, Logger, BindingProviderImpl)
{
/* global BindingProviderImpl:false */
/**
 * @protected
 * @ignore
 */
(function () {
  function _preprocessBindSlot(node, isTemplate) {
    var newNodes;
    var binding;
    var attrs = ['name', 'slot'];
    var bPreprocess = false;
    if (!isTemplate) {
      bPreprocess = true;
      attrs.push('index');
      binding = 'ko _ojBindSlot_:{';
    } else {
      bPreprocess = true;
      attrs.push('data');
      attrs.push('as');
      binding = 'ko _ojBindTemplateSlot_:{';
    }

    if (bPreprocess) {
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
    }
    return newNodes;
  }

  BindingProviderImpl.registerPreprocessor(
    'oj-bind-slot', _preprocessBindSlot);

  BindingProviderImpl.registerPreprocessor(
    'oj-slot', _preprocessBindSlot);

  BindingProviderImpl.registerPreprocessor(
    'oj-bind-template-slot', function (node) {
      return _preprocessBindSlot(node, true);
    }
  );

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

/* global ko:false */

/**
 * @ignore
 */
oj.CompositeTemplateRenderer = {};


/**
 * @ignore
 */
oj.CompositeTemplateRenderer.renderTemplate = function (params, element, view) {
  // Store composite children on a hidden node while slotting to avoid stale knockout bindings
  // when observables are updated while children are disconnected from DOM. The _storeNodes methods
  // also adds the storage node to the view so it's added to the DOM in setDomNodChildren
  var nodeStorage = oj.CompositeTemplateRenderer._storeNodes(element, view);
  ko.virtualElements.setDomNodeChildren(element, view);

  // Attached is deprecated in 4.2.0 for connected which is called when the view is first attached to the DOM
  // and then each time the component is connected to the DOM after a disconnect
  oj.CompositeTemplateRenderer.invokeViewModelMethod(params.viewModel, 'attached', [params.viewModelContext]);
  oj.CompositeTemplateRenderer.invokeViewModelMethod(params.viewModel, 'connected', [params.viewModelContext]);

  var bindingContext = oj.CompositeTemplateRenderer._getKoBindingContext();

  // Null out the parent references since we don't want the composite View to be able to access the outside context
  var childBindingContext = bindingContext.createChildContext(params.viewModel, undefined,
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
    }
  );

  ko.applyBindingsToDescendants(childBindingContext, element);

  oj.CompositeTemplateRenderer.invokeViewModelMethod(params.viewModel, 'bindingsApplied', [params.viewModelContext]);
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.getEnclosingComposite = function (node) {
  var enclosing = null;
  // for upstream dependency we will still rely components being registered on the oj namespace.
  for (var ctx = ko.contextFor(node); ctx && !enclosing; ctx = ctx.$parentContext) {
    enclosing = ctx[oj.Composite.__COMPOSITE_PROP];
  }

  return enclosing;
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.createTracker = function () {
  return ko.observable();
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer.invokeViewModelMethod = function (model, name, args) {
  if (model == null) {
    return undefined;
  }
  var handler = model[name];
  if (typeof handler === 'function') {
    return ko.ignoreDependencies(handler, model, args);
  }
  return undefined;
};

/**
 * @ignore
 */
oj.CompositeTemplateRenderer._storeNodes = function (element, view) {
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
      if (oj.BaseCustomElementBridge.isSlotAssignable(node)) {
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
oj.CompositeTemplateRenderer._getKoBindingContext = function () {
  // Cache the binding context that we use to generate the child
  // binding context for the View
  if (!oj.CompositeTemplateRenderer._BINDING_CONTEXT) {
    var div = document.createElement('div');
    ko.applyBindings(null, div);
    oj.CompositeTemplateRenderer._BINDING_CONTEXT = ko.contextFor(div);
    ko.cleanNode(div);
  }

  return oj.CompositeTemplateRenderer._BINDING_CONTEXT;
};

/**
 * @private
 */
oj.CompositeTemplateRenderer._BINDING_CONTEXT = null;

/* global ko:false */

ko.bindingHandlers._ojNodeStorage_ =
{
  init: function () {
    return { controlsDescendantBindings: true };
  }
};

/* global ko:false, SlotUtils:false */

ko.bindingHandlers._ojBindSlot_ =
{
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    // Add callback so we can move slot content to node storage during cleanup
    ko.utils.domNodeDisposal
      .addDisposeCallback(element, SlotUtils.cleanup.bind(null, element, bindingContext));

    var slots = bindingContext.__oj_slots;

    var values = valueAccessor();
    var unwrap = ko.utils.unwrapObservable;
    var slotName = unwrap(values.name) || '';
    var index = unwrap(values.index);
    var assignedNodes = index != null ? [slots[slotName][index]] : slots[slotName];

    if (assignedNodes) {
      var i;
      for (i = 0; i < assignedNodes.length; i++) {
        // Save references to nodes we need to cleanup ._slot field
        var node = assignedNodes[i];
        // Get the slot value of this oj-bind-slot element so we can assign it to its
        // assigned nodes for downstream slotting
        node.__oj_slots = unwrap(values.slot) || '';
      }
      ko.virtualElements.setDomNodeChildren(element, assignedNodes);

      // Notifies JET components in node that they have been shown
      // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
      if (oj.Components) {
        for (i = 0; i < assignedNodes.length; i++) {
          oj.Components.subtreeShown(assignedNodes[i]);
        }
      }

      // If no assigned nodes, let ko apply bindings to default slot content
      return { controlsDescendantBindings: true };
    }
    return undefined;
  }
};

// Allow _ojBindSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
ko.virtualElements.allowedBindings._ojBindSlot_ = true;

/* global ko:false */

/**
 * Utilities shared between oj-bind-slot and oj-bind-template slot elements.
 * @private
 */
var SlotUtils = {};

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
    var node = ko.virtualElements.firstChild(element);
    while (node) {
      // Save a reference to the next node before we move it
      var next = ko.virtualElements.nextSibling(node);
      if (node.__oj_slots != null) {
        nodeStorage.appendChild(node); // @HTMLUpdateOK
        // Notifies JET components in node that they have been hidden
        // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
        if (oj.Components) {
          oj.Components.subtreeHidden(node);
        }
      }
      node = next;
    }
  }
};

/* global ko:false, SlotUtils:false, templateEngine:false, Logger:false */

ko.bindingHandlers._ojBindTemplateSlot_ = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    // Add callback so we can move slot content to node storage during cleanup
    ko.utils.domNodeDisposal
      .addDisposeCallback(element, SlotUtils.cleanup.bind(null, element, bindingContext));

    var slots = bindingContext.__oj_slots;

    var values = valueAccessor();
    var unwrap = ko.utils.unwrapObservable;
    var slotName = unwrap(values.name) || '';
    var slotChildren = slots[slotName];
    // Take the last item matching the slot name
    var template = slotChildren && slotChildren[slotChildren.length - 1];
    // If no application provided template, check for default template
    var isDefaultTemplate = false;
    if (!template) {
      var virtualChildren = ko.virtualElements.childNodes(element);
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
        Logger.error("Slot content for slot '" + slotName + "' under " +
                        composite.tagName.toLowerCase() +
                        " with id '" + composite.id +
                        "' should be wrapped inside a <template> node.");
      }
      // Get the slot value of this oj-bind-template element so we can assign it to its
      // assigned nodes for downstream slotting
      template.__oj_slots = unwrap(values.slot) || '';

      // Re-execute the template if the oj-bind-template-slot bound attributes change
      ko.computed(function () {
        // Use the template engine to execute the template
        var data = unwrap(values.data);
        var as = unwrap(values.as);

        // Extend the composite's bindingContext for the default template
        var nodes = templateEngine.execute(isDefaultTemplate ? element : composite,
                                           template, data, isDefaultTemplate ? as : null);
        ko.virtualElements.setDomNodeChildren(element, nodes);
      });
    } else {
      // Clear out any child nodes if no slot children or default template found
      ko.virtualElements.setDomNodeChildren(element, []);
    }
    return { controlsDescendantBindings: true };
  }
};

// Allow _ojBindTemplateSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
ko.virtualElements.allowedBindings._ojBindTemplateSlot_ = true;

/**
 * @ojstatus preview
 * @ojcomponent oj.ojBindSlot
 * @ojshortdesc A placeholder for child DOM to appear in a specified slot.
 * @ojbindingelement
 * @ojmodule ojcomposite
 * @since 4.1.0
 * @ojtsignore
 *
 * @classdesc
 * <h3 id="overview-section">
 *   Slot Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>
 * The oj-bind-slot element is used inside a composite View as a placeholder for child DOM and is
 * a declarative way to define a <a href="CustomElementOverview.html#ce-slots-section">slot</a>.
 * Default markup can be defined if no child DOM is assigned to that particular
 * slot by adding the markup as children of the slot. An oj-bind-slot element with a name attribute
 * whose value is not the empty string is referred to as a named slot. A slot without a name attribute or one
 * whose name value is the empty string is referred to as the default slot where any composite
 * children without a slot attribute will be moved to.
 * </p>
 *
 * <h3 id="slotprops-section">
 *   Slot Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#slotprops-section"></a>
 * </h3>
 * <ul>
 *  <li>A default slot is a slot element whose slot name is the empty string or missing.</li>
 *  <li>More than one node can be assigned to the same slot.</li>
 *  <li>A slot can also have a slot attribute and be assigned to another slot.</li>
 *  <li>A slot can have fallback content which are its child nodes that will be used in the DOM in its place if it has no assigned nodes.</li>
 *  <li>A slot can also also have an index attribute to allow the slot's assigned nodes
 *    to be individually slotted (e.g. in conjunction with an oj-bind-for-each element).</li>
 * </ul>
 *
 * <h3 id="nodeprops-section">
 *   Assignable Node Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#nodeprops-section"></a>
 * </h3>
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
 * <h3 id="example1-section">
 *   Example #1: Basic Usage
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#example1-section"></a>
 * </h3>
 * Note that the IDs are provided for sample purposes only.
 * <h4>Initial DOM</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;component-a>
 *  &lt;div id="A" slot="foo">&lt;/div>
 *  &lt;div id="B" slot="bar">&lt;/div>
 *  &lt;div id="C">&lt;/div>
 *  &lt;div id="D" slot="foo">&lt;/div>
 *  &lt;div id="E" slot="cat">&lt;/div>
 * &lt;/component-a>
 * </code>
 * </pre>
 *
 * <h4>View</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- component-a View -->
 * &lt;div id="outerFoo">
 *  &lt;oj-bind-slot name="foo">&lt;/oj-bind-slot>
 * &lt;/div>
 * &lt;div id="outerBar">
 *  &lt;oj-bind-slot name="bar">&lt;/oj-bind-slot>
 * &lt;/div>
 * &lt;div id="outerBaz">
 *  &lt;oj-bind-slot name="baz">
 *    &lt;!-- Default Content -->
 *    &lt;img id="F">&lt;/img>
 *    &lt;div id="G">&lt;/div>
 *  &lt;/oj-bind-slot>
 * &lt;/div>
 * &lt;div id="outerDefault">
 *  &lt;oj-bind-slot>
 *    &lt;!-- Default Content -->
 *    &lt;div id="H">&lt;/div>
 *  &lt;/oj-bind-slot>
 * &lt;/div>
 * </code>
 * </pre>
 *
 * <h4>Final DOM</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;component-a>
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
 * &lt;/component-a>
 * </code>
 * </pre>
 *
 * <h3 id="example2-section">
 *   Example #2: Slot Attribute Evaluation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#example2-section"></a>
 * </h3>
 * <p>When a node is assigned to a slot, its slot value is not used for subsequent
 *  slot assignments when child bindings are applied. Instead that slot's slot attribute,
 *  which by default is "", overrides the assigned node's slot attribute. No actual
 *  DOM changes will be made to the assigned node's slot attribute, but its evaluated
 *  slot value will be managed internally and used for applying subsequent child bindings.</p>
 *
 * <h4>Initial DOM</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;component-a>
 *  &lt;div id="A" slot="foo">&lt;/div>
 * &lt;/component-a>
 * </code>
 * </pre>
 *
 * <h4>View</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- component-a View -->
 * &lt;component-b>
 *  &lt;oj-bind-slot name="foo">&lt;/oj-bind-slot>
 * &lt;/component-b>
 *
 * &lt;!-- component-b View -->
 * &lt;div id="outerFoo">
 *  &lt;oj-bind-slot name="foo">&lt;/oj-bind-slot>
 * &lt;/div>
 * &lt;div id="outerDefault">
 *  &lt;oj-bind-slot>&lt;/oj-bind-slot>
 * &lt;/div>
 * </code>
 * </pre>
 *
 * <p>When applying bindings for the component-a View, the oj-bind-slot binding will replace
 * slot foo with div A. Slot foo's slot attribute ("") overrides div A's ("foo")
 * so that the evaluated slot value ("") will be used when applying subsequent child bindings.<p>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- DOM -->
 * &lt;component-a>
 *  &lt;!-- Start component-a View -->
 *  &lt;component-b>
 *    &lt;!-- Evaluated slot value is "" -->
 *    &lt;div id="A" slot="foo">&lt;/div>
 *  &lt;/component-b>
 *  &lt;!-- End component-a View -->
 * &lt;/component-a>
 * </code>
 * </pre>
 *
 * <p>When applying bindings for the component-b View, the oj-bind-slot binding will replace
 *  component-b's default slot with div A since it's evaluated slot value is "".</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- DOM -->
 * &lt;component-a>
 *  &lt;!-- Start component-a View -->
 *  &lt;component-b>
 *    &lt;!-- Start component-b View -->
 *    &lt;div id="outerFoo">
 *    &lt;/div>
 *    &lt;div id="outerDefault">
 *      &lt;div id="A" slot="foo">&lt;/div>
 *    &lt;/div>
 *    &lt;!-- End component-b View -->
 *  &lt;/component-b>
 *  &lt;!-- End component-a View -->
 * &lt;/component-a>
 * </code>
 * </pre>
 *
 * <h3 id="deferred-section">
 *   Deferred Slots
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-section"></a>
 * </h3>
 * As a performance enhancement, the composite can participate in deferred slot
 * rendering by conditionally rendering a slot element inside a conditional oj-bind-if element
 * and document that certain slots will be lazily rendered. This gives the application the opportunity
 * to wrap their slot content in an <a href="oj.ojDefer.html">oj-defer</a> element and have the
 * bindings for that deferred content be delayed. oj.Components.subtreeHidden/Shown will automatically
 * be called on the slot contents when they are added or removed from a slot. <b>Note that due to a current
 * limitation, the slot element should be wrapped in an HTML element (e.g. &lt;div> or &lt;span>), when it is a child of an
 * oj-bind-if element or a knockout if binding on a comment node.</b> It is not required to wrap when
 * the slot element is a child of a knockout if binding on an HTML element.
 *
 * <h4>Initial DOM</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;card-component>
 *  &lt;oj-defer slot="front">
 *    &lt;div>
 *      ...
 *    &lt;/div>
 *  &lt;/oj-defer>
 *  &lt;oj-defer slot="back">
 *    &lt;div>
 *      ...
 *    &lt;/div>
 *  &lt;/oj-defer>
 * &lt;/card-component>
 * </code>
 * </pre>
 *
 * <h4>View</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-bind-if test="isFront">
 *   &lt;div>
 *     &lt;oj-bind-slot class="card-component-front">
 *       ...
 *     &lt;/oj-bind-slot>
 *   &lt;/div>
 * &lt;/oj-bind-if>
 * &lt;oj-bind-if test="!isFront">
 *   &lt;div>
 *     &lt;oj-bind-slot class="card-component-back">
 *       ...
 *     &lt;/oj-bind-slot>
 *   &lt;/div>
 * &lt;/oj-bind-if>
 * </code>
 * </pre>
 */

/**
 * An index value allowing the slot children to be individually slotted. This is useful
 * when the composite needs to add additional DOM around slotted children.
 * @expose
 * @name index
 * @memberof oj.ojBindSlot
 * @instance
 * @type {number}
 * @example <caption>
 *          Use an oj-bind-for-each element inside the composite View to stamp out
 *          li wrapped oj-bind-slot elements that correspond to the number of slot children.
 *          The oj-bind-slot elements should have the value for the name attribute, but different indices.
 *          </caption>
 * &lt;!-- Composite View -->
 * &lt;ul>
 *   &lt;oj-bind-for-each data="[[new Array($slotCounts.foo)]]">
 *     &lt;template>
 *       &lt;li>
 *         &lt;oj-bind-slot name="foo" index="[[$current.index]]">&lt;/oj-bind-slot>
 *       &lt;/li>
 *     &lt;/template>
 *   &lt;/oj-bind-for-each>
 * &lt;/ul>
 */

/**
 * The name of the slot.
 * @expose
 * @name name
 * @memberof oj.ojBindSlot
 * @instance
 * @type {string}
 * @example <caption>Define a slot within a composite View with the name "foo":</caption>
 * &lt;oj-bind-slot name="foo">
 *   &lt;div>My Contents&lt;/div>
 * &lt;/oj-bind-slot>
 */

/**
 * @ojstatus preview
 * @ojcomponent oj.ojBindTemplateSlot
 * @ojshortdesc A placeholder for stamped child DOM to appear in a specified slot.
 * @ojbindingelement
 * @ojmodule ojcomposite
 * @since 5.1.0
 * @ojtsignore
 *
 * @classdesc
 * <h3 id="overview-section">
 *   Template Slot Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>
 * The oj-bind-template-slot element is used inside a composite View as a placeholder for stamped child DOM and
 * is a declarative way to define a <a href="CustomElementOverview.html#ce-slots-template-section">template slot</a>.
 * Similar to oj-bind-slot-elements, the oj-bind-template-slot has fallback content
 * which should be provided in a template node and will be used when the template has no assigned nodes.
 * The 'name' attribute on an oj-bind-template-slot follows the same rules as an oj-bind-slot where a template slot
 * with a name attribute whose value is not the empty string is referred to as a named slot and a template slot
 * without a name attribute or one whose name value is the empty string is referred to as the default slot
 * where any composite children without a slot attribute will be moved to.
 * </p>
 *
 * <h3 id="slotprops-section">
 *   Template Slot Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#slotprops-section"></a>
 * </h3>
 * <ul>
 *  <li>A default template slot is a slot element whose slot name is the empty string or missing.</li>
 *  <li>More than one template node can be assigned to the same template slot, but only the last will be used for stamping.</li>
 *  <li>A template slot can also have a slot attribute and be assigned to another template slot or slot.</li>
 *  <li>A template slot can have a default template as its direct child node which will be used to stamp DOM content
 *      if it has no assigned nodes. The binding context for the default template is the composite's binding context with the
 *      additional data properties.</li>
 * </ul>
 *
 * <h3 id="nodeprops-section">
 *   Assignable Node Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#nodeprops-section"></a>
 * </h3>
 * <ul>
 *  <li>Template nodes are the only allowed children of template slots.</li>
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
 *
 * <h3 id="bindingcontext-section">
 *   Binding Context
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bindingcontext-section"></a>
 * </h3>
 * <p>
 *  Unlike oj-bind-slot nodes whose children's bindings are resolved in the application's binding
 *  context before being slotted, oj-bind-template-slot children are resolved when the composite View
 *  bindings are applied and are resolved in the application's binding context extended with additional
 *  properties provided by the composite. These additional properties are available on the $current
 *  variable in the application provided template node and should be documented in the composite's
 *  <a href="MetadataOverview.html#slots>slot metadata</a>.
 * </p>
 *
 * <h3 id="example1-section">
 *   Example #1: Basic Usage
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#example1-section"></a>
 * </h3>
 * Note that the IDs are provided for sample purposes only.
 * <h4>Initial DOM</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;demo-list data="{{groceryList}}" header="Groceries">
 *  &lt;template slot="item" data-oj-as="groceryItem">
 *    &lt;oj-checkboxset>
 *      &lt;oj-option value="bought">&lt;oj-bind-text value='[[groceryItem.value]]'>&lt;/oj-bind-text>&lt;oj-option>
 *    &lt;/oj-checkboxset>
 *  &lt;/template>
 * &lt;/demo-list>
 * </code>
 * </pre>
 *
 * <h4>View</h4>
 * <pre class="prettyprint">
 * <code>
 * &lt;table>
 *   &lt;thead>
 *     &lt;tr>
 *       &lt;th>
 *         &lt;oj-bind-text value="[[$properties.header]]">&lt;/oj-bind-text>
 *       &lt;/th>
 *     &lt;/tr>
 *   &lt;/thead>
 *   &lt;tbody>
 *     &lt;oj-bind-for-each data="{{$properties.data}}">
 *       &lt;template>
 *         &lt;tr>
 *           &lt;td>
 *             &lt;!-- Template slot for list items with default template and alias -->
 *             &lt;oj-bind-template-slot name="item" data={{$current.data}} as="listItem">
 *               &lt;!-- Default template -->
 *               &lt;template>
 *                 &lt;span>&lt;oj-bind-text value='[[listItem.value]]'>&lt;/oj-bind-text>&lt;/span>
 *               &lt;/template>
 *             &lt;/oj-bind-template-slot>
 *           &lt;/td>
 *         &lt;/tr>
 *       &lt;/template>
 *     &lt;/oj-bind-for-each>
 *   &lt;/tbody>
 * &lt;/table>
 * </code>
 * </pre>
 */


/**
 * An optional alias for $current that can be referenced inside the default template DOM. Note
 * that application $current aliasing should be done with the
 * <a href="CustomElementOverview.html#ce-slots-template-section">data-oj-as</a> attribute on the
 * template element.
 * @expose
 * @name as
 * @memberof oj.ojBindTemplateSlot
 * @instance
 * @type {string}
 * @example <caption>Define a slot within a composite View with the name "foo":</caption>
 * &lt;oj-bind-template-slot name="foo" data="[[extraProperties]]" as="listItem">
 *   &lt;!-- optional default template content -->
 *   &lt;template>
 *     ...
 *     <oj-bind-text value="[[listItem.value]]"></oj-bind-text>
 *     ...
 *   &lt;/template>
 * &lt;/oj-bind-template-slot>
 */

/**
 * The object containing additional context variables to extend the stamped template nodes'
 * binding context. These variables will be exposed as variables on $current and aliases.
 * @expose
 * @name data
 * @memberof oj.ojBindTemplateSlot
 * @instance
 * @type {Object}
 * @example <caption>Define a slot within a composite View with the name "foo":</caption>
 * &lt;oj-bind-template-slot name="foo" data="[[$properties.data]]">
 *   &lt;!-- optional default template content -->
 *   &lt;template>
 *     ...
 *     <oj-bind-text value="[[$current.value]]"></oj-bind-text>
 *     ...
 *   &lt;/template>
 * &lt;/oj-bind-template-slot>
 */

/**
 * The name of the slot.
 * @expose
 * @name name
 * @memberof oj.ojBindTemplateSlot
 * @instance
 * @type {string}
 * @example <caption>Define a slot within a composite View with the name "foo":</caption>
 * &lt;oj-bind-template-slot name="foo">
 *   &lt;!-- optional default template content -->
 *   &lt;template>
 *     ...
 *   &lt;/template>
 * &lt;/oj-bind-template-slot>
 */

});