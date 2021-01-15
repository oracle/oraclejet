/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcustomelement-utils', 'ojs/ojcore-base', 'ojs/ojdefaultsutils', 'ojs/ojlogger'], function (exports, ojcustomelementUtils, oj, ojdefaultsutils, Logger) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    const EMPTYO = Object.freeze({});
    const SKIPKEYS = new Set(['key', 'ref', 'children']);
    function classPropToObject(classProp) {
        if (!classProp) {
            return EMPTYO;
        }
        if (typeof classProp === 'string') {
            return Object.freeze(classProp.split(' ').reduce((acc, val) => {
                if (val) {
                    acc[val] = true;
                }
                return acc;
            }, {}));
        }
        return classProp;
    }
    function canPatch(newch, oldch) {
        return (((newch.key == null && oldch.key == null) || newch.key === oldch.key) &&
            newch._isWrapped === oldch._isWrapped &&
            ((newch._node && newch === oldch) || !newch._node));
    }

    function h(type, props, ...args) {
        let isSVG = false, isVComponent = false, isCustomElement;
        if (typeof type === 'string') {
            isSVG = type === 'svg';
            isCustomElement = !isSVG && ojcustomelementUtils.ElementUtils.isValidCustomElementName(type);
        }
        else {
            isVComponent = isComponent(type.prototype);
            isCustomElement = isVComponent && type.prototype.mountContent;
        }
        const needsWritableProps = isVComponent || isCustomElement;
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

    const XLINK_NS = 'http://www.w3.org/1999/xlink';
    const NS_ATTRS = {
        show: XLINK_NS,
        actuate: XLINK_NS
    };
    const LISTENER_OPTIONS_SYMBOL = Symbol();
    function addOrUpdateProps(el, props, oldProps, isVComponent) {
        const propKeys = Object.keys(props);
        propKeys.forEach(function (key) {
            if (SKIPKEYS.has(key)) {
                return;
            }
            const value = props[key];
            const oldValue = oldProps[key];
            if (value !== oldValue) {
                if (key === 'style') {
                    patchProperties(el.style, value || EMPTYO, oldValue || EMPTYO, '');
                }
                else if (key === 'class') {
                    patchClassName(el, value, oldValue, isVComponent);
                }
                else if (!maybePatchListener(el, key, value, oldValue) &&
                    !maybePatchAttribute(el, key, value, isVComponent)) {
                    el[key] = value;
                }
            }
        });
    }
    function removeOldProps(el, props, oldProps, isVComponent) {
        const propKeys = Object.keys(oldProps);
        propKeys.forEach(function (key) {
            if (key === 'key' || key === 'ref') {
                return;
            }
            const oldValue = oldProps[key];
            if (!(key in props)) {
                if (key === 'style') {
                    patchProperties(el.style, EMPTYO, oldValue || EMPTYO, '');
                }
                else if (key === 'class') {
                    patchClassName(el, null, oldValue, isVComponent);
                }
                else if (!maybePatchListener(el, key, null, oldValue) &&
                    !maybePatchAttribute(el, key, null, isVComponent)) {
                    el[key] = undefined;
                }
            }
        });
    }
    function isTemplateElement(node) {
        return node.nodeName === 'TEMPLATE';
    }
    function removeListeners(el, props) {
        const propKeys = Object.keys(props);
        propKeys.forEach(function (key) {
            if (SKIPKEYS.has(key)) {
                return;
            }
            maybePatchListener(el, key, null, props[key]);
        });
    }
    function patchProperties(propertyHolder, props, oldProps, unsetValue) {
        for (let key in props) {
            const oldv = oldProps[key];
            const newv = props[key];
            if (oldv !== newv) {
                propertyHolder[key] = newv;
            }
        }
        for (let key in oldProps) {
            if (!(key in props)) {
                propertyHolder[key] = unsetValue;
            }
        }
    }
    function patchClassName(el, value, oldValue, isVComponent) {
        if (isVComponent) {
            patchClassNameAsMap(el, value, oldValue);
        }
        else {
            patchClassNameAsString(el, value);
        }
    }
    function patchClassNameAsString(el, value) {
        if (value) {
            const classStr = typeof value === 'object'
                ? Object.keys(value)
                    .filter((key) => value[key])
                    .join(' ')
                : value;
            el.setAttribute('class', classStr);
        }
        else {
            el.removeAttribute('class');
        }
    }
    function patchClassNameAsMap(el, value, oldValue) {
        const oldValueMap = classPropToObject(oldValue);
        const valueMap = classPropToObject(value);
        for (let key in oldValueMap) {
            if (oldValueMap[key] && !valueMap[key]) {
                el.classList.remove(key);
            }
        }
        for (let key in valueMap) {
            if (valueMap[key] && !oldValueMap[key]) {
                el.classList.add(key);
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
            const attr = ojcustomelementUtils.AttributeUtils.getNativeAttr(key);
            if (key === 'draggable') {
                if (value == null) {
                    el.removeAttribute('draggable');
                }
                else {
                    el.setAttribute('draggable', value.toString());
                }
            }
            else if (value === true) {
                el.setAttribute(attr, '');
            }
            else if (value === false) {
                el.removeAttribute(attr);
            }
            else {
                if (value != null) {
                    const ns = NS_ATTRS[attr];
                    if (ns !== undefined) {
                        el.setAttributeNS(ns, attr, value);
                    }
                    else {
                        el.setAttribute(attr, value);
                    }
                }
                else {
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
        return (propName !== 'value' &&
            propName !== 'checked' &&
            (propName !== 'render' || !isTemplateElement(el)));
    }

    const PATCH = 2;
    const INSERTION = 4;
    const DELETION = 8;
    function diffOND(children, oldChildren, newStart = 0, newEnd = children.length - 1, oldStart = 0, oldEnd = oldChildren.length - 1) {
        const rows = newEnd - newStart + 1;
        const cols = oldEnd - oldStart + 1;
        const dmax = rows + cols;
        const v = [];
        let d, k, r, c, pv, cv, pd;
        outer: for (d = 0; d <= dmax; d++) {
            if (d > 50)
                return null;
            pd = d - 1;
            pv = d ? v[d - 1] : [0, 0];
            cv = v[d] = [];
            for (k = -d; k <= d; k += 2) {
                if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
                    c = pv[pd + k + 1];
                }
                else {
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
        const diff = Array(d / 2 + dmax / 2);
        const keymap = {}, wrapmap = new Map();
        let oldCh;
        let diffIdx = diff.length - 1;
        for (d = v.length - 1; d >= 0; d--) {
            while (c > 0 && r > 0 && canPatch(children[newStart + r - 1], oldChildren[oldStart + c - 1])) {
                diff[diffIdx--] = PATCH;
                c--;
                r--;
            }
            if (!d)
                break;
            pd = d - 1;
            pv = d ? v[d - 1] : [0, 0];
            k = c - r;
            if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
                r--;
                diff[diffIdx--] = INSERTION;
            }
            else {
                c--;
                diff[diffIdx--] = DELETION;
                oldCh = oldChildren[oldStart + c];
                if (oldCh.key != null) {
                    keymap[oldCh.key] = oldStart + c;
                }
                else if (oldCh._isWrapped) {
                    wrapmap.set(oldCh._node, oldStart + c);
                }
            }
        }
        return { diff, keymap, wrapmap };
    }
    function diffWithMap(children, oldChildren, newStart, newEnd, oldStart, oldEnd) {
        const newLen = newEnd - newStart + 1;
        const oldLen = oldEnd - oldStart + 1;
        const minLen = Math.min(newLen, oldLen);
        const tresh = Array(minLen + 1);
        tresh[0] = -1;
        for (let i = 1; i < tresh.length; i++) {
            tresh[i] = oldEnd + 1;
        }
        const link = Array(minLen);
        const keymap = {}, unkeyed = [], wrapmap = new Map();
        for (let i = oldStart; i <= oldEnd; i++) {
            let oldCh = oldChildren[i];
            let key = oldCh.key;
            if (key != null) {
                keymap[key] = i;
            }
            else if (oldCh._isWrapped) {
                wrapmap.set(oldCh._node, i);
            }
            else {
                unkeyed.push(i);
            }
        }
        let idxUnkeyed = 0;
        for (let i = newStart; i <= newEnd; i++) {
            const ch = children[i];
            let idxInOld;
            let incrementUnkeyed = false;
            if (ch.key != null) {
                idxInOld = keymap[ch.key];
            }
            else if (ch._isWrapped) {
                idxInOld = wrapmap.get(ch._node);
            }
            else {
                incrementUnkeyed = true;
                idxInOld = unkeyed[idxUnkeyed];
            }
            if (idxInOld != null && !canPatch(ch, oldChildren[idxInOld])) {
                idxInOld = null;
            }
            else if (incrementUnkeyed) {
                idxUnkeyed++;
            }
            if (idxInOld != null) {
                let k = findK(tresh, idxInOld);
                if (k >= 0) {
                    tresh[k] = idxInOld;
                    link[k] = { newi: i, oldi: idxInOld, prev: link[k - 1] };
                }
            }
        }
        let k = tresh.length - 1;
        while (tresh[k] > oldEnd) {
            k--;
        }
        let ptr = link[k];
        const diff = Array(oldLen + newLen - k);
        let curNewi = newEnd, curOldi = oldEnd;
        let d = diff.length - 1;
        while (ptr) {
            let _ptr = ptr, newi = _ptr.newi, oldi = _ptr.oldi;
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
        return { diff, keymap, wrapmap };
    }
    function findK(ktr, j) {
        let lo = 1;
        let hi = ktr.length - 1;
        while (lo <= hi) {
            let mid = Math.ceil((lo + hi) / 2);
            if (j < ktr[mid])
                hi = mid - 1;
            else
                lo = mid + 1;
        }
        return lo;
    }

    const SVG_NS = 'http://www.w3.org/2000/svg';
    function flattenContent(children, isSVG = false) {
        const childrenType = typeof children;
        if (children == null || childrenType === 'boolean') {
            return [];
        }
        else if (Array.isArray(children)) {
            return [].concat(...children.map((child) => flattenContent(child, isSVG)));
        }
        else if (!isVNode(children)) {
            return [{ _text: children }];
        }
        const vnode = children;
        if (isSVG && !vnode.isSVG) {
            vnode.isSVG = true;
        }
        return [vnode];
    }
    function mountCustomElement(vnode, uncontrolledRootProps) {
        const type = vnode.type, props = vnode.props;
        const node = document.createElement(type);
        patchDOM(node, uncontrolledRootProps, null, true);
        patchDOM(node, props, null, true);
        vnode.content = flattenContent(vnode.content, vnode.isSVG);
        appendChildren(node, vnode.content);
        vnode._node = node;
        return node;
    }
    function mountCustomElementContent(vnode, controlledRootProps) {
        const node = vnode._node;
        patchDOM(node, vnode.props, controlledRootProps, true);
        vnode.content = flattenContent(vnode.content, vnode.isSVG);
        appendChildren(node, vnode.content);
        patchRef(vnode.ref, node);
    }
    function mount(c, isVComponent = false) {
        c.content = flattenContent(c.content, c.isSVG);
        let node;
        if (c._isWrapped) {
            return c._node;
        }
        if (c._node != null) {
            throw new Error('Trying to mount already mounted vnode');
        }
        if (c._text != null) {
            node = document.createTextNode(c._text);
        }
        else {
            const type = c.type, props = c.props, content = c.content, isSVG = c.isSVG;
            if (typeof type === 'string') {
                if (!isSVG) {
                    node = document.createElement(type);
                }
                else {
                    node = document.createElementNS(SVG_NS, type);
                }
                patchDOM(node, props, null, isVComponent || c.isCustomElement);
                if (isTemplateElement(node)) {
                    appendChildrenForTemplate(node, content);
                }
                else {
                    appendChildren(node, content);
                }
            }
            else if (typeof type === 'function') {
                if (c.isComponent) {
                    let instance;
                    const constr = type;
                    const splitProps = sortControlled(constr, props, c.isCustomElement);
                    c._uncontrolled = splitProps.uncontrolled;
                    instance = new constr(splitProps.controlled);
                    instance._uniqueId = ojcustomelementUtils.ElementUtils.getUniqueId(props.id);
                    node = instance.mount(splitProps.controlled, content, splitProps.uncontrolled);
                    c._data = instance;
                }
                else {
                    const render = type;
                    const vnode = render(props, content);
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
            Object.defineProperty(node, '_ojBndgPrv', { value: 'none' });
        }
        return node;
    }
    function mountForTemplate(c) {
        c.content = flattenContent(c.content, c.isSVG);
        let node;
        if (c._text != null) {
            node = document.createTextNode(c._text);
        }
        else {
            const type = c.type, props = c.props, isSVG = c.isSVG;
            if (typeof type === 'string') {
                if (!isSVG) {
                    node = document.createElement(type);
                }
                else {
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
            const vcomp = vnode._data;
            patchRef(vnode.ref, vcomp);
            patchRef(vcomp._vnode.props.ref, vnode._node);
            if (!vnode.isCustomElement) {
                vcomp.notifyMounted();
            }
        }
        else if (typeof vnode.type !== 'function') {
            patchRef(vnode.ref, vnode._node);
        }
    }
    function appendChildren(parent, children, start = 0, end = children.length - 1, oldch = null) {
        while (start <= end) {
            const chIdx = start++;
            const ch = children[chIdx];
            if (ch._isWrapped) {
                children[chIdx] = insertBeforeChild(parent, ch, oldch);
                const node = ch._node;
                if (node.nodeType === 1 && oj.Components) {
                    oj.Components.subtreeShown(node);
                }
            }
            else {
                children[chIdx] = insertBeforeChild(parent, ch, oldch);
            }
        }
    }
    function appendChildrenForTemplate(parent, children, start = 0, end = children.length - 1, oldch = null) {
        while (start <= end) {
            const chIdx = start++;
            const ch = children[chIdx];
            insertBeforeChildForTemplate(parent, ch, oldch);
        }
    }
    function removeChildren(parent, children, start = 0, end = children.length - 1) {
        let cleared = void 0;
        if (parent.childNodes.length === end - start + 1) {
            parent.textContent = '';
            cleared = true;
        }
        while (start <= end) {
            let ch = children[start++];
            if (!cleared) {
                removeAndUnmountChild(parent, ch);
            }
        }
    }
    function mounted(ch) {
        if (ch.isComponent) {
            const vcomp = ch._data;
            vcomp.notifyMounted();
        }
    }
    function unmount(ch) {
        if (Array.isArray(ch)) {
            for (let i = 0; i < ch.length; i++) {
                unmount(ch[i]);
            }
        }
        else {
            if (ch.isComponent) {
                const vcomp = ch._data;
                vcomp.notifyUnmounted();
            }
            else if (ch.content != null) {
                unmount(ch.content);
            }
            if (ch.isComponent || typeof ch.type !== 'function') {
                patchRef(ch.ref, null);
            }
        }
    }
    function defShouldUpdate(p1, p2, c1, c2) {
        if (c1 !== c2)
            return true;
        for (let key in p1) {
            if (p1[key] !== p2[key])
                return true;
        }
        return false;
    }
    function isControlledProp(constr, prop) {
        var _a, _b;
        const meta = constr.metadata;
        return ((_b = (_a = meta === null || meta === void 0 ? void 0 : meta.extension) === null || _a === void 0 ? void 0 : _a._ROOT_PROPS_MAP) === null || _b === void 0 ? void 0 : _b[prop]) != null;
    }
    function sortControlled(constr, props, isCustomElement) {
        const staticDefaults = ojdefaultsutils.DefaultsUtils.getStaticDefaults(constr, constr.metadata, true);
        const splitProps = {
            controlled: Object.create(staticDefaults),
            uncontrolled: {}
        };
        for (let propName in props) {
            const value = props[propName];
            if (value !== undefined && isValidProp(constr, propName)) {
                if (!isCustomElement ||
                    !ojcustomelementUtils.AttributeUtils.isGlobalOrData(propName) ||
                    isControlledProp(constr, propName)) {
                    splitProps.controlled[propName] = value;
                }
                else {
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
            const propKeys = Object.keys(props);
            propKeys.forEach(function (key) {
                if (SKIPKEYS.has(key)) {
                    return;
                }
                const value = props[key];
                el.setAttribute(key, value);
            });
        }
        if (oldProps) {
        }
    }
    function patchCustomElement(newch, oldch, uncontrolledRootProps, oldUncontrolledRootProps) {
        const parentNode = oldch._node;
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
        const parentNode = oldch._node;
        if (oldch === newch) {
            return;
        }
        newch.content = flattenContent(newch.content, newch.isSVG);
        const oldRootProps = {};
        const oldProps = oldch.props;
        for (let prop in oldProps) {
            if (ojcustomelementUtils.AttributeUtils.isEventListenerProperty(prop) || prop === 'class' || prop === 'style') {
                oldRootProps[prop] = oldProps[prop];
            }
        }
        Object.assign(oldRootProps, controlledRootProps);
        patchDOM(parentNode, newch.props, oldRootProps, true);
        diffChildren(parentNode, newch.content, oldch.content);
        patchRef(newch.ref, parentNode, oldch.ref);
    }
    function patch(newch, oldch, parent, isVComponent = false) {
        let childNode = oldch._node;
        const newContent = (newch.content = flattenContent(newch.content, newch.isSVG));
        const oldContent = oldch.content;
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
        let t1, t2;
        if ((t1 = oldch._text) != null && (t2 = newch._text) != null) {
            if (t1 !== t2) {
                childNode.nodeValue = t2;
            }
        }
        else if (oldch.type === newch.type && oldch.isSVG === newch.isSVG) {
            const type = oldch.type;
            if (typeof type === 'function') {
                if (oldch.isComponent) {
                    const vcomp = oldch._data;
                    const constr = type;
                    const splitProps = sortControlled(constr, newch.props, newch.isCustomElement);
                    newch._uncontrolled = splitProps.uncontrolled;
                    vcomp.patch(splitProps.controlled, newContent, splitProps.uncontrolled, oldch._uncontrolled);
                    newch._data = vcomp;
                    patchRef(newch.ref, vcomp, oldch.ref);
                }
                else {
                    const shouldUpdateFn = type['shouldUpdate'] || defShouldUpdate;
                    if (shouldUpdateFn(newch.props, oldch.props, newContent, oldContent)) {
                        const render = type;
                        const vnode = render(newch.props, newContent);
                        newch = patch(vnode, oldch._data, parent);
                        newch._data = vnode;
                    }
                    else {
                        newch._data = oldch._data;
                    }
                }
            }
            else if (typeof type === 'string') {
                if (oldch.isCustomElement && contentChangeRequiresRemount(newContent, oldContent)) {
                    return replaceAndUnmountChild(parent, newch, oldch);
                }
                else {
                    return patchDomNode(parent, newch, oldch, isVComponent);
                }
            }
            else {
                throw new Error(`Error while patching. Unknown node type '${type}'.`);
            }
        }
        else {
            if (parent) {
                return replaceAndUnmountChild(parent, newch, oldch);
            }
        }
        newch._node = childNode;
        return newch;
    }
    function diffChildren(parent, children, oldChildren, newStart = 0, newEnd = children.length - 1, oldStart = 0, oldEnd = oldChildren.length - 1) {
        if (children === oldChildren)
            return;
        let oldCh;
        let k = diffCommonPrefix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
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
        const oldRem = oldEnd - oldStart + 1;
        const newRem = newEnd - newStart + 1;
        k = -1;
        if (oldRem < newRem) {
            k = indexOf(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, true);
            if (k >= 0) {
                oldCh = oldChildren[oldStart];
                appendChildren(parent, children, newStart, k - 1, oldCh);
                const upperLimit = k + oldRem;
                newStart = k;
                while (newStart < upperLimit) {
                    const chIdx = newStart++;
                    children[chIdx] = patch(children[chIdx], oldChildren[oldStart++], parent);
                }
                const oldChSibling = oldChildren[oldEnd + 1];
                appendChildren(parent, children, newStart, newEnd, oldChSibling);
                return;
            }
        }
        else if (oldRem > newRem) {
            k = indexOf(oldChildren, children, oldStart, oldEnd, newStart, newEnd, canPatch, false);
            if (k >= 0) {
                removeChildren(parent, oldChildren, oldStart, k - 1);
                const upperLimit = k + newRem;
                oldStart = k;
                while (oldStart < upperLimit) {
                    const chIdx = newStart++;
                    children[chIdx] = patch(children[chIdx], oldChildren[oldStart++], parent);
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
        let result = diffOND(children, oldChildren, newStart, newEnd, oldStart, oldEnd);
        if (!result) {
            result = diffWithMap(children, oldChildren, newStart, newEnd, oldStart, oldEnd);
        }
        applyDiff(parent, result.diff, children, oldChildren, newStart, oldStart, oldEnd, result.keymap, result.wrapmap);
    }
    function diffCommonPrefix(s1, s2, start1, end1, start2, end2, eq, parent) {
        let k = 0, c1, c2;
        while (start1 <= end1 && start2 <= end2 && eq((c1 = s1[start1]), (c2 = s2[start2]))) {
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
        let k = 0, c1, c2;
        while (start1 <= end1 && start2 <= end2 && eq((c1 = s1[end1]), (c2 = s2[end2]))) {
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
        const keyMoveMap = new Map();
        const wrapMoveMap = new Map();
        for (let i = 0, chIdx = newStart, oldChIdx = oldStart; i < diff.length; i++) {
            const op = diff[i];
            if (op === PATCH) {
                chIdx++;
                oldChIdx++;
            }
            else if (op === INSERTION) {
                const currIdx = chIdx++;
                const ch = children[currIdx];
                let oldMatchIdx = null;
                if (ch.key != null) {
                    oldMatchIdx = deleteMap[ch.key];
                    if (oldMatchIdx != null && canPatch(ch, oldChildren[oldMatchIdx])) {
                        keyMoveMap.set(ch.key, oldMatchIdx);
                    }
                }
                else if (ch._isWrapped) {
                    oldMatchIdx = wrapMap.get(ch._node);
                    if (oldMatchIdx != null && canPatch(ch, oldChildren[oldMatchIdx])) {
                        wrapMoveMap.set(ch._node, oldMatchIdx);
                    }
                }
            }
            else if (op === DELETION) {
                oldChIdx++;
            }
        }
        const oldRefs = oldChildren.slice();
        for (let i = diff.length - 1, oldChIdx = oldEnd; i >= 0; i--) {
            const _op = diff[i];
            if (_op === PATCH) {
                oldChIdx--;
            }
            else if (_op === DELETION) {
                const chIdx = oldChIdx--;
                const oldCh = oldChildren[chIdx];
                if ((oldCh.key == null || !keyMoveMap.has(oldCh.key)) &&
                    (!oldCh._isWrapped || !wrapMoveMap.has(oldCh._node))) {
                    removeAndUnmountChild(parent, oldCh);
                    oldRefs[chIdx] = oldRefs[chIdx + 1];
                }
            }
        }
        for (let i = 0, chIdx = newStart, oldChIdx = oldStart; i < diff.length; i++) {
            const op = diff[i];
            if (op === PATCH) {
                const currIdx = chIdx++;
                children[currIdx] = patch(children[currIdx], oldChildren[oldChIdx++], parent);
            }
            else if (op === INSERTION) {
                const currIdx = chIdx++;
                const ch = children[currIdx];
                let oldMatchIdx = null;
                if (ch.key != null) {
                    oldMatchIdx = keyMoveMap.get(ch.key);
                }
                else if (ch._isWrapped) {
                    oldMatchIdx = wrapMoveMap.get(ch._node);
                }
                if (oldMatchIdx != null) {
                    children[currIdx] = patch(ch, oldChildren[oldMatchIdx], parent);
                    getDomContainer(parent).insertBefore(children[currIdx]._node, oldChIdx < oldRefs.length ? oldRefs[oldChIdx]._node : null);
                }
                else {
                    children[currIdx] = insertBeforeChild(parent, ch, oldChIdx < oldRefs.length ? oldRefs[oldChIdx] : null);
                }
            }
            else if (op === DELETION) {
                oldChIdx++;
            }
        }
    }
    function indexOf(a, suba, aStart, aEnd, subaStart, subaEnd, eq, isNewFirst) {
        let j = subaStart, k = -1;
        const subaLen = subaEnd - subaStart + 1;
        while (aStart <= aEnd && aEnd - aStart + 1 >= subaLen) {
            const newch = isNewFirst ? a[aStart] : suba[j];
            const oldch = isNewFirst ? suba[j] : a[aStart];
            if (eq(newch, oldch)) {
                if (k < 0)
                    k = aStart;
                j++;
                if (j > subaEnd)
                    return k;
            }
            else {
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
            const oldNode = oldContent[index];
            if (node.type !== oldNode.type) {
                return true;
            }
            return ((_a = node.props) === null || _a === void 0 ? void 0 : _a.slot) !== ((_b = oldNode.props) === null || _b === void 0 ? void 0 : _b.slot);
        });
    }
    function patchDomNode(parent, newch, oldch, isVComponent) {
        let newVNode = newch;
        const newNode = oldch._node;
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
        const sibling = oldch._node.nextSibling;
        removeAndUnmountChild(parent, oldch);
        const newVNode = safelyMount(newch);
        const newNode = newVNode._node;
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
        const newVNode = safelyMount(newch);
        const newNode = newVNode._node;
        getDomContainer(parent).insertBefore(newNode, oldch === null || oldch === void 0 ? void 0 : oldch._node);
        afterMountHooks(newVNode);
        return newVNode;
    }
    function insertBeforeChildForTemplate(parent, newch, oldch) {
        const newNode = mountForTemplate(newch);
        getDomContainer(parent).insertBefore(newNode, oldch === null || oldch === void 0 ? void 0 : oldch._node);
        afterMountHooks(newch);
    }
    function patchRef(newRefCallback, ref, oldRefCallback = null) {
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
            const content = node.content;
            if (content) {
                return content;
            }
        }
        return node;
    }
    function isValidProp(constr, prop) {
        var _a, _b;
        const meta = constr.metadata;
        if ((_b = (_a = meta === null || meta === void 0 ? void 0 : meta.properties) === null || _a === void 0 ? void 0 : _a[prop]) === null || _b === void 0 ? void 0 : _b.readOnly) {
            Logger.warn(`Read-only property '${prop}' cannot be set on ${meta.name}.`);
            return false;
        }
        return true;
    }
    function safelyMount(vnode) {
        let returnVNode = vnode;
        if (!vnode._isWrapped) {
            if (vnode._node) {
                returnVNode = copyVNode(vnode);
            }
            mount(returnVNode);
        }
        return returnVNode;
    }
    function copyVNode(vnode) {
        const vnodeCopy = Object.assign({}, vnode);
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

    Object.defineProperty(exports, '__esModule', { value: true });

});
