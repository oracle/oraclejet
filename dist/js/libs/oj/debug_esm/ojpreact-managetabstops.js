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

/**
 * The ManageTabStops component is used to provide tabbable mode for legacy components
 * when they are used inside a template slot of a Preact component.
 * See JET-54400 for details.
 * @ignore
 */
function ManageTabStops({ children }) {
    let childRef = useRef(null);
    let isInitialized = useRef(false);
    const { isTabbable } = useTabbableMode();
    useEffect(() => {
        let observer;
        if (childRef.current) {
            if (!isInitialized.current || !isTabbable) {
                // include childRef.current as well as any child elements
                disableAllFocusableElements(childRef.current, false, false, true);
                isInitialized.current = true;
            }
            if (isTabbable) {
                // include childRef.current as well as any child elements
                enableAllFocusableElements(childRef.current, true);
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
                                    disableAllFocusableElements(addedNodes[i], false, false, true);
                                }
                            }
                            if (entry.type === 'attributes' && entry.target.tabIndex > -1) {
                                nodesToUpdate.add(entry.target);
                            }
                        }
                        nodesToUpdate.forEach((entry) => disableAllFocusableElements(entry, false, false, true));
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
    return jsx(Fragment, { children: children });
}

export { ManageTabStops };
