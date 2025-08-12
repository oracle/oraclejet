/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'preact/hooks', '@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode', 'ojs/ojkeyboardfocus-utils'], function (exports, jsxRuntime, preact, hooks, UNSAFE_useTabbableMode, ojkeyboardfocusUtils) { 'use strict';

    /**
     * The ManageTabStops component is used to provide tabbable mode for legacy components
     * when they are used inside a template slot of a Preact component.
     * See JET-54400 for details.
     * @ignore
     */
    function ManageTabStops({ children }) {
        let childRef = hooks.useRef(null);
        let isInitialized = hooks.useRef(false);
        const { isTabbable } = UNSAFE_useTabbableMode.useTabbableMode();
        hooks.useEffect(() => {
            let observer;
            if (childRef.current) {
                if (!isInitialized.current || !isTabbable) {
                    // include childRef.current as well as any child elements
                    ojkeyboardfocusUtils.disableAllFocusableElements(childRef.current, false, false, true);
                    isInitialized.current = true;
                }
                if (isTabbable) {
                    // include childRef.current as well as any child elements
                    ojkeyboardfocusUtils.enableAllFocusableElements(childRef.current, true);
                }
                else {
                    observer = new MutationObserver((entries) => {
                        if (!isTabbable && childRef.current?.isConnected) {
                            // The tabindex attribute might be modified multiple times
                            // before the MutationObserver invokes its callback.
                            // Lets accumulate the relevant nodes in a Set and
                            // update them after all entries are processed.
                            const nodesToUpdate = new Set();
                            for (const entry of entries) {
                                const addedNodes = entry.addedNodes;
                                for (let i = 0; i < addedNodes.length; i++) {
                                    if (addedNodes[i].nodeType === 1) {
                                        ojkeyboardfocusUtils.disableAllFocusableElements(addedNodes[i], false, false, true);
                                    }
                                }
                                if (entry.type === 'attributes' && entry.target.tabIndex > -1) {
                                    nodesToUpdate.add(entry.target);
                                }
                            }
                            nodesToUpdate.forEach((entry) => ojkeyboardfocusUtils.disableAllFocusableElements(entry, false, false, true));
                        }
                    });
                    observer.observe(childRef.current, {
                        subtree: true,
                        childList: true,
                        attributeFilter: ['tabindex']
                    });
                }
                return () => {
                    if (observer) {
                        observer.disconnect();
                    }
                };
            }
        }, [isTabbable]);
        // Define refCallback method on a child.
        // The component should only have a single child, since it wraps an element with a specific attribute.
        const childComp = children;
        if (childComp.ref) {
            const origRefCallback = childComp.ref;
            childComp.ref = (el) => {
                childRef.current = el;
                if (typeof origRefCallback === 'function') {
                    origRefCallback(el);
                }
                else {
                    origRefCallback.current = el;
                }
            };
        }
        else {
            childComp.ref = childRef;
        }
        return jsxRuntime.jsx(preact.Fragment, { children: children });
    }

    exports.ManageTabStops = ManageTabStops;

    Object.defineProperty(exports, '__esModule', { value: true });

});
