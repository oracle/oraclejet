/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import BindingProviderImpl from 'ojs/ojkoshared';
import { bindingHandlers, applyBindingsToDescendants } from 'knockout';
import oj from 'ojs/ojcore-base';

(function () {
  BindingProviderImpl.addPostprocessor(
    {
      nodeHasBindings: function (node, _wrappedReturn) {
        var wrappedReturn = _wrappedReturn;
        return wrappedReturn ||
          (node.nodeType === 1 &&
           /* istanbul ignore next: nodeHasBindings only called for non-elements */
           node.nodeName.toLowerCase() === 'oj-defer');
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
    }
    );
}());

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
          nodesArray.forEach(node => parentNode.appendChild(node));
          applyBindingsToDescendants(bindingContext, parentNode);
        };
      }
    } else {
      applyBindingsToDescendants(bindingContext, element);
    }
    return { controlsDescendantBindings: true };
  }
};

const DeferElement = {};
oj._registerLegacyNamespaceProp('DeferElement', DeferElement);

(function () {
  /**
   *
   * @since 4.0.0
   * @ojcomponent oj.ojDefer
   * @ojshortdesc Defer is used to delay applying bindings to its children until it is activated. Child elements are disconnected from the DOM tree until the parent component activates its subtree.
   * @ojsignature {target: "Type", value:"class ojDefer extends JetElement<ojDeferSettableProperties>"}
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
  DeferElement.register = function () {
    var deferElementProto = Object.create(HTMLElement.prototype);
    // define a non-public _activate API which will only be called
    // by subtreeAttach
    Object.defineProperties(deferElementProto, {
      _activate: {
        value: function () {
          if (!this._activateSubtree) {
            // if the _activateSubtree function is not there then
            // that means we have not been bound yet. Set a flag to activate when bound
            Object.defineProperty(this, '_shown', {
              configurable: false,
              value: true
            });
          } else {
            // if we have stashed away children, put them back, apply binding and remove the property
            this._activateSubtree(this);
            delete this._activateSubtree;
          }
        },
        writable: false
      },
      // A non-public property will be defined as a function by
      // either ko.bindingHandlers or VTemplateEngine. The function will attach
      // saved child nodes to oj-defer element and apply bindings if necessary.
      // The property will be deleted by the caller after a single use.
      _activateSubtree: {
        value: null,
        writable: true,
        configurable: true
      }
    });
    var constructorFunc = function () {
      const reflect = window.Reflect;
      let ret;
      /* istanbul ignore else: window.Reflect available everywhere except on IE11 */
      if (typeof reflect !== 'undefined') {
        ret = reflect.construct(HTMLElement, [], this.constructor);
      } else {
        ret = HTMLElement.call(this);
      }
      return ret;
    };
    Object.defineProperty(deferElementProto, 'constructor', {
      value: constructorFunc,
      writable: true,
      configurable: true
    });
    constructorFunc.prototype = deferElementProto;
    Object.setPrototypeOf(constructorFunc, HTMLElement);
    customElements.define('oj-defer', constructorFunc);
  };
  DeferElement.register();
}());
