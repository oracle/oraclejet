/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Fragment } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { useTabbableMode } from '@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode';
import { disableAllFocusableElements, enableAllFocusableElements } from 'ojs/ojkeyboardfocus-utils';

function ManageTabStops({ children }) {
    let childRef = useRef(null);
    let isInitialized = useRef(false);
    const { isTabbable } = useTabbableMode();
    useEffect(() => {
        let observer;
        if (childRef.current) {
            if (!isInitialized.current || !isTabbable) {
                disableAllFocusableElements(childRef.current, false, false, true);
                isInitialized.current = true;
            }
            if (isTabbable) {
                enableAllFocusableElements(childRef.current, true);
            }
            else {
                observer = new MutationObserver((entries) => {
                    if (!isTabbable && childRef.current) {
                        if (!childRef.current.isConnected) {
                            return;
                        }
                        for (const entry of entries) {
                            const addedNodes = entry.addedNodes;
                            for (let i = 0; i < addedNodes.length; i++) {
                                if (addedNodes[i].nodeType === 1) {
                                    disableAllFocusableElements(addedNodes[i], false, false, true);
                                }
                            }
                        }
                    }
                });
                observer.observe(childRef.current, { subtree: true, childList: true });
            }
            return () => {
                if (observer) {
                    observer.disconnect();
                }
            };
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
    return jsx(Fragment, { children: children });
}

export { ManageTabStops };
