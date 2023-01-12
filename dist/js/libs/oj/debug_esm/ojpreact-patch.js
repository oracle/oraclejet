/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const OJ_REPLACER = Symbol();
const OJ_POPUP = Symbol();
const OJ_SLOT_REMOVE = Symbol();
function patchSlotParent(parent) {
    if (!parent[_PATCHED]) {
        parent[_PATCHED] = true;
        const original = parent.removeChild;
        parent.removeChild = (child) => {
            const handler = child[OJ_SLOT_REMOVE];
            if (handler) {
                handler();
                return null;
            }
            return original.call(parent, child);
        };
    }
}
function patchPopupParent(parent) {
    if (!parent[_PATCHED]) {
        parent[_PATCHED] = true;
        Object.defineProperty(parent, 'firstChild', {
            get() {
                let child = parent.childNodes[0];
                if (!child) {
                    return null;
                }
                return child[OJ_POPUP] || child;
            },
            enumerable: true
        });
    }
}
const _PATCHED = Symbol();

export { OJ_POPUP, OJ_SLOT_REMOVE, patchPopupParent, patchSlotParent };
