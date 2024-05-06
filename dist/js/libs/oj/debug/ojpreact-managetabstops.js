/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'preact/hooks', '@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode', 'ojs/ojkeyboardfocus-utils'], function (exports, jsxRuntime, preact, hooks, UNSAFE_useTabbableMode, ojkeyboardfocusUtils) { 'use strict';

    function ManageTabStops({ children }) {
        let childRef = hooks.useRef(null);
        let isInitialized = hooks.useRef(false);
        const { isTabbable } = UNSAFE_useTabbableMode.useTabbableMode();
        hooks.useEffect(() => {
            if (childRef.current) {
                if (!isInitialized.current || !isTabbable) {
                    ojkeyboardfocusUtils.disableAllFocusableElements(childRef.current);
                    isInitialized.current = true;
                }
                if (isTabbable) {
                    ojkeyboardfocusUtils.enableAllFocusableElements(childRef.current);
                }
            }
        }, [isTabbable]);
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
