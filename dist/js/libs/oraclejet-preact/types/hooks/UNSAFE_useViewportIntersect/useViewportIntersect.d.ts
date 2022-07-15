/**
 * Configuration about the viewport.  For now, it only has a field that returns the viewport element.
 */
export declare type ViewportConfig = {
    scroller: () => HTMLElement | null;
};
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
export declare function useViewportIntersect(viewport: ViewportConfig, margin: number | undefined, targetSelector: string, onIntersect: () => void): void;
