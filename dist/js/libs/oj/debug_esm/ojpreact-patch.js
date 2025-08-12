/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const OJ_REPLACER = Symbol();
const OJ_POPUP = Symbol();
const OJ_SLOT_REMOVE = Symbol();
/**
 * Patches .removeChild() on the slot's parent to delegate slot removal to an implementation
 * that was provided by slot management code via the OJ_SLOT_REMOVE symbol. That implementation uses
 * ref counting to decide whether the slot node can be removed. The need for ref counting arises from
 * the fact that the slot nodes will not be simply discarded after unmount as normal
 * live DOM nodes that are created by VDom would. Consider an example where the slot node needs to
 * be wrapped in a <div> during component re-render. The VDom engine will clone the slot VNode and
 * place its element (slot node) inside the newly created DIV. Then the old VNode will be unmounted,
 * and .removeChild() will be called in the current parent of the slot node. This would remove the slot
 * node what just got inserted into the <div>. The ref counting allows us to determine when the slot
 * node is truly no longer used and thus can be safely removed.
 *
 * Note that the patch will be installed once, but will never be uninstalled
 * @ignore
 */
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
/**
 * patches .firstChild on the popup's parent element to work around Preact's placeChild() using .firstChild to get the
 * first physical element within the parent (as opposed to getting an element from child VDOM). These two may not match
 * when the poupup framework moves the popup element into the layer container.
 * @ignore
 */
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
