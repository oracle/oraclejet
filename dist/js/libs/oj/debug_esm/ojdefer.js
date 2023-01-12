/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import BindingProviderImpl from 'ojs/ojkoshared';
import { bindingHandlers, applyBindingsToDescendants } from 'knockout';
import oj from 'ojs/ojcore-base';

(function () {
  BindingProviderImpl.addPostprocessor({
    nodeHasBindings: function (node, _wrappedReturn) {
      var wrappedReturn = _wrappedReturn;
      return (
        wrappedReturn ||
        (node.nodeType === 1 &&
          /* istanbul ignore next: nodeHasBindings only called for non-elements */
          node.nodeName.toLowerCase() === 'oj-defer')
      );
    },
    getBindingAccessors: function (node, bindingContext, _wrappedReturn) {
      var wrappedReturn = _wrappedReturn;
      if (node.nodeType === 1 && node.nodeName.toLowerCase() === 'oj-defer') {
        wrappedReturn = wrappedReturn || {};
        wrappedReturn._ojDefer_ =
          /* istanbul ignore next: binding handler doesn't call valueAccessor */
          function () {};
      }
      return wrappedReturn;
    }
  });
})();

bindingHandlers._ojDefer_ = {
  init: function (_element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var element = _element;

    // _shown is set if subtreeShown was called before bound. Therefore, if _shown was set
    // we can directly call ko.applyBindingsToDescendants() without waiting for subtreeShown
    // because it was already called.

    if (!element._shown) {
      // this _activateSubtree function will be called from the element's
      // _activate API.
      if (!element._activateSubtree) {
        // Stash away the children into a node array and pass them through closure
        // to _activateSubtree() function.
        var nodesArray = [];
        while (element.firstChild) {
          nodesArray.push(element.firstChild);
          element.removeChild(element.firstChild);
        }
        element._activateSubtree = (parentNode) => {
          nodesArray.forEach((node) => parentNode.appendChild(node));
          applyBindingsToDescendants(bindingContext, parentNode);
        };
      }
    } else {
      applyBindingsToDescendants(bindingContext, element);
    }
    return { controlsDescendantBindings: true };
  }
};

/**
 *
 * @since 4.0.0
 * @ojcomponent oj.ojDefer
 * @ojshortdesc Defer is used to delay applying bindings to its children until it is activated. Child elements are disconnected from the DOM tree until the parent component activates its subtree.
 * @ojsignature {target: "Type", value:"class ojDefer extends JetElement<ojDeferSettableProperties>"}
 * @ojoracleicon 'oj-ux-ico-defer'
 * @classdesc
 * The oj-defer custom element delays applying bindings to its children until it is activated.
 * It works by disconnecting child elements from the DOM tree until the parent component activates its subtree. In addition, the tag will
 * defer binding execution and disconnect children within hidden subtrees of the components which support it.
 * There are several components which support oj-defer:<br>
 * <ul>
 * <li>Collapsible</li>
 * <li>Dialog</li>
 * <li>Film Strip</li>
 * <li>Off Canvas</li>
 * <li>Popup</li>
 * <li>MasonryLayout</li>
 * <li>Menu</li>
 * <li>Composite Component Slots</li>
 * </ul>
 * Note: For composite component slots, the oj-defer element could have a slot attribute specified directly on it,
 * i.e. &lt;oj-defer slot="something">, or &lt;oj-defer> could appear within a child subtree of the element with a slot attribute. Also,
 * the current implementation may allow bindings to be applied
 * to the content within &lt;oj-defer> prematurely if the tag is used in one of the
 * 'hiding' components that is nested within another 'hiding' component. That
 * limitation will be removed in the future.
 */

class DeferElement extends HTMLElement {
  constructor() {
    super();
    // Define internal properties for the _shown and _activateSubtree class properties.
    this._activateSubtreeInternal = null;
    this._shownInternal = false;
  }

  // Add getter for _shown. We don't need setter since we don't want external code to modify it.
  // The property is used as a flag in activating elements when binding.
  get _shown() {
    return this._shownInternal;
  }
  // Add getter and setter for _activateSubtree, since we expect the external code to set the value.
  // _activateSubtree is a non-public property that will be defined as a function by either ko.bindingHandlers
  // or VTemplateEngine. The function will attach saved child nodes to oj-defer element and apply bindings
  // if necessary. The property will be deleted by the caller after a single use.
  get _activateSubtree() {
    return this._activateSubtreeInternal;
  }
  set _activateSubtree(value) {
    this._activateSubtreeInternal = value;
  }
  // Define the class method that would be used by JET and only be called
  // by subtreeAttach
  _activate() {
    if (!this._activateSubtree) {
      // if the _activateSubtree function is not there then that means we have
      // not been bound yet. Therefore, this internal property sets _shown to true
      // as a flag to activate when bound.
      this._shownInternal = true;
    } else {
      // if we have stashed away children, put them back, apply binding and then
      // set the internal property to null.
      this._activateSubtree(this);
      this._activateSubtreeInternal = null;
    }
  }
}
customElements.define('oj-defer', DeferElement);
oj._registerLegacyNamespaceProp('DeferElement', DeferElement);
