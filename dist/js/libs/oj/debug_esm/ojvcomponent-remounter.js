/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component, toChildArray, cloneElement } from 'preact';

class Remounter extends Component {
    render(props) {
        let children = toChildArray(props?.children);
        let first = children[0];
        if (this._isVNode(first) &&
            typeof first.type === 'function' &&
            first.type['__ojIsEnvironmentWrapper']) {
            children = toChildArray(first.props?.children);
            first = children[0];
        }
        if (children.length !== 1 || !this._isVNode(first) || typeof first.type !== 'string') {
            throw new Error('The only child of the Remounter must be a custom element node');
        }
        const key = this._getElementKey(first);
        return [cloneElement(first, { key })];
    }
    _getElementKey(elem) {
        const slots = toChildArray(elem.props?.children);
        const slotInfos = slots.map((slot) => this._isVNode(slot) ? this._getSlotInfo(slot) : slot);
        return JSON.stringify(slotInfos);
    }
    _getSlotInfo(slot) {
        let type = slot.type;
        type = typeof type === 'string' ? type : type.name || String(type);
        return { key: slot.key, type, slot: slot.props?.slot };
    }
    _isVNode(node) {
        return typeof node !== 'string' && isNaN(node);
    }
}

export { Remounter };
