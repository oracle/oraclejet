/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcustomelement'], function()
{
/**
 * @private
 * @export
 */
var VComponent = /** @class */ (function () {
    function VComponent(_tag, props, content) {
        if (props === void 0) { props = {}; }
        this._tag = _tag;
        this.props = props;
        this.content = content;
        // TODO: remove ref variable once we support internal property set API
        this.patching = false;
    }
    /**
     * Called on element sets, patch, and if the root properties
     * change after a mount call.
     * @param props {Object} The current component properties
     * @ignore
     */
    VComponent.prototype.updateUI = function (props) {
        var oldVnode = this._vnode;
        this.props = this.GetRootProps(props, this.props);
        this._vnode = PetitDom.h(this._tag, this.props, this.render());
        // Set the node to the root element that was passed in if not already
        // set. PetitDom.patch will set _node, but other code paths will not.
        if (!this._vnode._node) {
            this._vnode._node = this.ref;
        }
        this._vnode._isRoot = oldVnode._isRoot;
        // We use this (hacky) patching flag to avoid recursive calls
        // to updateUI from the component's attributeChangedCallback.
        this.patching = true;
        PetitDom.patch(this._vnode, oldVnode);
        this.patching = false;
    };
    /**
     * Called by the VirtualElementBridge during the browser's connected
     * callback to instantiate our virtual component and generate the child
     * DOM node.
     * @ignore
     */
    VComponent.prototype.mountContent = function (props, content, rootElem) {
        this.ref = rootElem;
        return this._mount(props, content, rootElem);
    };
    // Called by petit-dom when the constructor is passed to the h function instead of
    // a custom element tag name. This will be called instead of mountContent.
    VComponent.prototype.mount = function (props, content) {
        this.ref = this._mount(props, content);
        return this.ref;
    };
    // Called by petit-dom when the constructor is passed to the h function instead of
    // a custom element tag name.
    VComponent.prototype.patch = function (node, props, oldProps, content, oldContent) {
        // updateUI is also called by VirtualElementBridge. We don't need to pass in oldProps
        // since our current this.props would be the oldProps and we do not support slot content
        // changes after initial render so we can ignore changes in content.
        this.updateUI(props);
    };
    // Called by petit-dom when the constructor is passed to the h function instead of
    // a custom element tag name.
    VComponent.prototype.unmount = function (node) {
        return PetitDom.unmount(this._vnode);
    };
    VComponent.prototype.slot = function (slotName, defaultContent) {
        // This method should only be called in subclass' render()
        // function meaning that mount() would have been called
        // and the slot map should have already been populated.
        if (this._slotMap) {
            return this._slotMap[slotName] || defaultContent;
        }
        else {
            throw new Error("Cannot access slot map before mount has been called");
        }
    };
    // TODO use the actual metadata type once we define it for Composites
    VComponent.register = function (tagName, metadata, constr) {
        oj.VirtualElementBridge.register(tagName, metadata, constr);
    };
    // Given the set of root properties that were provided to the virtual
    // component, returns a (possibly) augmented set of properties that
    // should be applied back to the component's root element.
    //
    // This would be used, for example, in cases where the component wants
    // to apply a style class to itself during rendering.
    //
    // Implementations should *not* modify the props object, but rather should
    // create a new object to hold the augmented set of properties, or return
    // props unmodified if no changes are needed.
    // eslint-disable-next-line no-unused-vars
    VComponent.prototype.GetRootProps = function (props, oldProps) {
        return props;
    };
    /**
     * Returns the slot map of slot name to slotted child elements for a given set
     * of child nodes. If the given element has no children, this method returns an
     * empty object. Note that the default slot name is mapped to the empty string.
     * @param {Array} childNodes An array of virtual nodes
     * @return {Object} A map of the child elements for a given custom element.
     * @ignore
     */
    VComponent.getSlotMap = function (childNodes) {
        var slotMap = {};
        childNodes.forEach(function (vnode) {
            var slot = vnode.props.slot || '';
            if (!slotMap[slot]) {
                slotMap[slot] = [];
            }
            // Generate the slotMap with the virtual node or the real DOM node.
            // petit-dom knows how to deal with both.
            slotMap[slot].push(vnode._refNode || vnode);
        });
        return slotMap;
    };
    /**
     * Renders the child DOM for this component and returns DOM node to mount which can
     * either be the child content if a root custom element node was passed in or the root
     * custom element node itself.
     * @param {Object} props The properties for this component
     * @param {Array|Object} content The slot content for this component
     * @param {HTMLElement} rootElem An optional live DOM node representing the custom
     *                               element root for this component
     * @return {HTMElement}
     * @private
     */
    VComponent.prototype._mount = function (props, content, rootElem) {
        if (rootElem === void 0) { rootElem = null; }
        // Before rendering content, generate the slot map given any slot content.
        // Note that we do not need to create a storage node for virtual nodes
        if (!this._slotMap && content) {
            this._slotMap = VComponent.getSlotMap(Array.isArray(content) ? content : [content]);
        }
        // Merge application and component provided properties
        this.props = this.GetRootProps(props, this.props);
        // Generate the virtual nodes representing the child DOM for this custom element
        var childContent = this.render();
        // Generate the virtual node for this custom element
        this._vnode = PetitDom.h(this._tag, this.props, childContent);
        // Our mounting logic changes depending on whether we are being instantiated by
        // the browser's connected callback or by our VComponent constructor in virtual DOM
        var mountNode;
        if (rootElem) {
            // Set the _node on the vnode because we won't be calling mount which would set it
            this._vnode._node = rootElem;
            // Set a flag that this vnode is a root custom element node
            // so we don't call setAttribute on it and override data bound
            // attributes. Internally generated DOM won't have data binding
            // so it's safe to call setAttribute on those elements.
            this._vnode._isRoot = true;
            // Since we're given the root custom element we don't need to render a DOM node
            // for it. However we do still need to generate a virtual node so we still call the
            // h function with the tag name. We only need to mount the child content.
            if (childContent) {
                mountNode = PetitDom.mount(childContent);
                // Always set null binding provider to child content since
                // virtually rendered content does not support knockout
                mountNode.setAttribute('data-oj-binding-provider', 'none');
            }
        }
        else {
            mountNode = PetitDom.mount(this._vnode);
            // Stash a reference of the virtual component onto the DOM node
            // so we don't regenerate the class during the connected callback
            Object.defineProperty(mountNode, '_vcomp', { value: this, enumerable: false });
        }
        return mountNode;
    };
    return VComponent;
}());

/* global vdom:false */

/**
 * @class
 * @ignore
 */
oj.VirtualElementBridge = {};

/**
 * Prototype for the JET component definitional bridge instance
 */
oj.VirtualElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);

oj.CollectionUtils.copyInto(oj.VirtualElementBridge.proto, {
  AddComponentMethods: function (proto) {
    // eslint-disable-next-line no-param-reassign
    proto.setProperty = function (prop, value) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      if (!bridge.SaveEarlyPropertySet(prop, value)) {
        bridge.SetProperty(this, prop, value, this, true);
      }
    };
    // eslint-disable-next-line no-param-reassign
    proto.getProperty = function (prop) {
      // 'this' is the property object we pass to the definitional element contructor to track internal property changes
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      return bridge.GetProperty(this, prop, this);
    };
  },

  CreateComponent: function (element) {
    if (!element._vcomp) {
      if (oj.Components) {
        oj.Components.unmarkPendingSubtreeHidden(element);
      }
      // We expose a similar set of properties as composites except that props is
      // not a Promise and we don't expose any slot information.
      // At the moment some definitional elements have mutation observers so they don't need
      // to rely on refresh being called to be alerted of new children so any cached slotMap
      // can become out of sync. We should add this once we build in support to auto detect
      // added/removed children to custom elements.
      // this._CONTEXT = {
      //   element: element,
      //   props: this._PROPS_PROXY,
      //   unique: oj.BaseCustomElementBridge.__GetUnique(),
      // };
      // this._CONTEXT.uniqueId = element.id ? element.id : this._CONTEXT.unique;
      var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);
      Object.defineProperty(element, '_vcomp',
        { value: new descriptor._CONSTRUCTOR(this._PROPS), enumerable: false });
      this._mountRoot(element, element._vcomp, this._PROPS);
    }

    // Set flag when we can fire property change events
    this.__READY_TO_FIRE = true;

    // Resolve the component busy state
    this.resolveDelayedReadyPromise();
  },

  // eslint-disable-next-line no-unused-vars
  DefineMethodCallback: function (proto, method, methodMeta) {
    // eslint-disable-next-line no-param-reassign
    proto[method] = function () {
      // The VComponent is asynchronously instantiated by CreateComponent so we
      // need to check that this has happened before we call any methods defined on it.
      // Custom elements are upgraded synchronously meaning the method will be available
      // on the HTMLElement, but we tell applications to wait on the component busy context
      // before accessing properties and methods due to the asynch CreateComponent call.
      if (!this._vcomp) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        bridge.throwError(this, 'Cannot access methods before element is upgraded.');
      }
      return this._vcomp[method].apply(this._vcomp, arguments);
    };
  },

  DefinePropertyCallback: function (proto, property, propertyMeta) {
    function set(value, bOuterSet) {
      // Properties can be set before the component is created. These early
      // sets are actually saved until after component creation and played back.
      if (!this._BRIDGE.SaveEarlyPropertySet(property, value)) {
        var previousValue = this._BRIDGE._PROPS[property];
        if (!oj.BaseCustomElementBridge.__CompareOptionValues(property, propertyMeta,
                                                              value, previousValue)) {
          // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
          if (bOuterSet) {
            // eslint-disable-next-line no-param-reassign
            value = this._BRIDGE.ValidatePropertySet(this._ELEMENT, property, value);
          }
          if (propertyMeta._eventListener) {
            this._BRIDGE.SetEventListenerProperty(this._ELEMENT, property, value);
            this._BRIDGE._PROPS[property] = value;
          } else {
            this._BRIDGE._PROPS[property] = value;
            oj.BaseCustomElementBridge.__FirePropertyChangeEvent(
              this._ELEMENT, property, value, previousValue, bOuterSet ? 'external' : 'internal'
            );
          }

          // this will get called before connected callback so short circuit updateUI for that case
          if (this._ELEMENT._vcomp) {
            this._BRIDGE._updateUI(this._ELEMENT);
          }
        }
      }
    }

    function innerSet(value) {
      set.bind(this)(value, false);
    }

    // Called on the custom element
    function outerSet(value) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      set.bind(bridge._PROPS_PROXY)(value, true);
    }

    function get() {
      var value = this._BRIDGE._PROPS[property];
      // If the attribute has not been set, return the default value
      if (value === undefined) {
        value = this._BRIDGE.GetDefaultValue(propertyMeta);
        this._BRIDGE._PROPS[property] = value;
      }
      return value;
    }

    function innerGet() {
      return get.bind(this)();
    }

    // Called on the custom element
    function outerGet() {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      return get.bind(bridge._PROPS_PROXY)();
    }

    // Don't add event listener properties for inner props
    if (!propertyMeta._derived) {
      oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto._propsProto, property,
                                                               innerGet, innerSet);
    }
    oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
  },

  // eslint-disable-next-line no-unused-vars
  HandleReattached: function (element) {
    // TODO call VComponent hook to allow component to reattach event listeners?
  },

  // eslint-disable-next-line no-unused-vars
  HandleDeattached: function (element) {
    // TODO call VComponent hook to allow component to detach event listeners?
  },

  InitializeElement: function (element) {
    if (!element._vcomp) {
      if (oj.Components) {
        oj.Components.markPendingSubtreeHidden(element);
      }
      oj.BaseCustomElementBridge.__InitProperties(element, element);
    }
  },

  InitializePrototype: function (proto) {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);

    Object.defineProperty(proto, '_propsProto', { value: {} });
  },

  InitializeBridge: function (element) {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializeBridge.call(this, element);

    this._EXTENSION = this.METADATA.extension || {};

    // For tracking all properties
    this._PROPS = {};

    // Has getters/setters and calls to set properties on this._PROPS
    if (element._propsProto) {
      this._PROPS_PROXY = Object.create(element._propsProto);
      this._PROPS_PROXY._BRIDGE = this;
      this._PROPS_PROXY._ELEMENT = element;
    }
  },

  PlaybackEarlyPropertySets: function (element) {
    if (!element._vcomp) {
      oj.BaseCustomElementBridge.proto.PlaybackEarlyPropertySets.call(this, element);
    }
  },

  _mountRoot: function (element, vcomp, props) {
    var vprops = _copyProps(props);
    var content = oj.VirtualElementBridge._processSlotContent(element);
    var childNode = vcomp.mountContent(vprops, content, element);
    if (childNode) {
      element.appendChild(childNode);
    }

    // The virtual component may have produced new root properties during
    // mounting (eg. maybe have introduced new root classes that need to
    // be applied).  If so, we manually patch these back to our custom
    // element.
    var newProps = vcomp.props;
    if (newProps !== vprops) {
      this._updateUI(element, newProps);
    }
  },

  _updateUI: function (element, props) {
    if (!element._vcomp.patching) {
      // Copying props on every attr change may end up being expensive
      // (eg. if multiple attributes are set on the same component
      // instance).  Eventually we'll perform the updateUI
      // asynchronously, which will allow us to avoid repeated copying.
      var vprops = _copyProps(props || this._PROPS);
      element._vcomp.updateUI(vprops);
    }
  }
});

/**
 * @export
 */
oj.VirtualElementBridge.register = function (tagName, metadata, constr) {
  if (!constr) {
    oj.Logger.error('Required constructor needed to register custom element: ' + tagName);
  }
  var descriptor = {};
  descriptor[oj.BaseCustomElementBridge.DESC_KEY_META] = metadata;
  if (!descriptor.extension) {
    descriptor.extension = {};
  }
  descriptor._CONSTRUCTOR = constr;

  if (oj.BaseCustomElementBridge.__Register(tagName, descriptor, oj.VirtualElementBridge.proto)) {
    customElements.define(tagName.toLowerCase(),
                          oj.VirtualElementBridge.proto.getClass(descriptor));
  }
};

/**
 * Creates a storage node for a custom element, moves all slot content to
 * the storage node and returns an Array of virtual nodes representing the
 * slot content or null if the custom element has no slot content.
 * @param {Element} element The custom element
 * @return {Array|null}
 * @private
 */
oj.VirtualElementBridge._processSlotContent = function (element) {
  if (element.childNodes) {
    // Needed to replicate what shadow DOM does since we don't have a
    // shadow root to hide slot content that do not map to a component
    // defined slot.
    if (!element._nodeStorage) {
      // eslint-disable-next-line no-param-reassign
      element._nodeStorage = document.createElement('div');
      // eslint-disable-next-line no-param-reassign
      element._nodeStorage.style.display = 'none';
      element.appendChild(element._nodeStorage);
    }
    // Array of virtual nodes we will pass to the VComponent mountContent method
    var content = [];
    var assignableNodes = [];
    for (var i = 0; i < element.childNodes.length - 1; i++) {
      var node = element.childNodes[i];
      if (oj.BaseCustomElementBridge.isSlotable(node)) {
        // Create a lightweight virtual node that contains a reference
        // back to the original slot content and slot value
        content.push({
          _refNode: node,
          props: { slot: oj.BaseCustomElementBridge.getSlotAssignment(node) }
        });
        assignableNodes.push(node);
      }
    }
    assignableNodes.forEach(function (assignableNode) {
      element._nodeStorage.appendChild(assignableNode); // @HTMLUpdateOK
    });
    // Notifies JET components inside nodeStorage that they have been hidden
    // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
    if (oj.Components) {
      oj.Components.subtreeHidden(element._nodeStorage);
    }
    return content;
  }
  return null;
};

// We need to make a copy of this._props any time we hand off
// props to the vcomp, as we mutate our own copy and vcomp
// should not be exposed to these changes (until we hand off
// a new copy)
function _copyProps(props) {
  var propsCopy = {};
  // eslint-disable-next-line no-restricted-syntax
  for (var prop in props) {
    // Because of the way we create and copy the props prototype we
    // can't use getOwnPropertyNames to retrieve the prop getters
    if (prop !== 'getProperty' && prop !== 'setProperty' && prop !== '_ELEMENT' && prop !== '_BRIDGE') {
      propsCopy[prop] = props[prop];
    }
  }
  return propsCopy;
}

/*!
  petit-dom - v0.2.2
  https://github.com/yelouafi/petit-dom
  Copyright (C) 2017 Yassine Elouafi;
  Licensed under the MIT license

  Modification notice: The code is obtained from https://github.com/yelouafi/petit-dom
  and modified by Oracle JET team to be included into Oracle JET project.
*/

/* eslint-disable */
var PetitDom = (function () {

  var EMPTYO = {};
  var EMPTYAR = [];
  var isArray = Array.isArray;
  var isVNode = function isVNode(c) {
    return c && (c._vnode != null || c._text != null);
  };
  var isComponent = function isComponent(c) {
    return c && c.mount && c.patch && c.unmount;
  };

  function h(type, props, contArg) {
    var content,
        args,
        i,
        isSVG = false;
    var len = arguments.length - 2;

    if (typeof type !== "string") {
      if (len === 1) {
        content = contArg;
      } else if (len > 1) {
        args = Array(len);
        for (i = 0; i < len; i++) {
          args[i] = arguments[i + 2];
        }
        content = args;
      }
    } else {
      isSVG = type === "svg";
      if (len === 1) {
        if (isArray(contArg)) {
          content = maybeFlatten(contArg, isSVG);
        } else if (isVNode(contArg)) {
          contArg.isSVG = isSVG;
          content = [contArg];
        } else if (contArg instanceof Node) {
          content = [contArg];
        } else {
          content = [{ _text: contArg == null ? "" : contArg }];
        }
      } else if (len > 1) {
        args = Array(len);
        for (i = 0; i < len; i++) {
          args[i] = arguments[i + 2];
        }
        content = maybeFlatten(args, isSVG);
      } else {
        content = EMPTYAR;
      }
    }

    // sort the props object into categories so we can set as:
    // 1) attributes 2) properties 3) event listeners
    return {
      _vnode: true,
      isSVG: isSVG,
      type: type,
      key: props && props.key || null,
      props: props || EMPTYO,
      propSets: sortProps(props) || EMPTYO,
      content: content
    };
  }

  function maybeFlatten(arr, isSVG) {
    for (var i = 0; i < arr.length; i++) {
      var ch = arr[i];
      if (isArray(ch)) {
        return flattenChildren(arr, i, arr.slice(0, i), isSVG);
      } else if (ch instanceof Node) {
        arr[i] = ch;
      } else if (!isVNode(ch)) {
        arr[i] = { _text: ch == null ? "" : ch };
      } else if (isSVG && !ch.isSVG) {
        ch.isSVG = true;
      }
    }
    return arr;
  }

  function flattenChildren(children, start, arr, isSVG) {
    for (var i = start; i < children.length; i++) {
      var ch = children[i];
      if (isArray(ch)) {
        flattenChildren(ch, 0, arr, isSVG);
      } else if (ch instanceof Node) {
        arr.push(ch);
      } else if (isVNode(ch)) {
        if (isSVG && !ch.isSVG) {
          ch.isSVG = true;
        }
        arr.push(ch);
      } else if (ch == null || typeof ch === 'string') {
        arr.push({ _text: ch == null ? "" : ch });
      } else {
        arr.push(ch);
      }
    }
    return arr;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  /**
    TODO: activate full namespaced attributes (not supported in JSX)
    const XML_NS = "http://www.w3.org/XML/1998/namespace"
  **/
  var XLINK_NS = "http://www.w3.org/1999/xlink";
  var NS_ATTRS = {
    show: XLINK_NS,
    actuate: XLINK_NS,
    href: XLINK_NS
  };

  function defShouldUpdate(p1, p2, c1, c2) {
    if (c1 !== c2) return true;
    for (var key in p1) {
      if (p1[key] !== p2[key]) return true;
    }
    return false;
  }

  function mount(c) {
    var node;
    if (c._text != null) {
      node = document.createTextNode(c._text);
    } else if (c._vnode === true) {
      var type = c.type,
          props = c.props,
          propSets = c.propSets,
          content = c.content,
          isSVG = c.isSVG;

      if (typeof type === "string") {
        // TODO : {is} for custom elements
        if (!isSVG) {
          node = document.createElement(type);
        } else {
          node = document.createElementNS(SVG_NS, type);
        }
        patchDOM(node, propSets, null);
        if (!isArray(content)) {
          var isDomNode  = content instanceof Node;
          var childNode = isDomNode  ? content : mount(content);
          node.appendChild(childNode);
          if (isDomNode  && oj.Components) {
            oj.Components.subtreeShown(childNode);
          }
        } else {
          appendChildren(node, content);
        }
      } else if (isComponent(type)) {
        node = type.mount(props, content);
      } else if (typeof type === "function") {
        if (isComponent(type.prototype)) {
          var instance = new type(props, content);
          node = instance.mount(props, content);
          c._data = instance;
        } else {
          var vnode = type(props, content);
          node = mount(vnode);
          c._data = vnode;
        }
      }
    }
    if (node == null) {
      throw new Error("Unkown node type!");
    }
    c._node = node;
    return node;
  }

  function appendChildren(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var beforeNode = arguments[4];

    while (start <= end) {
      var ch = children[start++];
      // Check to see if child is a vdom or a live DOM node
      var isDomNode  = ch instanceof Node;
      var content = isDomNode  ? ch : mount(ch);
      parent.insertBefore(content, beforeNode);
      // Notifies JET components in node that they have been shown
      // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
      if (isDomNode  && oj.Components) {
        oj.Components.subtreeShown(content);
      }
    }
  }

  function removeChildren(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;

    var cleared = void 0;
    if (parent.childNodes.length === end - start + 1) {
      parent.textContent = "";
      cleared = true;
    }
    while (start <= end) {
      var ch = children[start++];
      if (!cleared) parent.removeChild(ch._node);
      unmount(ch);
    }
  }

  function unmount(ch) {
    if (isArray(ch)) {
      for (var i = 0; i < ch.length; i++) {
        unmount(ch[i]);
      }
    } else if (ch._vnode === true) {
      if (isComponent(ch.type)) {
        ch.type.unmount(ch._node);
      } else if (typeof ch.type === "function" && isComponent(ch.type.prototype)) {
        ch._data.unmount(ch._node);
      } else if (ch.content != null) {
        unmount(ch.content);
      }
    }
  }

  function propertyNameToAttribute(name) {
    return name.replace(/([A-Z])/g,
      function (match) {
        return '-' + match.toLowerCase();
      }
    );
  }

  function sortProps(props) {
    // store attribute, property, and event listener
    // sets separately
    var sets = {
      attrs: {},
      props: {},
      listeners: {}
    };
    for (var key in props) {
      var value = props[key];
      // Note: innerHTML is not currently supported
      if (typeof value === 'string') {
        // TODO Should we make this more efficient?
        var attrName = propertyNameToAttribute(key);
        sets.attrs[attrName] = value;
      } else {
        // Event listeners will be added with addEventListener
        var eventType = eventListenerPropertyToEventType(key);
        if (eventType) {
          sets.listeners[key] = {type: eventType, listener: value};
        } else {
          sets.props[key] = value;
        }
      }
    }
    return sets;
  }

  function patchDOM(el, sets, oldSets) {
    patchAttrs(el, sets.attrs, oldSets ? oldSets.attrs : null);
    patchListeners(el, sets.listeners, oldSets ? oldSets.listeners : null);
    patchProps(el, sets.props, oldSets ? oldSets.props : null);
  }

  function patchAttrs(el, attrs, oldAttrs) {
    for (var key in attrs) {
      var oldv = oldAttrs != null ? oldAttrs[key] : null;
      var newv = attrs[key];
      if (oldv !== newv) {
        if (newv === true) {
          el.setAttribute(key, "");
        } else if (newv === false) {
          el.removeAttribute(key);
        } else {
          if (newv != null) {
            var ns = NS_ATTRS[key];
            if (ns !== undefined) {
              el.setAttributeNS(ns, key, newv);
            } else {
              el.setAttribute(key, newv);
            }
          } else {
            el.removeAttribute(key);
          }
        }
      }
    }
    for (var key in oldAttrs) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }

  function patchProps(el, props, oldProps) {
    for (var key in props) {
      var oldv = oldProps != null ? oldProps[key] : null;
      var newv = props[key];
      if (oldv !== newv) {
        el[key] = newv;
      }
    }
    for (var key in oldProps) {
      if (!(key in props)) {
        // This will reset property to default value for
        // native HTMLElement properties and JET components
        // that specify a default in their metadata
        el[key] = undefined;
      }
    }
  }

  /**
   * Calls addEventListener to set listeners on a given element.
   * The listeners and oldListeners contains a map of keys, e.g. 'onClick' to an object that contains
   * the event type and the listener, e.g. { 'onClick: { 'type': 'click', 'listener': clickCallback } }
   * @param {HTMLElement} el
   * @param {Object} listeners
   * @param {Object} oldListeners
   */
  function patchListeners(el, listeners, oldListeners) {
    for (var key in listeners) {
      var oldv = oldListeners != null ? (oldListeners[key] || {}) : {};
      var newv = listeners[key];
      if (oldv.listener !== newv.listener) {
        var eventType = newv.type;
        if (oldv.listener) {
          el.removeEventListener(eventType, oldv.listener);
        }
        el.addEventListener(eventType, newv.listener);
      }
    }
    for (var key in oldListeners) {
      if (!(key in listeners)) {
        var oldv = oldListeners[key];
        el.removeEventListener(oldv.type, oldv.listener);
      }
    }
  }

  function eventListenerPropertyToEventType(property) {
    if (/^on[A-Z]/.test(property)) {
      return property.substr(2, 1).toLowerCase() + property.substr(3);
    }
    return null;
  }

  function patch(newch, oldch, parent) {
    var childNode = oldch._node;

    if (oldch === newch) {
      return childNode;
    }

    var t1, t2;
    if ((t1 = oldch._text) != null && (t2 = newch._text) != null) {
      if (t1 !== t2) {
        childNode.nodeValue = t2;
      }
    } else if (oldch.type === newch.type && oldch.isSVG === newch.isSVG) {
      var type = oldch.type;

      if (isComponent(type)) {
        type.patch(childNode, newch.props, oldch.props, newch.content, oldch.content);
      } else if (typeof type === "function") {
        if (isComponent(type.prototype)) {
          var instance = oldch._data;
          instance.patch(childNode, newch.props, oldch.props, newch.content, oldch.content);
          newch._data = instance;
        } else {
          var shouldUpdateFn = type.shouldUpdate || defShouldUpdate;
          if (shouldUpdateFn(newch.props, oldch.props, newch.content, oldch.content)) {
            var vnode = type(newch.props, newch.content);
            childNode = patch(vnode, oldch._data, parent);
            newch._data = vnode;
          } else {
            newch._data = oldch._data;
          }
        }
      } else if (typeof type === "string") {
        // Skip patching the root node for a custom element
        // since all attributes will be set by application and
        // we don't want to override data bound attributes.
        if (!oldch._isRoot) {
          patchDOM(childNode, newch.propSets, oldch.propSets);
        }
        patchContent(childNode, newch.content, oldch.content);
      } else if (oldch instanceof Node && newch instanceof Node) {
        if (oldch !== newch && parent) {
          parent.replaceChild(newch, oldch);
        }
      } else {
        throw new Error("Unknown node type! " + type);
      }
    } else {
      childNode = mount(newch);
      if (parent) {
        parent.replaceChild(childNode, oldch._node);
      }
      unmount(oldch);
    }

    newch._node = childNode;
    return childNode;
  }

  function patchContent(parent, content, oldContent) {
    if (!isArray(content) && !isArray(oldContent)) {
      if (content !== oldContent) {
        patch(content, oldContent, parent);
      }
    } else if (isArray(content) && isArray(oldContent)) {
      diffChildren(parent, content, oldContent);
    } else {
      removeChildren(parent, oldContent, 0, oldContent.length - 1);
      appendChildren(parent, content);
    }
  }

  function canPatch(v1, v2) {
    return v1.key === v2.key;
  }

  function diffChildren(parent, children, oldChildren) {
    var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
    var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;

    if (children === oldChildren) return;
    var oldCh;

    /**
      Before applying the diff algorithm we try some preprocessing optimizations
      to reduce the cost
      See https://neil.fraser.name/writing/diff/ for the full details.
        In the following : indel = INsertion/DELetion
    **/

    // common prefix/suffix

    var k = diffCommonPrefix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
    newStart += k;
    oldStart += k;

    k = diffCommonSufffix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
    newEnd -= k;
    oldEnd -= k;

    if (newStart > newEnd && oldStart > oldEnd) {
      return;
    }

    // simple indel: one of the 2 sequences is empty after common prefix/suffix removal

    // old sequence is empty -> insertion
    if (newStart <= newEnd && oldStart > oldEnd) {
      oldCh = oldChildren[oldStart];
      appendChildren(parent, children, newStart, newEnd, oldCh && oldCh._node);
      return;
    }

    // new sequence is empty -> deletion
    if (oldStart <= oldEnd && newStart > newEnd) {
      removeChildren(parent, oldChildren, oldStart, oldEnd);
      return;
    }

    // 2 simple indels: the shortest sequence is a subsequence of the longest
    var oldRem = oldEnd - oldStart + 1;
    var newRem = newEnd - newStart + 1;
    k = -1;
    if (oldRem < newRem) {
      k = indexOf(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch);
      if (k >= 0) {
        oldCh = oldChildren[oldStart];
        appendChildren(parent, children, newStart, k - 1, oldCh._node);
        var upperLimit = k + oldRem;
        newStart = k;
        while (newStart < upperLimit) {
          patch(children[newStart++], oldChildren[oldStart++]);
        }
        oldCh = oldChildren[oldEnd];
        appendChildren(parent, children, newStart, newEnd, oldCh && oldCh._node.nextSibling);
        return;
      }
    } else if (oldRem > newRem) {
      k = indexOf(oldChildren, children, oldStart, oldEnd, newStart, newEnd, canPatch);
      if (k >= 0) {
        removeChildren(parent, oldChildren, oldStart, k - 1);
        upperLimit = k + newRem;
        oldStart = k;
        while (oldStart < upperLimit) {
          patch(children[newStart++], oldChildren[oldStart++]);
        }
        removeChildren(parent, oldChildren, oldStart, oldEnd);
        return;
      }
    }

    // fast case: difference between the 2 sequences is only one item
    if (oldStart === oldEnd) {
      var node = oldChildren[oldStart]._node;
      appendChildren(parent, children, newStart, newEnd, node);
      parent.removeChild(node);
      unmount(node);
      return;
    }
    if (newStart === newEnd) {
      parent.insertBefore(mount(children[newStart]), oldChildren[oldStart]._node);
      removeChildren(parent, oldChildren, oldStart, oldEnd);
      return;
    }

    /*
      last preopt
      if we can find a subsequence that's at least half the longest sequence the it's guaranteed to
      be the longest common subsequence. This allows us to find the lcs using a simple O(N) algorithm
    */
    var hm;
    /*var oldShorter = oldRem < newRem;
    if (oldShorter) {
      hm = diffHalfMatch(
        children,
        oldChildren,
        newStart,
        newEnd,
        oldStart,
        oldEnd,
        canPatch
      );
    } else {
      hm = diffHalfMatch(
        oldChildren,
        children,
        oldStart,
        oldEnd,
        newStart,
        newEnd,
        canPatch
      );
    }
    if (hm) {
      var newStartHm = oldShorter ? hm.start1 : hm.start2;
      var newEndHm = newStartHm + hm.length - 1;
      var oldStartHm = oldShorter ? hm.start2 : hm.start1;
      var oldEndHm = oldStartHm + hm.length - 1;
      for (var i = newStartHm, j = oldStartHm; i <= newEndHm; i++, j++) {
        patch(children[i], oldChildren[j], parent);
      }
      diffChildren(
        parent,
        children,
        oldChildren,
        newStart,
        newStartHm - 1,
        oldStart,
        oldStartHm - 1
      );
      diffChildren(
        parent,
        children,
        oldChildren,
        newEndHm + 1,
        newEnd,
        oldEndHm + 1,
        oldEnd
      );
      return;
    }*/

    /*
      Run the diff algorithm
      First try the O(ND) algorithm. If O(ND) cost is high (Too match diffs between the 2 seqs)
      then fallback to Map lookup based algorithm
    */
    if (!hm) {
      var failed = diffOND(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd);
      if (failed) diffWithMap(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd);
    }
  }

  function diffCommonPrefix(s1, s2, start1, end1, start2, end2, eq, parent) {
    var k = 0,
        c1,
        c2;
    while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[start1], c2 = s2[start2])) {
      if (parent) patch(c1, c2, parent);
      start1++;
      start2++;
      k++;
    }
    return k;
  }

  function diffCommonSufffix(s1, s2, start1, end1, start2, end2, eq, parent) {
    var k = 0,
        c1,
        c2;
    while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[end1], c2 = s2[end2])) {
      if (parent) patch(c1, c2, parent);
      end1--;
      end2--;
      k++;
    }
    return k;
  }
  /*
  function diffHalfMatch(s1, s2, start1, end1, start2, end2, eq) {
    var len1 = end1 - start1 + 1;
    var len2 = end2 - start2 + 1;

    if (len1 < 2 || len2 < 1) {
      return null;
    }

    var hm1 = halfMatchInt(start1 + Math.ceil(len1 / 4));
    var hm2 = halfMatchInt(start1 + Math.ceil(len1 / 2));
    return !hm1 && !hm2
      ? null
      : !hm1 ? hm2 : !hm2 ? hm1 : hm1.length > hm2.length ? hm1 : hm2;

    function halfMatchInt(seedStart) {
      var seedEnd = seedStart + Math.floor(len1 / 4);
      var j = start2 - 1;
      var bestCS = { length: 0 };
      while (
        j < end2 &&
        (j = indexOf(s2, s1, j + 1, end2, seedStart, seedEnd, eq)) !== -1
      ) {
        var prefixLen = diffCommonPrefix(s1, s2, seedStart, end1, j, end2, eq);
        var suffixLen = diffCommonSufffix(
          s1,
          s2,
          start1,
          seedStart - 1,
          start2,
          j - 1,
          eq
        );
        if (bestCS.length < prefixLen + suffixLen) {
          bestCS.start1 = seedStart - suffixLen;
          bestCS.start2 = j - suffixLen;
          bestCS.length = prefixLen + suffixLen;
        }
      }
      return bestCS.length >= len1 / 2 ? bestCS : null;
    }
  }
  */
  var PATCH = 2;
  var INSERTION = 4;
  var DELETION = 8;

  /**
    Find the shortest edit script between the old and new sequences
    This is equivalent to finding the shortest path in the edit graph of the 2 sequences
    see "An O(ND) Difference Algorithm and Its Variations" at
    http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.4.6927&rep=rep1&type=pdf
  **/
  function diffOND(parent, children, oldChildren) {
    var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
    var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;

    var rows = newEnd - newStart + 1;
    var cols = oldEnd - oldStart + 1;
    var dmax = rows + cols;

    var v = [];
    var d, k, r, c, pv, cv, pd;
    outer: for (d = 0; d <= dmax; d++) {
      if (d > 50) return true;
      pd = d - 1;
      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];
      for (k = -d; k <= d; k += 2) {
        if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }
        r = c - k;
        while (c < cols && r < rows && canPatch(oldChildren[oldStart + c], children[newStart + r])) {
          c++;
          r++;
        }
        if (c === cols && r === rows) {
          break outer;
        }
        cv[d + k] = c;
      }
    }

    var diff = Array(d / 2 + dmax / 2);
    var deleteMap = {};
    var oldCh;
    var diffIdx = diff.length - 1;
    for (d = v.length - 1; d >= 0; d--) {
      while (c > 0 && r > 0 && canPatch(oldChildren[oldStart + c - 1], children[newStart + r - 1])) {
        // diagonal edge = equality
        diff[diffIdx--] = PATCH;
        c--;
        r--;
      }
      if (!d) break;
      pd = d - 1;
      pv = d ? v[d - 1] : [0, 0];
      k = c - r;
      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
        oldCh = oldChildren[oldStart + c];
        if (oldCh.key != null) {
          deleteMap[oldCh.key] = oldStart + c;
        }
      }
    }

    applyDiff(parent, diff, children, oldChildren, newStart, oldStart, deleteMap);
  }

  function applyDiff(parent, diff, children, oldChildren, newStart, oldStart, deleteMap) {
    var ch,
        oldCh,
        node,
        oldMatchIdx,
        moveMap = {};
    for (var i = 0, chIdx = newStart, oldChIdx = oldStart; i < diff.length; i++) {
      var op = diff[i];
      if (op === PATCH) {
        patch(children[chIdx++], oldChildren[oldChIdx++], parent);
      } else if (op === INSERTION) {
        ch = children[chIdx++];
        oldMatchIdx = null;
        if (ch.key != null) {
          oldMatchIdx = deleteMap[ch.key];
        }
        if (oldMatchIdx != null) {
          node = patch(ch, oldChildren[oldMatchIdx]);
          moveMap[ch.key] = oldMatchIdx;
        } else {
          node = mount(ch);
        }
        parent.insertBefore(node, oldChIdx < oldChildren.length ? oldChildren[oldChIdx]._node : null);
      } else if (op === DELETION) {
        oldChIdx++;
      }
    }

    for (i = 0, oldChIdx = oldStart; i < diff.length; i++) {
      var _op = diff[i];
      if (_op === PATCH) {
        oldChIdx++;
      } else if (_op === DELETION) {
        oldCh = oldChildren[oldChIdx++];
        if (oldCh.key == null || moveMap[oldCh.key] == null) {
          parent.removeChild(oldCh._node);
          unmount(oldCh);
        }
      }
    }
  }

  /**
    A simplified implementation of Hunt-Szymanski algorithm
    see "A Fast Algorithm for Computing Longest Common Subsequences"
    http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.608.1614&rep=rep1&type=pdf
    This implementation supposes keys are unique so we only use
    simple object maps to build the match list
  **/
  function diffWithMap(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd) {
    var keymap = {},
        unkeyed = [],
        idxUnkeyed = 0,
        ch,
        oldCh,
        k,
        idxInOld,
        key;

    var newLen = newEnd - newStart + 1;
    var oldLen = oldEnd - oldStart + 1;
    var minLen = Math.min(newLen, oldLen);
    var tresh = Array(minLen + 1);
    tresh[0] = -1;

    for (var i = 1; i < tresh.length; i++) {
      tresh[i] = oldEnd + 1;
    }
    var link = Array(minLen);

    for (i = oldStart; i <= oldEnd; i++) {
      oldCh = oldChildren[i];
      key = oldCh.key;
      if (key != null) {
        keymap[key] = i;
      } else {
        unkeyed.push(i);
      }
    }

    for (i = newStart; i <= newEnd; i++) {
      ch = children[i];
      idxInOld = ch.key == null ? unkeyed[idxUnkeyed++] : keymap[ch.key];
      if (idxInOld != null) {
        k = findK(tresh, idxInOld);
        if (k >= 0) {
          tresh[k] = idxInOld;
          link[k] = { newi: i, oldi: idxInOld, prev: link[k - 1] };
        }
      }
    }

    k = tresh.length - 1;
    while (tresh[k] > oldEnd) {
      k--;
    }var ptr = link[k];
    var diff = Array(oldLen + newLen - k);
    var curNewi = newEnd,
        curOldi = oldEnd;
    var d = diff.length - 1;
    while (ptr) {
      var _ptr = ptr,
          newi = _ptr.newi,
          oldi = _ptr.oldi;

      while (curNewi > newi) {
        diff[d--] = INSERTION;
        curNewi--;
      }
      while (curOldi > oldi) {
        diff[d--] = DELETION;
        curOldi--;
      }
      diff[d--] = PATCH;
      curNewi--;
      curOldi--;
      ptr = ptr.prev;
    }
    while (curNewi >= newStart) {
      diff[d--] = INSERTION;
      curNewi--;
    }
    while (curOldi >= oldStart) {
      diff[d--] = DELETION;
      curOldi--;
    }
    applyDiff(parent, diff, children, oldChildren, newStart, oldStart, keymap);
  }

  function findK(ktr, j) {
    var lo = 1;
    var hi = ktr.length - 1;
    while (lo <= hi) {
      var mid = Math.ceil((lo + hi) / 2);
      if (j < ktr[mid]) hi = mid - 1;else lo = mid + 1;
    }
    return lo;
  }

  function indexOf(a, suba, aStart, aEnd, subaStart, subaEnd, eq) {
    var j = subaStart,
        k = -1;
    var subaLen = subaEnd - subaStart + 1;
    while (aStart <= aEnd && aEnd - aStart + 1 >= subaLen) {
      if (eq(a[aStart], suba[j])) {
        if (k < 0) k = aStart;
        j++;
        if (j > subaEnd) return k;
      } else {
        k = -1;
        j = subaStart;
      }
      aStart++;
    }
    return -1;
  }

  return {
    h: h,
    mount: mount,
    patch: patch,
    unmount: unmount,
    diffChildren: diffChildren
  }
}());


VComponent.h = PetitDom.h;
return VComponent;
});