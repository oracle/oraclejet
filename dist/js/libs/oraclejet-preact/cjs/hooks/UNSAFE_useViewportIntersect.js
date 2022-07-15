/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Hook to detect when the specified viewport element intersects elements that matches the specified css selector.
 * This is currently used by IncrementalLoader and VirtualizeViewportCollection.
 * Note options to IntersectionObsever such as rootMargin is not exposed now but can be added in the future as
 * needed.  (for example, with sticky footer we want to specify a wider margin so it won't trigger intersect)
 *
 * @param viewport an object which provide information about the viewport including what the viewport element is
 * @param onIntersect callback when an intersection with an element that has the specified target
 *                    style class occurred
 * @param targetSelector the CSS querySelector string used to identify the element where IntersectionObserver
 *                       observes
 * @param margin the top and bottom margin surrounding the viewport element in which the intersect detection takes into account.
 */
function useViewportIntersect(viewport, margin = 0, targetSelector, onIntersect) {
    // create an IntersectionObserver.  Note for now we are creating it on every render (instead of once
    // on mounted) due to an issue we encountered where sometimes IntersectionObserver will not invoke
    // the intersect callback (possibly due to the root might have been detach/re-attached?), see JET-49951.
    hooks.useEffect(() => {
        let observer;
        const root = viewport.scroller();
        if (root) {
            const options = {
                // specifying null to cause ResizeObserver to use document viewport
                root: root === document.body || root === document.documentElement ? null : root,
                rootMargin: `${margin}px 0px`,
                threshold: 0
            };
            observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        onIntersect();
                        return;
                    }
                }
            }, options);
            // start observing the element with certain class is scrolled into viewport
            root.querySelectorAll(targetSelector).forEach((target) => {
                observer.observe(target);
            });
        }
        return () => {
            observer === null || observer === void 0 ? void 0 : observer.disconnect();
        };
    });
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useViewportIntersect = useViewportIntersect;
/*  */
//# sourceMappingURL=UNSAFE_useViewportIntersect.js.map
