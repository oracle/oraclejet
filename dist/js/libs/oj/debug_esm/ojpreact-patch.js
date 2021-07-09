/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const OJ_REPLACER = Symbol();
const OJ_SLOT = Symbol();
const OJ_POPUP = Symbol();
function patchSlotParent(parent) {
    if (!parent[_PATCHED]) {
        parent[_PATCHED] = true;
        const original = parent.insertBefore;
        parent.insertBefore = (newNode, reference) => original.call(parent, newNode, (reference === null || reference === void 0 ? void 0 : reference[OJ_SLOT]) || reference);
        _patchFirstChild(parent, true);
    }
}
function patchPopupParent(parent) {
    if (!parent[_PATCHED]) {
        parent[_PATCHED] = true;
        _patchFirstChild(parent, false);
    }
}
function _patchFirstChild(parent, checkSlot) {
    Object.defineProperty(parent, 'firstChild', {
        get() {
            let child = parent.childNodes[0];
            if (!child) {
                return null;
            }
            child = child[OJ_POPUP] || child;
            if (checkSlot) {
                child = child[OJ_REPLACER] || child;
            }
            return child;
        },
        enumerable: true
    });
}
const _PATCHED = Symbol();

export { OJ_POPUP, OJ_REPLACER, OJ_SLOT, patchPopupParent, patchSlotParent };
