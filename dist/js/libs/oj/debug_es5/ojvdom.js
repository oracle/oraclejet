(function() {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcustomelement-utils', 'ojs/ojcore-base', 'ojs/ojdefaultsutils', 'ojs/ojlogger'], function (exports, ojcustomelementUtils, oj, ojdefaultsutils, Logger) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  var EMPTYO = Object.freeze({});
  var SKIPKEYS = new Set(['key', 'ref', 'children']);

  function classPropToObject(classProp) {
    if (!classProp) {
      return EMPTYO;
    }

    if (typeof classProp === 'string') {
      return Object.freeze(classProp.split(' ').reduce(function (acc, val) {
        if (val) {
          acc[val] = true;
        }

        return acc;
      }, {}));
    }

    return classProp;
  }

  function canPatch(newch, oldch) {
    return (newch.key == null && oldch.key == null || newch.key === oldch.key) && newch._isWrapped === oldch._isWrapped && (newch._node && newch === oldch || !newch._node);
  }

  function h(type, props) {
    var isSVG = false,
        isVComponent = false,
        isCustomElement;

    if (typeof type === 'string') {
      isSVG = type === 'svg';
      isCustomElement = !isSVG && ojcustomelementUtils.ElementUtils.isValidCustomElementName(type);
    } else {
      isVComponent = isComponent(type.prototype);
      isCustomElement = isVComponent && type.prototype.mountContent;
    }

    var needsWritableProps = isVComponent || isCustomElement;

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return {
      type: type,
      isSVG: isSVG,
      isComponent: isVComponent,
      isCustomElement: isCustomElement,
      key: props === null || props === void 0 ? void 0 : props.key,
      props: props || (needsWritableProps ? Object.create(null) : EMPTYO),
      content: args.length === 1 ? args[0] : args,
      ref: props === null || props === void 0 ? void 0 : props.ref
    };
  }

  function isComponent(c) {
    return (c === null || c === void 0 ? void 0 : c.mount) && (c === null || c === void 0 ? void 0 : c.patch) && (c === null || c === void 0 ? void 0 : c.notifyUnmounted) && (c === null || c === void 0 ? void 0 : c.notifyMounted);
  }

  var XLINK_NS = 'http://www.w3.org/1999/xlink';
  var NS_ATTRS = {
    show: XLINK_NS,
    actuate: XLINK_NS
  };
  var LISTENER_OPTIONS_SYMBOL = Symbol();

  function addOrUpdateProps(el, props, oldProps, isVComponent) {
    var propKeys = Object.keys(props);
    propKeys.forEach(function (key) {
      if (SKIPKEYS.has(key)) {
        return;
      }

      var value = props[key];
      var oldValue = oldProps[key];

      if (value !== oldValue) {
        if (key === 'style') {
          patchProperties(el.style, value || EMPTYO, oldValue || EMPTYO, '');
        } else if (key === 'class') {
          patchClassName(el, value, oldValue, isVComponent);
        } else if (!maybePatchListener(el, key, value, oldValue) && !maybePatchAttribute(el, key, value, isVComponent)) {
          el[key] = value;
        }
      }
    });
  }

  function removeOldProps(el, props, oldProps, isVComponent) {
    var propKeys = Object.keys(oldProps);
    propKeys.forEach(function (key) {
      if (key === 'key' || key === 'ref') {
        return;
      }

      var oldValue = oldProps[key];

      if (!(key in props)) {
        if (key === 'style') {
          patchProperties(el.style, EMPTYO, oldValue || EMPTYO, '');
        } else if (key === 'class') {
          patchClassName(el, null, oldValue, isVComponent);
        } else if (!maybePatchListener(el, key, null, oldValue) && !maybePatchAttribute(el, key, null, isVComponent)) {
          el[key] = undefined;
        }
      }
    });
  }

  function isTemplateElement(node) {
    return node.nodeName === 'TEMPLATE';
  }

  function removeListeners(el, props) {
    var propKeys = Object.keys(props);
    propKeys.forEach(function (key) {
      if (SKIPKEYS.has(key)) {
        return;
      }

      maybePatchListener(el, key, null, props[key]);
    });
  }

  function patchProperties(propertyHolder, props, oldProps, unsetValue) {
    for (var key in props) {
      var oldv = oldProps[key];
      var newv = props[key];

      if (oldv !== newv) {
        propertyHolder[key] = newv;
      }
    }

    for (var _key2 in oldProps) {
      if (!(_key2 in props)) {
        propertyHolder[_key2] = unsetValue;
      }
    }
  }

  function patchClassName(el, value, oldValue, isVComponent) {
    if (isVComponent) {
      patchClassNameAsMap(el, value, oldValue);
    } else {
      patchClassNameAsString(el, value);
    }
  }

  function patchClassNameAsString(el, value) {
    if (value) {
      var classStr = _typeof(value) === 'object' ? Object.keys(value).filter(function (key) {
        return value[key];
      }).join(' ') : value;
      el.setAttribute('class', classStr);
    } else {
      el.removeAttribute('class');
    }
  }

  function patchClassNameAsMap(el, value, oldValue) {
    var oldValueMap = classPropToObject(oldValue);
    var valueMap = classPropToObject(value);

    for (var key in oldValueMap) {
      if (oldValueMap[key] && !valueMap[key]) {
        el.classList.remove(key);
      }
    }

    for (var _key3 in valueMap) {
      if (valueMap[_key3] && !oldValueMap[_key3]) {
        el.classList.add(_key3);
      }
    }
  }

  function maybePatchListener(el, key, value, oldValue) {
    if (value || oldValue) {
      if (ojcustomelementUtils.AttributeUtils.isEventListenerProperty(key)) {
        patchListener(el, ojcustomelementUtils.AttributeUtils.eventListenerPropertyToEventType(key), value, oldValue);
        return true;
      }
    }

    return false;
  }

  function patchListener(el, eventType, value, oldValue) {
    if (oldValue) {
      el.removeEventListener(eventType, oldValue, oldValue[LISTENER_OPTIONS_SYMBOL]);
    }

    if (value) {
      el.addEventListener(eventType, value, value[LISTENER_OPTIONS_SYMBOL]);
    }
  }

  function maybePatchAttribute(el, key, value, isVComponent) {
    if (requiresDomPropertyPatching(el, key, isVComponent)) {
      var attr = ojcustomelementUtils.AttributeUtils.getNativeAttr(key);

      if (key === 'draggable') {
        if (value == null) {
          el.removeAttribute('draggable');
        } else {
          el.setAttribute('draggable', value.toString());
        }
      } else if (value === true) {
        el.setAttribute(attr, '');
      } else if (value === false) {
        el.removeAttribute(attr);
      } else {
        if (value != null) {
          var ns = NS_ATTRS[attr];

          if (ns !== undefined) {
            el.setAttributeNS(ns, attr, value);
          } else {
            el.setAttribute(attr, value);
          }
        } else {
          el.removeAttribute(attr);
        }
      }

      return true;
    }

    return false;
  }

  function requiresDomPropertyPatching(el, propName, isVComponent) {
    if (isVComponent) {
      return ojcustomelementUtils.AttributeUtils.isGlobalOrData(propName);
    }

    return propName !== 'value' && propName !== 'checked' && (propName !== 'render' || !isTemplateElement(el));
  }

  var PATCH = 2;
  var INSERTION = 4;
  var DELETION = 8;

  function diffOND(children, oldChildren) {
    var newStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var newEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var oldStart = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var oldEnd = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : oldChildren.length - 1;
    var rows = newEnd - newStart + 1;
    var cols = oldEnd - oldStart + 1;
    var dmax = rows + cols;
    var v = [];
    var d, k, r, c, pv, cv, pd;

    outer: for (d = 0; d <= dmax; d++) {
      if (d > 50) return null;
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

        while (c < cols && r < rows && canPatch(children[newStart + r], oldChildren[oldStart + c])) {
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
    var keymap = {},
        wrapmap = new Map();
    var oldCh;
    var diffIdx = diff.length - 1;

    for (d = v.length - 1; d >= 0; d--) {
      while (c > 0 && r > 0 && canPatch(children[newStart + r - 1], oldChildren[oldStart + c - 1])) {
        diff[diffIdx--] = PATCH;
        c--;
        r--;
      }

      if (!d) break;
      pd = d - 1;
      pv = d ? v[d - 1] : [0, 0];
      k = c - r;

      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        c--;
        diff[diffIdx--] = DELETION;
        oldCh = oldChildren[oldStart + c];

        if (oldCh.key != null) {
          keymap[oldCh.key] = oldStart + c;
        } else if (oldCh._isWrapped) {
          wrapmap.set(oldCh._node, oldStart + c);
        }
      }
    }

    return {
      diff: diff,
      keymap: keymap,
      wrapmap: wrapmap
    };
  }

  function diffWithMap(children, oldChildren, newStart, newEnd, oldStart, oldEnd) {
    var newLen = newEnd - newStart + 1;
    var oldLen = oldEnd - oldStart + 1;
    var minLen = Math.min(newLen, oldLen);
    var tresh = Array(minLen + 1);
    tresh[0] = -1;

    for (var i = 1; i < tresh.length; i++) {
      tresh[i] = oldEnd + 1;
    }

    var link = Array(minLen);
    var keymap = {},
        unkeyed = [],
        wrapmap = new Map();

    for (var _i = oldStart; _i <= oldEnd; _i++) {
      var oldCh = oldChildren[_i];
      var key = oldCh.key;

      if (key != null) {
        keymap[key] = _i;
      } else if (oldCh._isWrapped) {
        wrapmap.set(oldCh._node, _i);
      } else {
        unkeyed.push(_i);
      }
    }

    var idxUnkeyed = 0;

    for (var _i2 = newStart; _i2 <= newEnd; _i2++) {
      var ch = children[_i2];
      var idxInOld = void 0;
      var incrementUnkeyed = false;

      if (ch.key != null) {
        idxInOld = keymap[ch.key];
      } else if (ch._isWrapped) {
        idxInOld = wrapmap.get(ch._node);
      } else {
        incrementUnkeyed = true;
        idxInOld = unkeyed[idxUnkeyed];
      }

      if (idxInOld != null && !canPatch(ch, oldChildren[idxInOld])) {
        idxInOld = null;
      } else if (incrementUnkeyed) {
        idxUnkeyed++;
      }

      if (idxInOld != null) {
        var _k = findK(tresh, idxInOld);

        if (_k >= 0) {
          tresh[_k] = idxInOld;
          link[_k] = {
            newi: _i2,
            oldi: idxInOld,
            prev: link[_k - 1]
          };
        }
      }
    }

    var k = tresh.length - 1;

    while (tresh[k] > oldEnd) {
      k--;
    }

    var ptr = link[k];
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

    return {
      diff: diff,
      keymap: keymap,
      wrapmap: wrapmap
    };
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

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function flattenContent(children) {
    var isSVG = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var childrenType = _typeof(children);

    if (children == null || childrenType === 'boolean') {
      return [];
    } else if (Array.isArray(children)) {
      var _ref;

      return (_ref = []).concat.apply(_ref, _toConsumableArray(children.map(function (child) {
        return flattenContent(child, isSVG);
      })));
    } else if (!isVNode(children)) {
      return [{
        _text: children
      }];
    }

    var vnode = children;

    if (isSVG && !vnode.isSVG) {
      vnode.isSVG = true;
    }

    return [vnode];
  }

  function mountCustomElement(vnode, uncontrolledRootProps) {
    var type = vnode.type,
        props = vnode.props;
    var node = document.createElement(type);
    patchDOM(node, uncontrolledRootProps, null, true);
    patchDOM(node, props, null, true);
    vnode.content = flattenContent(vnode.content, vnode.isSVG);
    appendChildren(node, vnode.content);
    vnode._node = node;
    return node;
  }

  function mountCustomElementContent(vnode, controlledRootProps) {
    var node = vnode._node;
    patchDOM(node, vnode.props, controlledRootProps, true);
    vnode.content = flattenContent(vnode.content, vnode.isSVG);
    appendChildren(node, vnode.content);
    patchRef(vnode.ref, node);
  }

  function mount(c) {
    var isVComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    c.content = flattenContent(c.content, c.isSVG);
    var node;

    if (c._isWrapped) {
      return c._node;
    }

    if (c._node != null) {
      throw new Error('Trying to mount already mounted vnode');
    }

    if (c._text != null) {
      node = document.createTextNode(c._text);
    } else {
      var type = c.type,
          props = c.props,
          content = c.content,
          isSVG = c.isSVG;

      if (typeof type === 'string') {
        if (!isSVG) {
          node = document.createElement(type);
        } else {
          node = document.createElementNS(SVG_NS, type);
        }

        patchDOM(node, props, null, isVComponent || c.isCustomElement);

        if (isTemplateElement(node)) {
          appendChildrenForTemplate(node, content);
        } else {
          appendChildren(node, content);
        }
      } else if (typeof type === 'function') {
        if (c.isComponent) {
          var instance;
          var constr = type;
          var splitProps = sortControlled(constr, props, c.isCustomElement);
          c._uncontrolled = splitProps.uncontrolled;
          instance = new constr(splitProps.controlled);
          instance._uniqueId = ojcustomelementUtils.ElementUtils.getUniqueId(props.id);
          node = instance.mount(splitProps.controlled, content, splitProps.uncontrolled);
          c._data = instance;
        } else {
          var render = type;
          var vnode = render(props, content);
          node = mount(vnode);
          c._data = vnode;
        }
      }
    }

    if (node == null) {
      throw new Error('Unknown node type!');
    }

    c._node = node;

    if (c.isCustomElement) {
      Object.defineProperty(node, '_ojBndgPrv', {
        value: 'none'
      });
    }

    return node;
  }

  function mountForTemplate(c) {
    c.content = flattenContent(c.content, c.isSVG);
    var node;

    if (c._text != null) {
      node = document.createTextNode(c._text);
    } else {
      var type = c.type,
          props = c.props,
          isSVG = c.isSVG;

      if (typeof type === 'string') {
        if (!isSVG) {
          node = document.createElement(type);
        } else {
          node = document.createElementNS(SVG_NS, type);
        }

        patchDOMForTemplate(node, props, null, c.isCustomElement);
        appendChildrenForTemplate(node, c.content);
      }
    }

    if (node == null) {
      throw new Error('content inside <template> elements is limited to HTML elements and text');
    }

    c._node = node;
    return node;
  }

  function getMountedNode(vnode) {
    return vnode._node;
  }

  function afterMountHooks(vnode) {
    if (vnode._isWrapped) {
      return;
    }

    if (vnode.isComponent) {
      var vcomp = vnode._data;
      patchRef(vnode.ref, vcomp);
      patchRef(vcomp._vnode.props.ref, vnode._node);

      if (!vnode.isCustomElement) {
        vcomp.notifyMounted();
      }
    } else if (typeof vnode.type !== 'function') {
      patchRef(vnode.ref, vnode._node);
    }
  }

  function appendChildren(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var oldch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    while (start <= end) {
      var chIdx = start++;
      var ch = children[chIdx];

      if (ch._isWrapped) {
        children[chIdx] = insertBeforeChild(parent, ch, oldch);
        var node = ch._node;

        if (node.nodeType === 1 && oj.Components) {
          oj.Components.subtreeShown(node);
        }
      } else {
        children[chIdx] = insertBeforeChild(parent, ch, oldch);
      }
    }
  }

  function appendChildrenForTemplate(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var oldch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    while (start <= end) {
      var chIdx = start++;
      var ch = children[chIdx];
      insertBeforeChildForTemplate(parent, ch, oldch);
    }
  }

  function removeChildren(parent, children) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
    var cleared = void 0;

    if (parent.childNodes.length === end - start + 1) {
      parent.textContent = '';
      cleared = true;
    }

    while (start <= end) {
      var ch = children[start++];

      if (!cleared) {
        removeAndUnmountChild(parent, ch);
      }
    }
  }

  function mounted(ch) {
    if (ch.isComponent) {
      var vcomp = ch._data;
      vcomp.notifyMounted();
    }
  }

  function unmount(ch) {
    if (Array.isArray(ch)) {
      for (var i = 0; i < ch.length; i++) {
        unmount(ch[i]);
      }
    } else {
      if (ch.isComponent) {
        var vcomp = ch._data;
        vcomp.notifyUnmounted();
      } else if (ch.content != null) {
        unmount(ch.content);
      }

      if (ch.isComponent || typeof ch.type !== 'function') {
        patchRef(ch.ref, null);
      }
    }
  }

  function defShouldUpdate(p1, p2, c1, c2) {
    if (c1 !== c2) return true;

    for (var key in p1) {
      if (p1[key] !== p2[key]) return true;
    }

    return false;
  }

  function isControlledProp(constr, prop) {
    var _a, _b;

    var meta = constr.metadata;
    return ((_b = (_a = meta === null || meta === void 0 ? void 0 : meta.extension) === null || _a === void 0 ? void 0 : _a._ROOT_PROPS_MAP) === null || _b === void 0 ? void 0 : _b[prop]) != null;
  }

  function sortControlled(constr, props, isCustomElement) {
    var staticDefaults = ojdefaultsutils.DefaultsUtils.getStaticDefaults(constr, constr.metadata, true);
    var splitProps = {
      controlled: Object.create(staticDefaults),
      uncontrolled: {}
    };

    for (var propName in props) {
      var value = props[propName];

      if (value !== undefined && isValidProp(constr, propName)) {
        if (!isCustomElement || !ojcustomelementUtils.AttributeUtils.isGlobalOrData(propName) || isControlledProp(constr, propName)) {
          splitProps.controlled[propName] = value;
        } else {
          splitProps.uncontrolled[propName] = value;
        }
      }
    }

    return splitProps;
  }

  function patchDOM(el, props, oldProps, isVComponent) {
    if (props) {
      addOrUpdateProps(el, props, oldProps || EMPTYO, isVComponent);
    }

    if (oldProps) {
      removeOldProps(el, props || EMPTYO, oldProps, isVComponent);
    }
  }

  function patchDOMForTemplate(el, props, oldProps, isCustomElement) {
    if (props) {
      var propKeys = Object.keys(props);
      propKeys.forEach(function (key) {
        if (SKIPKEYS.has(key)) {
          return;
        }

        var value = props[key];
        el.setAttribute(key, value);
      });
    }

    if (oldProps) {}
  }

  function patchCustomElement(newch, oldch, uncontrolledRootProps, oldUncontrolledRootProps) {
    var parentNode = oldch._node;

    if (oldch === newch) {
      return;
    }

    patchDOM(parentNode, uncontrolledRootProps, oldUncontrolledRootProps, true);
    patchDOM(parentNode, newch.props, oldch.props, true);
    newch.content = flattenContent(newch.content, newch.isSVG);
    diffChildren(parentNode, newch.content, oldch.content);
    patchRef(newch.ref, parentNode, oldch.ref);
  }

  function patchCustomElementContent(newch, oldch, controlledRootProps) {
    var parentNode = oldch._node;

    if (oldch === newch) {
      return;
    }

    newch.content = flattenContent(newch.content, newch.isSVG);
    var oldRootProps = {};
    var oldProps = oldch.props;

    for (var prop in oldProps) {
      if (ojcustomelementUtils.AttributeUtils.isEventListenerProperty(prop) || prop === 'class' || prop === 'style') {
        oldRootProps[prop] = oldProps[prop];
      }
    }

    Object.assign(oldRootProps, controlledRootProps);
    patchDOM(parentNode, newch.props, oldRootProps, true);
    diffChildren(parentNode, newch.content, oldch.content);
    patchRef(newch.ref, parentNode, oldch.ref);
  }

  function patch(newch, oldch, parent) {
    var isVComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var childNode = oldch._node;
    var newContent = newch.content = flattenContent(newch.content, newch.isSVG);
    var oldContent = oldch.content;

    if (oldch === newch || newch._node) {
      return newch;
    }

    if (isTemplateElement(childNode)) {
      if (oldch.props.render !== newch.props.render) {
        childNode['render'] = newch.props.render;
      }

      newch._node = childNode;
      return newch;
    }

    var t1, t2;

    if ((t1 = oldch._text) != null && (t2 = newch._text) != null) {
      if (t1 !== t2) {
        childNode.nodeValue = t2;
      }
    } else if (oldch.type === newch.type && oldch.isSVG === newch.isSVG) {
      var type = oldch.type;

      if (typeof type === 'function') {
        if (oldch.isComponent) {
          var vcomp = oldch._data;
          var constr = type;
          var splitProps = sortControlled(constr, newch.props, newch.isCustomElement);
          newch._uncontrolled = splitProps.uncontrolled;
          vcomp.patch(splitProps.controlled, newContent, splitProps.uncontrolled, oldch._uncontrolled);
          newch._data = vcomp;
          patchRef(newch.ref, vcomp, oldch.ref);
        } else {
          var shouldUpdateFn = type['shouldUpdate'] || defShouldUpdate;

          if (shouldUpdateFn(newch.props, oldch.props, newContent, oldContent)) {
            var render = type;
            var vnode = render(newch.props, newContent);
            newch = patch(vnode, oldch._data, parent);
            newch._data = vnode;
          } else {
            newch._data = oldch._data;
          }
        }
      } else if (typeof type === 'string') {
        if (oldch.isCustomElement && contentChangeRequiresRemount(newContent, oldContent)) {
          return replaceAndUnmountChild(parent, newch, oldch);
        } else {
          return patchDomNode(parent, newch, oldch, isVComponent);
        }
      } else {
        throw new Error("Error while patching. Unknown node type '".concat(type, "'."));
      }
    } else {
      if (parent) {
        return replaceAndUnmountChild(parent, newch, oldch);
      }
    }

    newch._node = childNode;
    return newch;
  }

  function diffChildren(parent, children, oldChildren) {
    var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
    var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;
    if (children === oldChildren) return;
    var oldCh;
    var k = diffCommonPrefix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
    newStart += k;
    oldStart += k;
    k = diffCommonSuffix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
    newEnd -= k;
    oldEnd -= k;

    if (newStart > newEnd && oldStart > oldEnd) {
      return;
    }

    if (newStart <= newEnd && oldStart > oldEnd) {
      oldCh = oldChildren[oldStart];
      appendChildren(parent, children, newStart, newEnd, oldCh);
      return;
    }

    if (oldStart <= oldEnd && newStart > newEnd) {
      removeChildren(parent, oldChildren, oldStart, oldEnd);
      return;
    }

    var oldRem = oldEnd - oldStart + 1;
    var newRem = newEnd - newStart + 1;
    k = -1;

    if (oldRem < newRem) {
      k = indexOf(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, true);

      if (k >= 0) {
        oldCh = oldChildren[oldStart];
        appendChildren(parent, children, newStart, k - 1, oldCh);
        var upperLimit = k + oldRem;
        newStart = k;

        while (newStart < upperLimit) {
          var chIdx = newStart++;
          children[chIdx] = patch(children[chIdx], oldChildren[oldStart++], parent);
        }

        var oldChSibling = oldChildren[oldEnd + 1];
        appendChildren(parent, children, newStart, newEnd, oldChSibling);
        return;
      }
    } else if (oldRem > newRem) {
      k = indexOf(oldChildren, children, oldStart, oldEnd, newStart, newEnd, canPatch, false);

      if (k >= 0) {
        removeChildren(parent, oldChildren, oldStart, k - 1);

        var _upperLimit = k + newRem;

        oldStart = k;

        while (oldStart < _upperLimit) {
          var _chIdx = newStart++;

          children[_chIdx] = patch(children[_chIdx], oldChildren[oldStart++], parent);
        }

        removeChildren(parent, oldChildren, oldStart, oldEnd);
        return;
      }
    }

    if (oldStart === oldEnd) {
      removeAndUnmountChild(parent, oldChildren[oldStart]);
      appendChildren(parent, children, newStart, newEnd, oldChildren[oldStart + 1]);
      return;
    }

    if (newStart === newEnd) {
      removeChildren(parent, oldChildren, oldStart, oldEnd);
      children[newStart] = insertBeforeChild(parent, children[newStart], oldChildren[oldEnd + 1]);
      return;
    }

    var result = diffOND(children, oldChildren, newStart, newEnd, oldStart, oldEnd);

    if (!result) {
      result = diffWithMap(children, oldChildren, newStart, newEnd, oldStart, oldEnd);
    }

    applyDiff(parent, result.diff, children, oldChildren, newStart, oldStart, oldEnd, result.keymap, result.wrapmap);
  }

  function diffCommonPrefix(s1, s2, start1, end1, start2, end2, eq, parent) {
    var k = 0,
        c1,
        c2;

    while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[start1], c2 = s2[start2])) {
      if (parent) {
        s1[start1] = patch(c1, c2, parent);
      }

      start1++;
      start2++;
      k++;
    }

    return k;
  }

  function diffCommonSuffix(s1, s2, start1, end1, start2, end2, eq, parent) {
    var k = 0,
        c1,
        c2;

    while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[end1], c2 = s2[end2])) {
      if (parent) {
        s1[end1] = patch(c1, c2, parent);
      }

      end1--;
      end2--;
      k++;
    }

    return k;
  }

  function applyDiff(parent, diff, children, oldChildren, newStart, oldStart, oldEnd, deleteMap, wrapMap) {
    var keyMoveMap = new Map();
    var wrapMoveMap = new Map();

    for (var i = 0, chIdx = newStart, oldChIdx = oldStart; i < diff.length; i++) {
      var op = diff[i];

      if (op === PATCH) {
        chIdx++;
        oldChIdx++;
      } else if (op === INSERTION) {
        var currIdx = chIdx++;
        var ch = children[currIdx];
        var oldMatchIdx = null;

        if (ch.key != null) {
          oldMatchIdx = deleteMap[ch.key];

          if (oldMatchIdx != null && canPatch(ch, oldChildren[oldMatchIdx])) {
            keyMoveMap.set(ch.key, oldMatchIdx);
          }
        } else if (ch._isWrapped) {
          oldMatchIdx = wrapMap.get(ch._node);

          if (oldMatchIdx != null && canPatch(ch, oldChildren[oldMatchIdx])) {
            wrapMoveMap.set(ch._node, oldMatchIdx);
          }
        }
      } else if (op === DELETION) {
        oldChIdx++;
      }
    }

    var oldRefs = oldChildren.slice();

    for (var _i3 = diff.length - 1, _oldChIdx = oldEnd; _i3 >= 0; _i3--) {
      var _op = diff[_i3];

      if (_op === PATCH) {
        _oldChIdx--;
      } else if (_op === DELETION) {
        var _chIdx2 = _oldChIdx--;

        var oldCh = oldChildren[_chIdx2];

        if ((oldCh.key == null || !keyMoveMap.has(oldCh.key)) && (!oldCh._isWrapped || !wrapMoveMap.has(oldCh._node))) {
          removeAndUnmountChild(parent, oldCh);
          oldRefs[_chIdx2] = oldRefs[_chIdx2 + 1];
        }
      }
    }

    for (var _i4 = 0, _chIdx3 = newStart, _oldChIdx2 = oldStart; _i4 < diff.length; _i4++) {
      var _op2 = diff[_i4];

      if (_op2 === PATCH) {
        var _currIdx = _chIdx3++;

        children[_currIdx] = patch(children[_currIdx], oldChildren[_oldChIdx2++], parent);
      } else if (_op2 === INSERTION) {
        var _currIdx2 = _chIdx3++;

        var _ch = children[_currIdx2];
        var _oldMatchIdx = null;

        if (_ch.key != null) {
          _oldMatchIdx = keyMoveMap.get(_ch.key);
        } else if (_ch._isWrapped) {
          _oldMatchIdx = wrapMoveMap.get(_ch._node);
        }

        if (_oldMatchIdx != null) {
          children[_currIdx2] = patch(_ch, oldChildren[_oldMatchIdx], parent);
          getDomContainer(parent).insertBefore(children[_currIdx2]._node, _oldChIdx2 < oldRefs.length ? oldRefs[_oldChIdx2]._node : null);
        } else {
          children[_currIdx2] = insertBeforeChild(parent, _ch, _oldChIdx2 < oldRefs.length ? oldRefs[_oldChIdx2] : null);
        }
      } else if (_op2 === DELETION) {
        _oldChIdx2++;
      }
    }
  }

  function indexOf(a, suba, aStart, aEnd, subaStart, subaEnd, eq, isNewFirst) {
    var j = subaStart,
        k = -1;
    var subaLen = subaEnd - subaStart + 1;

    while (aStart <= aEnd && aEnd - aStart + 1 >= subaLen) {
      var newch = isNewFirst ? a[aStart] : suba[j];
      var oldch = isNewFirst ? suba[j] : a[aStart];

      if (eq(newch, oldch)) {
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

  function contentChangeRequiresRemount(content, oldContent) {
    if (content === oldContent) {
      return false;
    }

    if (content.length !== oldContent.length) {
      return true;
    }

    return content.some(function (node, index) {
      var _a, _b;

      var oldNode = oldContent[index];

      if (node.type !== oldNode.type) {
        return true;
      }

      return ((_a = node.props) === null || _a === void 0 ? void 0 : _a.slot) !== ((_b = oldNode.props) === null || _b === void 0 ? void 0 : _b.slot);
    });
  }

  function patchDomNode(parent, newch, oldch, isVComponent) {
    var newVNode = newch;
    var newNode = oldch._node;

    if (newVNode._node && newNode !== newVNode._node) {
      newVNode = replaceAndUnmountChild(parent, copyVNode(newch), oldch);
    }

    patchDOM(newNode, newVNode.props, oldch.props, isVComponent || oldch.isCustomElement);
    diffChildren(newNode, newch.content, oldch.content);
    patchRef(newVNode.ref, newNode, oldch.ref);
    newVNode._node = newNode;
    return newVNode;
  }

  function replaceAndUnmountChild(parent, newch, oldch) {
    var sibling = oldch._node.nextSibling;
    removeAndUnmountChild(parent, oldch);
    var newVNode = safelyMount(newch);
    var newNode = newVNode._node;
    getDomContainer(parent).insertBefore(newNode, sibling);
    afterMountHooks(newVNode);
    return newVNode;
  }

  function removeAndUnmountChild(parent, oldch) {
    if (oldch._clean) {
      oldch._clean();
    }

    getDomContainer(parent).removeChild(oldch._node);
    unmount(oldch);
  }

  function insertBeforeChild(parent, newch, oldch) {
    var newVNode = safelyMount(newch);
    var newNode = newVNode._node;
    getDomContainer(parent).insertBefore(newNode, oldch === null || oldch === void 0 ? void 0 : oldch._node);
    afterMountHooks(newVNode);
    return newVNode;
  }

  function insertBeforeChildForTemplate(parent, newch, oldch) {
    var newNode = mountForTemplate(newch);
    getDomContainer(parent).insertBefore(newNode, oldch === null || oldch === void 0 ? void 0 : oldch._node);
    afterMountHooks(newch);
  }

  function patchRef(newRefCallback, ref) {
    var oldRefCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (oldRefCallback !== newRefCallback) {
      if (typeof oldRefCallback === 'function') {
        oldRefCallback(null);
      }

      if (typeof newRefCallback === 'function') {
        newRefCallback(ref);
      }
    }
  }

  function getDomContainer(node) {
    if (isTemplateElement(node)) {
      var content = node.content;

      if (content) {
        return content;
      }
    }

    return node;
  }

  function isValidProp(constr, prop) {
    var _a, _b;

    var meta = constr.metadata;

    if ((_b = (_a = meta === null || meta === void 0 ? void 0 : meta.properties) === null || _a === void 0 ? void 0 : _a[prop]) === null || _b === void 0 ? void 0 : _b.readOnly) {
      Logger.warn("Read-only property '".concat(prop, "' cannot be set on ").concat(meta.name, "."));
      return false;
    }

    return true;
  }

  function safelyMount(vnode) {
    var returnVNode = vnode;

    if (!vnode._isWrapped) {
      if (vnode._node) {
        returnVNode = copyVNode(vnode);
      }

      mount(returnVNode);
    }

    return returnVNode;
  }

  function copyVNode(vnode) {
    var vnodeCopy = Object.assign({}, vnode);
    vnodeCopy._node = null;
    return vnodeCopy;
  }

  function isVNode(c) {
    return c && (c.type != null || c._text != null || c._node);
  }

  exports.LISTENER_OPTIONS_SYMBOL = LISTENER_OPTIONS_SYMBOL;
  exports.appendChildrenForTemplate = appendChildrenForTemplate;
  exports.classPropToObject = classPropToObject;
  exports.flattenContent = flattenContent;
  exports.getMountedNode = getMountedNode;
  exports.h = h;
  exports.mount = mount;
  exports.mountCustomElement = mountCustomElement;
  exports.mountCustomElementContent = mountCustomElementContent;
  exports.mountForTemplate = mountForTemplate;
  exports.mounted = mounted;
  exports.patch = patch;
  exports.patchCustomElement = patchCustomElement;
  exports.patchCustomElementContent = patchCustomElementContent;
  exports.patchDOMForTemplate = patchDOMForTemplate;
  exports.patchRef = patchRef;
  exports.removeChildren = removeChildren;
  exports.removeListeners = removeListeners;
  exports.unmount = unmount;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())